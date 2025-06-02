"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("relevance")
  const [category, setCategory] = useState("all")
  const [year, setYear] = useState("all")

  useEffect(() => {
    // 模拟从后端获取搜索结果
    // 实际使用时，这里应该是一个fetch请求到你的Spring Boot后端
    // 例如: fetch(`/api/search?query=${query}&sortBy=${sortBy}&category=${category}&year=${year}`)
    setLoading(true)
    setTimeout(() => {
      const dummyResults = Array(12)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          title: `${query} 相关电影 ${index + 1}`,
          posterUrl: `/placeholder.svg?height=300&width=200&text=Movie${index + 1}`,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0之间的随机评分
          year: 2020 + Math.floor(Math.random() * 4),
          category: ["动作", "冒险", "科幻", "喜剧", "爱情"][Math.floor(Math.random() * 5)],
        }))
      setMovies(dummyResults)
      setLoading(false)
    }, 1000)
  }, [query, sortBy, category, year])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">搜索结果: {query}</h1>
          <p className="text-gray-600 dark:text-gray-400">找到 {loading ? "..." : movies.length} 个结果</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-fit">
            <div className="mb-4">
              <h3 className="font-bold mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-2" /> 筛选
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">排序方式</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">相关度</SelectItem>
                      <SelectItem value="newest">最新上映</SelectItem>
                      <SelectItem value="rating">评分最高</SelectItem>
                      <SelectItem value="popularity">最受欢迎</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">类型</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="action">动作</SelectItem>
                      <SelectItem value="comedy">喜剧</SelectItem>
                      <SelectItem value="romance">爱情</SelectItem>
                      <SelectItem value="scifi">科幻</SelectItem>
                      <SelectItem value="horror">恐怖</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">年份</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择年份" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="older">2020以前</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">应用筛选</Button>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[300px] animate-pulse"></div>
                  ))}
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                      <div className="relative h-[250px]">
                        <Image
                          src={movie.posterUrl || "/placeholder.svg"}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
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
            ) : (
              <div className="text-center py-12">
                <p className="text-xl">没有找到与 "{query}" 相关的电影</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">请尝试其他关键词或浏览我们的电影分类</p>
              </div>
            )}

            {movies.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <span className="sr-only">上一页</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-red-600 text-white hover:bg-red-700">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">下一页</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
