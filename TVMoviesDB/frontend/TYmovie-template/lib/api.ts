// API 配置和工具函数
// 注意：请在您的Spring Boot项目中设置CORS配置，允许前端域名访问
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// API 请求工具函数
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // 添加认证token（如果存在）
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    // 静默处理错误，使用模拟数据
    console.warn("API not available, using mock data")
    throw error
  }
}

// 用户认证相关API
// TODO: 在您的Spring Boot项目中实现 UserController
export const authAPI = {
  // TODO: 实现 POST /api/auth/register 接口
  // 对应后端: UserController.register()
  register: (userData: any) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // TODO: 实现 POST /api/auth/login 接口
  // 对应后端: UserController.login()
  login: (credentials: any) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // TODO: 实现 POST /api/auth/logout 接口
  // 对应后端: UserController.logout()
  logout: () =>
    apiRequest("/api/auth/logout", {
      method: "POST",
    }),

  // TODO: 实现 GET /api/user/profile 接口
  // 对应后端: UserController.getProfile()
  getProfile: () => apiRequest("/api/user/profile"),

  // TODO: 实现 PUT /api/user/profile 接口
  // 对应后端: UserController.updateProfile()
  updateProfile: (userData: any) =>
    apiRequest("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
}

// 电影相关API
// TODO: 在您的Spring Boot项目中实现 MovieController
export const movieAPI = {
  // TODO: 实现 GET /api/movies 接口
  // 对应后端: MovieController.getMovies()
  // 支持分页参数: page, size, category, status等
  getMovies: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/movies?${queryString}`)
  },

  // TODO: 实现 GET /api/movies/{id} 接口
  // 对应后端: MovieController.getMovieById()
  getMovieDetail: (movieId: string) => apiRequest(`/api/movies/${movieId}`),

  // TODO: 实现 GET /api/movies/now-playing 接口
  // 对应后端: MovieController.getNowPlayingMovies()
  getNowPlaying: () => apiRequest("/api/movies/now-playing"),

  // TODO: 实现 GET /api/movies/coming-soon 接口
  // 对应后端: MovieController.getComingSoonMovies()
  getComingSoon: () => apiRequest("/api/movies/coming-soon"),

  // TODO: 实现 GET /api/movies/search 接口
  // 对应后端: MovieController.searchMovies()
  searchMovies: (query: string, params: any = {}) => {
    const queryString = new URLSearchParams({ query, ...params }).toString()
    return apiRequest(`/api/movies/search?${queryString}`)
  },

  // TODO: 实现 GET /api/movies/categories 接口
  // 对应后端: MovieController.getCategories()
  getCategories: () => apiRequest("/api/movies/categories"),

  // TODO: 实现 GET /api/movies/{id}/photos 接口
  // 对应后端: MovieController.getMoviePhotos()
  getMoviePhotos: (movieId: string) => apiRequest(`/api/movies/${movieId}/photos`),

  // TODO: 实现 GET /api/movies/{id}/videos 接口
  // 对应后端: MovieController.getMovieVideos()
  getMovieVideos: (movieId: string) => apiRequest(`/api/movies/${movieId}/videos`),
}

// 影院相关API
// TODO: 在您的Spring Boot项目中实现 CinemaController
export const cinemaAPI = {
  // TODO: 实现 GET /api/cinemas 接口
  // 对应后端: CinemaController.getCinemas()
  getCinemas: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/cinemas?${queryString}`)
  },

  // TODO: 实现 GET /api/cinemas/{id} 接口
  // 对应后端: CinemaController.getCinemaById()
  getCinemaDetail: (cinemaId: string) => apiRequest(`/api/cinemas/${cinemaId}`),

  // TODO: 实现 GET /api/cinemas/search 接口
  // 对应后端: CinemaController.searchCinemas()
  searchCinemas: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/cinemas/search?${queryString}`)
  },

  // TODO: 实现 GET /api/cinemas/{id}/halls 接口
  // 对应后端: CinemaController.getCinemaHalls()
  getCinemaHalls: (cinemaId: string) => apiRequest(`/api/cinemas/${cinemaId}/halls`),
}

// 排片和场次相关API
// TODO: 在您的Spring Boot项目中实现 ShowtimeController
export const showtimeAPI = {
  // TODO: 实现 GET /api/showtimes 接口
  // 对应后端: ShowtimeController.getShowtimes()
  getShowtimes: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/showtimes?${queryString}`)
  },

  // TODO: 实现 GET /api/movies/{movieId}/showtimes 接口
  // 对应后端: ShowtimeController.getMovieShowtimes()
  getMovieShowtimes: (movieId: string, params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/movies/${movieId}/showtimes?${queryString}`)
  },

  // TODO: 实现 GET /api/cinemas/{cinemaId}/showtimes 接口
  // 对应后端: ShowtimeController.getCinemaShowtimes()
  getCinemaShowtimes: (cinemaId: string, params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/cinemas/${cinemaId}/showtimes?${queryString}`)
  },

  // TODO: 实现 GET /api/showtimes/{id} 接口
  // 对应后端: ShowtimeController.getShowtimeById()
  getShowtimeDetail: (showtimeId: string) => apiRequest(`/api/showtimes/${showtimeId}`),
}

