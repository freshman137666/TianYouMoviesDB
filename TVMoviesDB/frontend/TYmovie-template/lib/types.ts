// 数据库实体类型定义
// 对应后端 Spring Boot 实体类

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  nickname?: string
  avatar?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  birthday?: string
  level: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
  points: number
  status: "ACTIVE" | "INACTIVE" | "BANNED"
  createdAt: string
  updatedAt: string
}

// 电影相关类型
export interface Movie {
  id: number
  title: string
  englishTitle?: string
  director: string
  actors: string[]
  categories: string[]
  duration: number // 分钟
  rating: number
  description: string
  posterUrl?: string
  backdropUrl?: string
  trailerUrl?: string
  releaseDate: string
  status: "COMING_SOON" | "NOW_PLAYING" | "ENDED"
  wantToWatch: number
  boxOffice?: number
  createdAt: string
  updatedAt: string
}

// 影院相关类型
export interface Cinema {
  id: number
  name: string
  address: string
  phone?: string
  cityId: number
  areaId: number
  latitude?: number
  longitude?: number
  facilities?: string[]
  tags?: string[]
  minPrice: number
  status: "ACTIVE" | "INACTIVE"
  distance?: number // 前端计算的距离
  createdAt: string
  updatedAt: string
}

// 影厅类型
export interface Hall {
  id: number
  cinemaId: number
  name: string
  type: "STANDARD" | "IMAX" | "VIP" | "4D" | "DOLBY"
  totalSeats: number
  rows: number
  cols: number
  status: "ACTIVE" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}

// 座位类型
export interface Seat {
  id: number
  hallId: number
  rowNum: number
  colNum: number
  type: "STANDARD" | "VIP" | "COUPLE" | "DISABLED"
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
  price: number
}

// 座位状态（用于选座页面）
export interface SeatStatus {
  id: number
  rowNum: number
  colNum: number
  type: "STANDARD" | "VIP" | "COUPLE" | "DISABLED"
  status: "AVAILABLE" | "SELECTED" | "OCCUPIED" | "LOCKED" | "MAINTENANCE"
  price: number
}

// 场次类型
export interface Showtime {
  id: number
  movieId: number
  cinemaId: number
  hallId: number
  showDate: string
  startTime: string
  endTime: string
  price: number
  language: "CHINESE" | "ENGLISH" | "ORIGINAL"
  version: "2D" | "3D" | "IMAX" | "4D"
  status: "AVAILABLE" | "SOLD_OUT" | "CANCELLED"
  availableSeats: number
  totalSeats: number
  // 关联数据
  movie?: Movie
  cinema?: Cinema
  hall?: Hall
  createdAt: string
  updatedAt: string
}

// 订单类型
export interface Order {
  id: string
  userId: number
  movieId: number
  cinemaId: number
  showtimeId: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED" | "USED"
  paymentMethod?: "WECHAT" | "ALIPAY" | "UNIONPAY"
  paymentTime?: string
  couponId?: number
  // 关联数据
  movie?: Movie
  cinema?: Cinema
  showtime?: Showtime
  seats?: OrderSeat[]
  createdAt: string
  updatedAt: string
}

// 订单座位类型
export interface OrderSeat {
  id: number
  orderId: string
  seatId: number
  rowNum: number
  colNum: number
  price: number
  ticketCode?: string
}

// 评论类型
export interface Review {
  id: number
  userId: number
  movieId: number
  orderId?: string
  rating: number // 1-5
  content?: string
  likes: number
  status: "PUBLISHED" | "HIDDEN" | "DELETED"
  // 关联数据
  user?: User
  movie?: Movie
  createdAt: string
  updatedAt: string
}

// 优惠券类型
export interface Coupon {
  id: number
  name: string
  type: "DISCOUNT" | "CASH" | "EXCHANGE"
  value: number
  minAmount: number
  maxDiscount?: number
  startDate: string
  endDate: string
  totalCount: number
  usedCount: number
  status: "ACTIVE" | "INACTIVE" | "EXPIRED"
  description?: string
  createdAt: string
  updatedAt: string
}

// 用户优惠券类型
export interface UserCoupon {
  id: number
  userId: number
  couponId: number
  status: "AVAILABLE" | "USED" | "EXPIRED"
  usedAt?: string
  orderId?: string
  // 关联数据
  coupon?: Coupon
  createdAt: string
  updatedAt: string
}

