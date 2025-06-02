"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              天佑电影
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                href="/category/action"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                动作片
              </Link>
              <Link
                href="/category/comedy"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                喜剧片
              </Link>
              <Link
                href="/category/romance"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                爱情片
              </Link>
              <Link
                href="/category/scifi"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                科幻片
              </Link>
              <Link
                href="/category/horror"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                恐怖片
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative mr-4">
              <input
                type="text"
                placeholder="搜索电影..."
                className="py-1 px-3 pr-8 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <Link
              href="/login"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              登录
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md">
              注册
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
