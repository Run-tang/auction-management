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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  RotateCcw, Plus, User, Phone, Clock, Calendar, AlertCircle, X, Building2,
} from 'lucide-react'
import { THEME } from '@/lib/theme'
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
  { id: 'U20260414001', phone: '13800138001', realName: '张三', accountType: 'system_admin', status: 'active', createTime: '2026-04-01 09:30:00', lastLogin: '2026-04-14 18:22:15' },
  { id: 'U20260414002', phone: '13800138002', realName: '李四', accountType: 'system_admin', status: 'active', createTime: '2026-04-02 10:15:00', lastLogin: '2026-04-14 16:45:30' },
  { id: 'U20260414003', phone: '13800138003', realName: '王五', accountType: 'group', groupName: '广联二手车集团', status: 'active', createTime: '2026-04-03 14:20:00', lastLogin: '2026-04-13 11:30:45' },
  { id: 'U20260414004', phone: '13800138004', realName: '赵六', accountType: 'group', groupName: '诚信车行', status: 'inactive', createTime: '2026-04-04 09:00:00', lastLogin: '2026-04-10 09:15:00' },
  { id: 'U20260414005', phone: '13800138005', realName: '钱七', accountType: 'group', groupName: '优车天下', status: 'active', createTime: '2026-04-05 11:30:00', lastLogin: '2026-04-14 10:22:00' },
  { id: 'U20260414006', phone: '13800138006', realName: '孙八', accountType: 'store', groupName: '广联二手车集团', storeName: '广联·广州旗舰店', status: 'active', createTime: '2026-04-06 15:45:00', lastLogin: '2026-04-14 19:01:22' },
  { id: 'U20260414007', phone: '13800138007', realName: '周九', accountType: 'store', groupName: '广联二手车集团', storeName: '广联·深圳直营店', status: 'active', createTime: '2026-04-07 08:30:00', lastLogin: '2026-04-14 17:55:10' },
  { id: 'U20260414008', phone: '13800138008', realName: '吴十', accountType: 'store', groupName: '广联二手车集团', storeName: '广联·佛山加盟店', status: 'active', createTime: '2026-04-08 10:00:00', lastLogin: '2026-04-12 14:30:00' },
  { id: 'U20260414009', phone: '13800138009', realName: '郑十一', accountType: 'store', groupName: '诚信车行', storeName: '诚信·广州总店', status: 'active', createTime: '2026-04-09 13:15:00', lastLogin: '2026-04-14 11:20:45' },
  { id: 'U20260414010', phone: '13800138010', realName: '王十二', accountType: 'store', groupName: '诚信车行', storeName: '诚信·深圳分店', status: 'inactive', createTime: '2026-04-10 16:30:00', lastLogin: '2026-04-08 09:45:00' },
  { id: 'U20260414011', phone: '13800138011', realName: '李十三', accountType: 'store', groupName: '优车天下', storeName: '优车·天河店', status: 'active', createTime: '2026-04-11 09:45:00', lastLogin: '2026-04-14 15:10:30' },
  { id: 'U20260414012', phone: '13800138012', realName: '张十四', accountType: 'store', groupName: '优车天下', storeName: '优车·番禺店', status: 'active', createTime: '2026-04-12 14:00:00', lastLogin: '2026-04-13 18:30:15' },
]

// ===== 集团数据（用于新增表单） =====
const GROUP_OPTIONS = [
  { value: 'guanglian', label: '广联二手车集团' },
  { value: 'chengxin', label: '诚信车行' },
  { value: 'youche', label: '优车天下' },
]

// ===== 门店数据（按集团分组） =====
const STORE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  guanglian: [
    { value: 'guanglian_gz', label: '广联·广州旗舰店' },
    { value: 'guanglian_sz', label: '广联·深圳直营店' },
    { value: 'guanglian_fs', label: '广联·佛山加盟店' },
  ],
  chengxin: [
    { value: 'chengxin_gz', label: '诚信·广州总店' },
    { value: 'chengxin_sz', label: '诚信·深圳分店' },
  ],
  youche: [
    { value: 'youche_th', label: '优车·天河店' },
    { value: 'youche_py', label: '优车·番禺店' },
  ],
}

const PAGE_SIZE_OPTIONS = [20, 50, 100]

// ===== 新增账号表单 =====
interface AddAccountForm {
  phone: string
  realName: string
  accountType: AccountType
  groupValue: string
  storeValue: string
}

const initForm: AddAccountForm = {
  phone: '',
  realName: '',
  accountType: 'store',
  groupValue: '',
  storeValue: '',
}

