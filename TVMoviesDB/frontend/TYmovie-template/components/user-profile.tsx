"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, Settings, CreditCard, Ticket, Gift, Heart, LogOut } from "lucide-react"

export function UserProfile() {
  // 模拟用户数据
  const [user, setUser] = useState({
    name: "张三",
    avatar: "/placeholder.svg?height=100&width=100&text=User",
    level: "黄金会员",
    points: 1250,
  })

  const menuItems = [
    { icon: <User className="h-5 w-5" />, label: "个人信息", href: "/user/profile" },
    { icon: <Ticket className="h-5 w-5" />, label: "我的订单", href: "/user/orders" },
    { icon: <Gift className="h-5 w-5" />, label: "我的优惠券", href: "/user/coupons" },
    { icon: <Heart className="h-5 w-5" />, label: "我的收藏", href: "/user/favorites" },
    { icon: <CreditCard className="h-5 w-5" />, label: "我的卡包", href: "/user/cards" },
    { icon: <Settings className="h-5 w-5" />, label: "账户设置", href: "/user/settings" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3">
          <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
        </div>
        <h3 className="font-bold text-lg">{user.name}</h3>
        <div className="text-sm text-gray-500 mt-1">{user.level}</div>
        <div className="text-sm text-yellow-600 mt-1">积分: {user.points}</div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <span className="text-gray-500 mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 w-full">
          <span className="text-gray-500 mr-3">
            <LogOut className="h-5 w-5" />
          </span>
          退出登录
        </button>
      </div>
    </div>
  )
}
