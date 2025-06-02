"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function PaymentOptions({ selectedPayment, setSelectedPayment }) {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">选择支付方式</h3>

      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
        <div className="flex items-center space-x-2 mb-3 p-3 border border-gray-200 rounded-lg hover:border-red-600 cursor-pointer">
          <RadioGroupItem value="wechat" id="wechat" />
          <Label htmlFor="wechat" className="flex items-center cursor-pointer">
            <div className="w-6 h-6 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">
              微
            </div>
            <span>微信支付</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2 mb-3 p-3 border border-gray-200 rounded-lg hover:border-red-600 cursor-pointer">
          <RadioGroupItem value="alipay" id="alipay" />
          <Label htmlFor="alipay" className="flex items-center cursor-pointer">
            <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">
              支
            </div>
            <span>支付宝</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-red-600 cursor-pointer">
          <RadioGroupItem value="unionpay" id="unionpay" />
          <Label htmlFor="unionpay" className="flex items-center cursor-pointer">
            <div className="w-6 h-6 bg-red-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">
              银
            </div>
            <span>银联支付</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
