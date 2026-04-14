import { useParams, useNavigate } from 'react-router'
import { mockAuctionApplies } from '@/data/mockData'
import type { AuctionApply } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Copy, User, Phone, Building2, Calendar, MapPin, Store, Clock,
  Car, Gauge, RefreshCcw, XCircle, AlertTriangle, Eye, ExternalLink,
  FileText, Camera, DollarSign, Package, Wrench, Image as ImageIcon,
  CheckCircle2, X
} from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// ===== 状态映射 =====
const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  draft:      { label: '草稿',     color: 'text-slate-600',   bgColor: 'bg-slate-100' },
  ready:      { label: '待发拍',   color: 'text-blue-600',    bgColor: 'bg-blue-100' },
  scheduled:  { label: '待拍卖',   color: 'text-amber-600',   bgColor: 'bg-amber-100' },
  auctioning: { label: '拍卖中',   color: 'text-orange-600',  bgColor: 'bg-orange-100' },
  sold:       { label: '交易成功', color: 'text-green-600',   bgColor: 'bg-green-100' },
  unsold:     { label: '流拍',     color: 'text-red-600',    bgColor: 'bg-red-100' },
  offshelf:   { label: '已下架',   color: 'text-gray-500',   bgColor: 'bg-gray-100' },
}

// ===== 7宫格照片位定义 =====
const REQUIRED_PHOTO_LABELS = [
  { key: 'front',     label: '前脸' },
  { key: 'frontLeft', label: '左前45°' },
  { key: 'rearRight', label: '右后45°' },
  { key: 'interior',  label: '内饰' },
  { key: 'dashboard', label: '仪表盘' },
  { key: 'engine',    label: '发动机舱' },
  { key: 'trunk',     label: '后备箱' },
]

