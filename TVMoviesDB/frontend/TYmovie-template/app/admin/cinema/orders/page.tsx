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
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Film, CreditCard, User, Phone, Mail, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Order {
  id: string
  orderNumber: string
  movieTitle: string
  hallName: string
  screeningDate: string
  screeningTime: string
  seats: string[]
  totalAmount: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  orderStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  customerName: string
  customerPhone: string
  customerEmail: string
  createdAt: string
  paidAt?: string
  refundReason?: string
  refundAmount?: number
}

export default function OrdersPage() {
  // Mock data - 在实际应用中应该从API获取
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD20240115001',
      movieTitle: '阿凡达：水之道',
      hallName: '1号厅',
      screeningDate: '2024-01-15',
      screeningTime: '14:30',
      seats: ['A5', 'A6'],
      totalAmount: 90,
      paymentMethod: '微信支付',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      customerName: '张三',
      customerPhone: '13800138000',
      customerEmail: 'zhangsan@example.com',
      createdAt: '2024-01-14 10:30:00',
      paidAt: '2024-01-14 10:32:15'
    },
    {
      id: '2',
      orderNumber: 'ORD20240115002',
      movieTitle: '流浪地球2',
      hallName: '2号厅',
      screeningDate: '2024-01-15',
      screeningTime: '16:00',
      seats: ['C8', 'C9', 'C10'],
      totalAmount: 126,
      paymentMethod: '支付宝',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      customerName: '李四',
      customerPhone: '13900139000',
      customerEmail: 'lisi@example.com',
      createdAt: '2024-01-14 14:20:00',
      paidAt: '2024-01-14 14:21:30'
    },
    {
      id: '3',
      orderNumber: 'ORD20240115003',
      movieTitle: '阿凡达：水之道',
      hallName: '1号厅',
      screeningDate: '2024-01-15',
      screeningTime: '19:30',
      seats: ['F12'],
      totalAmount: 48,
      paymentMethod: '银行卡',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      customerName: '王五',
      customerPhone: '13700137000',
      customerEmail: 'wangwu@example.com',
      createdAt: '2024-01-14 16:45:00'
    },
    {
      id: '4',
      orderNumber: 'ORD20240115004',
      movieTitle: '满江红',
      hallName: '3号厅',
      screeningDate: '2024-01-14',
      screeningTime: '20:00',
      seats: ['D5', 'D6'],
      totalAmount: 80,
      paymentMethod: '微信支付',
      paymentStatus: 'refunded',
      orderStatus: 'cancelled',
      customerName: '赵六',
      customerPhone: '13600136000',
      customerEmail: 'zhaoliu@example.com',
      createdAt: '2024-01-13 18:30:00',
      paidAt: '2024-01-13 18:31:45',
      refundReason: '客户主动取消',
      refundAmount: 80
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refundAmount, setRefundAmount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState('')

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待支付', variant: 'secondary' as const },
      paid: { label: '已支付', variant: 'default' as const },
      refunded: { label: '已退款', variant: 'outline' as const },
      failed: { label: '支付失败', variant: 'destructive' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待确认', variant: 'secondary' as const },
      confirmed: { label: '已确认', variant: 'default' as const },
      cancelled: { label: '已取消', variant: 'destructive' as const },
      completed: { label: '已完成', variant: 'outline' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter
    const matchesDate = !dateFilter || order.screeningDate === dateFilter
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate
  })

  const handleConfirmOrder = (orderId: string) => {
    // TODO: 实际应用中应该调用API
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, orderStatus: 'confirmed' as const }
        : order
    ))
  }

  const handleCancelOrder = (orderId: string) => {
    // TODO: 实际应用中应该调用API
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, orderStatus: 'cancelled' as const }
        : order
    ))
  }

  const handleRefundOrder = () => {
    if (selectedOrder) {
      // TODO: 实际应用中应该调用API
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? {
            ...order,
            orderStatus: 'cancelled' as const,
            paymentStatus: 'refunded' as const,
            refundReason,
            refundAmount
          }
          : order
      ))
      setIsRefundDialogOpen(false)
      setRefundReason('')
      setRefundAmount(0)
      setSelectedOrder(null)
    }
  }

  const getStatistics = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(order => order.screeningDate === today)

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue: orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: orders.filter(order => order.orderStatus === 'pending').length
    }
  }

  const statistics = getStatistics()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">订单管理</h1>
          <p className="text-gray-600 mt-2">管理影院的订单和支付</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总订单数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">累计订单</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日订单</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.todayOrders}</div>
            <p className="text-xs text-muted-foreground">今日新增</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{statistics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">已支付订单</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">待确认订单</p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>筛选订单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">搜索</Label>
              <Input
                id="search"
                placeholder="订单号、客户姓名、手机号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">订单状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment">支付状态</Label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待支付</SelectItem>
                  <SelectItem value="paid">已支付</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                  <SelectItem value="failed">支付失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">放映日期</Label>
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
                  setPaymentStatusFilter('all')
                  setDateFilter('')
                }}
              >
                重置筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 订单列表 */}
      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
          <CardDescription>
            共找到 {filteredOrders.length} 个订单
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>电影信息</TableHead>
                <TableHead>座位</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>支付状态</TableHead>
                <TableHead>订单状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{order.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{order.customerPhone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Film className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{order.movieTitle}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{order.screeningDate}</span>
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{order.screeningTime}</span>
                      </div>
                      <div className="text-xs text-gray-600">{order.hallName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.seats.map(seat => (
                        <Badge key={seat} variant="outline" className="text-xs">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">¥{order.totalAmount}</div>
                      <div className="text-xs text-gray-600">{order.paymentMethod}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{order.createdAt}</div>
                    {order.paidAt && (
                      <div className="text-xs text-gray-600">支付: {order.paidAt}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {order.orderStatus === 'pending' && order.paymentStatus === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmOrder(order.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') &&
                        order.paymentStatus === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setRefundAmount(order.totalAmount)
                              setIsRefundDialogOpen(true)
                            }}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 订单详情对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>
              查看订单的详细信息
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">订单号</Label>
                  <p className="text-sm text-gray-600">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">创建时间</Label>
                  <p className="text-sm text-gray-600">{selectedOrder.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">订单状态</Label>
                  <div className="mt-1">{getOrderStatusBadge(selectedOrder.orderStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">支付状态</Label>
                  <div className="mt-1">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                </div>
              </div>

              {/* 客户信息 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">客户信息</Label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500">姓名</Label>
                    <p className="text-sm">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">手机号</Label>
                    <p className="text-sm">{selectedOrder.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">邮箱</Label>
                    <p className="text-sm">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* 电影信息 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">电影信息</Label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500">电影名称</Label>
                    <p className="text-sm">{selectedOrder.movieTitle}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">影厅</Label>
                    <p className="text-sm">{selectedOrder.hallName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">放映日期</Label>
                    <p className="text-sm">{selectedOrder.screeningDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">放映时间</Label>
                    <p className="text-sm">{selectedOrder.screeningTime}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">座位</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedOrder.seats.map(seat => (
                        <Badge key={seat} variant="outline">{seat}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 支付信息 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">支付信息</Label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500">支付方式</Label>
                    <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">订单金额</Label>
                    <p className="text-sm font-medium">¥{selectedOrder.totalAmount}</p>
                  </div>
                  {selectedOrder.paidAt && (
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-500">支付时间</Label>
                      <p className="text-sm">{selectedOrder.paidAt}</p>
                    </div>
                  )}
                  {selectedOrder.refundReason && (
                    <>
                      <div>
                        <Label className="text-xs text-gray-500">退款原因</Label>
                        <p className="text-sm">{selectedOrder.refundReason}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">退款金额</Label>
                        <p className="text-sm font-medium">¥{selectedOrder.refundAmount}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 退款对话框 */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>订单退款</DialogTitle>
            <DialogDescription>
              处理订单退款申请
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  订单 {selectedOrder.orderNumber} 将被取消并退款，此操作不可撤销。
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="refund-amount">退款金额 (元)</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  max={selectedOrder.totalAmount}
                />
                <p className="text-xs text-gray-500 mt-1">
                  原订单金额: ¥{selectedOrder.totalAmount}
                </p>
              </div>

              <div>
                <Label htmlFor="refund-reason">退款原因</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="请输入退款原因..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefundOrder}
              disabled={!refundReason.trim()}
            >
              确认退款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}