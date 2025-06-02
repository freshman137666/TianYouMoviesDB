"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare } from "lucide-react"

export function MovieComments({ movieId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从后端获取评论
    setTimeout(() => {
      const dummyComments = [
        {
          id: 1,
          user: {
            name: "用户1",
            avatar: "/placeholder.svg?height=40&width=40&text=用户1",
          },
          content: "这是一条示例评论。这条评论将在实际使用时被替换为真实的用户评论。",
          rating: 9.0,
          likes: 42,
          date: "2023-02-15",
          replies: [],
        },
        {
          id: 2,
          user: {
            name: "用户2",
            avatar: "/placeholder.svg?height=40&width=40&text=用户2",
          },
          content: "这是另一条示例评论。用户可以在这里分享他们对电影的看法和感受。",
          rating: 8.5,
          likes: 28,
          date: "2023-02-10",
          replies: [
            {
              id: 3,
              user: {
                name: "用户3",
                avatar: "/placeholder.svg?height=40&width=40&text=用户3",
              },
              content: "这是一条回复评论的示例。用户可以回复其他用户的评论。",
              likes: 15,
              date: "2023-02-11",
            },
          ],
        },
      ]
      setComments(dummyComments)
      setLoading(false)
    }, 1000)
  }, [movieId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">共 {comments.length} 条评论</div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">写影评</Button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{comment.user.name}</div>
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(comment.rating / 2)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{comment.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{comment.date}</div>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
              <div className="mt-2 flex gap-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-red-600">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes}</span>
                </button>
                <button className="flex items-center text-sm text-gray-500 hover:text-red-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>回复</span>
                </button>
              </div>

              {comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{reply.user.name}</div>
                          <div className="text-xs text-gray-500">{reply.date}</div>
                        </div>
                        <p className="mt-1 text-gray-700">{reply.content}</p>
                        <div className="mt-1">
                          <button className="flex items-center text-xs text-gray-500 hover:text-red-600">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <Button variant="outline" className="text-gray-500">
          查看更多评论
        </Button>
      </div>
    </div>
  )
}
