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
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Shield,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react'
import { getUser, isSystemAdmin, apiRequest } from '@/lib/auth'
import type { User } from '@/lib/auth'
import Link from 'next/link'

interface UserData {
  userId: number
  name: string
  phone: string
  email: string
  adminType: 'none' | 'cinema'
  managedCinemaId?: number
  registerTime: string
  cinemaName?: string
}

interface Cinema {
  cinemaId: number
  name: string
  address: string
}

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    adminType: 'none' as 'none' | 'cinema',
    managedCinemaId: ''
  })
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user || !isSystemAdmin()) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadUsers()
    loadCinemas()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/system/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data?.users || [])
      } else {
        console.error('获取用户列表失败')
        setMessage('获取用户列表失败')
      }
    } catch (error) {
      console.error('加载用户列表失败:', error)
      setMessage('加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const loadCinemas = async () => {
    try {
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
      }
    } catch (error) {
      console.error('加载影院列表失败:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === 'all' || user.adminType === filterType

    return matchesSearch && matchesFilter
  })

  // 添加用户功能已被移除

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`http://localhost:8080/api/admin/system/users/${selectedUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          managedCinemaId: formData.managedCinemaId ? parseInt(formData.managedCinemaId) : null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage('用户信息更新成功')
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        resetForm()
        loadUsers()
      } else {
        setMessage(data.message || '更新用户失败')
      }
    } catch (error) {
      console.error('更新用户失败:', error)
      setMessage('更新用户失败')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/system/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage('用户删除成功')
        loadUsers()
      } else {
        setMessage(data.message || '删除用户失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      setMessage('删除用户失败')
    }
  }

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: '',
      adminType: user.adminType,
      managedCinemaId: user.managedCinemaId?.toString() || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      adminType: 'none',
      managedCinemaId: ''
    })
  }

  const getAdminTypeBadge = (adminType: string) => {
    switch (adminType) {
      case 'system':
        return <Badge className="bg-red-100 text-red-800">系统管理员</Badge>
      case 'cinema':
        return <Badge className="bg-blue-100 text-blue-800">影院管理员</Badge>
      default:
        return <Badge variant="secondary">普通用户</Badge>
    }
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
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">用户管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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

        {/* 操作栏 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>用户列表</CardTitle>
                <CardDescription>管理系统中的所有用户账户</CardDescription>
              </div>
              {/* 添加用户功能已被移除 */}
            </div>
          </CardHeader>
          <CardContent>
            {/* 搜索和筛选 */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索用户姓名、手机号或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="筛选类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有用户</SelectItem>
                  <SelectItem value="none">普通用户</SelectItem>
                  <SelectItem value="cinema">影院管理员</SelectItem>
                  <SelectItem value="system">系统管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 用户表格 */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户信息</TableHead>
                    <TableHead>联系方式</TableHead>
                    <TableHead>用户类型</TableHead>
                    <TableHead>管理影院</TableHead>
                    <TableHead>注册时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{user.phone}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAdminTypeBadge(user.adminType)}
                      </TableCell>
                      <TableCell>
                        {user.cinemaName || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(user.registerTime).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.userId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">没有找到匹配的用户</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 编辑用户对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑用户信息</DialogTitle>
              <DialogDescription>
                修改用户的基本信息和权限设置
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">姓名</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  className="col-span-3 bg-gray-100"
                  disabled
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">手机号</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  className="col-span-3 bg-gray-100"
                  disabled
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">邮箱</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  className="col-span-3 bg-gray-100"
                  disabled
                  readOnly
                />
              </div>
              {/* 密码字段已移除，不允许修改密码 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-adminType" className="text-right">用户类型</Label>
                <Select value={formData.adminType} onValueChange={(value: 'none' | 'cinema') => setFormData({ ...formData, adminType: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">普通用户</SelectItem>
                    <SelectItem value="cinema">影院管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.adminType === 'cinema' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-managedCinemaId" className="text-right">管理影院</Label>
                  <Select value={formData.managedCinemaId} onValueChange={(value) => setFormData({ ...formData, managedCinemaId: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择管理的影院" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.cinemaId} value={cinema.cinemaId.toString()}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditUser}>
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}