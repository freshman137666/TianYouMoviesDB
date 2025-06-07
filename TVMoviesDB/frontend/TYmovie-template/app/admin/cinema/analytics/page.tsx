'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  Users,
  Film,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Clock,
  Star,
  Percent
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface CinemaStats {
  todayRevenue: number
  todayOrders: number
  todayScreenings: number
  averageOccupancy: number
  totalSeats: number
  activeHalls: number
  averageTicketPrice: number
  customerSatisfaction: number
}

interface DailyData {
  date: string
  revenue: number
  orders: number
  occupancy: number
  screenings: number
}

interface HallPerformance {
  hallName: string
  revenue: number
  occupancy: number
  screenings: number
  capacity: number
  type: string
}

interface MoviePerformance {
  movieTitle: string
  revenue: number
  tickets: number
  screenings: number
  occupancyRate: number
  rating: number
}

interface TimeSlotData {
  timeSlot: string
  occupancy: number
  revenue: number
  orders: number
}

export default function CinemaAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - 在实际应用中应该从API获取
  const [cinemaStats] = useState<CinemaStats>({
    todayRevenue: 45680,
    todayOrders: 156,
    todayScreenings: 24,
    averageOccupancy: 72.5,
    totalSeats: 1200,
    activeHalls: 8,
    averageTicketPrice: 48.5,
    customerSatisfaction: 4.6
  })

  const [dailyData] = useState<DailyData[]>([
    { date: '2024-01-01', revenue: 38500, orders: 125, occupancy: 65, screenings: 22 },
    { date: '2024-01-02', revenue: 42300, orders: 142, occupancy: 68, screenings: 24 },
    { date: '2024-01-03', revenue: 39800, orders: 135, occupancy: 70, screenings: 23 },
    { date: '2024-01-04', revenue: 46200, orders: 158, occupancy: 75, screenings: 25 },
    { date: '2024-01-05', revenue: 51200, orders: 172, occupancy: 78, screenings: 26 },
    { date: '2024-01-06', revenue: 48900, orders: 165, occupancy: 82, screenings: 25 },
    { date: '2024-01-07', revenue: 45680, orders: 156, occupancy: 72, screenings: 24 }
  ])

  const [hallPerformance] = useState<HallPerformance[]>([
    { hallName: '1号厅(IMAX)', revenue: 12500, occupancy: 85, screenings: 4, capacity: 120, type: 'IMAX' },
    { hallName: '2号厅', revenue: 8900, occupancy: 78, screenings: 5, capacity: 100, type: '普通厅' },
    { hallName: '3号厅(VIP)', revenue: 9800, occupancy: 72, screenings: 3, capacity: 80, type: 'VIP厅' },
    { hallName: '4号厅(4DX)', revenue: 7200, occupancy: 68, screenings: 3, capacity: 150, type: '4DX' },
    { hallName: '5号厅', revenue: 6500, occupancy: 65, screenings: 4, capacity: 90, type: '普通厅' },
    { hallName: '6号厅', revenue: 5800, occupancy: 62, screenings: 3, capacity: 110, type: '普通厅' },
    { hallName: '7号厅', revenue: 4200, occupancy: 58, screenings: 2, capacity: 95, type: '普通厅' },
    { hallName: '8号厅', revenue: 3600, occupancy: 55, screenings: 2, capacity: 85, type: '普通厅' }
  ])

  const [moviePerformance] = useState<MoviePerformance[]>([
    { movieTitle: '流浪地球3', revenue: 18500, tickets: 420, screenings: 8, occupancyRate: 88, rating: 9.2 },
    { movieTitle: '你好,李焕英2', revenue: 15200, tickets: 350, screenings: 6, occupancyRate: 82, rating: 8.8 },
    { movieTitle: '唐人街探案4', revenue: 12800, tickets: 285, screenings: 5, occupancyRate: 75, rating: 8.5 },
    { movieTitle: '我和我的祖国2', revenue: 9600, tickets: 220, screenings: 4, occupancyRate: 68, rating: 8.3 },
    { movieTitle: '速度与激情11', revenue: 8200, tickets: 185, screenings: 3, occupancyRate: 65, rating: 8.0 }
  ])

  const [timeSlotData] = useState<TimeSlotData[]>([
    { timeSlot: '09:00-12:00', occupancy: 45, revenue: 8500, orders: 28 },
    { timeSlot: '12:00-15:00', occupancy: 68, revenue: 12800, orders: 42 },
    { timeSlot: '15:00-18:00', occupancy: 75, revenue: 15200, orders: 48 },
    { timeSlot: '18:00-21:00', occupancy: 88, revenue: 18900, orders: 65 },
    { timeSlot: '21:00-24:00', occupancy: 72, revenue: 14200, orders: 38 }
  ])

  const occupancyDistribution = [
    { name: '高峰时段(>80%)', value: 35, color: '#22c55e' },
    { name: '正常时段(60-80%)', value: 45, color: '#3b82f6' },
    { name: '低峰时段(<60%)', value: 20, color: '#f59e0b' }
  ]

  const handleRefreshData = async () => {
    setIsLoading(true)
    // TODO: 实际应用中应该调用API刷新数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExportReport = () => {
    // TODO: 实际应用中应该调用API导出报表
    console.log('导出影院报表')
  }

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">运营数据</h1>
          <p className="text-gray-600 mt-2">星光影城运营数据分析和报表</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 时间范围选择 */}
      <div className="flex space-x-4 mb-6">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">今天</SelectItem>
            <SelectItem value="7days">最近7天</SelectItem>
            <SelectItem value="30days">最近30天</SelectItem>
            <SelectItem value="90days">最近90天</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 今日统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cinemaStats.todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.5%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日订单</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cinemaStats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.3%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均上座率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(cinemaStats.averageOccupancy)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客户满意度</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cinemaStats.customerSatisfaction}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> 较昨日
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="halls">影厅表现</TabsTrigger>
          <TabsTrigger value="movies">电影表现</TabsTrigger>
          <TabsTrigger value="timeslot">时段分析</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
        </TabsList>

        {/* 总览 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>收入趋势</CardTitle>
                <CardDescription>最近7天的收入变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>上座率分布</CardTitle>
                <CardDescription>不同时段的上座率分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={occupancyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {occupancyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>关键指标</CardTitle>
              <CardDescription>影院运营的重要指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(cinemaStats.averageTicketPrice)}</div>
                  <p className="text-sm text-gray-600">平均票价</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cinemaStats.activeHalls}</div>
                  <p className="text-sm text-gray-600">活跃影厅</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{cinemaStats.totalSeats}</div>
                  <p className="text-sm text-gray-600">总座位数</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{cinemaStats.todayScreenings}</div>
                  <p className="text-sm text-gray-600">今日场次</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 影厅表现 */}
        <TabsContent value="halls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>影厅表现排行</CardTitle>
              <CardDescription>各影厅的收入和上座率表现</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hallPerformance.map((hall, index) => (
                  <div key={hall.hallName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{hall.hallName}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{hall.type}</Badge>
                          <span className="text-sm text-gray-600">{hall.capacity} 座</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(hall.revenue)}</div>
                      <div className="text-sm text-gray-600">{hall.screenings} 场次</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={hall.occupancy >= 80 ? 'default' : hall.occupancy >= 70 ? 'secondary' : 'destructive'}>
                        {formatPercentage(hall.occupancy)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 电影表现 */}
        <TabsContent value="movies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>电影票房排行</CardTitle>
              <CardDescription>本影院热门电影的表现数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moviePerformance.map((movie, index) => (
                  <div key={movie.movieTitle} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{movie.movieTitle}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{movie.tickets} 张票</span>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">{movie.screenings} 场次</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(movie.revenue)}</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-yellow-600">★</span>
                        <span className="text-sm text-gray-600">{movie.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={movie.occupancyRate >= 80 ? 'default' : movie.occupancyRate >= 70 ? 'secondary' : 'destructive'}>
                        {formatPercentage(movie.occupancyRate)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 时段分析 */}
        <TabsContent value="timeslot" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>时段上座率</CardTitle>
                <CardDescription>不同时段的上座率对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSlot" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="occupancy" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>时段收入分布</CardTitle>
                <CardDescription>各时段的收入贡献</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSlot" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>时段详细数据</CardTitle>
              <CardDescription>各时段的详细运营数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlotData.map((slot, index) => (
                  <div key={slot.timeSlot} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{slot.timeSlot}</h3>
                        <p className="text-sm text-gray-600">{slot.orders} 订单</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(slot.revenue)}</div>
                      <div className="text-sm text-gray-600">收入</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={slot.occupancy >= 80 ? 'default' : slot.occupancy >= 60 ? 'secondary' : 'destructive'}>
                        {formatPercentage(slot.occupancy)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 趋势分析 */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>多维度趋势分析</CardTitle>
              <CardDescription>收入、订单和上座率的综合趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="收入" />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#82ca9d" name="订单数" />
                  <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#ffc658" name="上座率(%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}