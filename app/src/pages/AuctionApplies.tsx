import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { mockAuctionApplies, mockDealers } from '@/data/mockData'
import type { AuctionApply, AuctionApplyStatus } from '@/types'
import { THEME } from '@/lib/theme'
import {
  Search, Plus, Eye, RefreshCcw, Car, Calendar, Tag, AlertCircle, Camera, CheckCircle2,
  RotateCcw, Edit2, Send, ArrowLeft, ArrowRight, Image as ImageIcon, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, User, Phone, Building2,
  Download, Trash2, Copy, ArrowUpDown, MapPin, Store, Clock, Gavel, DollarSign,
  AlertTriangle, XCircle
} from 'lucide-react'

// ===== 状态映射 =====
// 注意：已移除 'ready'（待发拍）状态
const STATUS_MAP: Record<AuctionApplyStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  draft:      { label: '草稿',     color: 'text-slate-600',   bgColor: 'bg-slate-100',   borderColor: 'border-slate-300' },
  scheduled:  { label: '待拍卖',   color: 'text-amber-600',   bgColor: 'bg-amber-100',   borderColor: 'border-amber-300' },
  auctioning: { label: '拍卖中',   color: 'text-orange-600', bgColor: 'bg-orange-100',  borderColor: 'border-orange-300' },
  sold:       { label: '交易成功', color: 'text-green-600',   bgColor: 'bg-green-100',   borderColor: 'border-green-300' },
  unsold:     { label: '流拍',     color: 'text-red-600',     bgColor: 'bg-red-100',     borderColor: 'border-red-300' },
  offshelf:   { label: '已下架',   color: 'text-gray-500',   bgColor: 'bg-gray-100',     borderColor: 'border-gray-300' },
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

// ===== Tab配置 =====
// 注意：已移除 'ready'（待发拍）状态
const TABS = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'scheduled', label: '待拍卖' },
  { key: 'auctioning', label: '拍卖中' },
  { key: 'sold', label: '交易成功' },
  { key: 'unsold', label: '流拍' },
  { key: 'offshelf', label: '已下架' },
]

// ===== 省份数据 =====
const PROVINCES = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '山东', '河南', '福建']
const CITIES: Record<string, string[]> = {
  '北京': ['北京'],
  '上海': ['上海'],
  '广东': ['广州', '深圳', '东莞', '佛山', '珠海'],
  '浙江': ['杭州', '宁波', '温州', '嘉兴', '绍兴'],
  '江苏': ['南京', '苏州', '无锡', '常州', '南通'],
  '四川': ['成都', '绵阳', '德阳', '宜宾', '南充'],
  '湖北': ['武汉', '襄阳', '宜昌', '荆州', '黄冈'],
  '山东': ['济南', '青岛', '烟台', '潍坊', '临沂'],
  '河南': ['郑州', '洛阳', '开封', '南阳', '新乡'],
  '福建': ['福州', '厦门', '泉州', '漳州', '莆田'],
}

// ===== 分页配置 =====
const PAGE_SIZE = 10

