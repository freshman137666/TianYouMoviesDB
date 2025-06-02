"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectCinemaList({ movieId }) {
  const [dates, setDates] = useState([])
  const [cinemas, setCinemas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState("全城")

  useEffect(() => {
    // 生成未来7天的日期
    const generateDates = () => {
      const today = new Date()
      const result = []

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const day = date.getDate()
        const month = date.getMonth() + 1
        const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()]

        result.push({
          date: `${month}月${day}日`,
          weekday,
          value: `${date.getFullYear()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
          isToday: i === 0,
        })
      }

      return result
    }

    setDates(generateDates())

    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyCinemas = Array(8)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `影院${index + 1}`,
          address: `示例地址${index + 1}`,
          area: ["区域1", "区域2", "区域3", "区域4", "区域5"][Math.floor(Math.random() * 5)],
          distance: (Math.random() * 10).toFixed(1),
          minPrice: Math.floor(Math.random() * 30) + 30,
          showTimes: Array(Math.floor(Math.random() * 5) + 3)
            .fill(null)
            .map((_, i) => ({
              id: `st-${index}-${i}`,
              time: `${Math.floor(Math.random() * 12) + 10}:${Math.floor(Math.random() * 6) * 10}`,
              endTime: `${Math.floor(Math.random() * 12) + 10}:${Math.floor(Math.random() * 6) * 10}`,
              hall: `${Math.floor(Math.random() * 8) + 1}号厅`,
              language: Math.random() > 0.5 ? "国语" : "原版",
              price: Math.floor(Math.random() * 30) + 30,
            })),
        }))
      setCinemas(dummyCinemas)
      setLoading(false)
    }, 1000)
  }, [movieId])

  const areas = ["全城", "区域1", "区域2", "区域3", "区域4", "区域5"]

  const filteredCinemas = selectedArea === "全城" ? cinemas : cinemas.filter((cinema) => cinema.area === selectedArea)

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="h-40 bg-gray-200 rounded"></div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue={dates[0]?.value}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {dates.map((date) => (
              <TabsTrigger key={date.value} value={date.value} className="px-4">
                <div className="text-center">
                  <div>{date.weekday}</div>
                  <div>{date.isToday ? "今天" : date.date}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">选择区域:</span>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="选择区域" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {dates.map((date) => (
          <TabsContent key={date.value} value={date.value} className="space-y-6">
            {filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema) => (
                <div key={cinema.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{cinema.name}</h3>
                      <p className="text-sm text-gray-500">
                        {cinema.address} | {cinema.distance}km
                      </p>
                    </div>
                    <div className="text-red-600 font-bold">
                      ¥<span className="text-xl">{cinema.minPrice}</span>起
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cinema.showTimes.map((showTime) => (
                      <div key={showTime.id} className="border border-gray-200 rounded p-3">
                        <div className="flex justify-between text-base font-medium mb-1">
                          <span>{showTime.time}</span>
                          <span className="text-gray-500">{showTime.endTime}散场</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {showTime.hall} | {showTime.language}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-red-600 font-bold">¥{showTime.price}</div>
                          <Link href={`/movie/${movieId}/select-seats?cinemaId=${cinema.id}&showTimeId=${showTime.id}`}>
                            <Button
                              className="bg-red-600 hover:bg-red-700 text-white text-sm h-8"
                              onClick={() =>
                                console.log(
                                  `跳转到选座页面: movieId=${movieId}, cinemaId=${cinema.id}, showTimeId=${showTime.id}`,
                                )
                              }
                            >
                              选座
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">该区域暂无排片信息</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
