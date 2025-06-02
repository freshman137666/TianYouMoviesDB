import Image from "next/image"

export function AppDownload() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-bold mb-4">APP下载</h3>
      <div className="flex items-center">
        <div className="relative w-24 h-24 mr-4">
          <Image src="/placeholder.svg?height=100&width=100&text=QR" alt="扫码下载APP" fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-medium mb-2">扫码下载APP</h4>
          <p className="text-sm text-gray-500 mb-2">选座更优惠</p>
          <div className="flex space-x-2">
            <a href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded">
              iPhone
            </a>
            <a href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded">
              Android
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
