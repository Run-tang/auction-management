import { mockPermissions } from '@/data/mockData'
import type { Permission } from '@/types'
import { PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const typeMap: Record<string, { label: string; className: string }> = {
  menu: { label: '菜单', className: 'bg-blue-100 text-blue-700' },
  button: { label: '按钮', className: 'bg-green-100 text-green-700' },
  api: { label: 'API', className: 'bg-purple-100 text-purple-700' },
}

function PermRow({ perm, depth = 0 }: { perm: Permission; depth?: number }) {
  const [open, setOpen] = useState(true)
  const hasChildren = perm.children && perm.children.length > 0
  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center gap-1" style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-slate-600">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <span className="w-4 inline-block" />}
            <span className={depth === 0 ? 'font-semibold text-slate-800' : 'text-slate-700'}>{perm.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-slate-500">{perm.code}</td>
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeMap[perm.type].className}`}>{typeMap[perm.type].label}</span>
        </td>
        <td className="px-4 py-3 text-xs text-slate-400">{perm.path ?? '—'}</td>
        <td className="px-4 py-3 text-xs text-slate-400">{perm.sort}</td>
        <td className="px-4 py-3">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">编辑</Button>
          {!hasChildren && <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-600">删除</Button>}
        </td>
      </tr>
      {hasChildren && open && perm.children!.map(child => (
        <PermRow key={child.id} perm={child} depth={depth + 1} />
      ))}
    </>
  )
}

export default function SysPermissions() {
  return (
    <div>
      <PageHeader title="权限管理" description="定义系统权限项，按菜单/按钮/API分类管理">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus size={15} className="mr-1.5" />新增权限</Button>
      </PageHeader>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['权限名称','权限码','类型','路径','排序','操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPermissions.map(perm => <PermRow key={perm.id} perm={perm} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
