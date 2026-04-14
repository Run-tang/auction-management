import { useState } from 'react'
import { PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { mockRoles } from '@/data/mockData'
import type { Role } from '@/types'
import { Plus, Edit, Users, ShieldCheck, RefreshCcw, Search } from 'lucide-react'

export default function SysRoles() {
  const [data, setData] = useState<Role[]>(mockRoles)
  const [viewItem, setViewItem] = useState<Role | null>(null)

  function toggleStatus(id: string) {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r))
  }

  return (
    <div>
      <PageHeader title="角色管理" description="定义系统角色，为角色分配权限集合">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus size={15} className="mr-1.5" />新建角色</Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {data.map(role => (
          <div key={role.id} className={`bg-white rounded-xl border shadow-sm p-5 ${role.status === 'inactive' ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-blue-300'} transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{role.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{role.code}</div>
                  </div>
                </div>
              </div>
              <Switch checked={role.status === 'active'} onCheckedChange={() => toggleStatus(role.id)} className="scale-75" disabled={role.code === 'super_admin'} />
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{role.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-slate-500">
                <Users size={13} />
                <span>{role.userCount} 个用户</span>
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewItem(role)}>权限配置</Button>
                {role.code !== 'super_admin' && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Edit size={12} className="mr-1" />编辑</Button>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              创建于 {role.createTime}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>权限配置 · {viewItem?.name}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                <p>{viewItem.description}</p>
                <p className="text-xs text-slate-400 mt-1">角色编码：<span className="font-mono">{viewItem.code}</span></p>
              </div>
              {viewItem.code === 'super_admin' ? (
                <div className="p-3 bg-red-50 rounded-lg text-red-700 text-xs">⚠️ 超级管理员拥有所有权限，不可编辑</div>
              ) : (
                <div className="p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
                  当前分配了 <b>{viewItem.permissions.length}</b> 个权限项
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {viewItem.permissions.map(p => (
                      <span key={p} className="bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>关闭</Button>
            {viewItem?.code !== 'super_admin' && <Button className="bg-blue-600 hover:bg-blue-700 text-white">保存配置</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
