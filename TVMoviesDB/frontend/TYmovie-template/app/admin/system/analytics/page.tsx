'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Film,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Target,
  Percent
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface OverallStats {
  totalUsers: number
  totalCinemas: number
  totalMovies: number
  totalOrders: number
  totalRevenue: number
  averageTicketPrice: number
  occupancyRate: number
  activeScreenings: number
}

interface RevenueData {
  date: string
  revenue: number
  orders: number
  occupancy: number
}

interface CinemaPerformance {
  cinemaName: string
  revenue: number
  orders: number
  occupancyRate: number
  screenings: number
}

interface MoviePerformance {
  movieTitle: string
  revenue: number
  tickets: number
  screenings: number
  rating: number
}

interface UserStats {
  date: string
  newUsers: number
  activeUsers: number
  totalUsers: number
}

export default function SystemAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - 在实际应用中应该从API获取
  const [overallStats] = useState<OverallStats>({
    totalUsers: 15420,
    totalCinemas: 25,
    totalMovies: 156,
    totalOrders: 8934,
    totalRevenue: 2456780,
    averageTicketPrice: 45.5,
    occupancyRate: 68.5,
    activeScreenings: 342
  })

  const [revenueData] = useState<RevenueData[]>([
    { date: '2024-01-01', revenue: 125000, orders: 450, occupancy: 65 },
    { date: '2024-01-02', revenue: 138000, orders: 520, occupancy: 72 },
    { date: '2024-01-03', revenue: 142000, orders: 580, occupancy: 75 },
    { date: '2024-01-04', revenue: 156000, orders: 620, occupancy: 78 },
    { date: '2024-01-05', revenue: 168000, orders: 680, occupancy: 82 },
    { date: '2024-01-06', revenue: 175000, orders: 720, occupancy: 85 },
    { date: '2024-01-07', revenue: 182000, orders: 750, occupancy: 88 }
  ])

  const [cinemaPerformance] = useState<CinemaPerformance[]>([
    { cinemaName: '星光影城', revenue: 285000, orders: 1250, occupancyRate: 85, screenings: 45 },
    { cinemaName: '银河影院', revenue: 268000, orders: 1180, occupancyRate: 82, screenings: 42 },
    { cinemaName: '万达影城', revenue: 245000, orders: 1050, occupancyRate: 78, screenings: 38 },
    { cinemaName: '华谊兄弟影院', revenue: 220000, orders: 980, occupancyRate: 75, screenings: 35 },
    { cinemaName: '中影国际影城', revenue: 198000, orders: 890, occupancyRate: 72, screenings: 32 }
  ])

  const [moviePerformance] = useState<MoviePerformance[]>([
    { movieTitle: '流浪地球3', revenue: 450000, tickets: 12500, screenings: 85, rating: 9.2 },
    { movieTitle: '你好,李焕英2', revenue: 380000, tickets: 10200, screenings: 72, rating: 8.8 },
    { movieTitle: '唐人街探案4', revenue: 320000, tickets: 8900, screenings: 65, rating: 8.5 },
    { movieTitle: '我和我的祖国2', revenue: 285000, tickets: 7800, screenings: 58, rating: 8.3 },
    { movieTitle: '速度与激情11', revenue: 265000, tickets: 7200, screenings: 52, rating: 8.0 }
  ])

  const [userStats] = useState<UserStats[]>([
    { date: '2024-01-01', newUsers: 120, activeUsers: 2800, totalUsers: 15200 },
    { date: '2024-01-02', newUsers: 135, activeUsers: 3200, totalUsers: 15335 },
    { date: '2024-01-03', newUsers: 98, activeUsers: 2950, totalUsers: 15433 },
    { date: '2024-01-04', newUsers: 156, activeUsers: 3400, totalUsers: 15589 },
    { date: '2024-01-05', newUsers: 142, activeUsers: 3100, totalUsers: 15731 },
    { date: '2024-01-06', newUsers: 178, activeUsers: 3600, totalUsers: 15909 },
    { date: '2024-01-07', newUsers: 165, activeUsers: 3350, totalUsers: 16074 }
  ])

  const pieData = [
    { name: '在线支付', value: 75, color: '#0088FE' },
    { name: '现场支付', value: 20, color: '#00C49F' },
    { name: '会员积分', value: 5, color: '#FFBB28' }
  ]

  const handleRefreshData = async () => {
    setIsLoading(true)
    // TODO: 实际应用中应该调用API刷新数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExportReport = () => {
    // TODO: 实际应用中应该调用API导出报表
    console.log('导出报表')
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
          <h1 className="text-3xl font-bold">运营数据分析</h1>
          <p className="text-gray-600 mt-2">平台整体运营数据监控和分析</p>
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
            <SelectItem value="7days">最近7天</SelectItem>
            <SelectItem value="30days">最近30天</SelectItem>
            <SelectItem value="90days">最近90天</SelectItem>
            <SelectItem value="1year">最近1年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> 较上期
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总订单数</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> 较上期
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均上座率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(overallStats.occupancyRate)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.1%</span> 较上期
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> 较上期
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">收入分析</TabsTrigger>
          <TabsTrigger value="cinema">影院表现</TabsTrigger>
          <TabsTrigger value="movie">电影表现</TabsTrigger>
          <TabsTrigger value="user">用户分析</TabsTrigger>
          <TabsTrigger value="payment">支付分析</TabsTrigger>
        </TabsList>

        {/* 收入分析 */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>收入趋势</CardTitle>
                <CardDescription>最近7天的收入变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="收入" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>订单与上座率</CardTitle>
                <CardDescription>订单数量与上座率的关系</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="订单数" />
                    <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#82ca9d" name="上座率(%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>关键指标</CardTitle>
              <CardDescription>重要的运营指标汇总</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(overallStats.averageTicketPrice)}</div>
                  <p className="text-sm text-gray-600">平均票价</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{overallStats.activeScreenings}</div>
                  <p className="text-sm text-gray-600">活跃场次</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatPercentage(overallStats.occupancyRate)}</div>
                  <p className="text-sm text-gray-600">平均上座率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 影院表现 */}
        <TabsContent value="cinema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>影院表现排行</CardTitle>
              <CardDescription>各影院的收入和运营表现</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cinemaPerformance.map((cinema, index) => (
                  <div key={cinema.cinemaName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{cinema.cinemaName}</h3>
                        <p className="text-sm text-gray-600">{cinema.screenings} 场次</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(cinema.revenue)}</div>
                      <div className="text-sm text-gray-600">{cinema.orders} 订单</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={cinema.occupancyRate >= 80 ? 'default' : cinema.occupancyRate >= 70 ? 'secondary' : 'destructive'}>
                        {formatPercentage(cinema.occupancyRate)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 电影表现 */}
        <TabsContent value="movie" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>电影票房排行</CardTitle>
              <CardDescription>热门电影的票房和观影数据</CardDescription>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 用户分析 */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>用户增长趋势</CardTitle>
              <CardDescription>用户注册和活跃度变化</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="新增用户" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" name="活跃用户" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 支付分析 */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>支付方式分布</CardTitle>
                <CardDescription>不同支付方式的使用比例</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>支付统计</CardTitle>
                <CardDescription>支付相关的关键数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">支付成功率</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">平均支付时间</span>
                    <span className="font-medium">2.3秒</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">退款率</span>
                    <span className="font-medium">1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">单笔平均金额</span>
                    <span className="font-medium">{formatCurrency(overallStats.averageTicketPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}