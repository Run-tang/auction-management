import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

const logs = [
  { id: 1, user: '张系统', action: '审核通过', module: '发拍申请', target: 'AP2026041302', ip: '192.168.1.10', time: '2026-04-13 11:00:12', result: 'success' },
  { id: 2, user: '超级管理员', action: '新增用户', module: '系统用户', target: 'ops02', ip: '192.168.1.1', time: '2026-04-13 10:35:08', result: 'success' },
  { id: 3, user: '李审核', action: '拒绝申请', module: '发拍申请', target: 'AP2026041303', ip: '192.168.1.22', time: '2026-04-12 16:30:55', result: 'success' },
  { id: 4, user: '陈运营', action: '创建拍卖', module: '拍卖订单', target: 'AO2026041303', ip: '192.168.1.35', time: '2026-04-13 08:50:20', result: 'success' },
  { id: 5, user: '赵查看', action: '导出数据', module: '拍卖订单', target: 'orders_2026-04', ip: '192.168.1.50', time: '2026-04-12 14:20:33', result: 'failed' },
  { id: 6, user: '张系统', action: '禁用账号', module: '经销商账号', target: 'whct_admin', ip: '192.168.1.10', time: '2026-04-11 09:15:00', result: 'success' },
  { id: 7, user: '超级管理员', action: '更新角色权限', module: '角色管理', target: 'operator', ip: '192.168.1.1', time: '2026-04-10 16:40:12', result: 'success' },
  { id: 8, user: '陈运营', action: '登录系统', module: '鉴权', target: '—', ip: '192.168.1.35', time: '2026-04-13 08:00:05', result: 'success' },
]

export default function SysLogs() {
  return (
    <div>
      <PageHeader title="操作日志" description="记录所有后台操作行为，支持审计追溯" />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="搜索操作人/模块..." className="pl-9 h-9 text-sm" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-28 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部结果</SelectItem>
              <SelectItem value="success">成功</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-slate-100 bg-slate-50">
                {['操作人','操作模块','操作行为','操作对象','IP地址','操作时间','结果'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{log.user}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">{log.module}</span></td>
                  <td className="px-4 py-3 text-slate-700">{log.action}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.target}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.result === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.result === 'success' ? '成功' : '失败'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">共 <b>{logs.length}</b> 条记录</div>
      </div>
    </div>
  )
}
