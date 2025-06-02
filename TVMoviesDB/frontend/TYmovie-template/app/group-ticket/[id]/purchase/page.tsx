"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Users, Clock, MapPin, Ticket } from "lucide-react"

interface GroupTicket {
  id: number
  movieId: number
  movie: {
    id: number
    title: string
    poster: string
    duration: number
    genre: string
  }
  cinema: {
    id: number
    name: string
    address: string
  }
  title: string
  originalPrice: number
  groupPrice: number
  discount: number
  minPeople: number
  maxPeople: number
  validUntil: string
  description: string
  stock: number
  terms: string[]
}

export default function GroupTicketPurchasePage({ params }) {
  const { id: groupTicketId } = use(params)
  const router = useRouter()
  const [groupTicket, setGroupTicket] = useState<GroupTicket | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchGroupTicketDetail()
  }, [groupTicketId])

  const fetchGroupTicketDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/group-tickets/${groupTicketId}`)
      if (response.ok) {
        const data = await response.json()
        setGroupTicket(data.data)
        setQuantity(data.data.minPeople)
      }
    } catch (error) {
      console.error('获取团购票详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (!groupTicket) return

    if (newQuantity >= groupTicket.minPeople && newQuantity <= groupTicket.maxPeople) {
      setQuantity(newQuantity)
    }
  }

  const handlePurchase = async () => {
    if (!groupTicket) return

    setPurchasing(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/group-tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          groupTicketTypeId: groupTicket.id,
          quantity: quantity
        })
      })

      const data = await response.json()
      if (data.success) {
        // 跳转到支付成功页面或用户中心
        router.push('/user?tab=group-tickets')
      } else {
        alert(data.message || '购买失败')
      }
    } catch (error) {
      console.error('购买团购票失败:', error)
      alert('购买失败，请重试')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">加载中...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!groupTicket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">团购票不存在</div>
        </div>
        <Footer />
      </div>
    )
  }

  const totalPrice = quantity * groupTicket.groupPrice
  const originalTotalPrice = quantity * groupTicket.originalPrice
  const savings = originalTotalPrice - totalPrice

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">团购票购买</h1>
            <p className="text-gray-600 mt-1">请确认购买信息</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：团购票详情 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 电影信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ticket className="w-5 h-5 mr-2 text-red-600" />
                    团购票详情
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img
                      src={groupTicket.movie.poster || '/placeholder-movie.jpg'}
                      alt={groupTicket.movie.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{groupTicket.title}</h3>
                      <div className="text-lg text-gray-700 mb-2">{groupTicket.movie.title}</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{groupTicket.cinema.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>有效期至：{new Date(groupTicket.validUntil).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>适用人数：{groupTicket.minPeople}-{groupTicket.maxPeople}人</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-700">{groupTicket.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 购买数量 */}
              <Card>
                <CardHeader>
                  <CardTitle>选择数量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium">购买份数</div>
                      <div className="text-sm text-gray-600">
                        最少{groupTicket.minPeople}份，最多{groupTicket.maxPeople}份
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= groupTicket.minPeople}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= groupTicket.maxPeople}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 使用须知 */}
              <Card>
                <CardHeader>
                  <CardTitle>使用须知</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• 团购票购买后不可退款，请谨慎购买</p>
                    <p>• 团购票需在有效期内使用，过期作废</p>
                    <p>• 使用时需提前选择场次和座位</p>
                    <p>• 团购票不可与其他优惠同时使用</p>
                    <p>• 如有疑问请联系客服</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：价格和支付 */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>订单信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>团购票单价</span>
                      <span>¥{groupTicket.groupPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>购买数量</span>
                      <span>{quantity}份</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>原价</span>
                      <span className="line-through">¥{originalTotalPrice}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>实付金额</span>
                      <span className="text-red-600">¥{totalPrice}</span>
                    </div>
                    <div className="text-center text-sm text-green-600">
                      已优惠 ¥{savings}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Badge variant="destructive" className="w-full justify-center py-2">
                      {groupTicket.discount}折特惠
                    </Badge>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                      onClick={handlePurchase}
                      disabled={purchasing || groupTicket.stock === 0}
                    >
                      {purchasing ? '购买中...' : groupTicket.stock === 0 ? '已售罄' : '立即购买'}
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      点击购买即表示同意相关条款
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}