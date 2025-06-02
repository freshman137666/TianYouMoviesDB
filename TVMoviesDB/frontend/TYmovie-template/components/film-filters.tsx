"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function FilmFilters() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [activeRegion, setActiveRegion] = useState("全部")
  const [activeYear, setActiveYear] = useState("全部")

  const categories = [
    "全部",
    "爱情",
    "喜剧",
    "动画",
    "剧情",
    "恐怖",
    "惊悚",
    "科幻",
    "动作",
    "悬疑",
    "犯罪",
    "冒险",
    "战争",
    "奇幻",
    "运动",
    "家庭",
  ]
  const regions = [
    "全部",
    "中国大陆",
    "美国",
    "韩国",
    "日本",
    "中国香港",
    "中国台湾",
    "泰国",
    "印度",
    "法国",
    "英国",
    "俄罗斯",
    "意大利",
    "西班牙",
    "德国",
    "其他",
  ]
  const years = ["全部", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "更早"]

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">类型：</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeCategory === category
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">地区：</div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeRegion === region
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500 mb-2">年代：</div>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeYear === year
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
