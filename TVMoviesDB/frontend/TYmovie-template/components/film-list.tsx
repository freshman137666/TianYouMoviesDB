"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FilmList() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyMovies = Array(12)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          title: `电影${index + 1}`,
          posterUrl: `/placeholder.svg?height=300&width=200&text=电影${index + 1}`,
          rating: (Math.random() * 2 + 7).toFixed(1), // 7.0-9.0之间的随机评分
          category: ["类型1", "类型2", "类型3", "类型4", "类型5", "类型6"][Math.floor(Math.random() * 6)],
          actors: ["演员A", "演员B", "演员C"].join(" "),
          showTimes: Math.floor(Math.random() * 50) + 10,
        }))
      setMovies(dummyMovies)
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
              <div className="bg-gray-200 w-32 h-44 rounded mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-white rounded-lg p-4 flex">
          <Link href={`/movie/${movie.id}`} className="relative w-32 h-44 rounded overflow-hidden mr-4">
            <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
          </Link>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold mb-1">
                  <Link href={`/movie/${movie.id}`} className="hover:text-red-600">
                    {movie.title}
                  </Link>
                </h3>
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-yellow-500 font-medium mr-2">{movie.rating}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{movie.category}</p>
                <p className="text-sm text-gray-500 mb-4">主演：{movie.actors}</p>
              </div>
              <div className="text-sm text-gray-500">今日{movie.showTimes}场</div>
            </div>
            <Link href={`/movie/${movie.id}/buy`}>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">购票</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
