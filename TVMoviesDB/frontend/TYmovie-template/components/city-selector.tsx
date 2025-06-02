"use client"

import { useState } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("北京")

  const hotCities = ["北京", "上海", "广州", "深圳", "成都", "武汉", "杭州", "重庆", "南京", "西安", "天津", "苏州"]

  const citiesByLetter = {
    A: ["阿坝", "阿拉善", "阿里", "安康", "安庆", "鞍山", "安顺", "安阳", "澳门"],
    B: ["北京", "白银", "保定", "宝鸡", "保山", "包头", "巴中", "北海", "蚌埠", "本溪", "毕节", "滨州", "百色", "亳州"],
    C: [
      "重庆",
      "成都",
      "长沙",
      "长春",
      "沧州",
      "常德",
      "昌都",
      "长治",
      "常州",
      "巢湖",
      "潮州",
      "承德",
      "郴州",
      "赤峰",
      "池州",
      "崇左",
      "楚雄",
      "滁州",
      "朝阳",
    ],
    D: ["大连", "东莞", "大理", "丹东", "大庆", "大同", "大兴安岭", "德宏", "德阳", "德州", "定西", "迪庆", "东营"],
    E: ["鄂尔多斯", "恩施", "鄂州"],
    F: ["福州", "防城港", "佛山", "抚顺", "抚州", "阜新", "阜阳"],
    G: ["广州", "桂林", "贵阳", "甘南", "赣州", "甘孜", "广安", "广元", "贵港", "果洛"],
    H: [
      "杭州",
      "哈尔滨",
      "合肥",
      "海口",
      "呼和浩特",
      "海北",
      "海东",
      "海南",
      "海西",
      "邯郸",
      "汉中",
      "鹤壁",
      "河池",
      "鹤岗",
      "黑河",
      "衡水",
      "衡阳",
      "河源",
      "贺州",
      "红河",
      "淮安",
      "淮北",
      "怀化",
      "淮南",
      "黄冈",
      "黄南",
      "黄山",
      "黄石",
      "惠州",
      "葫芦岛",
      "呼伦贝尔",
      "湖州",
      "菏泽",
    ],
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
          <MapPin className="h-4 w-4 mr-1" />
          {selectedCity}
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">当前城市</h3>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-red-600" />
              <span className="font-medium">{selectedCity}</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">热门城市</h3>
            <div className="grid grid-cols-3 gap-2">
              {hotCities.map((city) => (
                <button
                  key={city}
                  className={`text-sm py-1 px-2 rounded ${
                    selectedCity === city ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="A">
            <TabsList className="grid grid-cols-8 h-9">
              {Object.keys(citiesByLetter).map((letter) => (
                <TabsTrigger key={letter} value={letter} className="text-xs">
                  {letter}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(citiesByLetter).map(([letter, cities]) => (
              <TabsContent key={letter} value={letter} className="mt-2">
                <div className="grid grid-cols-3 gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      className={`text-sm py-1 px-2 rounded text-left ${
                        selectedCity === city ? "bg-red-600 text-white" : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}
