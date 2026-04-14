import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  RotateCcw, Plus, User, Phone, Clock, Calendar,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle,
} from 'lucide-react'
import type { Account, AccountType, AccountStatus } from '@/types'

// ===== 账号类型映射 =====
const ACCOUNT_TYPE_MAP: Record<AccountType, { label: string; color: string; bgColor: string }> = {
  system_admin: { label: '系统管理员', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  group: { label: '集团账号', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  store: { label: '门店账号', color: 'text-green-700', bgColor: 'bg-green-100' },
}

// ===== 账号状态映射 =====
const ACCOUNT_STATUS_MAP: Record<AccountStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: '正常', color: 'text-green-700', bgColor: 'bg-green-100' },
  inactive: { label: '停用', color: 'text-gray-500', bgColor: 'bg-gray-100' },
}

// ===== 模拟数据 =====
const mockAccounts: Account[] = [
  { id: 'U20260414001', phone: '13800138001', name: '张三', type: 'system_admin', group: null, status: 'active', createTime: '2026-04-01 09:30:00', lastLoginTime: '2026-04-14 18:22:15' },
  { id: 'U20260414002', phone: '13800138002', name: '李四', type: 'system_admin', group: null, status: 'active', createTime: '2026-04-02 10:15:00', lastLoginTime: '2026-04-14 16:45:30' },
  { id: 'U20260414003', phone: '13800138003', name: '王五', type: 'group', group: null, status: 'active', createTime: '2026-04-03 14:20:00', lastLoginTime: '2026-04-13 11:30:45' },
  { id: 'U20260414004', phone: '13800138004', name: '赵六', type: 'group', group: null, status: 'inactive', createTime: '2026-04-04 09:00:00', lastLoginTime: '2026-04-10 09:15:00' },
  { id: 'U20260414005', phone: '13800138005', name: '钱七', type: 'group', group: null, status: 'active', createTime: '2026-04-05 11:30:00', lastLoginTime: '2026-04-14 10:22:00' },
  { id: 'U20260414006', phone: '13800138006', name: '孙八', type: 'store', group: '广联二手车集团', status: 'active', createTime: '2026-04-06 15:45:00', lastLoginTime: '2026-04-14 19:01:22' },
  { id: 'U20260414007', phone: '13800138007', name: '周九', type: 'store', group: '广联二手车集团', status: 'active', createTime: '2026-04-07 08:30:00', lastLoginTime: '2026-04-14 17:55:10' },
  { id: 'U20260414008', phone: '13800138008', name: '吴十', type: 'store', group: '广联二手车集团', status: 'active', createTime: '2026-04-08 10:00:00', lastLoginTime: '2026-04-12 14:30:00' },
  { id: 'U20260414009', phone: '13800138009', name: '郑十一', type: 'store', group: '诚信车行', status: 'active', createTime: '2026-04-09 13:15:00', lastLoginTime: '2026-04-14 11:20:45' },
  { id: 'U20260414010', phone: '13800138010', name: '王十二', type: 'store', group: '诚信车行', status: 'inactive', createTime: '2026-04-10 16:30:00', lastLoginTime: '2026-04-08 09:45:00' },
  { id: 'U20260414011', phone: '13800138011', name: '李十三', type: 'store', group: '优车天下', status: 'active', createTime: '2026-04-11 09:45:00', lastLoginTime: '2026-04-14 15:10:30' },
  { id: 'U20260414012', phone: '13800138012', name: '张十四', type: 'store', group: '优车天下', status: 'active', createTime: '2026-04-12 14:00:00', lastLoginTime: '2026-04-13 18:30:15' },
]

const PAGE_SIZE_OPTIONS = [20, 50, 100]

export default function AccountList() {
  // 筛选条件
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType | 'all'>('all')
  const [group, setGroup] = useState('')
  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 筛选
  const filtered = useMemo(() => {
    return mockAccounts.filter(item => {
      if (phone && !item.phone.includes(phone)) return false
      if (name && !item.name.includes(name)) return false
      if (type !== 'all' && item.type !== type) return false
      if (group && (!item.group || !item.group.includes(group))) return false
      return true
    }).sort((a, b) => b.createTime.localeCompare(a.createTime))
  }, [phone, name, type, group])

  // 分页数据
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 重置
  const handleReset = () => {
    setPhone('')
    setName('')
    setType('all')
    setGroup('')
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-xl font-semibold text-slate-800">账号列表</h1>
        <p className="text-sm text-slate-500 mt-1">系统管理 · 账号管理</p>
      </div>

      {/* 筛选区 */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">手机号</label>
            <Input
              placeholder="精确搜索"
              value={phone}
              onChange={e => { setPhone(e.target.value); setCurrentPage(1) }}
              className="h-8 w-36"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">姓名</label>
            <Input
              placeholder="模糊搜索"
              value={name}
              onChange={e => { setName(e.target.value); setCurrentPage(1) }}
              className="h-8 w-36"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">账号类型</label>
            <Select value={type} onValueChange={v => { setType(v as AccountType | 'all'); setCurrentPage(1) }}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="system_admin">系统管理员</SelectItem>
                <SelectItem value="group">集团账号</SelectItem>
                <SelectItem value="store">门店账号</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">所属集团</label>
            <Input
              placeholder="模糊搜索"
              value={group}
              onChange={e => { setGroup(e.target.value); setCurrentPage(1) }}
              className="h-8 w-36"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-8 px-3" onClick={handleReset}>
              <RotateCcw size={14} className="mr-1" />重置
            </Button>
          </div>
        </div>
      </div>

      {/* 操作区 */}
      <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-slate-100">
        <span className="text-sm text-slate-500">共 {filtered.length} 条记录</span>
        <Button variant="outline" size="sm" className="h-8 px-3 opacity-50 cursor-not-allowed" disabled>
          <Plus size={14} className="mr-1" />新增账号
        </Button>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-32">账号ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-28">手机号码</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-24">用户姓名</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-28">账号类型</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">所属集团</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-20">账号状态</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">创建时间</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">最近登录时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                      <AlertCircle size={24} className="text-slate-300" />
                    </div>
                    <span className="text-sm text-slate-400">暂无符合条件的账号数据</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paged.map(item => {
                const typeConfig = ACCOUNT_TYPE_MAP[item.type]
                const statusConfig = ACCOUNT_STATUS_MAP[item.status]
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/70">
                    <TableCell>
                      <span className="font-mono text-sm font-medium text-blue-600">{item.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        <span className="text-sm">{item.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${typeConfig.bgColor} ${typeConfig.color} border-0 text-xs`}>
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`text-sm ${item.group ? 'text-slate-700' : 'text-slate-300'}`}>
                              {item.group || '-'}
                            </span>
                          </TooltipTrigger>
                          {item.group && item.group.length > 10 && (
                            <TooltipContent>
                              <p>{item.group}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0 text-xs`}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-600">{item.createTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-600">{item.lastLoginTime}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">每页显示</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1) }}>
              <SelectTrigger className="h-7 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-slate-500">条</span>
          </div>
          <span className="text-xs text-slate-400">
            共 {filtered.length} 条，第 {currentPage}/{totalPages} 页
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}><ChevronsLeft size={13} /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={13} /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={13} /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}><ChevronsRight size={13} /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
