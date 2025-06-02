"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { MovieBrief } from "@/components/movie-brief"
import { OrderDetails } from "@/components/order-details"
import { PaymentOptions } from "@/components/payment-options"
import { Button } from "@/components/ui/button"

function OrderConfirmContent({ movieId }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const cinemaId = searchParams.get("cinemaId")
  const showTimeId = searchParams.get("showTimeId")
  const seatsParam = searchParams.get("seats")
  const selectedSeats = seatsParam ? seatsParam.split(",") : []

  const [loading, setLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("wechat")

  const handleSubmitOrder = async () => {
    if (selectedSeats.length === 0) {
      alert("请选择座位")
      return
    }

    setLoading(true)

    // 模拟提交订单
    setTimeout(() => {
      setLoading(false)
      // 跳转到支付成功页面
      router.push(`/movie/${movieId}/payment-success?orderId=ORD${Date.now()}`)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">确认订单</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <MovieBrief movieId={movieId} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <OrderDetails movieId={movieId} cinemaId={cinemaId} showTimeId={showTimeId} selectedSeats={selectedSeats} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <PaymentOptions selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h3 className="font-bold text-lg mb-4">订单金额</h3>
            <OrderDetails
              movieId={movieId}
              cinemaId={cinemaId}
              showTimeId={showTimeId}
              selectedSeats={selectedSeats}
              simple={true}
            />
            <Button className="w-full bg-red-600 hover:bg-red-700 mt-4" onClick={handleSubmitOrder} disabled={loading}>
              {loading ? "处理中..." : "立即支付"}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              点击立即支付，表示您同意《购票须知》和《退改签规则》
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmPage({ params }) {
  const { id: movieId } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>
        <Suspense fallback={<div className="container mx-auto px-4 py-6">加载中...</div>}>
          <OrderConfirmContent movieId={movieId} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
