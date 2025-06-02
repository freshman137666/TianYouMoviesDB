"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

export function UserOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyOrders = Array(5)
        .fill(null)
        .map((_, index) => ({
          id: `ORD${100000 + index}`,
          movieTitle: `订单电影${index + 1}`,
          posterUrl: `/placeholder.svg?height=120&width=80&text=订单${index + 1}`,
          cinema: `影院${index + 1}`,
          showTime: `2023-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1} ${Math.floor(Math.random() * 12) + 10}:${Math.floor(Math.random() * 6) * 10}`,
          seats: `${Math.floor(Math.random() * 10) + 1}排${Math.floor(Math.random() * 10) + 1}座`,
          price: Math.floor(Math.random() * 50) + 30,
          status: ["已完成", "待付款", "已取消"][Math.floor(Math.random() * 3)],
          hasReviewed: Math.random() > 0.7, // 随机设置是否已评价
        }))
      setOrders(dummyOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmitReview = () => {
    if (!selectedOrder) return

    setSubmitting(true)

    // 模拟提交评论到后端
    setTimeout(() => {
      // 更新本地订单状态，标记为已评价
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, hasReviewed: true } : order,
      )

      setOrders(updatedOrders)
      setSubmitting(false)
      setComment("")
      setRating(5)

      // 关闭对话框 - 通过设置selectedOrder为null
      setSelectedOrder(null)

      alert("评价提交成功！")
    }, 1000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="animate-pulse flex">
              <div className="bg-gray-200 w-16 h-24 rounded mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 h-10 mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待付款</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex">
                <div className="relative w-16 h-24 rounded overflow-hidden mr-4">
                  <Image
                    src={order.posterUrl || "/placeholder.svg"}
                    alt={order.movieTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">{order.movieTitle}</h4>
                      <p className="text-sm text-gray-500 mb-1">{order.cinema}</p>
                      <p className="text-sm text-gray-500 mb-1">{order.showTime}</p>
                      <p className="text-sm text-gray-500">{order.seats}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm ${
                          order.status === "待付款"
                            ? "text-red-600"
                            : order.status === "已完成"
                              ? "text-green-600"
                              : "text-gray-500"
                        } mb-2`}
                      >
                        {order.status}
                      </div>
                      <div className="text-lg font-bold mb-2">¥{order.price}</div>
                      {order.status === "待付款" && (
                        <Button className="bg-red-600 hover:bg-red-700 text-white text-sm h-8">去支付</Button>
                      )}
                      {order.status === "已完成" && (
                        <>
                          {order.hasReviewed ? (
                            <Button variant="outline" className="text-sm h-8" disabled>
                              已评价
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-sm h-8"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  评价
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>电影评价</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="mb-4">
                                    <h4 className="font-medium mb-2">{order?.movieTitle}</h4>
                                    <p className="text-sm text-gray-500">
                                      {order?.cinema} | {order?.showTime}
                                    </p>
                                  </div>

                                  <div className="mb-4">
                                    <div className="text-sm text-gray-500 mb-2">评分</div>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setRating(star)}
                                          className="focus:outline-none"
                                        >
                                          <Star
                                            className={`h-8 w-8 ${
                                              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <div className="text-sm text-gray-500 mb-2">评价内容</div>
                                    <Textarea
                                      placeholder="分享您对这部电影的看法..."
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      rows={4}
                                    />
                                  </div>

                                  <Button
                                    className="w-full bg-red-600 hover:bg-red-700"
                                    onClick={handleSubmitReview}
                                    disabled={submitting}
                                  >
                                    {submitting ? "提交中..." : "提交评价"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {orders
            .filter((order) => order.status === "待付款")
            .map((order) => (
              <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex">
                  <div className="relative w-16 h-24 rounded overflow-hidden mr-4">
                    <Image
                      src={order.posterUrl || "/placeholder.svg"}
                      alt={order.movieTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-1">{order.movieTitle}</h4>
                        <p className="text-sm text-gray-500 mb-1">{order.cinema}</p>
                        <p className="text-sm text-gray-500 mb-1">{order.showTime}</p>
                        <p className="text-sm text-gray-500">{order.seats}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-600 mb-2">{order.status}</div>
                        <div className="text-lg font-bold mb-2">¥{order.price}</div>
                        <Button className="bg-red-600 hover:bg-red-700 text-white text-sm h-8">去支付</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders
            .filter((order) => order.status === "已完成")
            .map((order) => (
              <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex">
                  <div className="relative w-16 h-24 rounded overflow-hidden mr-4">
                    <Image
                      src={order.posterUrl || "/placeholder.svg"}
                      alt={order.movieTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-1">{order.movieTitle}</h4>
                        <p className="text-sm text-gray-500 mb-1">{order.cinema}</p>
                        <p className="text-sm text-gray-500 mb-1">{order.showTime}</p>
                        <p className="text-sm text-gray-500">{order.seats}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 mb-2">{order.status}</div>
                        <div className="text-lg font-bold mb-2">¥{order.price}</div>
                        {order.hasReviewed ? (
                          <Button variant="outline" className="text-sm h-8" disabled>
                            已评价
                          </Button>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="text-sm h-8" onClick={() => setSelectedOrder(order)}>
                                评价
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>电影评价</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2">{order.movieTitle}</h4>
                                  <p className="text-sm text-gray-500">
                                    {order.cinema} | {order.showTime}
                                  </p>
                                </div>

                                <div className="mb-4">
                                  <div className="text-sm text-gray-500 mb-2">评分</div>
                                  <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                      >
                                        <Star
                                          className={`h-8 w-8 ${
                                            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="text-sm text-gray-500 mb-2">评价内容</div>
                                  <Textarea
                                    placeholder="分享您对这部电影的看法..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <Button
                                  className="w-full bg-red-600 hover:bg-red-700"
                                  onClick={handleSubmitReview}
                                  disabled={submitting}
                                >
                                  {submitting ? "提交中..." : "提交评价"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {orders
            .filter((order) => order.status === "已取消")
            .map((order) => (
              <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex">
                  <div className="relative w-16 h-24 rounded overflow-hidden mr-4">
                    <Image
                      src={order.posterUrl || "/placeholder.svg"}
                      alt={order.movieTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-1">{order.movieTitle}</h4>
                        <p className="text-sm text-gray-500 mb-1">{order.cinema}</p>
                        <p className="text-sm text-gray-500 mb-1">{order.showTime}</p>
                        <p className="text-sm text-gray-500">{order.seats}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-2">{order.status}</div>
                        <div className="text-lg font-bold mb-2">¥{order.price}</div>
                        <Button variant="outline" className="text-sm h-8">
                          删除订单
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </>
  )
}
