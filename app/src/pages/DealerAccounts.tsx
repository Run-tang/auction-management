import { useState } from 'react'
import { PageHeader, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { mockDealerAccounts, mockDealers } from '@/data/mockData'
import type { DealerAccount } from '@/types'
import {
  Search, Plus, Eye, Edit, Key, RefreshCcw, Users, ShieldCheck, Shield, Eye as EyeIcon,
  Building2, UserCheck, UserX, Clock
} from 'lucide-react'

const roleMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  admin: { label: '管理员', className: 'bg-purple-100 text-purple-700', icon: <ShieldCheck size={11} /> },
  operator: { label: '操作员', className: 'bg-blue-100 text-blue-700', icon: <Shield size={11} /> },
  viewer: { label: '查看员', className: 'bg-slate-100 text-slate-600', icon: <EyeIcon size={11} /> },
}

const permLabelMap: Record<string, string> = {
  'apply:create': '提交发拍申请',
  'apply:view': '查看发拍申请',
  'order:view': '查看拍卖订单',
  'account:manage': '账号管理',
}

export default function DealerAccounts() {
  const [data, setData] = useState<DealerAccount[]>(mockDealerAccounts)
  const [search, setSearch] = useState('')
  const [dealerFilter, setDealerFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [viewItem, setViewItem] = useState<DealerAccount | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResetPwdModal, setShowResetPwdModal] = useState<DealerAccount | null>(null)
  const [newAccount, setNewAccount] = useState({ dealerId: '', realName: '', username: '', phone: '', email: '', role: 'operator' })

  const filtered = data.filter(acc => {
    const matchSearch = !search || acc.username.includes(search) || acc.realName.includes(search) || acc.phone.includes(search) || acc.dealerName.includes(search)
    const matchDealer = dealerFilter === 'all' || acc.dealerId === dealerFilter
    const matchRole = roleFilter === 'all' || acc.role === roleFilter
    return matchSearch && matchDealer && matchRole
  })

  function toggleStatus(id: string) {
    setData(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
  }

  function handleCreate() {
    const dealer = mockDealers.find(d => d.id === newAccount.dealerId)
    if (!dealer) return
    const acc: DealerAccount = {
      id: `da${Date.now()}`,
      dealerId: newAccount.dealerId,
      dealerName: dealer.name,
      username: newAccount.username,
      realName: newAccount.realName,
      phone: newAccount.phone,
      email: newAccount.email,
      role: newAccount.role as 'admin' | 'operator' | 'viewer',
      status: 'active',
      createTime: new Date().toISOString().slice(0, 10),
      permissions: newAccount.role === 'admin' ? ['apply:create','apply:view','order:view','account:manage'] : newAccount.role === 'operator' ? ['apply:create','apply:view','order:view'] : ['apply:view','order:view'],
    }
    setData(prev => [...prev, acc])
    setShowCreateModal(false)
    setNewAccount({ dealerId: '', realName: '', username: '', phone: '', email: '', role: 'operator' })
  }

  const activeCount = data.filter(a => a.status === 'active').length
  const adminCount = data.filter(a => a.role === 'admin').length

  return (
    <div>
      <PageHeader title="经销商账号管理" description="管理经销商子账号体系，控制账号权限和状态">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreateModal(true)}>
          <Plus size={15} className="mr-1.5" />新建账号
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users size={18} className="text-blue-600" /></div>
          <div><div className="text-xl font-bold">{data.length}</div><div className="text-xs text-slate-500">总账号数</div></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><UserCheck size={18} className="text-green-600" /></div>
          <div><div className="text-xl font-bold">{activeCount}</div><div className="text-xs text-slate-500">活跃账号</div></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><ShieldCheck size={18} className="text-purple-600" /></div>
          <div><div className="text-xl font-bold">{adminCount}</div><div className="text-xs text-slate-500">管理员账号</div></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Building2 size={18} className="text-amber-600" /></div>
          <div><div className="text-xl font-bold">{new Set(data.map(a => a.dealerId)).size}</div><div className="text-xs text-slate-500">覆盖经销商</div></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="搜索用户名、姓名、手机..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={dealerFilter} onValueChange={setDealerFilter}>
            <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="全部经销商" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部经销商</SelectItem>
              {mockDealers.map(d => <SelectItem key={d.id} value={d.id}>{d.shortName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-28 h-9 text-sm"><SelectValue placeholder="全部角色" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="admin">管理员</SelectItem>
              <SelectItem value="operator">操作员</SelectItem>
              <SelectItem value="viewer">查看员</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearch(''); setDealerFilter('all'); setRoleFilter('all') }}>
            <RefreshCcw size={14} className="mr-1.5" />重置
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-slate-100 bg-slate-50">
                {['账号信息','所属经销商','联系方式','角色','权限','最近登录','状态','操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const roleInfo = roleMap[item.role]
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          item.role === 'admin' ? 'bg-purple-100 text-purple-700' : item.role === 'operator' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.realName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{item.realName}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-700">{item.dealerName}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm">{item.phone}</div>
                      <div className="text-xs text-slate-400">{item.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.className}`}>
                        {roleInfo.icon}{roleInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {item.permissions.map(p => (
                          <span key={p} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {permLabelMap[p] ?? p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {item.lastLogin ? (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={11} />{item.lastLogin}
                        </div>
                      ) : <span className="text-slate-300 text-xs">未登录</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.status === 'active'}
                          onCheckedChange={() => toggleStatus(item.id)}
                          className="scale-75"
                        />
                        <span className={`text-xs ${item.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                          {item.status === 'active' ? '启用' : '禁用'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewItem(item)}>
                          <Eye size={13} className="mr-1" />详情
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-amber-600" onClick={() => setShowResetPwdModal(item)}>
                          <Key size={13} className="mr-1" />重置密码
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>共 <b>{filtered.length}</b> 个账号</span>
          <div className="flex gap-1">
            {[1].map(p => (
              <button key={p} className="w-7 h-7 rounded text-xs font-medium bg-blue-600 text-white">{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>账号详情 · {viewItem?.realName}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${
                  viewItem.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>{viewItem.realName.slice(0,1)}</div>
                <div>
                  <div className="font-semibold text-lg text-slate-800">{viewItem.realName}</div>
                  <div className="text-slate-500 font-mono text-sm">{viewItem.username}</div>
                  <div className="mt-1"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleMap[viewItem.role].className}`}>
                    {roleMap[viewItem.role].icon}{roleMap[viewItem.role].label}
                  </span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg">
                <div><span className="text-slate-400">所属经销商：</span>{viewItem.dealerName}</div>
                <div><span className="text-slate-400">手机：</span>{viewItem.phone}</div>
                <div><span className="text-slate-400">邮箱：</span>{viewItem.email}</div>
                <div><span className="text-slate-400">创建时间：</span>{viewItem.createTime}</div>
                <div><span className="text-slate-400">最近登录：</span>{viewItem.lastLogin ?? '从未'}</div>
                <div><span className="text-slate-400">状态：</span><span className={viewItem.status === 'active' ? 'text-green-600' : 'text-slate-400'}>{viewItem.status === 'active' ? '已启用' : '已禁用'}</span></div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-slate-500 mb-2 font-medium">权限清单</div>
                <div className="flex flex-wrap gap-2">
                  {viewItem.permissions.map(p => (
                    <span key={p} className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">{permLabelMap[p] ?? p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Account Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>新建经销商账号</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">所属经销商 *</label>
              <Select value={newAccount.dealerId} onValueChange={v => setNewAccount(p => ({...p, dealerId: v}))}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="选择经销商" /></SelectTrigger>
                <SelectContent>
                  {mockDealers.filter(d => d.status === 'active').map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">真实姓名 *</label>
                <Input className="h-9 text-sm" value={newAccount.realName} onChange={e => setNewAccount(p => ({...p, realName: e.target.value}))} placeholder="请输入" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">登录账号 *</label>
                <Input className="h-9 text-sm" value={newAccount.username} onChange={e => setNewAccount(p => ({...p, username: e.target.value}))} placeholder="英文+数字" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">手机号 *</label>
                <Input className="h-9 text-sm" value={newAccount.phone} onChange={e => setNewAccount(p => ({...p, phone: e.target.value}))} placeholder="11位手机号" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">邮箱</label>
                <Input className="h-9 text-sm" value={newAccount.email} onChange={e => setNewAccount(p => ({...p, email: e.target.value}))} placeholder="example@mail.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">账号角色 *</label>
              <Select value={newAccount.role} onValueChange={v => setNewAccount(p => ({...p, role: v}))}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员（可管理子账号）</SelectItem>
                  <SelectItem value="operator">操作员（提交申请和查看订单）</SelectItem>
                  <SelectItem value="viewer">查看员（仅查看）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              💡 账号创建后，初始密码将通过短信发送到绑定手机号
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}
              disabled={!newAccount.dealerId || !newAccount.realName || !newAccount.username || !newAccount.phone}>
              创建账号
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={!!showResetPwdModal} onOpenChange={() => setShowResetPwdModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>重置密码</DialogTitle></DialogHeader>
          <div className="py-2 text-sm text-slate-600">
            确认重置 <span className="font-semibold">{showResetPwdModal?.realName}</span> ({showResetPwdModal?.username}) 的登录密码？
            <div className="mt-3 p-3 bg-amber-50 rounded-lg text-amber-700 text-xs">
              ⚠️ 重置后新密码将发送至 {showResetPwdModal?.phone}，该账号需重新登录
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPwdModal(null)}>取消</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setShowResetPwdModal(null)}>确认重置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
