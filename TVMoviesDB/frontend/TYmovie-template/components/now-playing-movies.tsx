"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
// Fix the import statement
// import { mockApiDelay } from "@/lib/mock-data"
// import getMockData from "@/lib/mock-data"
import { mockApiDelay, getMockMovies } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"

export function NowPlayingMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  // Update the useEffect to use the default export
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        // TODO: 当您的Spring Boot API准备好时，取消注释下面的代码
        // const response = await movieAPI.getNowPlaying()
        // setMovies(response.data || response)

        // 目前使用模拟数据
        await mockApiDelay(1000)
        const mockMovies = getMockMovies().filter((movie) => movie.status === "NOW_PLAYING")
        setMovies(mockMovies)
        setLoading(false)
      } catch (error) {
        console.warn("API not available, using mock data")
        // 使用模拟数据作为后备
        const fallbackMovies = getMockMovies().filter((movie) => movie.status === "NOW_PLAYING")
        setMovies(fallbackMovies)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-[240px] mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie.id} className="group">
          <div className="relative mb-2">
            <Link href={`/movie/${movie.id}`}>
              <div className="relative h-[240px] rounded-lg overflow-hidden">
                <Image
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-white text-sm">{movie.rating}</span>
              </div>
            </div>
            <Link href={`/movie/${movie.id}`}>
              <Button className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 h-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                购票
              </Button>
            </Link>
          </div>
          <h3 className="font-medium text-base mb-1 truncate">
            <Link href={`/movie/${movie.id}`} className="hover:text-red-600">
              {movie.title}
            </Link>
          </h3>
          <p className="text-xs text-gray-500">{movie.wantToWatch?.toLocaleString()}人想看</p>
        </div>
      ))}
    </div>
  )
}
