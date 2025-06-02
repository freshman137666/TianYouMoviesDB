"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // 检查用户登录状态
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || parsedUser.username || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || ""
      })
    } catch (error) {
      console.error('解析用户数据失败:', error)
      router.push('/login')
    }
  }, [])

  const handleEditStart = (field: string) => {
    setEditingField(field)
    setTempValue(formData[field as keyof typeof formData])
    setCurrentPassword("")
  }

  const handleEditCancel = () => {
    setEditingField(null)
    setTempValue("")
    setCurrentPassword("")
  }

  const handleEditSave = async (field: string) => {
    if (!tempValue.trim()) {
      setMessage("请输入有效的值")
      return
    }

    // 邮箱和手机号需要密码验证
    if ((field === 'email' || field === 'phone') && !currentPassword) {
      setMessage("修改邮箱或手机号需要验证当前密码")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const updateData: any = {
        [field]: tempValue,
        userId: user.userId
      }
      if (field === 'email' || field === 'phone') {
        updateData.currentPassword = currentPassword
      }

      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || ''}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        // 更新localStorage中的用户信息
        const newUserData = { ...user, [field]: tempValue }
        localStorage.setItem('user', JSON.stringify(newUserData))
        setUser(newUserData)
        setFormData(prev => ({ ...prev, [field]: tempValue }))
        setMessage(`${field === 'name' ? '姓名' : field === 'email' ? '邮箱' : '手机号'}更新成功！`)
        handleEditCancel()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "更新失败，请稍后重试")
      }
    } catch (error) {
      console.error('更新失败:', error)
      setMessage("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }



  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // 验证密码
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage("请填写所有密码字段")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("新密码和确认密码不匹配")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("新密码长度至少为6位")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || ''}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          userId: user.userId
        })
      })

      if (response.ok) {
        setMessage("密码修改成功！请重新登录")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setShowPasswordSection(false)
        // 提示用户重新登录
        setTimeout(() => {
          localStorage.removeItem('user')
          window.location.href = '/login'
        }, 2000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "密码修改失败，请检查当前密码是否正确")
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      setMessage("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }



  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link href="/user" className="inline-flex items-center text-gray-600 hover:text-red-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回个人中心
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>管理您的个人资料和账户信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  {/* 姓名 */}
                  <div className="space-y-2">
                    <Label>姓名</Label>
                    {editingField === 'name' ? (
                      <div className="space-y-3">
                        <Input
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          placeholder="请输入您的姓名"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave('name')}
                            disabled={isLoading}
                          >
                            {isLoading ? '保存中...' : '保存'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-gray-900">{formData.name || '未设置'}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart('name')}
                        >
                          更改
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 邮箱 */}
                  <div className="space-y-2">
                    <Label>邮箱 <span className="text-red-500 text-xs">(修改需验证密码)</span></Label>
                    {editingField === 'email' ? (
                      <div className="space-y-4">
                        {/* 新邮箱输入框 - 更加突出 */}
                        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <Label htmlFor="newEmail" className="text-blue-800 font-medium">新邮箱地址 <span className="text-red-500">*</span></Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="请输入新的邮箱地址"
                            className="mt-2 border-blue-300 focus:border-blue-500"
                          />
                        </div>
                        {/* 密码验证框 */}
                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                          <Label htmlFor="emailPassword" className="text-yellow-800 font-medium">当前密码验证 <span className="text-red-500">*</span></Label>
                          <Input
                            id="emailPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="请输入当前密码以验证身份"
                            className="mt-2 border-yellow-300 focus:border-yellow-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave('email')}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoading ? '保存中...' : '保存新邮箱'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-gray-900">{formData.email || '未设置'}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart('email')}
                        >
                          更改
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 手机号 */}
                  <div className="space-y-2">
                    <Label>手机号 <span className="text-red-500 text-xs">(修改需验证密码)</span></Label>
                    {editingField === 'phone' ? (
                      <div className="space-y-4">
                        {/* 新手机号输入框 - 更加突出 */}
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                          <Label htmlFor="newPhone" className="text-green-800 font-medium">新手机号码 <span className="text-red-500">*</span></Label>
                          <Input
                            id="newPhone"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="请输入新的手机号码"
                            className="mt-2 border-green-300 focus:border-green-500"
                          />
                        </div>
                        {/* 密码验证框 */}
                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                          <Label htmlFor="phonePassword" className="text-yellow-800 font-medium">当前密码验证 <span className="text-red-500">*</span></Label>
                          <Input
                            id="phonePassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="请输入当前密码以验证身份"
                            className="mt-2 border-yellow-300 focus:border-yellow-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave('phone')}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isLoading ? '保存中...' : '保存新手机号'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-gray-900">{formData.phone || '未设置'}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart('phone')}
                        >
                          更改
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 修改密码按钮 */}
                <div className="border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full"
                  >
                    {showPasswordSection ? '取消修改密码' : '修改密码'}
                  </Button>
                </div>

                {/* 修改密码表单 */}
                {showPasswordSection && (
                  <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900">修改密码</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPasswordForChange">当前密码</Label>
                        <Input
                          id="currentPasswordForChange"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="请输入当前密码"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">新密码</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="请输入新密码（至少6位）"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认新密码</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="请再次输入新密码"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? '修改中...' : '确认修改密码'}
                      </Button>
                    </form>
                  </div>
                )}

                {/* 提示信息 */}
                {message && (
                  <div className={`p-3 rounded-lg text-sm ${message.includes('成功')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}