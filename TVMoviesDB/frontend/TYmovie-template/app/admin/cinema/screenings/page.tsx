'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Film, MapPin, Plus, Edit, Trash2, Users } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface Screening {
  id: string
  movieId: string
  movieTitle: string
  hallId: string
  hallName: string
  date: string
  time: string
  price: number
  totalSeats: number
  bookedSeats: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
}

interface Movie {
  id: string
  title: string
  duration: number
  genre: string
}

interface Hall {
  id: string
  name: string
  capacity: number
  type: string
}

export default function ScreeningsPage() {
  // Mock data - 在实际应用中应该从API获取
  const [screenings, setScreenings] = useState<Screening[]>([
    {
      id: '1',
      movieId: 'movie1',
      movieTitle: '阿凡达：水之道',
      hallId: 'hall1',
      hallName: '1号厅',
      date: '2024-01-15',
      time: '14:30',
      price: 45,
      totalSeats: 120,
      bookedSeats: 85,
      status: 'scheduled'
    },
    {
      id: '2',
      movieId: 'movie2',
      movieTitle: '流浪地球2',
      hallId: 'hall2',
      hallName: '2号厅',
      date: '2024-01-15',
      time: '16:00',
      price: 42,
      totalSeats: 100,
      bookedSeats: 67,
      status: 'scheduled'
    },
    {
      id: '3',
      movieId: 'movie1',
      movieTitle: '阿凡达：水之道',
      hallId: 'hall1',
      hallName: '1号厅',
      date: '2024-01-15',
      time: '19:30',
      price: 48,
      totalSeats: 120,
      bookedSeats: 102,
      status: 'scheduled'
    }
  ])

  const [movies] = useState<Movie[]>([
    { id: 'movie1', title: '阿凡达：水之道', duration: 192, genre: '科幻' },
    { id: 'movie2', title: '流浪地球2', duration: 173, genre: '科幻' },
    { id: 'movie3', title: '满江红', duration: 159, genre: '剧情' }
  ])

  const [halls] = useState<Hall[]>([
    { id: 'hall1', name: '1号厅', capacity: 120, type: 'IMAX' },
    { id: 'hall2', name: '2号厅', capacity: 100, type: '普通' },
    { id: 'hall3', name: '3号厅', capacity: 80, type: 'VIP' }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingScreening, setEditingScreening] = useState<Screening | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState('')

  const [newScreening, setNewScreening] = useState({
    movieId: '',
    hallId: '',
    date: '',
    time: '',
    price: 0
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: '已排期', variant: 'default' as const },
      ongoing: { label: '进行中', variant: 'secondary' as const },
      completed: { label: '已完成', variant: 'outline' as const },
      cancelled: { label: '已取消', variant: 'destructive' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getOccupancyRate = (booked: number, total: number) => {
    const rate = (booked / total) * 100
    return `${rate.toFixed(1)}%`
  }

  const getOccupancyColor = (booked: number, total: number) => {
    const rate = (booked / total) * 100
    if (rate >= 90) return 'text-red-600'
    if (rate >= 70) return 'text-orange-600'
    if (rate >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredScreenings = screenings.filter(screening => {
    const matchesSearch = screening.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screening.hallName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || screening.status === statusFilter
    const matchesDate = !dateFilter || screening.date === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleAddScreening = () => {
    // TODO: 实际应用中应该调用API
    const movie = movies.find(m => m.id === newScreening.movieId)
    const hall = halls.find(h => h.id === newScreening.hallId)

    if (movie && hall) {
      const screening: Screening = {
        id: Date.now().toString(),
        movieId: newScreening.movieId,
        movieTitle: movie.title,
        hallId: newScreening.hallId,
        hallName: hall.name,
        date: newScreening.date,
        time: newScreening.time,
        price: newScreening.price,
        totalSeats: hall.capacity,
        bookedSeats: 0,
        status: 'scheduled'
      }
      setScreenings([...screenings, screening])
      setNewScreening({ movieId: '', hallId: '', date: '', time: '', price: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditScreening = () => {
    if (editingScreening) {
      // TODO: 实际应用中应该调用API
      setScreenings(screenings.map(s =>
        s.id === editingScreening.id ? editingScreening : s
      ))
      setIsEditDialogOpen(false)
      setEditingScreening(null)
    }
  }

  const handleDeleteScreening = (id: string) => {
    // TODO: 实际应用中应该调用API
    setScreenings(screenings.filter(s => s.id !== id))
  }

  const handleCancelScreening = (id: string) => {
    // TODO: 实际应用中应该调用API
    setScreenings(screenings.map(s =>
      s.id === id ? { ...s, status: 'cancelled' as const } : s
    ))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">场次管理</h1>
          <p className="text-gray-600 mt-2">管理影院的电影场次安排</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              添加场次
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>添加新场次</DialogTitle>
              <DialogDescription>
                为影院添加新的电影放映场次
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="movie">电影</Label>
                <Select value={newScreening.movieId} onValueChange={(value) =>
                  setNewScreening({ ...newScreening, movieId: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="选择电影" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map(movie => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title} ({movie.duration}分钟)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hall">影厅</Label>
                <Select value={newScreening.hallId} onValueChange={(value) =>
                  setNewScreening({ ...newScreening, hallId: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="选择影厅" />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map(hall => (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name} ({hall.capacity}座, {hall.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">日期</Label>
                <Input
                  id="date"
                  type="date"
                  value={newScreening.date}
                  onChange={(e) => setNewScreening({ ...newScreening, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">时间</Label>
                <Input
                  id="time"
                  type="time"
                  value={newScreening.time}
                  onChange={(e) => setNewScreening({ ...newScreening, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">票价 (元)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newScreening.price}
                  onChange={(e) => setNewScreening({ ...newScreening, price: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddScreening}>
                添加场次
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日场次</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenings.filter(s => s.date === '2024-01-15').length}</div>
            <p className="text-xs text-muted-foreground">共 {screenings.length} 个场次</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均上座率</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((screenings.reduce((acc, s) => acc + (s.bookedSeats / s.totalSeats), 0) / screenings.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">今日平均</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预计收入</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{screenings.reduce((acc, s) => acc + (s.bookedSeats * s.price), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">今日总计</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可售座位</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {screenings.reduce((acc, s) => acc + (s.totalSeats - s.bookedSeats), 0)}
            </div>
            <p className="text-xs text-muted-foreground">剩余座位</p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>筛选场次</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">搜索</Label>
              <Input
                id="search"
                placeholder="搜索电影或影厅..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="scheduled">已排期</SelectItem>
                  <SelectItem value="ongoing">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setDateFilter('')
                }}
              >
                重置筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 场次列表 */}
      <Card>
        <CardHeader>
          <CardTitle>场次列表</CardTitle>
          <CardDescription>
            共找到 {filteredScreenings.length} 个场次
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>电影</TableHead>
                <TableHead>影厅</TableHead>
                <TableHead>日期时间</TableHead>
                <TableHead>票价</TableHead>
                <TableHead>座位情况</TableHead>
                <TableHead>上座率</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScreenings.map((screening) => (
                <TableRow key={screening.id}>
                  <TableCell className="font-medium">{screening.movieTitle}</TableCell>
                  <TableCell>{screening.hallName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{screening.date}</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{screening.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>¥{screening.price}</TableCell>
                  <TableCell>
                    {screening.bookedSeats}/{screening.totalSeats}
                  </TableCell>
                  <TableCell>
                    <span className={getOccupancyColor(screening.bookedSeats, screening.totalSeats)}>
                      {getOccupancyRate(screening.bookedSeats, screening.totalSeats)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(screening.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingScreening(screening)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {screening.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelScreening(screening.id)}
                        >
                          取消
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteScreening(screening.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑场次对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑场次</DialogTitle>
            <DialogDescription>
              修改场次信息
            </DialogDescription>
          </DialogHeader>
          {editingScreening && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-movie">电影</Label>
                <Select
                  value={editingScreening.movieId}
                  onValueChange={(value) => {
                    const movie = movies.find(m => m.id === value)
                    if (movie) {
                      setEditingScreening({
                        ...editingScreening,
                        movieId: value,
                        movieTitle: movie.title
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map(movie => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title} ({movie.duration}分钟)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-hall">影厅</Label>
                <Select
                  value={editingScreening.hallId}
                  onValueChange={(value) => {
                    const hall = halls.find(h => h.id === value)
                    if (hall) {
                      setEditingScreening({
                        ...editingScreening,
                        hallId: value,
                        hallName: hall.name,
                        totalSeats: hall.capacity
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map(hall => (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name} ({hall.capacity}座, {hall.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">日期</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingScreening.date}
                  onChange={(e) => setEditingScreening({ ...editingScreening, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">时间</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingScreening.time}
                  onChange={(e) => setEditingScreening({ ...editingScreening, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">票价 (元)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingScreening.price}
                  onChange={(e) => setEditingScreening({ ...editingScreening, price: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditScreening}>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}