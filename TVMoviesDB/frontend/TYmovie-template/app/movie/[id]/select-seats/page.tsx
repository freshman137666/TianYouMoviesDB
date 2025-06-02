"use client"

import { useState, Suspense, use } from "react"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { MovieBrief } from "@/components/movie-brief"
import { SeatSelector } from "@/components/seat-selector"
import { ShowtimeInfo } from "@/components/showtime-info"
import { SelectedSeatsInfo } from "@/components/selected-seats-info"

function SelectSeatsContent({ movieId }) {
  const searchParams = useSearchParams()
  const cinemaId = searchParams.get("cinemaId")
  const showTimeId = searchParams.get("showTimeId")
  const [selectedSeats, setSelectedSeats] = useState([])

  return (
    <div className="container mx-auto px-4 py-6">
      <MovieBrief movieId={movieId} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ShowtimeInfo cinemaId={cinemaId} showTimeId={showTimeId} />
            <div className="mt-6">
              <SeatSelector
                movieId={movieId}
                cinemaId={cinemaId}
                showTimeId={showTimeId}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
              />
            </div>
          </div>
        </div>

        <div>
          <SelectedSeatsInfo
            movieId={movieId}
            cinemaId={cinemaId}
            showTimeId={showTimeId}
            selectedSeats={selectedSeats}
          />
        </div>
      </div>
    </div>
  )
}

export default function SelectSeatsPage({ params }) {
  const { id: movieId } = use(params)

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>
        <Suspense fallback={<div className="container mx-auto px-4 py-6">加载中...</div>}>
          <SelectSeatsContent movieId={movieId} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
