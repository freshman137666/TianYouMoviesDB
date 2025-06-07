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
  Film,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Eye,
  Upload
} from 'lucide-react'
import { getUser, isSystemAdmin, apiRequest, validateToken } from '@/lib/auth'
import type { User } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'

interface MovieData {
  movieId: number
  title: string
  director: string
  actors: string
  genre: string
  duration: number // 分钟
  rating: number // 评分
  description: string
  posterUrl?: string
  releaseDate: string
  offShelfDate: string
  releaseRegion: string
  status: 'upcoming' | 'showing' | 'ended'
  createTime: string
  basePrice: number // 基础价格
}

export default function MoviesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [movies, setMovies] = useState<MovieData[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterGenre, setFilterGenre] = useState('all')
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    movieId: 0,
    title: '',
    director: '',
    actors: '',
    genre: '',
    duration: '',
    rating: '',
    description: '',
    posterUrl: '',
    releaseDate: '',
    offShelfDate: '',
    releaseRegion: '',
    status: 'upcoming' as 'upcoming' | 'showing' | 'ended',
    basePrice: ''
  })

  const genreOptions = [
    '动作', '喜剧', '剧情', '科幻', '恐怖', '爱情', '冒险', '动画', '纪录片', '其他'
  ]

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token || !validateToken(token)) {
        router.push('/admin/login')
        return
      }

      const currentUser = getUser()
      if (!currentUser || !isSystemAdmin(currentUser)) {
        router.push('/admin/login')
        return
      }

      setUser(currentUser)
      await fetchMovies()
    }

    checkAuth()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await apiRequest('/api/admin/system/movies', {
        method: 'GET'
      })
      
      if (response.success) {
        setMovies(response.data || [])
      } else {
        setMessage('获取电影列表失败: ' + response.message)
      }
    } catch (error) {
      console.error('获取电影列表失败:', error)
      setMessage('获取电影列表失败')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      movieId: 0,
      title: '',
      director: '',
      actors: '',
      genre: '',
      duration: '',
      rating: '',
      description: '',
      posterUrl: '',
      releaseDate: '',
      offShelfDate: '',
      releaseRegion: '',
      status: 'upcoming',
      basePrice: ''
    })
  }

  // 文件上传处理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setMessage('请选择图片文件')
      return
    }
    
    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('文件大小不能超过5MB')
      return
    }
    
    setUploading(true)
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      
      const data = await apiRequest('/api/upload', {
        method: 'POST',
        body: uploadFormData,
        isFormData: true
      })
      
      if (data.success) {
        setFormData(prev => ({ ...prev, posterUrl: data.url }))
        setMessage('图片上传成功')
      } else {
        setMessage('上传失败: ' + data.message)
      }
    } catch (error) {
      console.error('上传失败:', error)
      setMessage('图片上传失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setUploading(false)
    }
  }

  // 添加电影
  const handleAddMovie = async () => {
    try {
      // 验证必填字段
      if (!formData.basePrice || parseFloat(formData.basePrice) < 0.01 || parseFloat(formData.basePrice) > 1000) {
        setMessage('请输入有效的基础价格(0.01-1000元)')
        return
      }

      const data = await apiRequest('/api/admin/system/movies', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          rating: parseFloat(formData.rating),
          basePrice: parseFloat(formData.basePrice),
          category: formData.genre
        })
      })
      
      if (data.success) {
        setMessage('电影添加成功')
        setIsAddDialogOpen(false)
        resetForm()
        await fetchMovies()
      } else {
        setMessage('添加失败: ' + data.message)
      }
    } catch (error) {
      console.error('添加电影失败:', error)
      setMessage('添加电影失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  // 编辑电影
  const openEditDialog = (movie: MovieData) => {
    setFormData({
      movieId: movie.movieId,
      title: movie.title,
      director: movie.director,
      actors: movie.actors,
      genre: movie.genre,
      duration: movie.duration.toString(),
      rating: movie.rating.toString(),
      description: movie.description,
      posterUrl: movie.posterUrl || '',
      releaseDate: movie.releaseDate,
      offShelfDate: movie.offShelfDate,
      releaseRegion: movie.releaseRegion,
      status: movie.status,
      basePrice: movie.basePrice.toString()
    })
    setIsEditDialogOpen(true)
  }

  const handleEditMovie = async () => {
    try {
      const data = await apiRequest(`/api/admin/system/movies/${formData.movieId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          rating: parseFloat(formData.rating),
          basePrice: parseFloat(formData.basePrice),
          category: formData.genre
        })
      })
      
      if (data.success) {
        setMessage('电影更新成功')
        setIsEditDialogOpen(false)
        await fetchMovies()
      } else {
        setMessage('更新失败: ' + data.message)
      }
    } catch (error) {
      console.error('更新电影失败:', error)
      setMessage('更新电影失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  // 删除电影
  const handleDeleteMovie = async (movieId: number) => {
    if (!confirm('确定要删除这部电影吗？')) {
      return
    }

    try {
      const data = await apiRequest(`/api/admin/system/movies/${movieId}`, {
        method: 'DELETE'
      })
      
      if (data.success) {
        setMessage('电影删除成功')
        await fetchMovies()
      } else {
        setMessage('删除失败: ' + data.message)
      }
    } catch (error) {
      console.error('删除电影失败:', error)
      setMessage('删除电影失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'showing':
        return <Badge className="bg-green-500">正在上映</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-500">即将上映</Badge>
      case 'ended':
        return <Badge className="bg-gray-500">已下映</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题和导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/system" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">电影管理</h1>
              <p className="text-gray-600">管理系统中的所有电影信息</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            欢迎，{user?.username}
          </div>
        </div>

        {/* 消息提示 */}
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* 电影管理卡片 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  电影列表
                </CardTitle>
                <CardDescription>
                  共 {movies.length} 部电影
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {/* 添加电影对话框 */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加电影
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>添加新电影</DialogTitle>
                      <DialogDescription>
                        填写电影的详细信息
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">电影标题</Label>
                        <Input
                          id="title"
                          required
                          className="col-span-3"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="请输入电影标题"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="director" className="text-right">导演</Label>
                        <Input
                          id="director"
                          required
                          className="col-span-3"
                          value={formData.director}
                          onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                          placeholder="请输入导演姓名"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="actors" className="text-right">主演</Label>
                        <Input
                          id="actors"
                          className="col-span-3"
                          value={formData.actors}
                          onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
                          placeholder="请输入主演姓名，多个用逗号分隔"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="genre" className="text-right">类型</Label>
                        <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="选择电影类型" />
                          </SelectTrigger>
                          <SelectContent>
                            {genreOptions.map(genre => (
                              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">时长(分钟)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          className="col-span-3"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="请输入电影时长"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rating" className="text-right">评分</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="5.0"
                          className="col-span-3"
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          placeholder="请输入评分(1.0-5.0)"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="basePrice" className="text-right">基础价格(元)</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="1000"
                          required
                          className="col-span-3"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                          placeholder="请输入基础价格(0.01-1000元)"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="releaseDate" className="text-right">上映日期</Label>
                        <Input
                          id="releaseDate"
                          type="date"
                          className="col-span-3"
                          value={formData.releaseDate}
                          onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="offShelfDate" className="text-right">撤档日期</Label>
                        <Input
                          id="offShelfDate"
                          type="date"
                          className="col-span-3"
                          value={formData.offShelfDate}
                          onChange={(e) => setFormData({ ...formData, offShelfDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="releaseRegion" className="text-right">制片国家/地区</Label>
                        <Input
                          id="releaseRegion"
                          className="col-span-3"
                          value={formData.releaseRegion}
                          onChange={(e) => setFormData({ ...formData, releaseRegion: e.target.value })}
                          placeholder="请输入制片国家/地区"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">状态</Label>
                        <Select value={formData.status} onValueChange={(value: 'upcoming' | 'showing' | 'ended') => setFormData({ ...formData, status: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">即将上映</SelectItem>
                            <SelectItem value="showing">正在上映</SelectItem>
                            <SelectItem value="ended">已下映</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="posterUrl" className="text-right">海报URL</Label>
                        <div className="col-span-3 space-y-2">
                          <Input
                            id="posterUrl"
                            value={formData.posterUrl}
                            onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                            placeholder="请输入海报图片URL或上传图片"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              disabled={uploading}
                            >
                              {uploading ? '上传中...' : '上传图片'}
                            </Button>
                          </div>
                          {formData.posterUrl && (
                            <div className="mt-2">
                              <Image 
                                src={formData.posterUrl} 
                                alt="海报预览" 
                                width={100} 
                                height={150} 
                                className="object-cover rounded" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 col-span-2">
                        <Label htmlFor="description" className="text-right">简介</Label>
                        <Textarea
                          id="description"
                          className="col-span-3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="请输入电影简介"
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddMovie}>
                        添加电影
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    placeholder="搜索电影标题、导演或主演..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="showing">正在上映</SelectItem>
                    <SelectItem value="upcoming">即将上映</SelectItem>
                    <SelectItem value="ended">已下映</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    {genreOptions.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 电影表格 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>电影信息</TableHead>
                  <TableHead>导演/主演</TableHead>
                  <TableHead>类型/时长</TableHead>
                  <TableHead>评分</TableHead>
                  <TableHead>上映日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movies
                  .filter(movie => {
                    const matchesSearch = searchTerm === '' ||
                      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      movie.actors.toLowerCase().includes(searchTerm.toLowerCase())
                    const matchesStatus = filterStatus === 'all' || movie.status === filterStatus
                    const matchesGenre = filterGenre === 'all' || movie.genre === filterGenre
                    return matchesSearch && matchesStatus && matchesGenre
                  })
                  .map((movie) => (
                    <TableRow key={movie.movieId}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {movie.posterUrl && (
                            <Image
                              src={movie.posterUrl}
                              alt={movie.title}
                              width={48}
                              height={64}
                              className="rounded object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium">{movie.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {movie.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{movie.director}</div>
                          <div className="text-sm text-gray-500">{movie.actors}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{movie.genre}</div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(movie.duration)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {movie.rating}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(movie.releaseDate).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(movie.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(movie)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMovie(movie.movieId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {movies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">没有找到匹配的电影</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 编辑电影对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑电影信息</DialogTitle>
              <DialogDescription>
                修改电影的详细信息
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">电影标题</Label>
                <Input
                  id="edit-title"
                  className="col-span-3"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-director" className="text-right">导演</Label>
                <Input
                  id="edit-director"
                  className="col-span-3"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-actors" className="text-right">主演</Label>
                <Input
                  id="edit-actors"
                  className="col-span-3"
                  value={formData.actors}
                  onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-genre" className="text-right">类型</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genreOptions.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">时长(分钟)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  className="col-span-3"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rating" className="text-right">评分</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  className="col-span-3"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="请输入评分(1.0-5.0)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-basePrice" className="text-right">基础价格(元)</Label>
                <Input
                  id="edit-basePrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  required
                  className="col-span-3"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="请输入基础价格(0.01-1000元)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-releaseDate" className="text-right">上映日期</Label>
                <Input
                  id="edit-releaseDate"
                  type="date"
                  className="col-span-3"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-offShelfDate" className="text-right">撤档日期</Label>
                <Input
                  id="edit-offShelfDate"
                  type="date"
                  className="col-span-3"
                  value={formData.offShelfDate}
                  onChange={(e) => setFormData({ ...formData, offShelfDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-releaseRegion" className="text-right">制片国家/地区</Label>
                <Input
                  id="edit-releaseRegion"
                  className="col-span-3"
                  value={formData.releaseRegion}
                  onChange={(e) => setFormData({ ...formData, releaseRegion: e.target.value })}
                  placeholder="请输入制片国家/地区"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">状态</Label>
                <Select value={formData.status} onValueChange={(value: 'upcoming' | 'showing' | 'ended') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">即将上映</SelectItem>
                    <SelectItem value="showing">正在上映</SelectItem>
                    <SelectItem value="ended">已下映</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-posterUrl" className="text-right">海报URL</Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="edit-posterUrl"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="请输入海报图片URL或上传图片"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      disabled={uploading}
                    >
                      {uploading ? '上传中...' : '上传图片'}
                    </Button>
                  </div>
                  {formData.posterUrl && (
                    <div className="mt-2">
                      <Image 
                        src={formData.posterUrl} 
                        alt="海报预览" 
                        width={100} 
                        height={150} 
                        className="object-cover rounded" 
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 col-span-2">
                <Label htmlFor="edit-description" className="text-right">简介</Label>
                <Textarea
                  id="edit-description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditMovie}>
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}