"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket } from "lucide-react"

export function SelectedSeatsInfo({ movieId, cinemaId, showTimeId, selectedSeats }) {
  const searchParams = useSearchParams()
  const useGroupTicketId = searchParams.get('useGroupTicket')
  const [showtime, setShowtime] = useState(null)
  const [groupTicket, setGroupTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShowtimeData()
    if (useGroupTicketId) {
      fetchGroupTicketData()
    }
  }, [movieId, cinemaId, showTimeId, useGroupTicketId])

  const fetchShowtimeData = async () => {
    try {
      // 模拟从后端获取数据
      setTimeout(() => {
        setShowtime({
          price: 39,
          serviceFee: 5,
        })
        if (!useGroupTicketId) {
          setLoading(false)
        }
      }, 1000)
    } catch (error) {
      console.error('获取场次信息失败:', error)
      setLoading(false)
    }
  }

  const fetchGroupTicketData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/group-tickets/purchased/${useGroupTicketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGroupTicket(data.data)
      }
    } catch (error) {
      console.error('获取团购票信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  const totalPrice = useGroupTicketId ? 0 : selectedSeats.length * (showtime.price + showtime.serviceFee)
  const isGroupTicketValid = groupTicket && selectedSeats.length === groupTicket.quantity

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <h3 className="font-bold text-lg mb-4">
        {useGroupTicketId ? '团购票选座' : '已选座位'}
      </h3>

      {useGroupTicketId && groupTicket && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center mb-2">
            <Ticket className="w-4 h-4 mr-1 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">使用团购票</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>{groupTicket.groupTicketType.title}</div>
            <div className="text-xs text-gray-500 mt-1">
              需选择 {groupTicket.quantity} 个座位
            </div>
          </div>
        </div>
      )}

      {selectedSeats.length > 0 ? (
        <div>
          <div className="mb-4">
            {selectedSeats.map((seatId) => {
              const [row, col] = seatId.split("-")
              return (
                <div key={seatId} className="inline-block bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                  {row}排{col}座
                </div>
              )
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            {useGroupTicketId ? (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">团购票</span>
                  <span className="text-green-600">已付款</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">座位数量</span>
                  <span>{selectedSeats.length}/{groupTicket?.quantity || 0}</span>
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span>应付金额</span>
                  <span className="text-green-600">¥0</span>
                </div>
                {!isGroupTicketValid && (
                  <div className="text-xs text-red-500 mt-2">
                    请选择 {groupTicket?.quantity || 0} 个座位
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">票价</span>
                  <span>
                    ¥{showtime.price} × {selectedSeats.length}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">服务费</span>
                  <span>
                    ¥{showtime.serviceFee} × {selectedSeats.length}
                  </span>
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span>总计</span>
                  <span className="text-red-600">¥{totalPrice}</span>
                </div>
              </div>
            )}
          </div>

          {useGroupTicketId ? (
            <Link
              href={`/movie/${movieId}/order-confirm?cinemaId=${cinemaId}&showTimeId=${showTimeId}&seats=${selectedSeats.join(",")}&useGroupTicket=${useGroupTicketId}`}
            >
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!isGroupTicketValid}
              >
                确认使用团购票
              </Button>
            </Link>
          ) : (
            <Link
              href={`/movie/${movieId}/order-confirm?cinemaId=${cinemaId}&showTimeId=${showTimeId}&seats=${selectedSeats.join(",")}`}
            >
              <Button className="w-full bg-red-600 hover:bg-red-700">确认选座</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">请先选择座位</div>
      )}
    </div>
  )
}
