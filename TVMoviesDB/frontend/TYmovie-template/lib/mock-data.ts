import type {
  Movie,
  Cinema,
  Showtime,
  Order,
  Review,
  UserCoupon,
  Favorite,
  City,
  Area,
  SeatStatus,
  HotRanking,
  Promotion,
} from "./types"

// 模拟 API 延迟
export const mockApiDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// 生成随机 ID
const generateId = () => Math.floor(Math.random() * 1000000) + 1

// 电影数据 - 直接导出
export const getMockMovies = (): Movie[] => [
  {
    id: 1,
    title: "复仇者联盟4：终局之战",
    englishTitle: "Avengers: Endgame",
    director: "安东尼·罗素",
    actors: ["小罗伯特·唐尼", "克里斯·埃文斯", "马克·鲁法洛", "克里斯·海姆斯沃斯"],
    categories: ["动作", "科幻", "冒险"],
    duration: 181,
    rating: 9.2,
    description: "漫威电影宇宙的传奇性收官之作，复仇者联盟将面临最终决战。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=复仇者联盟4",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=复仇者联盟4背景",
    trailerUrl: "https://example.com/trailer1",
    releaseDate: "2023-12-01",
    status: "NOW_PLAYING",
    wantToWatch: 234567,
    boxOffice: 2798000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 2,
    title: "阿凡达：水之道",
    englishTitle: "Avatar: The Way of Water",
    director: "詹姆斯·卡梅隆",
    actors: ["萨姆·沃辛顿", "佐伊·索尔达娜", "西格妮·韦弗", "史蒂芬·朗"],
    categories: ["科幻", "冒险", "奇幻"],
    duration: 192,
    rating: 8.9,
    description: "杰克·萨利重返潘多拉星球，与纳美人一起保卫他们的家园。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=阿凡达2",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=阿凡达2背景",
    trailerUrl: "https://example.com/trailer2",
    releaseDate: "2023-12-15",
    status: "NOW_PLAYING",
    wantToWatch: 187654,
    boxOffice: 2320000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 3,
    title: "流浪地球2",
    englishTitle: "The Wandering Earth II",
    director: "郭帆",
    actors: ["刘德华", "吴京", "李雪健", "沙溢"],
    categories: ["科幻", "灾难", "剧情"],
    duration: 173,
    rating: 8.7,
    description: '人类为拯救地球，实施"流浪地球"计划，将地球推出太阳系。',
    posterUrl: "/placeholder.svg?height=300&width=200&text=流浪地球2",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=流浪地球2背景",
    trailerUrl: "https://example.com/trailer3",
    releaseDate: "2024-01-22",
    status: "COMING_SOON",
    wantToWatch: 156789,
    boxOffice: 4029000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 4,
    title: "满江红",
    englishTitle: "Full River Red",
    director: "张艺谋",
    actors: ["沈腾", "易烊千玺", "张译", "雷佳音"],
    categories: ["喜剧", "悬疑", "古装"],
    duration: 159,
    rating: 8.5,
    description: "南宋绍兴年间，岳飞死后四年，秦桧率兵与金国会谈。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=满江红",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=满江红背景",
    trailerUrl: "https://example.com/trailer4",
    releaseDate: "2024-02-14",
    status: "COMING_SOON",
    wantToWatch: 198765,
    boxOffice: 4544000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 5,
    title: "深海",
    englishTitle: "Deep Sea",
    director: "田晓鹏",
    actors: ["苏鑫", "王亭文", "滕奎兴"],
    categories: ["动画", "奇幻", "冒险"],
    duration: 112,
    rating: 8.3,
    description: "一个关于少女在神秘深海世界中寻找自我的奇幻冒险故事。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=深海",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=深海背景",
    trailerUrl: "https://example.com/trailer5",
    releaseDate: "2023-12-08",
    status: "NOW_PLAYING",
    wantToWatch: 123456,
    boxOffice: 920000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 6,
    title: "熊出没·伴我'熊芯'",
    englishTitle: "Boonie Bears: Guardian Code",
    director: "林汇达",
    actors: ["张伟", "张秉君", "谭笑"],
    categories: ["动画", "喜剧", "家庭"],
    duration: 103,
    rating: 8.1,
    description: "熊大熊二与光头强的全新冒险，科技与自然的完美结合。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=熊出没",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=熊出没背景",
    trailerUrl: "https://example.com/trailer6",
    releaseDate: "2024-01-22",
    status: "COMING_SOON",
    wantToWatch: 87654,
    boxOffice: 1477000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 7,
    title: "中国乒乓之绝地反击",
    englishTitle: "Ping-Pong: The Triumph",
    director: "邓超",
    actors: ["邓超", "俞白眉", "孙俪", "许魏洲"],
    categories: ["剧情", "运动", "励志"],
    duration: 140,
    rating: 7.9,
    description: "讲述中国乒乓球队在低谷期奋起直追，重回世界巅峰的励志故事。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=中国乒乓",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=中国乒乓背景",
    trailerUrl: "https://example.com/trailer7",
    releaseDate: "2024-02-10",
    status: "COMING_SOON",
    wantToWatch: 76543,
    boxOffice: 320000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 8,
    title: "无名",
    englishTitle: "Hidden Blade",
    director: "程耳",
    actors: ["梁朝伟", "王一博", "周迅", "黄磊"],
    categories: ["剧情", "动作", "谍战"],
    duration: 125,
    rating: 8.4,
    description: "抗日战争时期，地下工作者在敌后进行秘密斗争的故事。",
    posterUrl: "/placeholder.svg?height=300&width=200&text=无名",
    backdropUrl: "/placeholder.svg?height=600&width=1200&text=无名背景",
    trailerUrl: "https://example.com/trailer8",
    releaseDate: "2023-12-22",
    status: "NOW_PLAYING",
    wantToWatch: 145678,
    boxOffice: 930000000,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
]

// 影院数据 - 直接导出
export const getMockCinemas = (): Cinema[] => [
  {
    id: 1,
    name: "万达影城（朝阳大悦城店）",
    address: "北京市朝阳区朝阳北路101号朝阳大悦城9层",
    phone: "010-85528888",
    cityId: 1,
    areaId: 1,
    latitude: 39.9042,
    longitude: 116.4074,
    facilities: ["IMAX", "杜比全景声", "4DX", "VIP厅"],
    tags: ["停车便利", "地铁直达", "餐饮丰富"],
    minPrice: 35,
    status: "ACTIVE",
    distance: 2.5,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 2,
    name: "CGV影城（西单大悦城店）",
    address: "北京市西城区西单北大街131号西单大悦城8-9层",
    phone: "010-66186666",
    cityId: 1,
    areaId: 2,
    latitude: 39.9042,
    longitude: 116.3736,
    facilities: ["4DX", "Screen X", "VIP厅"],
    tags: ["商圈核心", "交通便利", "环境优雅"],
    minPrice: 42,
    status: "ACTIVE",
    distance: 3.2,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 3,
    name: "博纳国际影城（前门店）",
    address: "北京市东城区前门大街23号前门商业区3层",
    phone: "010-67028888",
    cityId: 1,
    areaId: 3,
    latitude: 39.9,
    longitude: 116.3974,
    facilities: ["IMAX", "杜比影院", "激光厅"],
    tags: ["历史文化", "观影体验佳", "设备先进"],
    minPrice: 38,
    status: "ACTIVE",
    distance: 4.1,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 4,
    name: "耀莱成龙国际影城（五棵松店）",
    address: "北京市海淀区复兴路69号华熙LIVE·五棵松B1层",
    phone: "010-88871234",
    cityId: 1,
    areaId: 4,
    latitude: 39.9042,
    longitude: 116.2836,
    facilities: ["IMAX", "杜比全景声", "VIP厅", "儿童厅"],
    tags: ["体育场馆", "娱乐综合体", "停车方便"],
    minPrice: 40,
    status: "ACTIVE",
    distance: 8.7,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 5,
    name: "UME国际影城（华星店）",
    address: "北京市丰台区南三环西路16号搜宝商务中心3层",
    phone: "010-67786666",
    cityId: 1,
    areaId: 5,
    latitude: 39.8704,
    longitude: 116.3587,
    facilities: ["杜比全景声", "VIP厅", "情侣座"],
    tags: ["环境舒适", "服务优质", "价格实惠"],
    minPrice: 32,
    status: "ACTIVE",
    distance: 6.3,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
]

// 场次数据 - 直接导出，避免循环依赖
export const getMockShowtimes = (): Showtime[] => {
  // 直接在这里定义基础数据，避免调用其他函数
  const basicMovies = [
    { id: 1, title: "复仇者联盟4", duration: 181, status: "NOW_PLAYING" },
    { id: 2, title: "阿凡达2", duration: 192, status: "NOW_PLAYING" },
    { id: 5, title: "深海", duration: 112, status: "NOW_PLAYING" },
    { id: 8, title: "无名", duration: 125, status: "NOW_PLAYING" },
  ]

  const basicCinemas = [
    { id: 1, name: "万达影城" },
    { id: 2, name: "CGV影城" },
    { id: 3, name: "博纳影城" },
  ]

  const showtimes: Showtime[] = []

  basicMovies.forEach((movie) => {
    basicCinemas.forEach((cinema) => {
      // 为每个影院生成3-5个场次
      const sessionCount = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < sessionCount; i++) {
        const startHour = 10 + i * 3 + Math.floor(Math.random() * 2)
        const startMinute = Math.floor(Math.random() * 4) * 15
        const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`

        const endHour = startHour + Math.floor(movie.duration / 60)
        const endMinute = startMinute + (movie.duration % 60)
        const adjustedEndHour = endHour + Math.floor(endMinute / 60)
        const adjustedEndMinute = endMinute % 60
        const endTime = `${adjustedEndHour.toString().padStart(2, "0")}:${adjustedEndMinute.toString().padStart(2, "0")}`

        showtimes.push({
          id: generateId(),
          movieId: movie.id,
          cinemaId: cinema.id,
          hallId: i + 1,
          showDate: "2023-12-20",
          startTime,
          endTime,
          price: Math.floor(Math.random() * 30) + 35,
          language: Math.random() > 0.5 ? "CHINESE" : "ORIGINAL",
          version: ["2D", "3D", "IMAX"][Math.floor(Math.random() * 3)] as any,
          status: "AVAILABLE",
          availableSeats: Math.floor(Math.random() * 50) + 100,
          totalSeats: 200,
          createdAt: "2023-11-01T00:00:00Z",
          updatedAt: "2023-11-01T00:00:00Z",
        })
      }
    })
  })

  return showtimes
}

// 座位状态数据 - 直接导出
export const getMockSeatStatus = (showtimeId: number): SeatStatus[] => {
  const seats: SeatStatus[] = []
  const rows = 12
  const cols = 16

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      // 随机生成座位状态
      let status: SeatStatus["status"] = "AVAILABLE"
      const random = Math.random()
      if (random < 0.15) status = "OCCUPIED"
      else if (random < 0.18) status = "MAINTENANCE"

      // VIP座位（前三排中间位置）
      const isVip = row <= 3 && col >= 6 && col <= 11

      seats.push({
        id: generateId(),
        rowNum: row,
        colNum: col,
        type: isVip ? "VIP" : "STANDARD",
        status,
        price: isVip ? 65 : 45,
      })
    }
  }

  return seats
}

// 热门排行数据 - 直接导出，避免循环依赖
export const getMockHotRankings = (): HotRanking[] => {
  // 直接定义基础电影数据
  const basicMovies = [
    {
      id: 1,
      title: "复仇者联盟4：终局之战",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门1",
      rating: 9.2,
      boxOffice: 2798000000,
      wantToWatch: 234567,
    },
    {
      id: 2,
      title: "阿凡达：水之道",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门2",
      rating: 8.9,
      boxOffice: 2320000000,
      wantToWatch: 187654,
    },
    {
      id: 3,
      title: "流浪地球2",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门3",
      rating: 8.7,
      boxOffice: 4029000000,
      wantToWatch: 156789,
    },
    {
      id: 4,
      title: "满江红",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门4",
      rating: 8.5,
      boxOffice: 4544000000,
      wantToWatch: 198765,
    },
    {
      id: 5,
      title: "深海",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门5",
      rating: 8.3,
      boxOffice: 920000000,
      wantToWatch: 123456,
    },
    {
      id: 6,
      title: "熊出没",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门6",
      rating: 8.1,
      boxOffice: 1477000000,
      wantToWatch: 87654,
    },
    {
      id: 7,
      title: "中国乒乓",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门7",
      rating: 7.9,
      boxOffice: 320000000,
      wantToWatch: 76543,
    },
    {
      id: 8,
      title: "无名",
      posterUrl: "/placeholder.svg?height=120&width=80&text=热门8",
      rating: 8.4,
      boxOffice: 930000000,
      wantToWatch: 145678,
    },
  ]

  return basicMovies.map((movie, index) => ({
    rank: index + 1,
    movie: movie as Movie,
    boxOffice: movie.boxOffice,
    rating: movie.rating,
    wantToWatch: movie.wantToWatch,
    changeFromLastWeek: Math.floor(Math.random() * 6) - 3,
  }))
}

// 其他数据导出
export const getMockUserOrders = (): Order[] => []
export const getMockUserCoupons = (): UserCoupon[] => []
export const getMockUserFavorites = (): Favorite[] => []
export const getMockMovieReviews = (movieId: number): Review[] => []
export const getMockCities = (): City[] => []
export const getMockAreas = (cityId?: number): Area[] => []
export const getMockPromotions = (): Promotion[] => []
