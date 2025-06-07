'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Building2,
  Calendar,
  Armchair,
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Eye,
  Clock,
  Trash2
} from 'lucide-react'
import { getUser, isCinemaAdmin, logout } from '@/lib/auth'
import { apiRequest } from '@/lib/api'
import type { User } from '@/lib/auth'

export default function CinemaAdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cinemaInfo, setCinemaInfo] = useState({
    cinemaId: 0,
    name: '',
    address: '',
    contactPhone: '',
    hallCount: 0
  })
  const [halls, setHalls] = useState<any[]>([])
  const [showAddHallDialog, setShowAddHallDialog] = useState(false)
  const [newHall, setNewHall] = useState({
    name: '',
    capacity: '',
    type: ''
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || !isCinemaAdmin()) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadCinemaData()
  }, [])

  const loadCinemaData = async () => {
    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      // 获取影院信息
      const cinemaResponse = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/info`)
      const cinemaData = cinemaResponse.success ? cinemaResponse.data : {
        name: '未知影院',
        address: '地址未设置',
        contactPhone: '电话未设置',
        hallCount: 0
      }
      setCinemaInfo({
        ...cinemaData,
        hallCount: 0 // 将通过影厅列表计算
      })

      // 获取影厅列表
      const hallsResponse = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`)
      const hallsData = hallsResponse.success ? hallsResponse.data : []
      setHalls(hallsData)
      setCinemaInfo(prev => ({ ...prev, hallCount: hallsData.length }))

    } catch (error) {
      console.error('加载影院数据失败:', error)
      // 如果API调用失败，显示错误信息而不是使用模拟数据
    } finally {
      setLoading(false)
    }
  }

  const handleAddHall = async () => {
    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const hallData = {
        name: newHall.name,
        capacity: parseInt(newHall.capacity),
        type: newHall.type
      }

      await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`, {
        method: 'POST',
        body: JSON.stringify(hallData)
      })

      // 重新加载影厅列表
      const hallsResponse = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`)
      const hallsData = hallsResponse.success ? hallsResponse.data : []
      setHalls(hallsData)
      setCinemaInfo(prev => ({ ...prev, hallCount: hallsData.length }))

      // 重置表单并关闭对话框
      setNewHall({ name: '', capacity: '', type: '' })
      setShowAddHallDialog(false)
    } catch (error) {
      console.error('添加影厅失败:', error)
      alert('添加影厅失败，请重试')
    }
  }

  const handleDeleteHall = async (hallId: number) => {
    if (!confirm('确定要删除这个影厅吗？此操作不可撤销。')) {
      return
    }

    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls/${hallId}`, {
        method: 'DELETE'
      })

      // 重新加载影厅列表
      const hallsResponse = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`)
      const hallsData = hallsResponse.success ? hallsResponse.data : []
      setHalls(hallsData)
      setCinemaInfo(prev => ({ ...prev, hallCount: hallsData.length }))
    } catch (error) {
      console.error('删除影厅失败:', error)
      alert('删除影厅失败，请重试')
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
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">影院管理后台</h1>
                <p className="text-sm text-gray-600">{cinemaInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                影院管理员
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
        {/* 影院信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              影院信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">影院名称</p>
                <p className="font-medium">{cinemaInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">地址</p>
                <p className="font-medium">{cinemaInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">联系电话</p>
                <p className="font-medium">{cinemaInfo.contactPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 影厅概览 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              影厅管理
            </CardTitle>
            <CardDescription>管理影院的影厅信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {cinemaInfo.hallCount} 个影厅</p>
              <Dialog open={showAddHallDialog} onOpenChange={setShowAddHallDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加影厅
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新影厅</DialogTitle>
                    <DialogDescription>
                      请填写影厅的基本信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="hall-name" className="text-right">
                        影厅名称
                      </Label>
                      <Input
                        id="hall-name"
                        value={newHall.name}
                        onChange={(e) => setNewHall(prev => ({ ...prev, name: e.target.value }))}
                        className="col-span-3"
                        placeholder="例如：1号厅"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="hall-capacity" className="text-right">
                        座位数量
                      </Label>
                      <Input
                        id="hall-capacity"
                        type="number"
                        value={newHall.capacity}
                        onChange={(e) => setNewHall(prev => ({ ...prev, capacity: e.target.value }))}
                        className="col-span-3"
                        placeholder="例如：120"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="hall-type" className="text-right">
                        影厅类型
                      </Label>
                      <Select value={newHall.type} onValueChange={(value) => setNewHall(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择影厅类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2D">2D</SelectItem>
                          <SelectItem value="3D">3D</SelectItem>
                          <SelectItem value="IMAX">IMAX</SelectItem>
                          <SelectItem value="杜比">杜比</SelectItem>
                          <SelectItem value="4D">4D</SelectItem>
                          <SelectItem value="动感">动感</SelectItem>
                          <SelectItem value="巨幕">巨幕</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddHallDialog(false)}>
                      取消
                    </Button>
                    <Button onClick={handleAddHall} disabled={!newHall.name || !newHall.capacity || !newHall.type}>
                      添加影厅
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {halls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {halls.map((hall) => (
                  <Card key={hall.hallId} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{hall.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">座位数：{hall.capacity}</p>
                        <Badge variant="secondary" className="mt-2">{hall.type}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHall(hall.hallId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>暂无影厅信息</p>
                <p className="text-sm">点击上方按钮添加第一个影厅</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 功能模块 */}
        <Tabs defaultValue="cinema-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cinema-info">影院信息</TabsTrigger>
            <TabsTrigger value="screenings">场次管理</TabsTrigger>
            <TabsTrigger value="seats">座位管理</TabsTrigger>
            <TabsTrigger value="orders">订单管理</TabsTrigger>
          </TabsList>

          {/* 场次管理 */}
          <TabsContent value="screenings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>场次管理</CardTitle>
                    <CardDescription>管理影院的电影场次安排</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加场次
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">今日场次</h3>
                        <p className="text-sm text-gray-600">查看和管理今日排片</p>
                      </div>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看今日排片
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">排片计划</h3>
                        <p className="text-sm text-gray-600">制定未来排片计划</p>
                      </div>
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      排片计划
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">场次统计</h3>
                        <p className="text-sm text-gray-600">场次利用率分析</p>
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

          {/* 座位管理 */}
          <TabsContent value="seats" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>座位管理</CardTitle>
                    <CardDescription>管理影厅座位状态和布局</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">座位状态</h3>
                        <p className="text-sm text-gray-600">实时查看座位状态</p>
                      </div>
                      <Armchair className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => router.push('/admin/cinema/seats?tab=status')}
                    >
                      查看座位图
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">座位锁定</h3>
                        <p className="text-sm text-gray-600">锁定或释放座位</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => router.push('/admin/cinema/seats?tab=operation')}
                    >
                      座位操作
                    </Button>
                  </Card>


                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 订单管理 */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>订单管理</CardTitle>
                    <CardDescription>处理影院的订单和退票</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">订单列表</h3>
                        <p className="text-sm text-gray-600">查看所有订单</p>
                      </div>
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      查看订单
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">支付确认</h3>
                        <p className="text-sm text-gray-600">确认支付状态</p>
                      </div>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      支付管理
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">退票处理</h3>
                        <p className="text-sm text-gray-600">处理退票申请</p>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      退票管理
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">订单统计</h3>
                        <p className="text-sm text-gray-600">订单数据分析</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      数据分析
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 影院信息 */}
          <TabsContent value="cinema-info" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>影院信息管理</CardTitle>
                    <CardDescription>查看和修改影院基本信息</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/admin/cinema/info')}>
                    <Edit className="h-4 w-4 mr-2" />
                    编辑信息
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">影院名称</Label>
                      <p className="mt-1 text-sm text-gray-900">{cinemaInfo.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">详细地址</Label>
                      <p className="mt-1 text-sm text-gray-900">{cinemaInfo.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">联系电话</Label>
                      <p className="mt-1 text-sm text-gray-900">{cinemaInfo.contactPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">影厅数量</Label>
                      <p className="mt-1 text-sm text-gray-900">{cinemaInfo.hallCount} 个影厅</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">营业状态</Label>
                      <Badge className="mt-1 bg-green-100 text-green-800">正常营业</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">管理员</Label>
                      <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                    </div>
                  </div>
                </div>

                <Alert className="mt-6">
                  <AlertDescription>
                    注意：修改影院基本信息需要系统管理员审核后才能生效。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  )
}