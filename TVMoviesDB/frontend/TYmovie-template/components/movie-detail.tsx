"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Calendar, Film, Heart, Share2, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MovieDetail({ movieId }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    // 模拟API请求延迟，然后使用模拟数据
    setTimeout(() => {
      setMovie({
        id: movieId,
        title: "电影标题",
        posterUrl: "/placeholder.svg?height=450&width=300&text=电影海报",
        backdropUrl: "/placeholder.svg?height=600&width=1200&text=电影背景",
        rating: "9.0",
        wantToWatch: 100000,
        year: "2023",
        duration: "120分钟",
        categories: ["类型1", "类型2", "类型3"],
        director: "导演名称",
        actors: ["演员1", "演员2", "演员3", "演员4", "演员5", "演员6"],
        description:
          "这里是电影的剧情简介。这是一个示例文本，将在实际使用时被替换为真实的电影描述。您可以在这里添加电影的详细情节、背景故事、主要角色等信息。",
        videoUrl: "#",
      })
      setLoading(false)
    }, 1000)
  }, [movieId])

  const handleFavoriteToggle = async () => {
    try {
      setFavoriteLoading(true)
      // 模拟收藏操作
      setTimeout(() => {
        setIsFavorited(!isFavorited)
        setFavoriteLoading(false)
      }, 500)
    } catch (err) {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] bg-gray-300 mb-6"></div>
      </div>
    )
  }

  if (!movie) {
    return <div className="text-center py-10">电影信息未找到</div>
  }

  return (
    <div>
      <div className="relative h-[400px] overflow-hidden">
        <Image src={movie.backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-end gap-6">
              <div className="relative h-[180px] w-[120px] shadow-lg rounded-lg overflow-hidden">
                <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {movie.categories?.map((category) => (
                    <span key={category} className="bg-red-600/80 px-2 py-1 rounded text-xs">
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{movie.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Film className="h-4 w-4 mr-1" />
                    <span>导演: {movie.director}</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <Button
                  className={`rounded-full ${isFavorited ? "bg-pink-600 hover:bg-pink-700" : "bg-red-600 hover:bg-red-700"} text-white`}
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "已收藏" : "想看"}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 rounded-full"
                >
                  <Share2 className="mr-2 h-4 w-4" /> 分享
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-[1fr_300px] gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3">剧情简介</h2>
              <p className="text-gray-700 mb-6">{movie.description}</p>

              <h2 className="text-xl font-bold mb-3">演职人员</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.actors?.map((actor) => (
                  <div key={actor} className="text-center">
                    <div className="h-20 w-20 rounded-full bg-gray-200 mb-2 mx-auto overflow-hidden relative">
                      <Image
                        src={`/placeholder.svg?height=80&width=80&text=${encodeURIComponent(actor)}`}
                        alt={actor}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm">{actor}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-500 mb-1">累计想看</div>
                  <div className="text-2xl font-bold text-red-600">{movie.wantToWatch?.toLocaleString()}</div>
                </div>
                <Link href={`/movie/${movie.id}/select-cinema`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">立即购票</Button>
                </Link>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3">预告片</h3>
                <div className="relative h-40 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src="/placeholder.svg?height=160&width=300&text=预告片"
                    alt="预告片"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      className="rounded-full w-12 h-12 bg-red-600/80 hover:bg-red-600"
                      onClick={() => window.open(movie.videoUrl, "_blank")}
                    >
                      <PlayCircle className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
