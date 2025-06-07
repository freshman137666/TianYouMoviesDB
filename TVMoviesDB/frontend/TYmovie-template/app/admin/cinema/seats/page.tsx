'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Film, MapPin, Users, Lock, Unlock, AlertTriangle, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { apiRequest } from '@/lib/api'
import { getUser } from '@/lib/auth'

interface Seat {
  id: string
  row: number
  col: number
  status: 'available' | 'booked' | 'locked' | 'maintenance'
  type: 'standard' | 'vip' | 'couple'
  lockReason?: string
  lockedAt?: string
  lockedBy?: string
  price?: number
  orderId?: string
  customerName?: string
}

interface Screening {
  screeningId: number
  movieId: number
  hallId: number
  screeningTime: string
  ticketPrice: number
  seatRemain: number
  movieTitle?: string
  hallName?: string
}

interface Hall {
  hallId: number
  hallName: string
  seatCount: number
  cinemaId: number
}

interface Movie {
  movieId: number
  title: string
  duration: number
}

export default function SeatsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'status'

  const [halls, setHalls] = useState<Hall[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [selectedHall, setSelectedHall] = useState<number | null>(null)
  const [selectedScreening, setSelectedScreening] = useState<number | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [isAddScreeningDialogOpen, setIsAddScreeningDialogOpen] = useState(false)
  const [newScreening, setNewScreening] = useState({
    movieId: '',
    hallId: '',
    screeningTime: '',
    ticketPrice: ''
  })
  const [loading, setLoading] = useState(true)
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)
  const [lockReason, setLockReason] = useState('')
  const [operationType, setOperationType] = useState<'lock' | 'unlock'>('lock')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 获取影厅列表和电影列表
  useEffect(() => {
    fetchHalls()
    fetchMovies()
  }, [])

  // 获取场次列表
  useEffect(() => {
    if (selectedHall) {
      fetchScreenings(selectedHall)
    }
  }, [selectedHall, movies, halls])

  // 获取座位状态
  useEffect(() => {
    if (selectedScreening) {
      fetchSeats(selectedScreening)
    }
  }, [selectedScreening])

  const fetchHalls = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/cinema/1/halls')
      const data = await response.json()

      if (data.success) {
        setHalls(data.data)
      } else {
        console.error('获取影厅列表失败:', data.message)
      }
    } catch (error) {
      console.error('获取影厅列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies')
      const data = await response.json()

      if (data.success) {
        setMovies(data.data)
      } else {
        console.error('获取电影列表失败:', data.message)
      }
    } catch (error) {
      console.error('获取电影列表失败:', error)
    }
  }

  const fetchScreenings = async (hallId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/cinema/1/screenings`)
      const data = await response.json()

      if (data.success) {
        // 过滤指定影厅的场次并添加电影和影厅信息
        const hallScreenings = data.data.filter((screening: Screening) => screening.hallId === hallId)
        const enrichedScreenings = hallScreenings.map((screening: Screening) => ({
          ...screening,
          movieTitle: movies.find(m => m.movieId === screening.movieId)?.title || '未知电影',
          hallName: halls.find(h => h.hallId === screening.hallId)?.hallName || '未知影厅'
        }))
        setScreenings(enrichedScreenings)
      } else {
        console.error('获取场次列表失败:', data.message)
        setScreenings([])
      }

      setSelectedScreening(null)
      setSeats([])
    } catch (error) {
      console.error('获取场次列表失败:', error)
      setScreenings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSeats = async (screeningId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/cinema/1/screenings/${screeningId}/seats`)
      const data = await response.json()

      if (data.success && data.data.seats) {
        // 转换后端座位数据为前端格式
        const seatLayout = convertSeatsData(data.data.seats)
        setSeats(seatLayout)
      } else {
        // 如果没有座位数据，生成默认布局
        const defaultLayout = generateDefaultSeatLayout()
        setSeats(defaultLayout)
      }
    } catch (error) {
      console.error('获取座位状态失败:', error)
      // 生成默认座位布局
      const defaultLayout = generateDefaultSeatLayout()
      setSeats(defaultLayout)
    } finally {
      setLoading(false)
    }
  }

  const convertSeatsData = (seatsData: any[]): Seat[] => {
    return seatsData.map((seat: any) => ({
      id: `${seat.seatRow}-${seat.seatCol}`,
      row: seat.seatRow,
      col: seat.seatCol,
      status: seat.status === '可用' ? 'available' :
        seat.status === '已售' ? 'booked' :
          seat.status === '锁定' ? 'locked' : 'maintenance',
      type: seat.seatRow <= 3 ? 'vip' : 'standard',
      lockReason: seat.status === '锁定' ? '管理员锁定' : undefined,
      lockedAt: seat.status === '锁定' ? new Date().toISOString() : undefined,
      lockedBy: seat.status === '锁定' ? '管理员' : undefined
    }))
  }

  const generateDefaultSeatLayout = (): Seat[] => {
    const seats: Seat[] = []
    const rows = 10
    const cols = 12

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        const seatId = `${row}-${col}`
        const type: Seat['type'] = row <= 3 ? 'vip' : 'standard'

        seats.push({
          id: seatId,
          row,
          col,
          status: 'available',
          type
        })
      }
    }

    return seats
  }

  const addScreening = async () => {
    try {
      const response = await fetch('/api/admin/cinema/1/screenings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScreening),
      })

      const data = await response.json()

      if (data.success) {
        alert('场次添加成功')
        setIsAddScreeningDialogOpen(false)
        setNewScreening({ movieId: '', hallId: '', screeningTime: '', ticketPrice: '' })
        if (selectedHall) {
          fetchScreenings(selectedHall)
        }
      } else {
        alert('场次添加失败: ' + data.message)
      }
    } catch (error) {
      console.error('添加场次失败:', error)
      alert('添加场次失败')
    }
  }

  const deleteScreening = async (screeningId: number) => {
    if (!confirm('确定要删除这个场次吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/cinema/1/screenings/${screeningId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        alert('场次删除成功')
        if (selectedHall) {
          fetchScreenings(selectedHall)
        }
        if (selectedScreening === screeningId) {
          setSelectedScreening(null)
          setSeats([])
        }
      } else {
        alert('场次删除失败: ' + data.message)
      }
    } catch (error) {
      console.error('删除场次失败:', error)
      alert('删除场次失败')
    }
  }

  // 生成座位布局
  const [seatLayout, setSeatLayout] = useState<Seat[][]>([])
  const [activeTab, setActiveTab] = useState(defaultTab)

  // 当选择场次时生成座位布局
  useEffect(() => {
    if (selectedScreening && seats.length > 0) {
      // 按行分组座位
      const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
          acc[seat.row] = []
        }
        acc[seat.row].push(seat)
        return acc
      }, {} as Record<number, Seat[]>)

      const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b)
      const layout = rows.map(rowNum => {
        return seatsByRow[rowNum].sort((a, b) => a.col - b.col)
      })
      setSeatLayout(layout)
    } else {
      setSeatLayout([])
    }
  }, [selectedScreening, seats])

  // 切换座位选择
  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return // 已预订的座位不能操作

    const seatId = seat.id
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (activeTab === 'operation' && (seat.status === 'available' || seat.status === 'locked')) {
      const seatId = seat.id
      setSelectedSeats(prev =>
        prev.includes(seatId)
          ? prev.filter(id => id !== seatId)
          : [...prev, seatId]
      )
    }
  }

  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) {
      alert('请先选择要锁定的座位')
      return
    }

    if (!lockReason.trim()) {
      alert('请输入锁定原因')
      return
    }

    try {
      const response = await fetch(`/api/admin/cinema/1/screenings/${selectedScreening}/seats/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatIds: selectedSeats,
          reason: lockReason
        })
      })

      const data = await response.json()

      if (data.success) {
        // 更新座位状态
        setSeats(prev =>
          prev.map(seat =>
            selectedSeats.includes(seat.id)
              ? { ...seat, status: 'locked' as const, lockReason, lockedAt: new Date().toISOString(), lockedBy: '管理员' }
              : seat
          )
        )

        setSelectedSeats([])
        setLockReason('')
        setIsLockDialogOpen(false)
        alert('座位锁定成功')
      } else {
        alert('座位锁定失败: ' + data.message)
      }
    } catch (error) {
      console.error('锁定座位失败:', error)
      alert('锁定座位失败')
    }
  }

  const handleUnlockSeats = async () => {
    if (selectedSeats.length === 0) {
      alert('请先选择要解锁的座位')
      return
    }

    try {
      const response = await fetch(`/api/admin/cinema/1/screenings/${selectedScreening}/seats/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatIds: selectedSeats
        })
      })

      const data = await response.json()

      if (data.success) {
        // 更新座位状态
        setSeats(prev =>
          prev.map(seat =>
            selectedSeats.includes(seat.id)
              ? { ...seat, status: 'available' as const, lockReason: undefined, lockedAt: undefined, lockedBy: undefined }
              : seat
          )
        )

        setSelectedSeats([])
        alert('座位解锁成功')
      } else {
        alert('座位解锁失败: ' + data.message)
      }
    } catch (error) {
      console.error('解锁座位失败:', error)
      alert('解锁座位失败')
    }
  }

  const getSeatStatusColor = (status: Seat['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 hover:bg-green-200'
      case 'booked': return 'bg-red-100 border-red-300'
      case 'locked': return 'bg-yellow-100 border-yellow-300'
      case 'maintenance': return 'bg-gray-100 border-gray-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getSeatTypeIcon = (type: Seat['type']) => {
    switch (type) {
      case 'vip': return '👑'
      case 'couple': return '💕'
      default: return ''
    }
  }

  const renderSeatMap = () => {
    if (seats.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">请选择场次查看座位图</p>
        </div>
      )
    }

    // 按行分组座位
    const seatsByRow = seats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    }, {} as Record<number, Seat[]>)

    const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b)

    return (
      <div className="space-y-4">
        {/* 银幕 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-lg">
            银幕
          </div>
        </div>

        {/* 座位图 */}
        <div className="space-y-2">
          {rows.map(rowNum => {
            const rowSeats = seatsByRow[rowNum].sort((a, b) => a.col - b.col)
            return (
              <div key={rowNum} className="flex items-center justify-center space-x-1">
                {/* 行号 */}
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(64 + rowNum)}
                </div>

                {/* 座位 */}
                {rowSeats.map(seat => {
                  const isSelected = selectedSeats.includes(seat.id)
                  const canSelect = activeTab === 'operation' && (seat.status === 'available' || seat.status === 'locked')

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={!canSelect}
                      className={`
                        w-8 h-8 text-xs border-2 rounded-md flex items-center justify-center
                        transition-all duration-200 relative
                        ${getSeatStatusColor(seat.status)}
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                        ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed'}
                      `}
                      title={`${String.fromCharCode(64 + seat.row)}${seat.col} - ${seat.status === 'available' ? '可用' : seat.status === 'booked' ? '已售' : seat.status === 'locked' ? '锁定' : '维护'} ${seat.type === 'vip' ? '(VIP)' : ''}`}
                    >
                      {getSeatTypeIcon(seat.type)}
                      {seat.type !== 'vip' && seat.type !== 'couple' && (
                        <span className="text-xs">{seat.col}</span>
                      )}
                    </button>
                  )
                })}

                {/* 行号 */}
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(64 + rowNum)}
                </div>
              </div>
            )
          })}
        </div>

        {/* 图例 */}
        <div className="flex justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span>可用</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span>已售</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
            <span>锁定</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span>维护</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center text-xs">
              👑
            </div>
            <span>VIP</span>
          </div>
        </div>
      </div>
    )
  }

  // 场次管理表单状态
  const [isAddScreeningOpen, setIsAddScreeningOpen] = useState(false)

  // 添加场次
  const handleAddScreening = async () => {
    if (!newScreening.movieId || !newScreening.hallId || !newScreening.screeningTime || !newScreening.ticketPrice) {
      alert('请填写完整信息')
      return
    }

    try {
      const response = await fetch('/api/admin/cinema/1/screenings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: Number(newScreening.movieId),
          hallId: Number(newScreening.hallId),
          screeningTime: newScreening.screeningTime,
          ticketPrice: Number(newScreening.ticketPrice)
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('场次添加成功')
        setIsAddScreeningOpen(false)
        setNewScreening({ movieId: '', hallId: '', screeningTime: '', ticketPrice: '' })
        // 重新获取场次列表
        fetchScreenings()
      } else {
        alert('场次添加失败: ' + data.message)
      }
    } catch (error) {
      console.error('添加场次失败:', error)
      alert('添加场次失败')
    }
  }

  // 删除场次
  const handleDeleteScreening = async (screeningId: number) => {
    if (!confirm('确定要删除这个场次吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/cinema/1/screenings/${screeningId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('场次删除成功')
        // 如果删除的是当前选中的场次，清空选择
        if (selectedScreening === screeningId) {
          setSelectedScreening(null)
          setSeats([])
        }
        // 重新获取场次列表
        fetchScreenings()
      } else {
        alert('场次删除失败: ' + data.message)
      }
    } catch (error) {
      console.error('删除场次失败:', error)
      alert('删除场次失败')
    }
  }

  // 获取座位状态样式
  const getSeatStyle = (seat: Seat, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-600 text-white'
    }

    switch (seat.status) {
      case 'available':
        return seat.type === 'vip' ? 'bg-yellow-200 hover:bg-yellow-300' : 'bg-gray-200 hover:bg-gray-300'
      case 'booked':
        return 'bg-red-500 text-white cursor-not-allowed'
      case 'locked':
        return 'bg-orange-500 text-white'
      case 'maintenance':
        return 'bg-gray-400 text-white cursor-not-allowed'
      default:
        return 'bg-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/cinema')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回影院管理
        </Button>
        <h1 className="text-2xl font-bold">座位管理</h1>
      </div>

      {/* 场次管理按钮 */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setIsAddScreeningOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加场次
        </Button>
      </div>

      {/* 成功/错误提示 */}
      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="status">座位状态</TabsTrigger>
          <TabsTrigger value="operation">座位锁定</TabsTrigger>
        </TabsList>

        {/* 座位状态查看 */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                座位状态查看
              </CardTitle>
              <CardDescription>
                实时查看各场次的座位状态和预订情况
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 影厅选择 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>选择影厅</Label>
                  <Select value={selectedHall?.toString()} onValueChange={(value) => setSelectedHall(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择影厅" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map(hall => (
                        <SelectItem key={hall.hallId} value={hall.hallId.toString()}>
                          {hall.hallName} ({hall.seatCount}座)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>选择场次</Label>
                  <Select value={selectedScreening?.toString()} onValueChange={(value) => setSelectedScreening(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择场次" />
                    </SelectTrigger>
                    <SelectContent>
                      {screenings.map(screening => (
                        <div key={screening.screeningId} className="flex items-center justify-between">
                          <SelectItem value={screening.screeningId.toString()} className="flex-1">
                            {screening.movieTitle} - {new Date(screening.screeningTime).toLocaleString()} (剩余:{screening.seatRemain})
                          </SelectItem>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteScreening(screening.screeningId)
                            }}
                            className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 场次信息 */}
              {selectedScreening && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {(() => {
                    const screening = screenings.find(s => s.id === selectedScreening)
                    if (!screening) return null
                    return (
                      <>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">电影</div>
                          <div className="font-medium">{screening.movieTitle}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">时间</div>
                          <div className="font-medium">{screening.date} {screening.time}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">已售</div>
                          <div className="font-medium text-red-600">{screening.bookedSeats}座</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">可售</div>
                          <div className="font-medium text-green-600">{screening.availableSeats}座</div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              {/* 座位图 */}
              {renderSeatMap()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 座位锁定操作 */}
        <TabsContent value="operation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                座位锁定操作
              </CardTitle>
              <CardDescription>
                锁定或释放座位，用于维护或特殊情况处理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 影厅和场次选择 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>选择影厅</Label>
                  <Select value={selectedHall?.toString()} onValueChange={(value) => setSelectedHall(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择影厅" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map(hall => (
                        <SelectItem key={hall.hallId} value={hall.hallId.toString()}>
                          {hall.hallName} ({hall.seatCount}座)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>选择场次</Label>
                  <Select value={selectedScreening} onValueChange={setSelectedScreening}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择场次" />
                    </SelectTrigger>
                    <SelectContent>
                      {screenings.map(screening => (
                        <SelectItem key={screening.id} value={screening.id}>
                          {screening.movieTitle} - {screening.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 操作按钮 */}
              {selectedSeats.length > 0 && (
                <div className="flex gap-2">
                  <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setOperationType('lock')}
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        锁定选中座位 ({selectedSeats.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>确认锁定座位</DialogTitle>
                        <DialogDescription>
                          您将要锁定 {selectedSeats.length} 个座位，锁定后这些座位将无法被预订。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>锁定原因</Label>
                          <Textarea
                            value={lockReason}
                            onChange={(e) => setLockReason(e.target.value)}
                            placeholder="请输入锁定原因（可选）"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLockDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleLockSeats}>
                          确认锁定
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    onClick={handleUnlockSeats}
                    className="flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                    解锁选中座位 ({selectedSeats.length})
                  </Button>
                </div>
              )}

              {/* 座位图 */}
              {renderSeatMap()}

              {selectedSeats.length > 0 && (
                <Alert>
                  <AlertDescription>
                    已选择 {selectedSeats.length} 个座位，点击上方按钮进行锁定或解锁操作。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加场次对话框 */}
      <Dialog open={isAddScreeningOpen} onOpenChange={setIsAddScreeningOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新场次</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>选择电影</Label>
              <Select value={newScreening.movieId} onValueChange={(value) => setNewScreening(prev => ({ ...prev, movieId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择电影" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map(movie => (
                    <SelectItem key={movie.movieId} value={movie.movieId.toString()}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>选择影厅</Label>
              <Select value={newScreening.hallId} onValueChange={(value) => setNewScreening(prev => ({ ...prev, hallId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择影厅" />
                </SelectTrigger>
                <SelectContent>
                  {halls.map(hall => (
                    <SelectItem key={hall.hallId} value={hall.hallId.toString()}>
                      {hall.hallName} ({hall.seatCount}座)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>放映时间</Label>
              <Input
                type="datetime-local"
                value={newScreening.screeningTime}
                onChange={(e) => setNewScreening(prev => ({ ...prev, screeningTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>票价 (元)</Label>
              <Input
                type="number"
                placeholder="请输入票价"
                value={newScreening.ticketPrice}
                onChange={(e) => setNewScreening(prev => ({ ...prev, ticketPrice: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddScreeningOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddScreening}>
              添加场次
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}