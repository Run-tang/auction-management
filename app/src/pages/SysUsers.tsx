import { useState } from 'react'
import { PageHeader, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { mockSysUsers } from '@/data/mockData'
import type { SysUser, SysRole } from '@/types'
import {
  Search, Plus, Edit, Key, RefreshCcw, Shield, ShieldCheck, Eye, UserCircle,
  Clock, Building, User
} from 'lucide-react'

const roleMap: Record<SysRole, { label: string; className: string }> = {
  super_admin: { label: '超级管理员', className: 'bg-red-100 text-red-700' },
  admin: { label: '系统管理员', className: 'bg-purple-100 text-purple-700' },
  operator: { label: '运营人员', className: 'bg-blue-100 text-blue-700' },
  viewer: { label: '只读用户', className: 'bg-slate-100 text-slate-600' },
}

export default function SysUsers() {
  const [data, setData] = useState<SysUser[]>(mockSysUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [viewItem, setViewItem] = useState<SysUser | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', realName: '', phone: '', email: '', role: 'operator' as SysRole, department: '' })

  const filtered = data.filter(u => {
    const matchSearch = !search || u.username.includes(search) || u.realName.includes(search) || u.phone.includes(search)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function toggleStatus(id: string) {
    setData(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
  }

  function handleCreate() {
    const u: SysUser = {
      id: `u${Date.now()}`,
      ...newUser,
      status: 'active',
      createTime: new Date().toISOString().slice(0, 10),
    }
    setData(prev => [...prev, u])
    setShowCreate(false)
    setNewUser({ username: '', realName: '', phone: '', email: '', role: 'operator', department: '' })
  }

  return (
    <div>
      <PageHeader title="系统用户管理" description="管理系统后台操作人员账号和角色">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}>
          <Plus size={15} className="mr-1.5" />新建用户
        </Button>
      </PageHeader>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {Object.entries(roleMap).map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xl font-bold">{data.filter(u => u.role === k).length}</div>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${v.className}`}>{v.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="搜索用户名、姓名、手机..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {Object.entries(roleMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearch(''); setRoleFilter('all') }}>
            <RefreshCcw size={14} className="mr-1.5" />重置
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-slate-100 bg-slate-50">
                {['用户信息','部门','联系方式','角色','最近登录','状态','创建时间','操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        item.role === 'super_admin' ? 'bg-red-100 text-red-700' : item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>{item.realName.slice(0,1)}</div>
                      <div>
                        <div className="font-medium text-slate-800">{item.realName}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{item.department}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm">{item.phone}</div>
                    <div className="text-xs text-slate-400">{item.email}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleMap[item.role].className}`}>
                      {roleMap[item.role].label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {item.lastLogin ? (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={11} />{item.lastLogin}
                      </div>
                    ) : <span className="text-slate-300 text-xs">从未</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Switch checked={item.status === 'active'} onCheckedChange={() => toggleStatus(item.id)} className="scale-75" disabled={item.role === 'super_admin'} />
                      <span className={`text-xs ${item.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>{item.status === 'active' ? '启用' : '禁用'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{item.createTime}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewItem(item)}><Eye size={13} className="mr-1" />详情</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-amber-600"><Key size={13} className="mr-1" />重置</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">共 <b>{filtered.length}</b> 个用户</div>
      </div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>用户详情 · {viewItem?.realName}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-slate-50 rounded-lg grid grid-cols-2 gap-3">
                <div><span className="text-slate-400">用户名：</span><span className="font-mono">{viewItem.username}</span></div>
                <div><span className="text-slate-400">姓名：</span>{viewItem.realName}</div>
                <div><span className="text-slate-400">角色：</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleMap[viewItem.role].className}`}>{roleMap[viewItem.role].label}</span></div>
                <div><span className="text-slate-400">部门：</span>{viewItem.department}</div>
                <div><span className="text-slate-400">手机：</span>{viewItem.phone}</div>
                <div><span className="text-slate-400">邮箱：</span>{viewItem.email}</div>
                <div><span className="text-slate-400">最近登录：</span>{viewItem.lastLogin ?? '从未'}</div>
                <div><span className="text-slate-400">创建时间：</span>{viewItem.createTime}</div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>新建系统用户</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-slate-700 block mb-1">登录账号 *</label><Input className="h-9 text-sm" value={newUser.username} onChange={e => setNewUser(p => ({...p, username: e.target.value}))} /></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1">真实姓名 *</label><Input className="h-9 text-sm" value={newUser.realName} onChange={e => setNewUser(p => ({...p, realName: e.target.value}))} /></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1">手机号 *</label><Input className="h-9 text-sm" value={newUser.phone} onChange={e => setNewUser(p => ({...p, phone: e.target.value}))} /></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1">邮箱</label><Input className="h-9 text-sm" value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} /></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1">部门</label><Input className="h-9 text-sm" value={newUser.department} onChange={e => setNewUser(p => ({...p, department: e.target.value}))} /></div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">角色 *</label>
                <Select value={newUser.role} onValueChange={v => setNewUser(p => ({...p, role: v as SysRole}))}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleMap).filter(([k]) => k !== 'super_admin').map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate} disabled={!newUser.username || !newUser.realName || !newUser.phone}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
