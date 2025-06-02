"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CinemaList() {
  const [cinemas, setCinemas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyCinemas = Array(10)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `影院${index + 1}`,
          address: `示例地址${index + 1}`,
          area: ["区域1", "区域2", "区域3", "区域4", "区域5"][Math.floor(Math.random() * 5)],
          distance: (Math.random() * 10).toFixed(1),
          minPrice: Math.floor(Math.random() * 30) + 30,
          tags: ["特色1", "特色2", "特色3", "特色4", "特色5"]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3) + 1),
          promotion: Math.random() > 0.5,
        }))
      setCinemas(dummyCinemas)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 animate-pulse flex">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cinemas.map((cinema) => (
        <div key={cinema.id} className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold mb-1">
                <Link href={`/cinema/${cinema.id}`} className="hover:text-red-600">
                  {cinema.name}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{cinema.address}</span>
                <span className="ml-2">{cinema.distance}km</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {cinema.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              {cinema.promotion && (
                <div className="text-xs text-red-600 mb-2">
                  <span className="border border-red-600 rounded px-1 mr-1">卡</span>
                  购卡特惠，首单立减10元
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-red-600 font-bold mb-2">
                ¥<span className="text-xl">{cinema.minPrice}</span>起
              </div>
              <Link href={`/cinema/${cinema.id}`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">选座购票</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
