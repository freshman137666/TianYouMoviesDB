"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UserProfile } from "@/components/user-profile"
import { UserOrders } from "@/components/user-orders"
import { UserCoupons } from "@/components/user-coupons"
import { UserFavorites } from "@/components/user-favorites"
import { UserGroupTickets } from "@/components/user-group-tickets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("orders")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserProfile />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="orders">我的订单</TabsTrigger>
                  <TabsTrigger value="group-tickets">团购票</TabsTrigger>
                  <TabsTrigger value="coupons">优惠券</TabsTrigger>
                  <TabsTrigger value="favorites">收藏</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-6">
                  <UserOrders />
                </TabsContent>

                <TabsContent value="group-tickets" className="mt-6">
                  <UserGroupTickets />
                </TabsContent>

                <TabsContent value="coupons" className="mt-6">
                  <UserCoupons />
                </TabsContent>

                <TabsContent value="favorites" className="mt-6">
                  <UserFavorites />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
