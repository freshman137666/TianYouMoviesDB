"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockApiDelay, getMockMovies } from "@/lib/mock-data"

export function ComingSoonMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        await mockApiDelay(1000)
        const mockMovies = getMockMovies().filter((movie) => movie.status === "COMING_SOON")
        setMovies(mockMovies)
        setLoading(false)
      } catch (error) {
        console.warn("Error fetching movies:", error)
        setMovies([])
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
                <Calendar className="h-4 w-4 text-white" />
                <span className="ml-1 text-white text-sm">{movie.releaseDate}</span>
              </div>
            </div>
            <Button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 h-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              预售
            </Button>
          </div>
          <h3 className="font-medium text-base mb-1 truncate">
            <Link href={`/movie/${movie.id}`} className="hover:text-red-600">
              {movie.title}
            </Link>
          </h3>
          <p className="text-xs text-gray-500">{movie.wantToWatch.toLocaleString()}人想看</p>
        </div>
      ))}
    </div>
  )
}
