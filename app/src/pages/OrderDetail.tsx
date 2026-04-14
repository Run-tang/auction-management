import { useParams, useNavigate } from 'react-router'
import { mockAuctionApplies } from '@/data/mockData'
import type { AuctionApply } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Copy, Calendar, Car, DollarSign, FileText, Clock, Package, Receipt
} from 'lucide-react'
import { toast } from 'sonner'

// ===== 订单状态映射 =====
const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  pending:    { label: '待付款', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  paid:       { label: '已付款', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  completed:  { label: '已完成', color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled:  { label: '已取消', color: 'text-gray-500', bgColor: 'bg-gray-100' },
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // 从发拍单数据中获取
  const item = mockAuctionApplies.find(a => a.id === id) as AuctionApply | undefined

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">订单不存在</p>
          <Button variant="link" onClick={() => navigate('/applies')}>返回列表</Button>
        </div>
      </div>
    )
  }

  // 模拟订单数据（仅交易成功状态有）
  const orderData = item.status === 'sold' ? {
    orderNo: `JY${item.applyNo.replace('FP', '')}`,
    orderStatus: 'completed',
    dealTime: '2026-04-14 15:30:00',
    carPrice: item.finalPrice || 0,  // 车款（元）
    serviceFee: Math.round((item.finalPrice || 0) * 0.03),  // 服务费 3%
    finalAmount: (item.finalPrice || 0) - Math.round((item.finalPrice || 0) * 0.03),  // 实收款
  } : null

  const st = ORDER_STATUS_MAP[orderData?.orderStatus || 'completed']

  // 复制功能
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  // 如果不是交易成功状态，显示提示
  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold text-slate-900">订单详情</h1>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-400 mb-4">该发拍单尚未成交，暂无订单信息</p>
          <Button variant="outline" onClick={() => navigate(`/applies/${id}`)}>
            查看发拍单详情
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold text-slate-900">订单详情</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* 一、交易状态与操作可视化区 */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 flex items-start gap-6">
            {/* 车辆主图 */}
            <div className="w-40 h-28 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
              {item.images?.frontLeft ? (
                <img
                  src={item.images.frontLeft}
                  alt="车辆主图"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car size={40} className="text-slate-300" />
                </div>
              )}
            </div>
            
            {/* 状态信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${st.bgColor} ${st.color} border-0`}>
                  {st.label}
                </Badge>
                <span className="text-sm text-slate-400">
                  订单编号：{orderData.orderNo}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {item.carBrand} {item.carSeries} {item.carModel}
              </h2>
              <p className="text-sm text-slate-500">
                {item.carYear} | {item.engineCapacity} | {item.transmission}
              </p>
            </div>
          </div>
        </div>

        {/* 二、订单基础及财务清算核心区 */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Receipt size={18} className="text-blue-500" />
              财务清算
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {/* 订单编号 */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText size={16} />
                <span>订单编号</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900">{orderData.orderNo}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(orderData.orderNo)}
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            {/* 成交时间 */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={16} />
                <span>成交时间</span>
              </div>
              <span className="text-slate-900">{orderData.dealTime}</span>
            </div>

            {/* 金额明细 */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">车款</span>
                <span className="text-slate-900">{orderData.carPrice.toLocaleString()} 元</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">成交服务费</span>
                <span className="text-red-500">-{orderData.serviceFee.toLocaleString()} 元</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-900">最终实收款</span>
                <span className="text-xl font-bold text-green-600">
                  {orderData.finalAmount.toLocaleString()} 元
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 三、成交车辆档案快照卡 */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Car size={18} className="text-blue-500" />
              成交车辆档案快照
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 车型名称 */}
              <div>
                <p className="text-xs text-slate-400 mb-1">车型名称</p>
                <p className="text-sm text-slate-900">{item.carBrand} {item.carSeries} {item.carModel}</p>
              </div>
              
              {/* 成交价 */}
              <div>
                <p className="text-xs text-slate-400 mb-1">成交价</p>
                <p className="text-sm font-semibold text-green-600">{orderData.carPrice.toLocaleString()} 元</p>
              </div>
              
              {/* 车牌号 */}
              <div>
                <p className="text-xs text-slate-400 mb-1">车牌号</p>
                <p className="text-sm text-slate-900">{item.licensePlate || '未上牌'}</p>
              </div>
              
              {/* VIN码 */}
              <div>
                <p className="text-xs text-slate-400 mb-1">车辆VIN码</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-900">{item.vin}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5"
                    onClick={() => copyToClipboard(item.vin)}
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
