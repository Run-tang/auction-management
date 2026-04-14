import { useState } from 'react'
import { PageHeader, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { mockDealers } from '@/data/mockData'
import type { Dealer, DealerStatus } from '@/types'
import {
  Search, Plus, Eye, Edit, Pause, Play, Building2, MapPin,
  Phone, Mail, RefreshCcw, Users, CheckCircle2, AlertCircle,
  ChevronRight, X, UserCog, KeyRound
} from 'lucide-react'

const statusMap: Record<DealerStatus, { label: string; className: string }> = {
  active:   { label: '正常',   className: 'bg-green-100 text-green-700 border border-green-200' },
  inactive: { label: '已禁用', className: 'bg-slate-100 text-slate-500 border border-slate-200' },
  pending:  { label: '待审核', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  rejected: { label: '已拒绝', className: 'bg-red-100 text-red-700 border border-red-200' },
}

// 省市联动
const provinceCityMap: Record<string, string[]> = {
  '北京': ['北京'], '上海': ['上海'],
  '广东': ['广州', '深圳', '东莞', '佛山', '珠海'],
  '浙江': ['杭州', '宁波', '温州', '绍兴'],
  '江苏': ['南京', '苏州', '无锡', '常州'],
  '四川': ['成都', '绵阳', '德阳', '乐山'],
  '湖北': ['武汉', '宜昌', '襄阳', '荆州'],
  '山东': ['济南', '青岛', '潍坊', '烟台'],
  '河南': ['郑州', '洛阳', '开封', '新乡'],
  '陕西': ['西安', '咸阳', '宝鸡'],
  '湖南': ['长沙', '株洲', '湘潭', '衡阳'],
  '福建': ['福州', '厦门', '泉州', '漳州'],
  '辽宁': ['沈阳', '大连', '鞍山', '抚顺'],
}

type FormErrors = Partial<Record<string, string>>

interface DealerForm {
  name: string; shortName: string
  contactPerson: string; phone: string; email: string
  province: string; city: string; address: string
  licenseNo: string; status: DealerStatus
  expireTime: string; remark: string
}

const emptyForm: DealerForm = {
  name: '', shortName: '', contactPerson: '', phone: '', email: '',
  province: '', city: '', address: '', licenseNo: '',
  status: 'pending', expireTime: '', remark: '',
}

function FormField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  )
}

// ============================================================
//  账号管理弹窗
// ============================================================
interface DealerAccount {
  id: string; name: string; phone: string; role: string
  permissions: string[]; status: 'active' | 'inactive'; lastLogin: string; createTime: string
}

const mockAccounts: Record<string, DealerAccount[]> = {
  'd1': [
    { id: 'a1', name: '张经理', phone: '13812340001', role: '管理员', permissions: ['发拍申请', '订单查看', '财务管理', '账号管理'], status: 'active', lastLogin: '2026-04-13 10:22', createTime: '2025-08-15' },
    { id: 'a2', name: '李操作', phone: '13812340002', role: '操作员', permissions: ['发拍申请', '订单查看'], status: 'active', lastLogin: '2026-04-12 18:05', createTime: '2025-10-01' },
    { id: 'a3', name: '王查看', phone: '13812340003', role: '查看员', permissions: ['订单查看'], status: 'inactive', lastLogin: '2026-03-20 09:00', createTime: '2025-11-20' },
  ],
}

const roleOptions = [
  { value: '管理员', desc: '拥有全部权限，可管理子账号', color: 'bg-blue-100 text-blue-700' },
  { value: '操作员', desc: '可发起发拍申请、查看订单', color: 'bg-green-100 text-green-700' },
  { value: '查看员', desc: '仅查看订单和申请记录', color: 'bg-slate-100 text-slate-600' },
]

const permissionOptions = ['发拍申请', '订单查看', '财务管理', '账号管理']