export default function AuctionApplyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offshelfDialog, setOffshelfDialog] = useState(false)
  const [offshelfReason, setOffshelfReason] = useState('')

  const item = mockAuctionApplies.find(a => a.id === id) as AuctionApply | undefined
  const st = item ? STATUS_MAP[item.status] : null

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">未找到该发拍单</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/applies')}>
            <ArrowLeft size={16} className="mr-1" /> 返回列表
          </Button>
        </div>
      </div>
    )
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  function handleOffshelf() {
    setOffshelfDialog(false)
    setOffshelfReason('')
    // 实际项目中这里会调用API
    alert('下架操作已提交')
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-8">
      {/* ===== 顶部导航 ===== */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/applies')} className="gap-1">
              <ArrowLeft size={16} /> 返回
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <span className="font-mono text-blue-600 font-semibold">{item.applyNo}</span>
            <button onClick={() => copyToClipboard(item.applyNo)} className="text-slate-400 hover:text-blue-600">
              <Copy size={14} />
            </button>
          </div>

          {/* 操作按钮池 */}
          <div className="flex items-center gap-2">
            {(item.status === 'draft' || item.status === 'ready') && (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1" onClick={() => setOffshelfDialog(true)}>
                <XCircle size={14} /> 强制下架
              </Button>
            )}
            {/* 交易成功/拍卖中/待拍卖状态：无操作按钮，仅供核账 */}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4 max-w-6xl mx-auto">
        {/* ===== 一、全局状态区 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* 核心状态标签 */}
              <div className={`px-4 py-2 rounded-lg ${st?.bgColor} ${st?.color}`}>
                <span className="text-lg font-bold">{st?.label}</span>
              </div>

              {/* 基本信息 */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Building2 size={14} />
                    <span>经销商：</span>
                    <span className="text-slate-700 font-medium">{item.dealerName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User size={14} />
                    <span>提交人：</span>
                    <span className="text-slate-700">{item.submitterName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone size={14} />
                    <span>{item.submitterPhone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>申请时间：</span>
                  <span className="text-slate-700">{item.applyTime}</span>
                </div>
              </div>
            </div>

            {/* 车型概览 */}
            <div className="text-right">
              <div className="text-lg font-bold text-slate-800">{item.carBrand} {item.carSeries}</div>
              <div className="text-sm text-slate-500">{item.carModel}</div>
              <div className="text-sm text-slate-400 mt-1">{item.carYear}款 · {item.licensePlate || '未上牌'}</div>
            </div>
          </div>
        </div>

        {/* ===== 二、基础信息档及车辆配置卡 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Car size={18} className="text-blue-600" />
            基础信息档
          </h3>

          <div className="grid grid-cols-4 gap-6">
            {/* VIN码 */}
            <div className="col-span-2">
              <label className="text-xs text-slate-400 uppercase tracking-wide">车辆识别码（VIN）</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                  {item.vin}
                </span>
                <button onClick={() => copyToClipboard(item.vin)} className="text-slate-400 hover:text-blue-600">
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* 车牌号 */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">车牌号</label>
              <div className="mt-1">
                <span className="font-mono text-sm text-slate-800">{item.licensePlate || '-'}</span>
              </div>
            </div>

            {/* 车辆所在城市 */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">车辆所在城市</label>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm text-slate-800">{item.province && item.city ? `${item.province}-${item.city}` : '-'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-4">
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-3 block">品牌车型</label>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-slate-400">品牌</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.carBrand}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">车系</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.carSeries}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">车型名称</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.carModel}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">年款</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.carYear}款</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-4">
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-3 block">车辆配置</label>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <span className="text-xs text-slate-400">排量</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.engineCapacity}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">变速箱</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.transmission}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">燃料类型</span>
                <div className="text-sm font-medium text-slate-800 mt-0.5">{item.fuelType}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">外饰颜色</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: getColorCode(item.exteriorColor) }} />
                  <span className="text-sm font-medium text-slate-800">{item.exteriorColor}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400">内饰颜色</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: getColorCode(item.interiorColor) }} />
                  <span className="text-sm font-medium text-slate-800">{item.interiorColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 三、车辆登记履历及过户性质卡 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            车辆登记履历
          </h3>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">上牌日期</label>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-800">{item.registrationDate}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">表显里程</label>
              <div className="flex items-center gap-1 mt-1">
                <Gauge size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-800">{item.mileage.toFixed(2)} 万公里</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">过户次数</label>
              <div className="flex items-center gap-1 mt-1">
                <RefreshCcw size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-800">{item.transferCount} 次</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide">车辆性质</label>
              <div className="mt-1">
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${item.vehicleNature === '非营运' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {item.vehicleNature}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 四、财务底价与验车图证区 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-orange-600" />
            财务底价与验车图证
          </h3>

          {/* 保留价 */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <label className="text-xs text-orange-400 uppercase tracking-wide">发拍保留价</label>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-orange-600">{item.reservePrice}</span>
              <span className="text-lg text-orange-500">万元</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-orange-600 text-xs">
              <AlertTriangle size={12} />
              <span>此价格在整个交易对买家闭底，低此价不触发落锤</span>
            </div>
          </div>

          {/* 7宫格必拍照片 */}
          <div className="mb-6">
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-3 block">
              底线7张（必拍位置）
            </label>
            <div className="grid grid-cols-7 gap-3">
              {REQUIRED_PHOTO_LABELS.map(photo => {
                const hasPhoto = item.images[photo.key as keyof typeof item.images]
                return (
                  <div key={photo.key} className="text-center">
                    <div className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center ${
                      hasPhoto
                        ? 'border-green-400 bg-green-50'
                        : 'border-dashed border-slate-300 bg-slate-50'
                    }`}>
                      {hasPhoto ? (
                        <CheckCircle2 size={24} className="text-green-500" />
                      ) : (
                        <>
                          <Camera size={20} className="text-slate-300 mb-1" />
                          <span className="text-[10px] text-red-400">图片上传故障</span>
                        </>
                      )}
                    </div>
                    <span className={`text-xs mt-1.5 block ${hasPhoto ? 'text-green-600' : 'text-red-500'}`}>
                      {photo.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 补充照片 */}
          {(item.images.defectImages?.length || item.images.modifiedImages?.length || item.images.otherImages?.length) && (
            <div className="space-y-4">
              {/* 瑕疵档案 */}
              {item.images.defectImages && item.images.defectImages.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">
                    瑕疵档案（{item.images.defectImages.length}/5张）
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {item.images.defectImages.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <ImageIcon size={16} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 改装特写 */}
              {item.images.modifiedImages && item.images.modifiedImages.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">
                    改装特写（{item.images.modifiedImages.length}/5张）
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {item.images.modifiedImages.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Wrench size={16} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 其他照片 */}
              {item.images.otherImages && item.images.otherImages.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">
                    其他照片（{item.images.otherImages.length}张）
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {item.images.otherImages.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <ImageIcon size={16} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== 下架确认弹窗 ===== */}
      <Dialog open={offshelfDialog} onOpenChange={() => setOffshelfDialog(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={18} />
              确认强制下架
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              确定要下架发拍单 <span className="font-mono font-semibold text-blue-600">{item.applyNo}</span> 吗？
            </p>
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              下架后该车源将从前端拍卖列表强行剔除并冻结，是否确认？
            </p>
            <div>
              <label className="text-xs text-slate-500 block mb-1">下架原因（选填）</label>
              <Textarea value={offshelfReason} onChange={e => setOffshelfReason(e.target.value)}
                placeholder="请输入下架原因..." rows={2} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOffshelfDialog(false)}>取消</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleOffshelf}>
              确认下架
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 颜色映射
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    '黑色': '#1a1a1a', '纯黑': '#000000',
    '白色': '#ffffff', '珍珠白': '#f5f5f5', '矿石白': '#e8e8e8',
    '银色': '#c0c0c0', '银': '#c0c0c0', '时空银': '#a8a8a8',
    '灰色': '#808080', '石墨灰': '#4a4a4a', '天云灰': '#b0b8c0',
    '玄武灰': '#3d3d3d',
    '红色': '#dc2626', '熔岩红': '#b91c1c',
    '蓝色': '#2563eb', '海盐蓝': '#60a5fa',
    '棕色': '#92400e', '干邑棕': '#8b5a2b', '玛奇朵米': '#c4a484',
    '米色': '#f5f5dc', '米': '#f5f5dc',
    '极夜流影': '#1e1e2e',
  }
  return colorMap[colorName] || '#e5e5e5'
}
