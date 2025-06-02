"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

export function MovieGrid({ category }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    // 实际使用时，这里应该是一个fetch请求到你的Spring Boot后端
    // 例如: fetch(`/api/movies/${category}`)
    setTimeout(() => {
      const dummyMovies = Array(8)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          title: `电影标题 ${index + 1}`,
          posterUrl: `/placeholder.svg?height=300&width=200&text=Movie${index + 1}`,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0之间的随机评分
          year: 2023,
          category: ["动作", "冒险", "科幻"][Math.floor(Math.random() * 3)],
        }))
      setMovies(dummyMovies)
      setLoading(false)
    }, 1000)
  }, [category])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[300px] animate-pulse"></div>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
          <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
            <div className="relative h-[250px]">
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">{movie.title}</h3>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{movie.rating}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {movie.year} · {movie.category}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
