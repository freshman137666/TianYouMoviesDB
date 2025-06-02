"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyFavorites = Array(4)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          title: `收藏电影${index + 1}`,
          posterUrl: `/placeholder.svg?height=120&width=80&text=收藏${index + 1}`,
          rating: (Math.random() * 2 + 7).toFixed(1), // 7.0-9.0之间的随机评分
          isPlaying: Math.random() > 0.5,
        }))
      setFavorites(dummyFavorites)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="animate-pulse flex">
              <div className="bg-gray-200 w-12 h-16 rounded mr-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {favorites.length > 0 ? (
        favorites.map((movie) => (
          <div key={movie.id} className="flex">
            <Link href={`/movie/${movie.id}`} className="relative w-12 h-16 rounded overflow-hidden mr-2">
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </Link>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1 line-clamp-1">
                <Link href={`/movie/${movie.id}`} className="hover:text-red-600">
                  {movie.title}
                </Link>
              </h4>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{movie.rating}</span>
              </div>
              {movie.isPlaying ? (
                <Link href={`/movie/${movie.id}/buy`}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white text-xs h-6 px-2">购票</Button>
                </Link>
              ) : (
                <span className="text-xs text-gray-500">暂未上映</span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-4 text-gray-500">暂无收藏电影</div>
      )}
    </div>
  )
}
