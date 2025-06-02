"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, Menu, X, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 检查localStorage中的用户信息
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('解析用户数据失败:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-red-600">天佑电影</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium border-b-2 border-red-600"
              >
                首页
              </Link>
              <Link
                href="/films"
                className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-red-600"
              >
                电影
              </Link>
              <Link
                href="/cinemas"
                className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-red-600"
              >
                影院
              </Link>
              <Link
                href="/shows"
                className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-red-600"
              >
                演出
              </Link>
              <Link
                href="/news"
                className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-red-600"
              >
                资讯
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative mr-4">
              <Input
                type="text"
                placeholder="搜索电影、影院、影人"
                className="w-64 py-1 pl-3 pr-10 rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/user" className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full hover:text-red-600 transition-colors">
                  <User className="h-4 w-4 text-red-600" />
                  <span className="text-gray-800 font-medium">{user.name || user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 flex items-center px-2 py-1 rounded hover:bg-gray-50"
                  title="退出登录"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="text-sm">退出</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-500 hover:text-red-600 flex items-center">
                <User className="h-5 w-5 mr-1" />
                <span>登录</span>
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-red-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="搜索电影、影院、影人"
                  className="w-full py-2 pl-3 pr-10 rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-900 hover:text-red-600 px-2 py-1 text-base font-medium">
                首页
              </Link>
              <Link href="/films" className="text-gray-500 hover:text-red-600 px-2 py-1 text-base font-medium">
                电影
              </Link>
              <Link href="/cinemas" className="text-gray-500 hover:text-red-600 px-2 py-1 text-base font-medium">
                影院
              </Link>
              <Link href="/shows" className="text-gray-500 hover:text-red-600 px-2 py-1 text-base font-medium">
                演出
              </Link>
              <Link href="/news" className="text-gray-500 hover:text-red-600 px-2 py-1 text-base font-medium">
                资讯
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <Link href="/user/profile" className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:text-red-600 transition-colors">
                    <User className="h-4 w-4 text-red-600" />
                    <span className="text-gray-800 font-medium">{user.name || user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-500 hover:text-red-600 px-2 py-1 w-full hover:bg-gray-50 rounded"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>退出登录</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center text-gray-500 hover:text-red-600 px-2 py-1">
                  <User className="h-5 w-5 mr-2" />
                  <span>登录/注册</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