export default function AuctionApplies() {
  const navigate = useNavigate()
  const [data, setData] = useState<AuctionApply[]>(mockAuctionApplies)

  // ===== 筛选状态 =====
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchApplyNo, setSearchApplyNo] = useState('')
  const [searchVin, setSearchVin] = useState('')
  const [searchPlate, setSearchPlate] = useState('')
  const [filterCity, setFilterCity] = useState<string>('all')
  const [filterProvince, setFilterProvince] = useState<string>('all')
  const [filterStore, setFilterStore] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  // ===== 分页 =====
  const [page, setPage] = useState(1)

  // ===== 详情 =====
  const [detailItem, setDetailItem] = useState<AuctionApply | null>(null)

  // ===== 下架确认 =====
  const [offshelfDialog, setOffshelfDialog] = useState<AuctionApply | null>(null)
  const [offshelfReason, setOffshelfReason] = useState('')

  // ===== 过滤逻辑 =====
  function getFiltered() {
    return data.filter(item => {
      // Tab筛选
      if (activeTab !== 'all' && item.status !== activeTab) return false
      // 发拍单号
      if (searchApplyNo && !item.applyNo.toLowerCase().includes(searchApplyNo.toLowerCase())) return false
      // VIN码
      if (searchVin && !item.vin.toLowerCase().includes(searchVin.toLowerCase())) return false
      // 车牌号
      if (searchPlate && !(item.licensePlate || '').toLowerCase().includes(searchPlate.toLowerCase())) return false
      // 城市
      if (filterCity !== 'all' && item.city !== filterCity) return false
      // 省份
      if (filterProvince !== 'all' && item.province !== filterProvince) return false
      // 门店
      if (filterStore !== 'all' && item.storeName !== filterStore) return false
      // 日期
      if (dateFrom && item.applyTime.slice(0, 10) < dateFrom) return false
      if (dateTo && item.applyTime.slice(0, 10) > dateTo) return false
      return true
    })
  }

  const filtered = getFiltered()
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // ===== 统计 =====
  function countByStatus(s: string) {
    if (s === 'all') return data.length
    return data.filter(d => d.status === s).length
  }

  // ===== 重置筛选 =====
  function resetFilters() {
    setActiveTab('all')
    setSearchApplyNo('')
    setSearchVin('')
    setSearchPlate('')
    setFilterCity('all')
    setFilterProvince('all')
    setFilterStore('all')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  // ===== 下架操作 =====
  function handleOffshelf(item: AuctionApply) {
    setData(prev => prev.map(d => d.id === item.id ? {
      ...d, status: 'offshelf' as AuctionApplyStatus,
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      auditTrail: [...d.auditTrail, {
        id: `o-${Date.now()}`, operator: '系统管理员', action: 'offshelf' as const,
        actionLabel: '强制下架', time: new Date().toISOString(), remark: offshelfReason || '管理员强制下架',
      }]
    } : d))
    setOffshelfDialog(null)
    setOffshelfReason('')
  }

  // ===== 复制功能 =====
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  const hasActiveFilters = searchApplyNo || searchVin || searchPlate || filterCity !== 'all' || filterProvince !== 'all' || filterStore !== 'all' || dateFrom || dateTo

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* ===== 页面标题栏 ===== */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Gavel size={20} className="text-blue-600" />
              发拍管理
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              共 <span className="font-semibold text-slate-600">{filtered.length}</span> 条记录
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
              <Download size={14} /> 导出
            </Button>
          </div>
        </div>

        {/* ===== 状态统计条 ===== */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => { setActiveTab(t.key); setPage(1) }}
              className={`flex items-center gap-2 pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.key ? 'border-blue-600' : 'border-transparent'
              }`}>
              <span className={`text-sm font-medium ${activeTab === t.key ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === t.key
                  ? 'bg-blue-100 text-blue-700'
                  : countByStatus(t.key) > 0 ? 'bg-slate-100 text-slate-500' : 'text-slate-300'
              }`}>
                {countByStatus(t.key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== 筛选区 ===== */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 发拍单号 */}
          <div className="relative w-44">
            <Input placeholder="发拍单号"
              className="h-8 text-sm pl-3 pr-8" value={searchApplyNo}
              onChange={e => { setSearchApplyNo(e.target.value); setPage(1) }} />
          </div>

          {/* VIN码 */}
          <div className="relative w-52">
            <Input placeholder="VIN码"
              className="h-8 text-sm pl-3 font-mono" value={searchVin}
              onChange={e => { setSearchVin(e.target.value.toUpperCase()); setPage(1) }} />
          </div>

          {/* 车牌号 */}
          <div className="relative w-36">
            <Input placeholder="车牌号"
              className="h-8 text-sm pl-3" value={searchPlate}
              onChange={e => { setSearchPlate(e.target.value); setPage(1) }} />
          </div>

          {/* 省份 */}
          <Select value={filterProvince} onValueChange={v => { setFilterProvince(v); setFilterCity('all'); setPage(1) }}>
            <SelectTrigger className="h-8 w-28 text-sm">
              <SelectValue placeholder="省份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部省份</SelectItem>
              {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* 城市 */}
          <Select value={filterCity} onValueChange={v => { setFilterCity(v); setPage(1) }}>
            <SelectTrigger className="h-8 w-28 text-sm" disabled={!filterProvince || filterProvince === 'all'}>
              <SelectValue placeholder="城市" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部城市</SelectItem>
              {(CITIES[filterProvince] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* 门店 */}
          <Select value={filterStore} onValueChange={v => { setFilterStore(v); setPage(1) }}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue placeholder="门店名称" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部门店</SelectItem>
              {[...new Set(data.map(d => d.storeName).filter(Boolean))].map(s => (
                <SelectItem key={s!} value={s!}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 日期 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Clock size={14} />
            <input type="date" className="h-8 px-2 border border-slate-200 rounded-md text-sm text-slate-600 outline-none focus:border-blue-400 w-32"
              value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} />
            <span className="text-slate-300">至</span>
            <input type="date" className="h-8 px-2 border border-slate-200 rounded-md text-sm text-slate-600 outline-none focus:border-blue-400 w-32"
              value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 gap-1" onClick={resetFilters}>
              <X size={13} /> 重置
            </Button>
          )}
        </div>
      </div>

      {/* ===== 数据表格 ===== */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-10 text-xs font-semibold text-slate-400 uppercase tracking-wide sticky left-0 bg-slate-50 z-10">#</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide sticky left-10 bg-slate-50 z-10 min-w-[140px]">发拍单号</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[60px]">品牌</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[60px]">车系</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[60px]">年款</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[180px]">车型名称</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[100px]">发拍用户</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[120px]">用户手机</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[100px]">车辆所在城市</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[90px]">当前状态</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[120px]">起拍场次名称</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[100px]">起拍时间</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[140px]">门店名称</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[90px]">车牌号</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[170px]">VIN码</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right min-w-[80px]">保留价</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right min-w-[80px]">拍卖次数</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right min-w-[80px]">车款</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center min-w-[180px] sticky right-0 bg-slate-50 z-10">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={19} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                          <FileText size={24} className="text-slate-300" />
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium">暂无数据</p>
                          <p className="text-slate-400 text-sm mt-1">调整筛选条件查看数据</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((item, idx) => {
                    const st = STATUS_MAP[item.status]
                    const seq = (currentPage - 1) * PAGE_SIZE + idx + 1
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/70 group transition-colors duration-150">
                        <TableCell className="text-slate-400 text-xs sticky left-0 bg-white z-10">{seq}</TableCell>
                        {/* 发拍单号 */}
                        <TableCell className="sticky left-10 bg-white z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-medium text-blue-600">{item.applyNo}</span>
                            <button 
                              onClick={() => copyToClipboard(item.applyNo)} 
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-slate-100"
                              title="复制单号"
                            >
                              <Copy size={12} className="text-slate-400 hover:text-blue-600" />
                            </button>
                          </div>
                        </TableCell>
                        {/* 品牌 */}
                        <TableCell><span className="text-sm text-slate-700">{item.carBrand}</span></TableCell>
                        {/* 车系 */}
                        <TableCell><span className="text-sm text-slate-700">{item.carSeries}</span></TableCell>
                        {/* 年款 */}
                        <TableCell><span className="text-sm text-slate-500">{item.carYear}款</span></TableCell>
                        {/* 车型名称 */}
                        <TableCell>
                          <span className="text-sm text-slate-800 max-w-[180px] truncate block" title={item.carModel}>
                            {item.carModel}
                          </span>
                        </TableCell>
                        {/* 发拍用户 */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{item.submitterName || '-'}</span>
                          </div>
                        </TableCell>
                        {/* 用户手机 */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-600 font-mono">{item.submitterPhone || '-'}</span>
                          </div>
                        </TableCell>
                        {/* 城市 */}
                        <TableCell>
                          <span className="text-sm text-slate-600">{item.province && item.city ? `${item.province}-${item.city}` : '-'}</span>
                        </TableCell>
                        {/* 状态 */}
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${st.bgColor} ${st.color} ${st.borderColor}`}>
                            {st.label}
                          </span>
                        </TableCell>
                        {/* 场次名称 */}
                        <TableCell>
                          <span className="text-sm text-slate-600">{item.auctionSessionName || '-'}</span>
                        </TableCell>
                        {/* 起拍时间 */}
                        <TableCell>
                          <span className="text-sm text-slate-500">{item.auctionStartTime ? item.auctionStartTime.slice(0, 10) : '-'}</span>
                        </TableCell>
                        {/* 门店 */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Store size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{item.storeName || '-'}</span>
                          </div>
                        </TableCell>
                        {/* 车牌 */}
                        <TableCell>
                          <span className={`font-mono text-sm ${item.licensePlate ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                            {item.licensePlate || '未上牌'}
                          </span>
                        </TableCell>
                        {/* VIN */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-slate-600">{item.vin.slice(0, 11)}...</span>
                            <button 
                              onClick={() => copyToClipboard(item.vin)} 
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-slate-100"
                              title="复制VIN"
                            >
                              <Copy size={11} className="text-slate-400 hover:text-blue-600" />
                            </button>
                          </div>
                        </TableCell>
                        {/* 保留价 */}
                        <TableCell className="text-right">
                          <span className="text-sm font-semibold text-orange-600">{item.reservePrice}万</span>
                        </TableCell>
                        {/* 拍卖次数 */}
                        <TableCell className="text-right">
                          <span className="text-sm text-slate-600">{item.auctionCount}次</span>
                        </TableCell>
                        {/* 车款 */}
                        <TableCell className="text-right">
                          <span className={`text-sm font-semibold ${item.status === 'sold' && item.finalPrice ? 'text-green-600' : 'text-slate-300'}`}>
                            {item.status === 'sold' && item.finalPrice ? `${(item.finalPrice / 10000).toFixed(2)}万` : '-'}
                          </span>
                        </TableCell>
                        {/* 操作 */}
                        <TableCell className="sticky right-0 bg-white z-10">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 px-3 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                              onClick={() => navigate(`/applies/${item.id}`)}
                            >
                              查看
                            </Button>
                            {(item.status === 'draft') && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-3 text-xs text-red-600 hover:bg-red-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-500"
                                onClick={() => setOffshelfDialog(item)}
                              >
                                下架
                              </Button>
                            )}
                            {item.status === 'sold' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-3 text-xs text-green-600 hover:bg-green-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500"
                                onClick={() => navigate(`/orders/${item.id}`)}
                              >
                                订单
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* ===== 分页 ===== */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                显示 {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}，共 {filtered.length} 条
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronsLeft size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="px-3 text-xs text-slate-600 font-medium">
                  {currentPage} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  <ChevronsRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 下架确认弹窗 ===== */}
      <Dialog open={!!offshelfDialog} onOpenChange={() => { setOffshelfDialog(null); setOffshelfReason('') }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={18} />
              确认强制下架
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              确定要下架发拍单 <span className="font-mono font-semibold text-blue-600">{offshelfDialog?.applyNo}</span> 吗？
            </p>
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              车辆将终止一切流程，下架后该车源将从前端拍卖列表强行剔除并冻结。
            </p>
            <div>
              <label className="text-xs text-slate-500 block mb-1">下架原因（选填）</label>
              <Textarea value={offshelfReason} onChange={e => setOffshelfReason(e.target.value)}
                placeholder="请输入下架原因..." rows={2} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setOffshelfDialog(null); setOffshelfReason('') }}>取消</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleOffshelf(offshelfDialog!)}>
              确认下架
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
