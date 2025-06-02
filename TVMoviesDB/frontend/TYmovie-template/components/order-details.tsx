"use client"

import { useState, useEffect } from "react"

export function OrderDetails({ movieId, cinemaId, showTimeId, selectedSeats, simple = false }) {
  const [orderInfo, setOrderInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      setOrderInfo({
        cinema: `影院${cinemaId}`,
        hall: "2号厅",
        date: "2023-05-20",
        time: "14:30",
        endTime: "16:45",
        seats: selectedSeats.map((seatId) => {
          const [row, col] = seatId.split("-")
          return `${row}排${col}座`
        }),
        price: 39,
        serviceFee: 5,
        totalPrice: selectedSeats.length * (39 + 5),
      })
      setLoading(false)
    }, 1000)
  }, [movieId, cinemaId, showTimeId, selectedSeats])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (simple) {
    return (
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">票价</span>
          <span>
            ¥{orderInfo.price} × {selectedSeats.length}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">服务费</span>
          <span>
            ¥{orderInfo.serviceFee} × {selectedSeats.length}
          </span>
        </div>
        <div className="flex justify-between font-bold mt-4 text-lg">
          <span>总计</span>
          <span className="text-red-600">¥{orderInfo.totalPrice}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">场次信息</h3>
      <div className="space-y-2 mb-4">
        <div className="flex">
          <span className="text-gray-500 w-20">影院:</span>
          <span>{orderInfo.cinema}</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-20">影厅:</span>
          <span>{orderInfo.hall}</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-20">场次:</span>
          <span>
            {orderInfo.date} {orderInfo.time}-{orderInfo.endTime}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-20">座位:</span>
          <div className="flex flex-wrap">
            {orderInfo.seats.map((seat, index) => (
              <span key={index} className="mr-2 mb-1">
                {seat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-bold text-lg mb-4">价格明细</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">票价</span>
          <span>
            ¥{orderInfo.price} × {selectedSeats.length}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">服务费</span>
          <span>
            ¥{orderInfo.serviceFee} × {selectedSeats.length}
          </span>
        </div>
        <div className="flex justify-between font-bold mt-4">
          <span>总计</span>
          <span className="text-red-600">¥{orderInfo.totalPrice}</span>
        </div>
      </div>
    </div>
  )
}
