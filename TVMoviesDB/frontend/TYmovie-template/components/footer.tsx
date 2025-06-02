import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-red-600">天佑电影</h3>
            <p className="text-gray-600 text-sm">
              天佑电影是您观看高清电影的最佳选择，提供最新、最热门的电影资源和在线购票服务。
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">关于我们</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-red-600">
                  公司介绍
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-red-600">
                  加入我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-red-600">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-600 hover:text-red-600">
                  投资者关系
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">帮助中心</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-red-600">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-red-600">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-red-600">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-600 hover:text-red-600">
                  意见反馈
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">商务合作</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cooperation" className="text-gray-600 hover:text-red-600">
                  广告合作
                </Link>
              </li>
              <li>
                <Link href="/cinema" className="text-gray-600 hover:text-red-600">
                  电影院加盟
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-gray-600 hover:text-red-600">
                  商家入驻
                </Link>
              </li>
              <li>
                <Link href="/distribution" className="text-gray-600 hover:text-red-600">
                  电影发行
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© 2023 天佑电影 保留所有权利</p>
          <p className="mt-2">
            <Link href="/license" className="text-gray-600 hover:text-red-600 mx-2">
              营业执照
            </Link>
            <Link href="/icp" className="text-gray-600 hover:text-red-600 mx-2">
              京ICP备12345678号-1
            </Link>
            <Link href="/network" className="text-gray-600 hover:text-red-600 mx-2">
              京网文[2023]1234-567号
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