// 收藏类型
export interface Favorite {
  id: number
  userId: number
  movieId: number
  // 关联数据
  movie?: Movie
  createdAt: string
}

// 城市类型
export interface City {
  id: number
  name: string
  code: string
  province: string
  status: "ACTIVE" | "INACTIVE"
}

// 区域类型
export interface Area {
  id: number
  cityId: number
  name: string
  code: string
  status: "ACTIVE" | "INACTIVE"
}

// 电子票类型
export interface Ticket {
  id: number
  orderId: string
  seatId: number
  rowNum: number
  colNum: number
  ticketCode: string
  qrCode: string
  status: "VALID" | "USED" | "EXPIRED"
  // 关联数据
  movie?: Movie
  cinema?: Cinema
  showtime?: Showtime
}

// API 请求/响应类型

// 分页响应类型
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// 统一 API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 认证相关请求类型
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  phone?: string
  nickname?: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

// 订单相关请求类型
export interface CreateOrderRequest {
  movieId: number
  cinemaId: number
  showtimeId: number
  seatIds: number[]
  couponId?: number
}

export interface PaymentRequest {
  paymentMethod: "WECHAT" | "ALIPAY" | "UNIONPAY"
  returnUrl?: string
}

export interface RefundRequest {
  reason: string
  amount?: number
}

// 座位相关请求类型
export interface LockSeatsRequest {
  showtimeId: number
  seatIds: number[]
  lockDuration?: number // 锁定时长（秒）
}

export interface UnlockSeatsRequest {
  showtimeId: number
  seatIds: number[]
}

export interface BookSeatsRequest {
  showtimeId: number
  seatIds: number[]
  orderId: string
}

// 评论相关请求类型
export interface AddReviewRequest {
  rating: number
  content?: string
  orderId?: string
}

export interface UpdateReviewRequest {
  rating?: number
  content?: string
}

// 搜索相关类型
export interface SearchParams {
  query?: string
  category?: string
  status?: string
  cityId?: number
  areaId?: number
  date?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: "ASC" | "DESC"
}

// 筛选选项类型
export interface FilterOptions {
  categories: string[]
  regions: string[]
  years: string[]
  languages: string[]
  versions: string[]
  cinemaTypes: string[]
  priceRanges: PriceRange[]
}

export interface PriceRange {
  label: string
  min: number
  max: number
}

// 统计数据类型
export interface MovieStats {
  totalMovies: number
  nowPlayingCount: number
  comingSoonCount: number
  totalBoxOffice: number
  averageRating: number
}

export interface CinemaStats {
  totalCinemas: number
  totalHalls: number
  totalSeats: number
  averagePrice: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  totalRevenue: number
}

// 错误类型
export interface ApiError {
  code: number
  message: string
  details?: string
  timestamp: string
}

// 文件上传类型
export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

// 通知类型
export interface Notification {
  id: number
  userId: number
  type: "ORDER" | "PROMOTION" | "SYSTEM" | "REVIEW"
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

// 系统配置类型
export interface SystemConfig {
  siteName: string
  siteDescription: string
  contactPhone: string
  contactEmail: string
  wechatQr: string
  appDownloadUrl: string
  minOrderAmount: number
  maxSeatsPerOrder: number
  seatLockDuration: number // 座位锁定时长（分钟）
  refundDeadline: number // 退票截止时间（小时）
}

// 促销活动类型
export interface Promotion {
  id: number
  title: string
  description: string
  type: "DISCOUNT" | "CASHBACK" | "GIFT"
  value: number
  minAmount: number
  startDate: string
  endDate: string
  imageUrl?: string
  status: "ACTIVE" | "INACTIVE" | "EXPIRED"
  createdAt: string
  updatedAt: string
}

// 热门排行类型
export interface HotRanking {
  rank: number
  movie: Movie
  boxOffice?: number
  rating?: number
  wantToWatch?: number
  changeFromLastWeek?: number
}

// 地铁线路类型
export interface SubwayLine {
  id: number
  cityId: number
  name: string
  color: string
  stations: SubwayStation[]
}

export interface SubwayStation {
  id: number
  lineId: number
  name: string
  order: number
}
