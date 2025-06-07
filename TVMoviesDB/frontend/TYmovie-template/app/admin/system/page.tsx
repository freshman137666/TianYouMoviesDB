'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  Building2,
  Film,
  Settings,
  BarChart3,
  Database,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { getUser, isSystemAdmin, logout } from '@/lib/auth'
import type { User } from '@/lib/auth'

export default function SystemAdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCinemas: 0,
    totalMovies: 0,
    totalOrders: 0
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || !isSystemAdmin()) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/system/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.totalUsers || 0,
          totalCinemas: data.totalCinemas || 0,
          totalMovies: data.totalMovies || 0,
          totalOrders: data.totalOrders || 0
        })
      } else {
        console.error('获取统计数据失败')
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">系统管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                系统管理员
              </Badge>
              <span className="text-sm text-gray-700">欢迎，{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总用户数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">影院数量</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCinemas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">电影数量</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMovies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总订单数</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            </CardContent>
          </Card>


        </div>

        {/* 功能模块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/system/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  用户管理
                </CardTitle>
                <CardDescription>
                  管理系统中的所有用户账户
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  查看、添加、修改、删除用户信息，分配用户角色和权限
                </p>
                <Button className="w-full">
                  进入管理
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/system/cinemas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-600" />
                  影院管理
                </CardTitle>
                <CardDescription>
                  管理所有影院信息和配置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  创建、修改、删除影院，分配影院管理员
                </p>
                <Button className="w-full">
                  进入管理
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/system/movies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Film className="h-5 w-5 mr-2 text-purple-600" />
                  电影管理
                </CardTitle>
                <CardDescription>
                  管理电影库和电影信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  添加、修改、删除电影数据，管理电影上映状态
                </p>
                <Button className="w-full">
                  进入管理
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/system/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                  运营数据
                </CardTitle>
                <CardDescription>
                  查看平台整体运营数据，生成统计报表和分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  订单统计、收入分析、用户行为分析等报表
                </p>
                <Button className="w-full">
                  查看报表
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-orange-600" />
                系统配置
              </CardTitle>
              <CardDescription>
                配置系统全局参数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                票价规则、促销活动、退票政策等系统参数设置
              </p>
              <Button className="w-full">
                进入配置
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                数据分析
              </CardTitle>
              <CardDescription>
                运营数据统计和分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                订单统计、收入分析、用户行为分析等报表
              </p>
              <Button className="w-full">
                查看报表
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-gray-600" />
                系统维护
              </CardTitle>
              <CardDescription>
                系统日志和维护工具
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                查看系统日志、数据库备份、错误排查等
              </p>
              <Button className="w-full">
                进入维护
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">用户管理</TabsTrigger>
            <TabsTrigger value="cinemas">影院管理</TabsTrigger>
            <TabsTrigger value="movies">电影管理</TabsTrigger>
            <TabsTrigger value="system">系统配置</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
            <TabsTrigger value="maintenance">系统维护</TabsTrigger>
          </TabsList>

          {/* 用户管理 */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>用户管理</CardTitle>
                    <CardDescription>管理所有用户账户，包括普通用户和管理员</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加用户
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">用户列表</h3>
                        <p className="text-sm text-gray-600">查看和管理所有用户</p>
                      </div>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看详情
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">角色分配</h3>
                        <p className="text-sm text-gray-600">设置用户权限和角色</p>
                      </div>
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      管理权限
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">批量操作</h3>
                        <p className="text-sm text-gray-600">批量导入或导出用户</p>
                      </div>
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      批量管理
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">用户统计</h3>
                        <p className="text-sm text-gray-600">查看用户活跃度统计</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看统计
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 影院管理 */}
          <TabsContent value="cinemas" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>影院管理</CardTitle>
                    <CardDescription>管理所有影院信息和分配影院管理员</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加影院
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">影院列表</h3>
                        <p className="text-sm text-gray-600">查看和编辑影院信息</p>
                      </div>
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      管理影院
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">管理员分配</h3>
                        <p className="text-sm text-gray-600">为影院分配管理员</p>
                      </div>
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      分配管理员
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">运营监控</h3>
                        <p className="text-sm text-gray-600">监控影院运营状态</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看监控
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 电影管理 */}
          <TabsContent value="movies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>电影管理</CardTitle>
                    <CardDescription>管理电影信息和排片计划</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加电影
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">电影库</h3>
                        <p className="text-sm text-gray-600">管理所有电影信息</p>
                      </div>
                      <Film className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      管理电影
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">排片管理</h3>
                        <p className="text-sm text-gray-600">全局排片计划管理</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      排片计划
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">票房分析</h3>
                        <p className="text-sm text-gray-600">电影票房表现分析</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      票房分析
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 系统配置 */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>系统配置</CardTitle>
                <CardDescription>配置系统全局参数和规则</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">票价规则</h3>
                        <p className="text-sm text-gray-600">设置票价计算规则</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      配置票价
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">促销活动</h3>
                        <p className="text-sm text-gray-600">管理促销活动和优惠</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      促销管理
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>数据分析</CardTitle>
                <CardDescription>平台运营数据分析和报表</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">销售报表</h3>
                        <p className="text-sm text-gray-600">生成销售统计报表</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      生成报表
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">用户行为</h3>
                        <p className="text-sm text-gray-600">分析用户行为数据</p>
                      </div>
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      行为分析
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 系统维护 */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>系统维护</CardTitle>
                <CardDescription>系统日志、备份和维护工具</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">系统日志</h3>
                        <p className="text-sm text-gray-600">查看系统运行日志</p>
                      </div>
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看日志
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">数据备份</h3>
                        <p className="text-sm text-gray-600">数据库备份和恢复</p>
                      </div>
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      备份管理
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">错误排查</h3>
                        <p className="text-sm text-gray-600">系统错误诊断工具</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      错误诊断
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}