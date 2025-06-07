'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  MapPin,
  Phone,
  Users,
  Calendar,
  Eye,
  Upload
} from 'lucide-react'
import { getUser, isSystemAdmin, apiRequest } from '@/lib/auth'
import type { User } from '@/lib/auth'
import Link from 'next/link'

interface CinemaData {
  cinemaId: number
  name: string
  address: string
  contactPhone: string
}

interface UserData {
  userId: number
  name: string
  phone: string
  email: string
  adminType: 'system' | 'cinema'
}

export default function CinemaManagementPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cinemas, setCinemas] = useState<CinemaData[]>([])

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCinema, setSelectedCinema] = useState<CinemaData | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPhone: ''
  })

  const router = useRouter()

  // 检查用户权限
  useEffect(() => {
    const user = getUser()
    if (!user || !isSystemAdmin()) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadCinemas()

  }, [])

  // 加载影院列表
  const loadCinemas = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/admin/system/cinemas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCinemas(data.data || [])
      } else {
        console.error('获取影院列表失败')
        setMessage('获取影院列表失败')
      }
    } catch (error) {
      console.error('加载影院列表失败:', error)
      setMessage('加载影院列表失败')
    } finally {
      setLoading(false)
    }
  }



  const filteredCinemas = cinemas.filter(cinema => {
    const matchesSearch = cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.contactPhone.includes(searchTerm)

    return matchesSearch
  })

  const handleAddCinema = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/system/cinemas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(data.message || '影院添加成功')
        setIsAddDialogOpen(false)
        resetForm()
        loadCinemas()
      } else {
        setMessage(data.message || '添加影院失败')
      }
    } catch (error) {
      console.error('添加影院失败:', error)
      setMessage('添加影院失败：网络错误')
    }
  }

  const handleEditCinema = async () => {
    if (!selectedCinema) return

    try {
      const response = await fetch(`http://localhost:8080/api/admin/system/cinemas/${selectedCinema.cinemaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(data.message || '影院信息更新成功')
        setIsEditDialogOpen(false)
        setSelectedCinema(null)
        resetForm()
        loadCinemas()
      } else {
        setMessage(data.message || '更新影院失败')
      }
    } catch (error) {
      console.error('更新影院失败:', error)
      setMessage('更新影院失败：网络错误')
    }
  }

  const handleDeleteCinema = async (cinemaId: number) => {
    if (!confirm('确定要删除这个影院吗？此操作不可恢复。')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/system/cinemas/${cinemaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(data.message || '影院删除成功')
        loadCinemas()
      } else {
        setMessage(data.message || '影院删除失败')
      }
    } catch (error) {
      console.error('删除影院失败:', error)
      setMessage('影院删除失败：网络错误')
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactPhone: ''
    })
  }

  // 打开编辑对话框
  const openEditDialog = (cinema: CinemaData) => {
    setSelectedCinema(cinema)
    setFormData({
      name: cinema.name,
      address: cinema.address,
      contactPhone: cinema.contactPhone
    })
    setIsEditDialogOpen(true)
  }

  // 处理文件上传





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
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/system" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">影院管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                系统管理员
              </Badge>
              <span className="text-sm text-gray-700">欢迎，{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 消息提示 */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总影院数</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cinemas.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已注册影院</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cinemas.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作栏 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>影院列表</CardTitle>
                <CardDescription>管理系统中的所有影院信息</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加影院
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>添加新影院</DialogTitle>
                      <DialogDescription>
                        创建新的影院信息
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">影院名称</Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="请输入影院名称"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">地址</Label>
                        <Input
                          id="address"
                          className="col-span-3"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="请输入影院地址"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">联系电话</Label>
                        <Input
                          id="phone"
                          className="col-span-3"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="请输入联系电话"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddCinema}>
                        添加影院
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* 批量上传功能已禁用 */}
                {/* <Dialog open={isBatchUploadDialogOpen} onOpenChange={setIsBatchUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      批量上传
                    </Button>
                  </DialogTrigger>
                </Dialog> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 搜索和筛选 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索影院名称、地址或电话..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

            </div>

            {/* 影院表格 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>影院信息</TableHead>
                  <TableHead>联系方式</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCinemas.map((cinema) => (
                  <TableRow key={cinema.cinemaId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cinema.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {cinema.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {cinema.contactPhone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(cinema)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCinema(cinema.cinemaId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredCinemas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">没有找到匹配的影院</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 编辑影院对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑影院信息</DialogTitle>
              <DialogDescription>
                修改影院的详细信息
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">影院名称</Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">地址</Label>
                <Input
                  id="edit-address"
                  className="col-span-3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">联系电话</Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditCinema}>
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  )
}