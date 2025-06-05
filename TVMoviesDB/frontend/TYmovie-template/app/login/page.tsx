'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Phone, Lock } from 'lucide-react'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '', // 支持手机号或邮箱，将作为phone字段发送到后端
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // 用户名验证（手机号或邮箱）
    if (!formData.username) {
      newErrors.username = '请输入手机号或邮箱'
    } else {
      const isPhone = /^1[3-9]\d{9}$/.test(formData.username)
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)
      if (!isPhone && !isEmail) {
        newErrors.username = '请输入有效的手机号或邮箱地址'
      }
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const data = await login(formData.username, formData.password)

      if (data.success) {
        setMessage('登录成功！')
        // 跳转到首页
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        setMessage(data.message || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      setMessage('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-6">登录</h1>

          {message && (
            <Alert className={`mb-4 ${message.includes('成功') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={message.includes('成功') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">手机号/邮箱</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="请输入手机号或邮箱"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    记住我
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-800">
                  忘记密码?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p>
              还没有账号?{" "}
              <Link href="/register" className="text-red-600 hover:text-red-800">
                立即注册
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或通过以下方式登录</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">使用微信登录</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.52-.62 1.45-1.1 2.5-1.1 1.93 0 3.5 1.57 3.5 3.5v2.5z" />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">使用QQ登录</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.52-.62 1.45-1.1 2.5-1.1 1.93 0 3.5 1.57 3.5 3.5v2.5z" />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">使用微博登录</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.52-.62 1.45-1.1 2.5-1.1 1.93 0 3.5 1.57 3.5 3.5v2.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
