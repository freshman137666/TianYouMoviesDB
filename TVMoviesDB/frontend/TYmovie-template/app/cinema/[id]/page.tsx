"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Star, Users, Ticket } from "lucide-react"

interface Cinema {
  id: number
  name: string
  address: string
  phone: string
  rating: number
  facilities: string[]
}

interface Movie {
  id: number
  title: string
  poster: string
  duration: number
  genre: string
  rating: number
}

interface Showtime {
  id: number
  movieId: number
  movie: Movie
  startTime: string
  endTime: string
  price: number
  availableSeats: number
  totalSeats: number
  hallName: string
}

interface GroupTicket {
  id: number
  movieId: number
  movie: Movie
  title: string
  originalPrice: number
  groupPrice: number
  discount: number
  minPeople: number
  maxPeople: number
  validUntil: string
  description: string
  soldCount: number
  stock: number
}

export default function CinemaDetailPage({ params }) {
  const { id: cinemaId } = use(params)
  const router = useRouter()
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [groupTickets, setGroupTickets] = useState<GroupTicket[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCinemaData()
    fetchShowtimes()
    fetchGroupTickets()
  }, [cinemaId, selectedDate])

  const fetchCinemaData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`)
      if (response.ok) {
        const data = await response.json()
        setCinema(data.data)
      }
    } catch (error) {
      console.error('获取影院信息失败:', error)
    }
  }

  const fetchShowtimes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/showtimes/cinema/${cinemaId}?date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setShowtimes(data.data || [])
      }
    } catch (error) {
      console.error('获取场次信息失败:', error)
    }
  }

  const fetchGroupTickets = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/group-tickets/cinema/${cinemaId}`)
      if (response.ok) {
        const data = await response.json()
        setGroupTickets(data.data || [])
      }
    } catch (error) {
      console.error('获取团购票信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSeats = (showtimeId: number, movieId: number) => {
    router.push(`/movie/${movieId}/select-seats?cinemaId=${cinemaId}&showTimeId=${showtimeId}`)
  }

  const handleBuyGroupTicket = (groupTicketId: number) => {
    router.push(`/group-ticket/${groupTicketId}/purchase`)
  }

  const getNextSevenDays = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? '今天' : i === 1 ? '明天' : `${date.getMonth() + 1}/${date.getDate()}`,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      })
    }
    return dates
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">加载中...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto px-4 py-6">
        {/* 影院信息 */}
        {cinema && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{cinema.name}</CardTitle>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{cinema.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>{cinema.rating}分</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">联系电话</div>
                  <div className="font-medium">{cinema.phone}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* 日期选择 */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {getNextSevenDays().map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? "default" : "outline"}
                className={`min-w-[80px] flex-shrink-0 ${selectedDate === date.value ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                onClick={() => setSelectedDate(date.value)}
              >
                <div className="text-center">
                  <div className="text-sm">{date.label}</div>
                  <div className="text-xs opacity-75">{date.weekday}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* 选座购票和团购票标签页 */}
        <Tabs defaultValue="showtimes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="showtimes">选座购票</TabsTrigger>
            <TabsTrigger value="group-tickets">团购票</TabsTrigger>
          </TabsList>

          {/* 场次列表 */}
          <TabsContent value="showtimes" className="space-y-4">
            {showtimes.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  暂无场次信息
                </CardContent>
              </Card>
            ) : (
              showtimes.map((showtime) => (
                <Card key={showtime.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={showtime.movie.poster || '/placeholder-movie.jpg'}
                          alt={showtime.movie.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{showtime.movie.title}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{showtime.startTime} - {showtime.endTime}</span>
                            </div>
                            <div>影厅：{showtime.hallName}</div>
                            <div>余票：{showtime.availableSeats}/{showtime.totalSeats}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-bold text-xl mb-2">
                          ¥{showtime.price}
                        </div>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleSelectSeats(showtime.id, showtime.movieId)}
                          disabled={showtime.availableSeats === 0}
                        >
                          {showtime.availableSeats === 0 ? '已售罄' : '选座购票'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 团购票列表 */}
          <TabsContent value="group-tickets" className="space-y-4">
            {groupTickets.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  暂无团购票
                </CardContent>
              </Card>
            ) : (
              groupTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* 左侧电影信息 */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={ticket.movie.poster || '/placeholder-movie.jpg'}
                            alt={ticket.movie.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{ticket.title}</h3>
                            <div className="text-sm text-gray-600 mb-2">{ticket.movie.title}</div>
                            <div className="text-sm text-gray-600 mb-2">{ticket.description}</div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{ticket.minPeople}-{ticket.maxPeople}人</span>
                              </div>
                              <div>已售{ticket.soldCount}份</div>
                              <div>有效期至{new Date(ticket.validUntil).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 右侧价格和购买 */}
                      <div className="w-32 bg-gradient-to-b from-red-50 to-red-100 p-4 flex flex-col justify-center items-center border-l-2 border-dashed border-red-200">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 line-through mb-1">
                            原价¥{ticket.originalPrice}
                          </div>
                          <div className="text-red-600 font-bold text-xl mb-1">
                            ¥{ticket.groupPrice}
                          </div>
                          <Badge variant="destructive" className="text-xs mb-3">
                            {ticket.discount}折
                          </Badge>
                          <Button
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleBuyGroupTicket(ticket.id)}
                            disabled={ticket.stock === 0}
                          >
                            <Ticket className="w-4 h-4 mr-1" />
                            {ticket.stock === 0 ? '已抢完' : '立即抢购'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}