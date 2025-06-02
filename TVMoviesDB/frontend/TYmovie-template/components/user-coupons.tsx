"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UserCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      const dummyCoupons = Array(6)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          type: ["满减券", "折扣券", "兑换券"][Math.floor(Math.random() * 3)],
          value: Math.floor(Math.random() * 30) + 10,
          minSpend: Math.floor(Math.random() * 50) + 50,
          expireDate: `2023-${Math.floor(Math.random() * 3) + 10}-${Math.floor(Math.random() * 28) + 1}`,
          isExpired: Math.random() > 0.7,
          isUsed: Math.random() > 0.7,
        }))
      setCoupons(dummyCoupons)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
      </div>
    )
  }

  const availableCoupons = coupons.filter((coupon) => !coupon.isExpired && !coupon.isUsed)
  const usedCoupons = coupons.filter((coupon) => coupon.isUsed)
  const expiredCoupons = coupons.filter((coupon) => coupon.isExpired && !coupon.isUsed)

  return (
    <Tabs defaultValue="available">
      <TabsList className="grid grid-cols-3 h-10 mb-4">
        <TabsTrigger value="available">可用 ({availableCoupons.length})</TabsTrigger>
        <TabsTrigger value="used">已使用 ({usedCoupons.length})</TabsTrigger>
        <TabsTrigger value="expired">已过期 ({expiredCoupons.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="space-y-4">
        {availableCoupons.length > 0 ? (
          availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold mb-1">
                    {coupon.type === "满减券" && `¥${coupon.value}`}
                    {coupon.type === "折扣券" && `${coupon.value}折`}
                    {coupon.type === "兑换券" && "兑换券"}
                  </div>
                  <div className="text-sm opacity-90">
                    {coupon.type === "满减券" && `满${coupon.minSpend}元可用`}
                    {coupon.type === "折扣券" && `最高减${coupon.minSpend}元`}
                    {coupon.type === "兑换券" && "可兑换指定套餐"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold mb-1">{coupon.type}</div>
                  <div className="text-xs opacity-90">有效期至: {coupon.expireDate}</div>
                </div>
              </div>
              <div className="absolute -left-2 -bottom-2 opacity-10">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="white" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">暂无可用优惠券</div>
        )}
      </TabsContent>

      <TabsContent value="used" className="space-y-4">
        {usedCoupons.length > 0 ? (
          usedCoupons.map((coupon) => (
            <div key={coupon.id} className="relative bg-gray-300 text-gray-600 rounded-lg p-4 overflow-hidden">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold mb-1">
                    {coupon.type === "满减券" && `¥${coupon.value}`}
                    {coupon.type === "折扣券" && `${coupon.value}折`}
                    {coupon.type === "兑换券" && "兑换券"}
                  </div>
                  <div className="text-sm opacity-90">
                    {coupon.type === "满减券" && `满${coupon.minSpend}元可用`}
                    {coupon.type === "折扣券" && `最高减${coupon.minSpend}元`}
                    {coupon.type === "兑换券" && "可兑换指定套餐"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold mb-1">{coupon.type}</div>
                  <div className="text-xs opacity-90">已使用</div>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-30 rotate-45">
                <div className="text-2xl font-bold border-4 border-gray-500 text-gray-500 py-1 px-4 rounded">
                  已使用
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">暂无已使用优惠券</div>
        )}
      </TabsContent>

      <TabsContent value="expired" className="space-y-4">
        {expiredCoupons.length > 0 ? (
          expiredCoupons.map((coupon) => (
            <div key={coupon.id} className="relative bg-gray-300 text-gray-600 rounded-lg p-4 overflow-hidden">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold mb-1">
                    {coupon.type === "满减券" && `¥${coupon.value}`}
                    {coupon.type === "折扣券" && `${coupon.value}折`}
                    {coupon.type === "兑换券" && "兑换券"}
                  </div>
                  <div className="text-sm opacity-90">
                    {coupon.type === "满减券" && `满${coupon.minSpend}元可用`}
                    {coupon.type === "折扣券" && `最高减${coupon.minSpend}元`}
                    {coupon.type === "兑换券" && "可兑换指定套餐"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold mb-1">{coupon.type}</div>
                  <div className="text-xs opacity-90">已过期: {coupon.expireDate}</div>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-30 rotate-45">
                <div className="text-2xl font-bold border-4 border-gray-500 text-gray-500 py-1 px-4 rounded">
                  已过期
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">暂无已过期优惠券</div>
        )}
      </TabsContent>
    </Tabs>
  )
}
