"use client"

import { useState, useEffect } from "react"
import type { SeatStatus } from "@/lib/types"

export function SeatSelector({ movieId, cinemaId, showTimeId, selectedSeats, setSelectedSeats }) {
  const [seatMap, setSeatMap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取座位数据
    setTimeout(() => {
      // 生成10行12列的座位图
      const rows = 10
      const cols = 12
      const generatedSeatMap = []

      for (let i = 0; i < rows; i++) {
        const row = []
        for (let j = 0; j < cols; j++) {
          // 随机生成座位状态: 0=可选, 1=已售, 2=不可用
          const status = Math.random() < 0.8 ? 0 : Math.random() < 0.5 ? 1 : 2
          row.push({
            id: `${i + 1}-${j + 1}`,
            row: i + 1,
            col: j + 1,
            status,
          })
        }
        generatedSeatMap.push(row)
      }

      setSeatMap(generatedSeatMap)
      setLoading(false)
    }, 1000)
  }, [movieId, cinemaId, showTimeId])

  const toggleSeat = (seat: SeatStatus) => {
    if (seat.status !== "AVAILABLE") return // 只能选择可选座位

    const seatId = seat.id.toString()
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
    } else {
      if (selectedSeats.length >= 4) {
        alert("最多只能选择4个座位")
        return
      }
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-3/4 h-8 bg-gray-200 rounded-lg mx-auto mb-6">
          <div className="text-center text-sm text-gray-500 pt-1">银幕</div>
        </div>

        <div className="flex justify-center mb-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <span className="text-xs text-gray-500">可选</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-1"></div>
            <span className="text-xs text-gray-500">已选</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-1"></div>
            <span className="text-xs text-gray-500">已售</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
            <span className="text-xs text-gray-500">不可用</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-12 gap-1 mb-2">
              {Array(12)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    {index + 1}
                  </div>
                ))}
            </div>

            {seatMap.map((row, rowIndex) => (
              <div key={rowIndex} className="flex mb-1 items-center">
                <div className="text-xs text-gray-500 w-4 mr-2">{rowIndex + 1}</div>
                <div className="grid grid-cols-12 gap-1 flex-1">
                  {row.map((seat) => {
                    let bgColor = "bg-gray-200 hover:bg-gray-300"
                    if (selectedSeats.includes(seat.id)) {
                      bgColor = "bg-red-600"
                    } else if (seat.status === 1) {
                      bgColor = "bg-gray-400"
                    } else if (seat.status === 2) {
                      bgColor = "bg-gray-300"
                    }

                    return (
                      <button
                        key={seat.id}
                        className={`w-6 h-6 rounded ${bgColor} ${seat.status === 0 ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.status !== 0}
                        title={`${seat.row}排${seat.col}座`}
                      ></button>
                    )
                  })}
                </div>
                <div className="text-xs text-gray-500 w-4 ml-2">{rowIndex + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
