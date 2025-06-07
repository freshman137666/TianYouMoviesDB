'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, MapPin, Phone, Mail, Clock, Users, Edit, Save, X, AlertTriangle, CheckCircle, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getUser, isCinemaAdmin } from '@/lib/auth'
import { apiRequest } from '@/lib/api'

interface CinemaInfo {
  cinemaId: number
  name: string
  address: string
  contactPhone: string
}

interface Hall {
  hallId: number
  name: string
  capacity: number
  type: string
  cinemaId: number
}

export default function CinemaInfoPage() {
  const router = useRouter()
  const [cinemaInfo, setCinemaInfo] = useState<CinemaInfo | null>(null)
  const [halls, setHalls] = useState<Hall[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<CinemaInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 添加影厅相关状态
  const [isAddingHall, setIsAddingHall] = useState(false)
  const [newHall, setNewHall] = useState({
    name: '',
    capacity: '',
    type: '2D'
  })

  // 获取影院信息
  const fetchCinemaInfo = async () => {
    try {
      setIsLoading(true)
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const data = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/info`)
      if (data.success) {
        setCinemaInfo(data.data)
        setEditedInfo(data.data)
      } else {
        throw new Error(data.message || '获取影院信息失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取影院信息失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取影厅列表
  const fetchHalls = async () => {
    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const data = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`)
      if (data.success) {
        setHalls(data.data || [])
      } else {
        throw new Error(data.message || '获取影厅列表失败')
      }
    } catch (err) {
      console.error('获取影厅列表失败:', err)
    }
  }

  useEffect(() => {
    // 检查用户权限
    const currentUser = getUser()
    if (!currentUser || !isCinemaAdmin()) {
      router.push('/login')
      return
    }

    fetchCinemaInfo()
    fetchHalls()
  }, [])

  // 保存影院信息
  const handleSave = async () => {
    if (!editedInfo) return

    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const data = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/info`, {
        method: 'PUT',
        body: JSON.stringify(editedInfo),
      })

      if (data.success) {
        setCinemaInfo(editedInfo)
        setIsEditing(false)
        setSuccess('影院信息更新成功')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error(data.message || '更新失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
      setTimeout(() => setError(null), 3000)
    }
  }

  // 添加影厅
  const handleAddHall = async () => {
    if (!newHall.name || !newHall.capacity) {
      setError('请填写完整的影厅信息')
      setTimeout(() => setError(null), 3000)
      return
    }

    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const data = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls`, {
        method: 'POST',
        body: JSON.stringify({
          name: newHall.name,
          capacity: parseInt(newHall.capacity),
          type: newHall.type
        }),
      })

      if (data.success) {
        setSuccess('影厅添加成功')
        setIsAddingHall(false)
        setNewHall({ name: '', capacity: '', type: '2D' })
        fetchHalls() // 重新获取影厅列表
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error(data.message || '添加影厅失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加影厅失败')
      setTimeout(() => setError(null), 3000)
    }
  }

  // 删除影厅
  const handleDeleteHall = async (hallId: number) => {
    if (!confirm('确定要删除这个影厅吗？此操作不可撤销。')) {
      return
    }

    try {
      const currentUser = getUser()
      if (!currentUser?.managedCinemaId) {
        throw new Error('未找到管理的影院ID')
      }

      const data = await apiRequest(`/api/admin/cinema/${currentUser.managedCinemaId}/halls/${hallId}`, {
        method: 'DELETE'
      })

      if (data.success) {
        setSuccess('影厅删除成功')
        setTimeout(() => setSuccess(null), 3000)
        fetchHalls() // 重新获取影厅列表
      } else {
        throw new Error(data.message || '删除失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleCancel = () => {
    setEditedInfo(cinemaInfo)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  if (!cinemaInfo) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || '无法获取影院信息'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">影院信息管理</h1>
          <p className="text-muted-foreground mt-2">
            管理影院基本信息和影厅配置
          </p>
        </div>
      </div>

      {/* 状态提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* 影院基本信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                影院基本信息
              </CardTitle>
              <CardDescription>
                影院的基本信息和联系方式
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    取消
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">影院名称</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedInfo?.name || ''}
                  onChange={(e) => setEditedInfo(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="请输入影院名称"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{cinemaInfo.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">联系电话</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedInfo?.contactPhone || ''}
                  onChange={(e) => setEditedInfo(prev => prev ? { ...prev, contactPhone: e.target.value } : null)}
                  placeholder="请输入联系电话"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{cinemaInfo.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">影院地址</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={editedInfo?.address || ''}
                onChange={(e) => setEditedInfo(prev => prev ? { ...prev, address: e.target.value } : null)}
                placeholder="请输入影院地址"
                rows={3}
              />
            ) : (
              <div className="flex items-start gap-2 p-2 bg-muted rounded">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{cinemaInfo.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 影厅管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                影厅管理
              </CardTitle>
              <CardDescription>
                管理影院的所有影厅信息
              </CardDescription>
            </div>
            <Dialog open={isAddingHall} onOpenChange={setIsAddingHall}>
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
                    请填写新影厅的基本信息
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hallName">影厅名称</Label>
                    <Input
                      id="hallName"
                      value={newHall.name}
                      onChange={(e) => setNewHall(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例如：1号厅"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">座位数量</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newHall.capacity}
                      onChange={(e) => setNewHall(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="例如：120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">影厅类型</Label>
                    <Select value={newHall.type} onValueChange={(value) => setNewHall(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                  <Button variant="outline" onClick={() => setIsAddingHall(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddHall}>
                    添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {halls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无影厅信息
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {halls.map((hall) => (
                <Card key={hall.hallId} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{hall.name}</CardTitle>
                      <Badge variant="secondary">{hall.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>座位数：{hall.capacity}</span>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteHall(hall.hallId)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}