function AccountDialog({ dealer, onClose }: { dealer: Dealer; onClose: () => void }) {
  const [accounts, setAccounts] = useState<DealerAccount[]>(
    mockAccounts[dealer.id] || []
  )
  const [showCreate, setShowCreate] = useState(false)
  const [editAcc, setEditAcc] = useState<DealerAccount | null>(null)
  const [resetPwd, setResetPwd] = useState<DealerAccount | null>(null)
  const [newAcc, setNewAcc] = useState({ name: '', phone: '', role: '操作员', permissions: ['发拍申请', '订单查看'] as string[] })
  const [errors, setErrors] = useState<FormErrors>({})
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')

  function togglePerm(perm: string) {
    setNewAcc(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }))
  }

  function validateNew(): boolean {
    const e: FormErrors = {}
    if (!newAcc.name.trim()) e.name = '请填写账号姓名'
    if (!newAcc.phone.trim()) e.phone = '请填写手机号'
    else if (!/^1[3-9]\d{9}$/.test(newAcc.phone.trim())) e.phone = '手机号格式不正确'
    if (newAcc.permissions.length === 0) e.permissions = '请至少选择一个权限'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleCreate() {
    if (!validateNew()) return
    const acc: DealerAccount = {
      id: `a${Date.now()}`,
      name: newAcc.name.trim(),
      phone: newAcc.phone.trim(),
      role: newAcc.role,
      permissions: [...newAcc.permissions],
      status: 'active',
      lastLogin: '—',
      createTime: new Date().toISOString().slice(0, 10),
    }
    setAccounts(prev => [acc, ...prev])
    setNewAcc({ name: '', phone: '', role: '操作员', permissions: ['发拍申请', '订单查看'] })
    setShowCreate(false)
    setActiveTab('list')
  }

  function toggleStatus(acc: DealerAccount) {
    setAccounts(prev => prev.map(a => a.id === acc.id
      ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
  }

  const roleColor = (r: string) => roleOptions.find(o => o.value === r)?.color || 'bg-slate-100 text-slate-600'

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <UserCog size={16} className="text-blue-600" />
            经销商账号管理 · {dealer.name}
          </DialogTitle>
        </DialogHeader>

        {/* 标签切换 */}
        <div className="flex gap-1 border-b border-slate-200 pb-0">
          {[['list', '账号列表'], ['create', '新建账号']].map(([tab, label]) => (
            <button key={tab} onClick={() => { setActiveTab(tab as 'list' | 'create'); setShowCreate(tab === 'create'); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
                ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 self-end pb-2">
            <Users size={12} />共 {accounts.length} 个账号
          </div>
        </div>

        {/* 账号列表 */}
        {!showCreate && (
          <div className="flex-1 overflow-y-auto space-y-2 mt-2">
            {accounts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">暂无子账号</div>
            ) : accounts.map(acc => (
              <div key={acc.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {acc.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-slate-800">{acc.name}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${roleColor(acc.role)}`}>
                      {acc.role}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                      ${acc.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {acc.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-0.5">
                    <span className="flex items-center gap-1"><Phone size={10} />{acc.phone}</span>
                    <span>最后登录：{acc.lastLogin}</span>
                    <span>创建于：{acc.createTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {acc.permissions.map(p => (
                      <span key={p} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-500">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => toggleStatus(acc)}
                    className={`w-16 py-1 rounded text-xs font-medium transition-colors border
                      ${acc.status === 'active'
                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                        : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                    {acc.status === 'active' ? '禁用' : '启用'}
                  </button>
                  <button onClick={() => setResetPwd(acc)}
                    className="w-16 py-1 rounded text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center gap-1">
                    <KeyRound size={10} />重置
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 新建账号 */}
        {showCreate && (
          <div className="flex-1 overflow-y-auto mt-2 space-y-4">
            <FormField label="账号姓名" required error={errors.name}>
              <Input placeholder="例：张三" value={newAcc.name}
                onChange={e => setNewAcc(p => ({ ...p, name: e.target.value }))} />
            </FormField>
            <FormField label="手机号码" required error={errors.phone}>
              <Input placeholder="用于登录的唯一账号" maxLength={11} value={newAcc.phone}
                onChange={e => setNewAcc(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} />
            </FormField>
            <FormField label="角色" required>
              <Select value={newAcc.role} onValueChange={v => setNewAcc(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roleOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      <div>
                        <div className="font-medium">{o.value}</div>
                        <div className="text-xs text-slate-400">{o.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="功能权限" required error={errors.permissions}>
              <div className="flex flex-wrap gap-2">
                {permissionOptions.map(p => (
                  <button key={p} type="button"
                    onClick={() => togglePerm(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                      ${newAcc.permissions.includes(p)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                    {p}
                    {newAcc.permissions.includes(p) && <CheckCircle2 size={10} className="inline ml-1" />}
                  </button>
                ))}
              </div>
              {errors.permissions && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle size={11} />{errors.permissions}</p>}
            </FormField>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <AlertCircle size={11} className="inline mr-1" />
                初始密码为手机号后6位，账号创建后请通知用户及时修改密码。
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-2">
          <Button variant="outline" onClick={onClose}>关闭</Button>
          {showCreate && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setShowCreate(false); setActiveTab('list') }}>取消</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
                <Plus size={14} className="mr-1" />确认创建
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
//  主页面
// ============================================================
export default function Dealers() {
  const [data, setData] = useState<Dealer[]>(mockDealers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewItem, setViewItem] = useState<Dealer | null>(null)
  const [editItem, setEditItem] = useState<Dealer | null>(null)
  const [accountDealer, setAccountDealer] = useState<Dealer | null>(null)

  // 新增弹窗
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<DealerForm>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [newDealerNo, setNewDealerNo] = useState('')
  const [success, setSuccess] = useState(false)

  // 编辑弹窗
  const [editErrors, setEditErrors] = useState<FormErrors>({})
  const [editSubmitting, setEditSubmitting] = useState(false)

  const filtered = data.filter(d => {
    const matchSearch = !search
      || d.name.includes(search) || d.dealerNo.includes(search)
      || d.contactPerson.includes(search) || d.city.includes(search)
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  function toggleStatus(id: string) {
    setData(prev => prev.map(d =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d))
  }

  function updateForm(key: keyof DealerForm, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
    if (key === 'province') setForm(prev => ({ ...prev, province: value, city: '' }))
  }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = '请填写经销商全称'
    else if (form.name.trim().length < 4) e.name = '名称至少4个字'
    if (!form.shortName.trim()) e.shortName = '请填写简称'
    if (!form.contactPerson.trim()) e.contactPerson = '请填写联系人'
    if (!form.phone.trim()) e.phone = '请填写手机号'
    else if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) e.phone = '手机号格式不正确'
    if (!form.email.trim()) e.email = '请填写邮箱'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = '邮箱格式不正确'
    if (!form.licenseNo.trim()) e.licenseNo = '请填写营业执照号'
    else if (!/^[0-9A-Z]{18}$/.test(form.licenseNo.trim())) e.licenseNo = '统一社会信用代码应为18位'
    if (!form.province) e.province = '请选择省份'
    if (!form.city) e.city = '请选择城市'
    if (!form.address.trim()) e.address = '请填写详细地址'
    if (!form.expireTime) e.expireTime = '请选择有效期'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      const now = new Date()
      const dealerNo = `DL${now.getFullYear()}${String(data.length + 1).padStart(3, '0')}`
      const newDealer: Dealer = {
        id: `d${Date.now()}`,
        dealerNo,
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        contactPerson: form.contactPerson.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        province: form.province,
        city: form.city,
        address: form.address.trim(),
        licenseNo: form.licenseNo.trim(),
        level: 'bronze',
        status: form.status,
        createTime: now.toISOString().slice(0, 10),
        expireTime: form.expireTime,
        balance: 0,
        deposit: 0,
        totalAuctions: 0,
        successAuctions: 0,
        accountCount: 0,
      }
      setData(prev => [newDealer, ...prev])
      setNewDealerNo(dealerNo)
      setSubmitting(false)
      setSuccess(true)
    }, 800)
  }

  function handleEditSave() {
    if (!editItem) return
    const e: FormErrors = {}
    if (!editItem.name.trim()) e.name = '请填写名称'
    if (!editItem.contactPerson.trim()) e.contactPerson = '请填写联系人'
    if (!editItem.phone.trim()) e.phone = '请填写手机号'
    else if (!/^1[3-9]\d{9}$/.test(editItem.phone.trim())) e.phone = '手机号格式不正确'
    if (!editItem.email.trim()) e.email = '请填写邮箱'
    if (Object.keys(e).length > 0) { setEditErrors(e); return }
    setEditSubmitting(true)
    setTimeout(() => {
      setData(prev => prev.map(d => d.id === editItem.id ? { ...editItem } : d))
      setEditItem(null)
      setEditSubmitting(false)
    }, 500)
  }

  function openCreate() {
    setForm(emptyForm); setErrors({}); setSuccess(false); setShowCreate(true)
  }

  return (
    <div>
      <PageHeader title="经销商管理" description="管理平台经销商资质与子账号体系">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
          <Plus size={15} className="mr-1.5" />新增经销商
        </Button>
      </PageHeader>

      {/* 统计概览 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '全部经销商', value: data.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '正常运营', value: data.filter(d => d.status === 'active').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '待审核', value: data.filter(d => d.status === 'pending').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="搜索名称/编号/联系人/城市..." className="pl-9 h-9 text-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearch(''); setStatusFilter('all') }}>
            <RefreshCcw size={14} className="mr-1.5" />重置
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-slate-100 bg-slate-50">
                {['编号','经销商信息','联系方式','地区','账号数','状态','有效期','操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{item.dealerNo}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={15} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.shortName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm">{item.contactPerson}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10} />{item.phone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin size={11} className="text-slate-400" />{item.province} · {item.city}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setAccountDealer(item)}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Users size={13} />{item.accountCount}
                    </button>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={item.status} map={statusMap} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{item.expireTime}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewItem(item)}>
                        <Eye size={13} className="mr-1" />详情
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setEditItem({ ...item })}>
                        <Edit size={13} className="mr-1" />编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-500" onClick={() => toggleStatus(item.id)}>
                        {item.status === 'active' ? <><Pause size={13} className="mr-1" />禁用</> : <><Play size={13} className="mr-1" />启用</>}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">暂无匹配的经销商数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>共 <b>{filtered.length}</b> 家经销商</span>
        </div>
      </div>

      {/* ==================== 新增经销商弹窗 ==================== */}
      <Dialog open={showCreate} onOpenChange={v => !v && setShowCreate(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Building2 size={16} className="text-blue-600" />新增经销商
            </DialogTitle>
          </DialogHeader>

          {/* 成功态 */}
          {success ? (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-800">经销商创建成功！</p>
                <p className="text-sm text-slate-500 mt-1">
                  编号 <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{newDealerNo}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">状态为"待审核"，请完成审核后激活账号</p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>关闭</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setSuccess(false); setForm(emptyForm) }}>
                  继续新增
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="经销商全称" required error={errors.name}>
                    <Input placeholder="例：北京华远汽车有限公司" value={form.name}
                      onChange={e => updateForm('name', e.target.value)}
                      className={errors.name ? 'border-red-400' : ''} />
                  </FormField>
                </div>
                <FormField label="经销商简称" required error={errors.shortName}>
                  <Input placeholder="例：北京华远" value={form.shortName}
                    onChange={e => updateForm('shortName', e.target.value)} />
                </FormField>
                <FormField label="联系人" required error={errors.contactPerson}>
                  <Input placeholder="负责人姓名" value={form.contactPerson}
                    onChange={e => updateForm('contactPerson', e.target.value)} />
                </FormField>
                <FormField label="手机号" required error={errors.phone}>
                  <Input placeholder="1开头11位手机号" maxLength={11} value={form.phone}
                    onChange={e => updateForm('phone', e.target.value.replace(/\D/g, ''))} />
                </FormField>
                <FormField label="电子邮箱" required error={errors.email}>
                  <Input placeholder="business@example.com" value={form.email}
                    onChange={e => updateForm('email', e.target.value)} />
                </FormField>
                <div className="col-span-2">
                  <FormField label="营业执照号" required error={errors.licenseNo}>
                    <Input placeholder="18位统一社会信用代码" maxLength={18} value={form.licenseNo}
                      onChange={e => updateForm('licenseNo', e.target.value.toUpperCase())}
                      className={`font-mono ${errors.licenseNo ? 'border-red-400' : ''}`} />
                  </FormField>
                </div>
                <FormField label="所在省份" required error={errors.province}>
                  <Select value={form.province} onValueChange={v => updateForm('province', v)}>
                    <SelectTrigger className={errors.province ? 'border-red-400' : ''}>
                      <SelectValue placeholder="请选择省份" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(provinceCityMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="所在城市" required error={errors.city}>
                  <Select value={form.city} onValueChange={v => updateForm('city', v)} disabled={!form.province}>
                    <SelectTrigger className={errors.city ? 'border-red-400' : ''}>
                      <SelectValue placeholder={form.province ? '请选择城市' : '请先选省份'} />
                    </SelectTrigger>
                    <SelectContent>
                      {(provinceCityMap[form.province] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <div className="col-span-2">
                  <FormField label="详细地址" required error={errors.address}>
                    <Input placeholder="街道、门牌号" value={form.address}
                      onChange={e => updateForm('address', e.target.value)} />
                  </FormField>
                </div>
                <FormField label="入驻有效期" required error={errors.expireTime}>
                  <Input type="date" value={form.expireTime}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={e => updateForm('expireTime', e.target.value)} />
                </FormField>
                <FormField label="初始状态">
                  <Select value={form.status} onValueChange={v => updateForm('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待审核</SelectItem>
                      <SelectItem value="active">直接激活</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <div className="col-span-2">
                  <FormField label="备注（可选）">
                    <Textarea placeholder="补充说明..." rows={2} value={form.remark}
                      onChange={e => updateForm('remark', e.target.value)} className="resize-none text-sm" />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {!success && (
            <DialogFooter className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>取消</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />提交中...</> : '确认新增'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== 编辑弹窗 ==================== */}
      <Dialog open={!!editItem} onOpenChange={v => !v && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit size={15} className="text-blue-600" />编辑经销商 · {editItem?.name}
            </DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2">
                <Label className="text-sm font-medium">经销商全称 *</Label>
                <Input className="mt-1" value={editItem.name}
                  onChange={e => { setEditItem(p => p ? Object.assign({}, p, { name: e.target.value }) : null); setEditErrors({}) }} />
                {editErrors.name && <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium">联系人 *</Label>
                <Input className="mt-1" value={editItem.contactPerson}
                  onChange={e => setEditItem(p => p ? Object.assign({}, p, { contactPerson: e.target.value }) : null)} />
              </div>
              <div>
                <Label className="text-sm font-medium">手机号 *</Label>
                <Input className="mt-1" value={editItem.phone}
                  onChange={e => setEditItem(p => p ? Object.assign({}, p, { phone: e.target.value.replace(/\D/g, '') }) : null)} />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium">邮箱 *</Label>
                <Input className="mt-1" value={editItem.email}
                  onChange={e => setEditItem(p => p ? Object.assign({}, p, { email: e.target.value }) : null)} />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium">状态</Label>
                <Select value={editItem.status}
                  onValueChange={v => setEditItem(p => p ? Object.assign({}, p, { status: v as DealerStatus }) : null)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium">备注</Label>
                <Textarea className="mt-1 resize-none" rows={2} value={editItem.remark || ''}
                  onChange={e => setEditItem(p => p ? Object.assign({}, p, { remark: e.target.value }) : null)} />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditItem(null)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleEditSave} disabled={editSubmitting}>
              {editSubmitting ? '保存中...' : '保存修改'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== 详情弹窗 ==================== */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>经销商详情 · {viewItem?.name}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg">
                <div><span className="text-slate-500">编号：</span><span className="font-mono text-blue-600">{viewItem.dealerNo}</span></div>
                <div><span className="text-slate-500">状态：</span><StatusBadge status={viewItem.status} map={statusMap} /></div>
                <div><span className="text-slate-500">入驻时间：</span>{viewItem.createTime}</div>
                <div className="col-span-2"><span className="text-slate-500">全称：</span>{viewItem.name}</div>
                <div><span className="text-slate-500">简称：</span>{viewItem.shortName}</div>
                <div><span className="text-slate-500">联系人：</span>{viewItem.contactPerson}</div>
                <div><span className="text-slate-500">手机：</span>{viewItem.phone}</div>
                <div><span className="text-slate-500">邮箱：</span>{viewItem.email}</div>
                <div className="col-span-2"><span className="text-slate-500">地址：</span>{viewItem.province} {viewItem.city} {viewItem.address}</div>
                <div><span className="text-slate-500">营业执照：</span><span className="font-mono text-xs">{viewItem.licenseNo}</span></div>
                <div><span className="text-slate-500">到期时间：</span>{viewItem.expireTime}</div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 bg-white border border-slate-200 rounded-lg">
                <div className="text-center"><div className="text-2xl font-bold text-blue-600">{viewItem.totalAuctions}</div><div className="text-xs text-slate-500 mt-1">总拍卖场次</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-green-600">{viewItem.successAuctions}</div><div className="text-xs text-slate-500 mt-1">成交场次</div></div>
                <div className="text-center">
                  <button onClick={() => setAccountDealer(viewItem)} className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    {viewItem.accountCount}
                  </button>
                  <div className="text-xs text-slate-500 mt-1">子账号数（点击管理）</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== 账号管理弹窗 ==================== */}
      {accountDealer && <AccountDialog dealer={accountDealer} onClose={() => setAccountDealer(null)} />}
    </div>
  )
}
