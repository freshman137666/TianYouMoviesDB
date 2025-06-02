"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { mockApiDelay, getMockHotRankings } from "@/lib/mock-data"

export function HotRankings() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        await mockApiDelay(1000)
        const rankingsData = getMockHotRankings()
        setRankings(rankingsData)
        setLoading(false)
      } catch (error) {
        console.warn("Error fetching rankings:", error)
        setRankings([])
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3"></div>
              <div className="bg-gray-200 w-16 h-24 rounded mr-3"></div>
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
    <div className="space-y-4">
      {rankings.map((ranking, index) => (
        <Link key={ranking.movie.id} href={`/movie/${ranking.movie.id}`} className="flex items-start group">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
              index < 3 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {ranking.rank}
          </div>
          <div className="relative w-16 h-24 rounded overflow-hidden mr-3">
            <Image
              src={ranking.movie.posterUrl || "/placeholder.svg"}
              alt={ranking.movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1 group-hover:text-red-600 line-clamp-1">{ranking.movie.title}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="mr-2">{ranking.rating}</span>
              <span>票房 {(ranking.boxOffice / 100000000).toFixed(1)}亿</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
