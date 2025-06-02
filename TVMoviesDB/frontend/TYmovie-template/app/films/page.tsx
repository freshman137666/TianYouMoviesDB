import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CitySelector } from "@/components/city-selector"
import { FilmList } from "@/components/film-list"
import { FilmFilters } from "@/components/film-filters"

export default function FilmsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <CitySelector />
            <div className="ml-6 flex space-x-6 text-sm">
              <a href="/films" className="text-red-600 font-medium">
                正在热映
              </a>
              <a href="/films/upcoming" className="text-gray-600 hover:text-red-600">
                即将上映
              </a>
              <a href="/cinemas" className="text-gray-600 hover:text-red-600">
                影院
              </a>
              <a href="/classics" className="text-gray-600 hover:text-red-600">
                经典电影
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <FilmFilters />
          <FilmList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
