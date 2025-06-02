"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export function MovieCarousel() {
  const [featuredMovies, setFeaturedMovies] = useState([
    {
      id: 1,
      title: "复仇者联盟4：终局之战",
      posterUrl: "/placeholder.svg?height=600&width=1200",
      description: "漫威电影宇宙的传奇性收官之作，复仇者联盟将面临最终决战。",
    },
    {
      id: 2,
      title: "阿凡达：水之道",
      posterUrl: "/placeholder.svg?height=600&width=1200",
      description: "杰克·萨利重返潘多拉星球，与纳美人一起保卫他们的家园。",
    },
    {
      id: 3,
      title: "流浪地球2",
      posterUrl: "/placeholder.svg?height=600&width=1200",
      description: '人类为拯救地球，实施"流浪地球"计划，将地球推出太阳系。',
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredMovies.length])

  return (
    <div className="relative rounded-lg overflow-hidden h-[400px] shadow-xl">
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={movie.posterUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <p className="mb-4 max-w-lg">{movie.description}</p>
              <Link
                href={`/movie/${movie.id}`}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md inline-block"
              >
                查看详情
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
