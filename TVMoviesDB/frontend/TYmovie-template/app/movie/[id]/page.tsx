import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { MovieDetail } from "@/components/movie-detail"
import { MovieShowtimes } from "@/components/movie-showtimes"
import { MovieComments } from "@/components/movie-comments"
import { MoviePhotos } from "@/components/movie-photos"

export default function MovieDetailPage({ params }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>
        <MovieDetail movieId={id} />

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">选座购票</h2>
            <MovieShowtimes movieId={id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">热门评论</h2>
                <MovieComments movieId={id} />
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">剧照</h2>
                <MoviePhotos movieId={id} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