// 座位相关API
// TODO: 在您的Spring Boot项目中实现 SeatController
export const seatAPI = {
  // TODO: 实现 GET /api/seats/showtime/{showtimeId} 接口
  // 对应后端: SeatController.getSeatsByShowtime()
  getSeats: (showtimeId: string) => apiRequest(`/api/seats/showtime/${showtimeId}`),

  // TODO: 实现 POST /api/seats/lock 接口
  // 对应后端: SeatController.lockSeats()
  lockSeats: (seatData: any) =>
    apiRequest("/api/seats/lock", {
      method: "POST",
      body: JSON.stringify(seatData),
    }),

  // TODO: 实现 POST /api/seats/unlock 接口
  // 对应后端: SeatController.unlockSeats()
  unlockSeats: (seatData: any) =>
    apiRequest("/api/seats/unlock", {
      method: "POST",
      body: JSON.stringify(seatData),
    }),

  // TODO: 实现 POST /api/seats/book 接口
  // 对应后端: SeatController.bookSeats()
  bookSeats: (seatData: any) =>
    apiRequest("/api/seats/book", {
      method: "POST",
      body: JSON.stringify(seatData),
    }),
}

// 订单相关API
// TODO: 在您的Spring Boot项目中实现 OrderController
export const orderAPI = {
  // TODO: 实现 POST /api/orders 接口
  // 对应后端: OrderController.createOrder()
  createOrder: (orderData: any) =>
    apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // TODO: 实现 GET /api/orders/{id} 接口
  // 对应后端: OrderController.getOrderById()
  getOrderDetail: (orderId: string) => apiRequest(`/api/orders/${orderId}`),

  // TODO: 实现 GET /api/user/orders 接口
  // 对应后端: OrderController.getUserOrders()
  getUserOrders: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/user/orders?${queryString}`)
  },

  // TODO: 实现 PUT /api/orders/{id}/pay 接口
  // 对应后端: OrderController.payOrder()
  payOrder: (orderId: string, paymentData: any) =>
    apiRequest(`/api/orders/${orderId}/pay`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    }),

  // TODO: 实现 PUT /api/orders/{id}/cancel 接口
  // 对应后端: OrderController.cancelOrder()
  cancelOrder: (orderId: string) =>
    apiRequest(`/api/orders/${orderId}/cancel`, {
      method: "PUT",
    }),

  // TODO: 实现 GET /api/orders/{id}/tickets 接口
  // 对应后端: OrderController.getOrderTickets()
  getTickets: (orderId: string) => apiRequest(`/api/orders/${orderId}/tickets`),

  // TODO: 实现 POST /api/orders/{id}/refund 接口
  // 对应后端: OrderController.refundOrder()
  refundOrder: (orderId: string, refundData: any) =>
    apiRequest(`/api/orders/${orderId}/refund`, {
      method: "POST",
      body: JSON.stringify(refundData),
    }),
}

// 评论相关API
// TODO: 在您的Spring Boot项目中实现 ReviewController
export const reviewAPI = {
  // TODO: 实现 GET /api/movies/{movieId}/reviews 接口
  // 对应后端: ReviewController.getMovieReviews()
  getMovieReviews: (movieId: string, params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/movies/${movieId}/reviews?${queryString}`)
  },

  // TODO: 实现 POST /api/movies/{movieId}/reviews 接口
  // 对应后端: ReviewController.addReview()
  addReview: (movieId: string, reviewData: any) =>
    apiRequest(`/api/movies/${movieId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  // TODO: 实现 PUT /api/reviews/{id} 接口
  // 对应后端: ReviewController.updateReview()
  updateReview: (reviewId: string, reviewData: any) =>
    apiRequest(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),

  // TODO: 实现 DELETE /api/reviews/{id} 接口
  // 对应后端: ReviewController.deleteReview()
  deleteReview: (reviewId: string) =>
    apiRequest(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),

  // TODO: 实现 POST /api/reviews/{id}/like 接口
  // 对应后端: ReviewController.likeReview()
  likeReview: (reviewId: string) =>
    apiRequest(`/api/reviews/${reviewId}/like`, {
      method: "POST",
    }),
}

// 优惠券相关API
// TODO: 在您的Spring Boot项目中实现 CouponController
export const couponAPI = {
  // TODO: 实现 GET /api/user/coupons 接口
  // 对应后端: CouponController.getUserCoupons()
  getUserCoupons: () => apiRequest("/api/user/coupons"),

  // TODO: 实现 GET /api/promotions 接口
  // 对应后端: PromotionController.getPromotions()
  getPromotions: () => apiRequest("/api/promotions"),

  // TODO: 实现 POST /api/coupons/use 接口
  // 对应后端: CouponController.useCoupon()
  useCoupon: (couponData: any) =>
    apiRequest("/api/coupons/use", {
      method: "POST",
      body: JSON.stringify(couponData),
    }),

  // TODO: 实现 GET /api/coupons/available 接口
  // 对应后端: CouponController.getAvailableCoupons()
  getAvailableCoupons: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/coupons/available?${queryString}`)
  },
}

