"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function CinemaFilters() {
  const [activeDistrict, setActiveDistrict] = useState("全部")
  const [activeSubway, setActiveSubway] = useState("全部")
  const [activeSpecial, setActiveSpecial] = useState("全部")
  const [searchQuery, setSearchQuery] = useState("")

  const districts = [
    "全部",
    "朝阳区",
    "海淀区",
    "东城区",
    "西城区",
    "丰台区",
    "石景山区",
    "通州区",
    "昌平区",
    "大兴区",
    "顺义区",
    "房山区",
  ]
  const subways = [
    "全部",
    "1号线",
    "2号线",
    "4号线",
    "5号线",
    "6号线",
    "7号线",
    "8号线",
    "9号线",
    "10号线",
    "13号线",
    "14号线",
    "15号线",
    "16号线",
    "八通线",
    "昌平线",
    "亦庄线",
    "房山线",
  ]
  const specials = [
    "全部",
    "IMAX厅",
    "CGS中国巨幕",
    "杜比全景声",
    "杜比影院",
    "RealD厅",
    "4DX厅",
    "DTS:X 临境音厅",
    "儿童厅",
    "4K厅",
    "4D厅",
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // 实现搜索逻辑
    console.log("搜索影院:", searchQuery)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="搜索影院"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </form>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">区域：</div>
        <div className="flex flex-wrap gap-2">
          {districts.map((district) => (
            <Button
              key={district}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeDistrict === district
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveDistrict(district)}
            >
              {district}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">地铁：</div>
        <div className="flex flex-wrap gap-2">
          {subways.map((subway) => (
            <Button
              key={subway}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeSubway === subway
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSubway(subway)}
            >
              {subway}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500 mb-2">特殊厅：</div>
        <div className="flex flex-wrap gap-2">
          {specials.map((special) => (
            <Button
              key={special}
              variant="ghost"
              className={`h-8 rounded-full px-3 py-1 text-sm ${
                activeSpecial === special
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSpecial(special)}
            >
              {special}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
