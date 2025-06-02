"use client"

import { useState, useEffect } from "react"

export function ShowtimeInfo({ cinemaId, showTimeId }) {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      setInfo({
        cinema: `影院${cinemaId}`,
        hall: "2号厅",
        date: "2023-05-20",
        time: "14:30",
        endTime: "16:45",
        language: "国语",
        version: "2D",
      })
      setLoading(false)
    }, 1000)
  }, [cinemaId, showTimeId])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{info.cinema}</h2>
      <div className="text-sm text-gray-500">
        {info.hall} | {info.date} {info.time}-{info.endTime} | {info.language} {info.version}
      </div>
    </div>
  )
}
