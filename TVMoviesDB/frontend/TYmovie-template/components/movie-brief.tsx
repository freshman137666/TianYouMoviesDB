"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

export function MovieBrief({ movieId }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取电影详情
    setTimeout(() => {
      setMovie({
        id: movieId,
        title: "电影标题",
        posterUrl: "/placeholder.svg?height=120&width=80&text=电影海报",
        rating: "9.0",
        duration: "120分钟",
        categories: ["类型1", "类型2", "类型3"],
        director: "导演名称",
        actors: ["演员1", "演员2", "演员3"],
      })
      setLoading(false)
    }, 1000)
  }, [movieId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 animate-pulse flex">
        <div className="bg-gray-200 w-20 h-28 rounded mr-4"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return <div className="text-center py-4">电影信息未找到</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex">
      <div className="relative w-20 h-28 rounded overflow-hidden mr-4">
        <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
      </div>
      <div>
        <h1 className="text-xl font-bold mb-1">{movie.title}</h1>
        <div className="flex items-center mb-1">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-yellow-500 font-medium mr-2">{movie.rating}</span>
          <span className="text-gray-500 text-sm">{movie.duration}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-1">
          {movie.categories.map((category) => (
            <span key={category} className="text-xs text-gray-500">
              {category}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          导演: {movie.director} | 主演: {movie.actors.join(", ")}
        </p>
      </div>
    </div>
  )
}
