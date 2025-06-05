'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, validateToken } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback = <div className="flex items-center justify-center min-h-screen">加载中...</div>
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 如果不需要认证，直接通过
        if (!requireAuth) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // 检查本地存储的认证状态
        if (!isAuthenticated()) {
          router.push('/login')
          return
        }

        // 验证token有效性
        const isValid = await validateToken()
        if (!isValid) {
          router.push('/login')
          return
        }

        // 如果需要管理员权限，检查用户角色
        if (requireAdmin) {
          const { isAdmin } = await import('@/lib/auth')
          if (!isAdmin()) {
            router.push('/') // 重定向到首页
            return
          }
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('认证检查失败:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requireAuth, requireAdmin, router])

  if (isLoading) {
    return fallback
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

// 高阶组件版本
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAuth?: boolean; requireAdmin?: boolean } = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}