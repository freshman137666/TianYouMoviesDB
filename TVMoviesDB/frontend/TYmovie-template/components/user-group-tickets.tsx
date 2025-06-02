"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Clock, MapPin, Users } from "lucide-react"

interface PurchasedTicket {
  id: number
  groupTicketType: {
    id: number
    title: string
    originalPrice: number
    groupPrice: number
    discount: number
    minPeople: number
    maxPeople: number
    validUntil: string
    movie: {
      id: number
      title: string
      poster: string
    }
    cinema: {
      id: number
      name: string
      address: string
    }
  }
  quantity: number
  totalPrice: number
  purchaseTime: string
  status: string
  usedTime?: string
}

export function UserGroupTickets() {
  const router = useRouter()
  const [tickets, setTickets] = useState<PurchasedTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserGroupTickets()
  }, [])

  const fetchUserGroupTickets = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8080/api/group-tickets/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTickets(data.data || [])
      }
    } catch (error) {
      console.error('获取团购票失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTicket = (ticketId: number, movieId: number, cinemaId: number) => {
    // 跳转到选择场次页面，使用团购票
    router.push(`/movie/${movieId}/select-seats?cinemaId=${cinemaId}&useGroupTicket=${ticketId}`)
  }

  const getStatusBadge = (status: string, validUntil: string) => {
    const now = new Date()
    const expiry = new Date(validUntil)

    if (status === '已使用') {
      return <Badge variant="secondary">已使用</Badge>
    } else if (now > expiry) {
      return <Badge variant="destructive">已过期</Badge>
    } else {
      return <Badge variant="default" className="bg-green-600">可使用</Badge>
    }
  }

  const isTicketUsable = (status: string, validUntil: string) => {
    const now = new Date()
    const expiry = new Date(validUntil)
    return status === '未使用' && now <= expiry
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg mb-2">暂无团购票</p>
        <p className="text-gray-400 text-sm">去影院页面购买团购票吧</p>
        <Button
          className="mt-4 bg-red-600 hover:bg-red-700"
          onClick={() => router.push('/cinemas')}
        >
          去购买
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const groupTicket = ticket.groupTicketType
        const isUsable = isTicketUsable(ticket.status, groupTicket.validUntil)

        return (
          <Card key={ticket.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* 左侧内容 */}
                <div className="flex-1 p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={groupTicket.movie.poster || '/placeholder-movie.jpg'}
                      alt={groupTicket.movie.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{groupTicket.title}</h3>
                          <div className="text-gray-600">{groupTicket.movie.title}</div>
                        </div>
                        {getStatusBadge(ticket.status, groupTicket.validUntil)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{groupTicket.cinema.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{ticket.quantity}份 ({groupTicket.minPeople}-{groupTicket.maxPeople}人)</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>有效期至：{new Date(groupTicket.validUntil).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          购买时间：{new Date(ticket.purchaseTime).toLocaleString()}
                        </div>
                        {ticket.usedTime && (
                          <div className="text-xs text-gray-500">
                            使用时间：{new Date(ticket.usedTime).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧价格和操作 */}
                <div className="w-32 bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex flex-col justify-center items-center border-l border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 line-through mb-1">
                      原价¥{groupTicket.originalPrice * ticket.quantity}
                    </div>
                    <div className="text-red-600 font-bold text-lg mb-1">
                      ¥{ticket.totalPrice}
                    </div>
                    <Badge variant="outline" className="text-xs mb-3">
                      {groupTicket.discount}折
                    </Badge>

                    {isUsable ? (
                      <Button
                        size="sm"
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleUseTicket(
                          ticket.id,
                          groupTicket.movie.id,
                          groupTicket.cinema.id
                        )}
                      >
                        <Ticket className="w-4 h-4 mr-1" />
                        立即使用
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        {ticket.status === '已使用' ? '已使用' : '已过期'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}