// 支付相关API
// TODO: 在您的Spring Boot项目中实现 PaymentController
export const paymentAPI = {
  // TODO: 实现 POST /api/payment/create 接口
  // 对应后端: PaymentController.createPayment()
  createPayment: (paymentData: any) =>
    apiRequest("/api/payment/create", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  // TODO: 实现 GET /api/payment/status/{orderId} 接口
  // 对应后端: PaymentController.getPaymentStatus()
  getPaymentStatus: (orderId: string) => apiRequest(`/api/payment/status/${orderId}`),
}

// 系统配置相关API
// TODO: 在您的Spring Boot项目中实现 ConfigController
export const configAPI = {
  // TODO: 实现 GET /api/config/cities 接口
  // 对应后端: ConfigController.getCities()
  getCities: () => apiRequest("/api/config/cities"),

  // TODO: 实现 GET /api/config/areas 接口
  // 对应后端: ConfigController.getAreas()
  getAreas: (cityId?: string) => {
    const params = cityId ? `?cityId=${cityId}` : ""
    return apiRequest(`/api/config/areas${params}`)
  },

  // TODO: 实现 GET /api/config/subway-lines 接口
  // 对应后端: ConfigController.getSubwayLines()
  getSubwayLines: (cityId?: string) => {
    const params = cityId ? `?cityId=${cityId}` : ""
    return apiRequest(`/api/config/subway-lines${params}`)
  },
}

// 收藏相关API
// TODO: 在您的Spring Boot项目中实现 FavoriteController
export const favoriteAPI = {
  // TODO: 实现 GET /api/user/favorites 接口
  // 对应后端: FavoriteController.getUserFavorites()
  getUserFavorites: () => apiRequest("/api/user/favorites"),

  // TODO: 实现 POST /api/user/favorites/{movieId} 接口
  // 对应后端: FavoriteController.addFavorite()
  addFavorite: (movieId: string) =>
    apiRequest(`/api/user/favorites/${movieId}`, {
      method: "POST",
    }),

  // TODO: 实现 DELETE /api/user/favorites/{movieId} 接口
  // 对应后端: FavoriteController.removeFavorite()
  removeFavorite: (movieId: string) =>
    apiRequest(`/api/user/favorites/${movieId}`, {
      method: "DELETE",
    }),
}
