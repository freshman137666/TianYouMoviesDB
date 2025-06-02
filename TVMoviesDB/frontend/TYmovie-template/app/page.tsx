import { CitySelector } from "@/components/city-selector"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { MovieSlider } from "@/components/movie-slider"
import { NowPlayingMovies } from "@/components/now-playing-movies"
import { ComingSoonMovies } from "@/components/coming-soon-movies"
import { HotRankings } from "@/components/hot-rankings"
import { AppDownload } from "@/components/app-download"

export default function HomePage() {
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

        <MovieSlider />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">正在热映</h2>
                  <a href="/films" className="text-sm text-red-600 hover:text-red-700">
                    全部 <span className="ml-1">→</span>
                  </a>
                </div>
                <NowPlayingMovies />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">即将上映</h2>
                  <a href="/films/upcoming" className="text-sm text-red-600 hover:text-red-700">
                    全部 <span className="ml-1">→</span>
                  </a>
                </div>
                <ComingSoonMovies />
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="text-lg font-bold mb-4">热门榜单</h3>
                <HotRankings />
              </div>

              <AppDownload />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