export default function AccountList() {
  // 筛选条件
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType | 'all'>('all')
  const [group, setGroup] = useState('')
  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  // 新增账号抽屉
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState<AddAccountForm>(initForm)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddAccountForm, string>>>({})

  // 筛选
  const filtered = useMemo(() => {
    return mockAccounts.filter(item => {
      if (phone && !item.phone.includes(phone)) return false
      if (name && !item.realName.includes(name)) return false
      if (type !== 'all' && item.accountType !== type) return false
      if (group && (!item.groupName || !item.groupName.includes(group))) return false
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

  // 打开抽屉
  const handleOpenDrawer = () => {
    setForm(initForm)
    setFormErrors({})
    setDrawerOpen(true)
  }

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setForm(initForm)
    setFormErrors({})
  }

  // 提交表单
  const handleSubmit = () => {
    const errors: Partial<Record<keyof AddAccountForm, string>> = {}
    if (!form.phone) errors.phone = '请输入手机号'
    else if (!/^1[3-9]\d{9}$/.test(form.phone)) errors.phone = '手机号格式不正确'
    if (!form.realName) errors.realName = '请输入用户姓名'
    if (form.accountType === 'group' && !form.groupValue) errors.groupValue = '请选择所属集团'
    if (form.accountType === 'store' && !form.groupValue) errors.groupValue = '请选择所属集团'
    if (form.accountType === 'store' && !form.storeValue) errors.storeValue = '请选择所属门店'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // 模拟提交
    console.log('新增账号:', {
      phone: form.phone,
      realName: form.realName,
      accountType: form.accountType,
      groupName: GROUP_OPTIONS.find(g => g.value === form.groupValue)?.label,
      storeName: STORE_OPTIONS[form.groupValue]?.find(s => s.value === form.storeValue)?.label,
    })
    alert('账号创建成功！')
    handleCloseDrawer()
  }

  // 表单变化
  const handleFormChange = (field: keyof AddAccountForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value, ...(field === 'groupValue' ? { storeValue: '' } : {}) }))
    setFormErrors(prev => ({ ...prev, [field]: undefined }))
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
        <Button variant="outline" size="sm" className="h-8 px-3" onClick={handleOpenDrawer}>
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
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[140px]">所属集团</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[140px]">所属门店</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-20">账号状态</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">创建时间</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">最近登录时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16">
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
                const typeConfig = ACCOUNT_TYPE_MAP[item.accountType]
                const statusConfig = ACCOUNT_STATUS_MAP[item.status]
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors duration-150">
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
                        <span className="text-sm font-medium">{item.realName}</span>
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
                            <span className={`text-sm ${item.groupName ? 'text-slate-700' : 'text-slate-300'}`}>
                              {item.groupName || '-'}
                            </span>
                          </TooltipTrigger>
                          {item.groupName && item.groupName.length > 10 && (
                            <TooltipContent>
                              <p>{item.groupName}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`text-sm ${item.storeName ? 'text-slate-700' : 'text-slate-300'}`}>
                              {item.storeName || '-'}
                            </span>
                          </TooltipTrigger>
                          {item.storeName && item.storeName.length > 12 && (
                            <TooltipContent>
                              <p>{item.storeName}</p>
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
                        <span className="text-xs text-slate-600">{item.lastLogin || '-'}</span>
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
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
            >
              {/* <ChevronsLeft size={14} /> */}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              {/* <ChevronLeft size={14} /> */}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              {/* <ChevronRight size={14} /> */}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              {/* <ChevronsRight size={14} /> */}
            </Button>
          </div>
        </div>
      )}

      {/* 新增账号抽屉 */}
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">新增账号</DialogTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCloseDrawer}>
                <X size={18} className="text-slate-400" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* 手机号 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                手机号码 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="请输入11位手机号"
                value={form.phone}
                onChange={e => handleFormChange('phone', e.target.value)}
                className={`h-10 ${formErrors.phone ? 'border-red-500' : ''}`}
              />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>

            {/* 用户姓名 */}
            <div className="space-y-2">
              <Label htmlFor="realName" className="text-sm font-medium text-slate-700">
                用户姓名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="realName"
                placeholder="请输入用户姓名"
                value={form.realName}
                onChange={e => handleFormChange('realName', e.target.value)}
                className={`h-10 ${formErrors.realName ? 'border-red-500' : ''}`}
              />
              {formErrors.realName && <p className="text-xs text-red-500">{formErrors.realName}</p>}
            </div>

            {/* 账号类型 */}
            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm font-medium text-slate-700">账号类型</Label>
              <Select value={form.accountType} onValueChange={v => handleFormChange('accountType', v)}>
                <SelectTrigger id="accountType" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system_admin">系统管理员</SelectItem>
                  <SelectItem value="group">集团账号</SelectItem>
                  <SelectItem value="store">门店账号</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 所属集团 */}
            {form.accountType !== 'system_admin' && (
              <div className="space-y-2">
                <Label htmlFor="group" className="text-sm font-medium text-slate-700">
                  所属集团 <span className="text-red-500">*</span>
                </Label>
                <Select value={form.groupValue} onValueChange={v => handleFormChange('groupValue', v)}>
                  <SelectTrigger id="group" className={`h-10 ${formErrors.groupValue ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="请选择所属集团" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_OPTIONS.map(g => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.groupValue && <p className="text-xs text-red-500">{formErrors.groupValue}</p>}
              </div>
            )}

            {/* 所属门店 */}
            {form.accountType === 'store' && (
              <div className="space-y-2">
                <Label htmlFor="store" className="text-sm font-medium text-slate-700">
                  所属门店 <span className="text-red-500">*</span>
                </Label>
                <Select value={form.storeValue} onValueChange={v => handleFormChange('storeValue', v)} disabled={!form.groupValue}>
                  <SelectTrigger id="store" className={`h-10 ${formErrors.storeValue ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={form.groupValue ? '请选择所属门店' : '请先选择集团'} />
                  </SelectTrigger>
                  <SelectContent>
                    {form.groupValue && STORE_OPTIONS[form.groupValue]?.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.storeValue && <p className="text-xs text-red-500">{formErrors.storeValue}</p>}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDrawer} className="h-9 px-4">
              取消
            </Button>
            <Button onClick={handleSubmit} className="h-9 px-4 bg-blue-600 hover:bg-blue-700">
              创建账号
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
