"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function MoviePhotos({ movieId }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyPhotos = Array(6)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          url: `/placeholder.svg?height=150&width=200&text=剧照${index + 1}`,
          thumbnail: `/placeholder.svg?height=150&width=200&text=剧照${index + 1}`,
        }))
      setPhotos(dummyPhotos)
      setLoading(false)
    }, 1000)
  }, [movieId])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="aspect-video bg-gray-200 rounded animate-pulse"></div>
          ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {photos.slice(0, 6).map((photo) => (
          <div key={photo.id} className="relative aspect-video rounded overflow-hidden">
            <Image src={photo.thumbnail || "/placeholder.svg"} alt="电影剧照" fill className="object-cover" />
          </div>
        ))}
      </div>

      {photos.length > 6 && (
        <div className="text-center mt-4">
          <Button variant="outline" className="text-gray-500">
            查看全部
          </Button>
        </div>
      )}
    </div>
  )
}
