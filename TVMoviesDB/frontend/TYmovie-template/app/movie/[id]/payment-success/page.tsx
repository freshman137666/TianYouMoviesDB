"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage({ params }) {
  const { id: movieId } = params
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [orderInfo, setOrderInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // 模拟从后端获取订单数据
    setTimeout(() => {
      setOrderInfo({
        id: orderId,
        movieTitle: "电影标题",
        cinema: "影院名称",
        hall: "2号厅",
        date: "2023-05-20",
        time: "14:30",
        seats: ["5排6座", "5排7座"],
        totalPrice: 88,
      })
      setLoading(false)
    }, 1000)

    // 倒计时自动跳转
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <main className="container mx-auto px-4 py-10">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">支付成功</h1>
          <p className="text-gray-500 mb-6">您的订单已支付成功，感谢您的购买！</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">订单号:</span>
                <span>{orderInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">电影:</span>
                <span>{orderInfo.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">影院:</span>
                <span>{orderInfo.cinema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">影厅:</span>
                <span>{orderInfo.hall}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">场次:</span>
                <span>
                  {orderInfo.date} {orderInfo.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">座位:</span>
                <span>{orderInfo.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>总价:</span>
                <span className="text-red-600">¥{orderInfo.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/user">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                查看我的订单 {countdown > 0 && `(${countdown}s)`}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
