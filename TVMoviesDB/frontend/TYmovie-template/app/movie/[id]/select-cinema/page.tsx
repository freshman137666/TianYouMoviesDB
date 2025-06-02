import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CitySelector } from "@/components/city-selector"
import { SelectCinemaList } from "@/components/select-cinema-list"
import { MovieBrief } from "@/components/movie-brief"

export default function SelectCinemaPage({ params }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <CitySelector />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <MovieBrief movieId={id} />
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">选择影院</h2>
            <SelectCinemaList movieId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
