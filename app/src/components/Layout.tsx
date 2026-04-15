import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Car, Building2, Settings, Users, ShieldCheck,
  ChevronDown, ChevronRight, Menu,
  LogOut, User, KeyRound, BarChart3
} from 'lucide-react'
import { THEME } from '@/lib/theme'

interface NavItem {
  label: string
  path?: string
  icon: React.ReactNode
  badge?: number
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: '发拍管理', path: '/applies', icon: <Car size={18} /> },
  { label: '系统管理', icon: <Settings size={18} />, children: [
    { label: '账号列表', path: '/accounts', icon: <Users size={16} /> },
  ]},
]

function NavItemComp({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const [open, setOpen] = useState(() => item.children?.some(c => c.path === location.pathname) ?? false)

  if (item.children) {
    const isChildActive = item.children.some(c => c.path === location.pathname)
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            'hover:bg-white/10 text-slate-300 hover:text-white',
            isChildActive && 'text-white bg-white/10'
          )}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
            {item.children.map(child => (
              <NavItemComp key={child.path} item={child} collapsed={false} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isActive = location.pathname === item.path
  return (
    <Link
      to={item.path!}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
        'hover:bg-white/10 text-slate-300 hover:text-white',
        isActive && 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500'
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  // 获取当前登录用户信息
  const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}')

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  // 修改密码
  const handleChangePassword = () => {
    navigate('/change-password')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'flex-shrink-0 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Car size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm leading-tight">发拍管理</div>
              <div className="text-slate-400 text-xs">二手车拍卖后台</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map(item => (
            <NavItemComp key={item.path ?? item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <><Menu size={16} className="mr-2" /><span className="text-xs">收起</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-slate-800 font-medium">二手车发拍管理系统</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">v2.6.0</span>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 h-9 px-3 hover:bg-slate-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback 
                      className="text-white text-xs font-medium"
                      style={{ backgroundColor: THEME.primary.DEFAULT }}
                    >
                      {currentUser.name ? currentUser.name.slice(0, 1) : '管'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">{currentUser.name || '管理员'}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">
                  <User size={14} className="mr-2 text-slate-500" />个人信息
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={handleChangePassword}>
                  <KeyRound size={14} className="mr-2 text-slate-500" />修改密码
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-red-50" onClick={() => setLogoutConfirmOpen(true)}>
                  <LogOut size={14} className="mr-2" />退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>

      {/* 退出登录确认弹窗 */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-red-100">
              <LogOut size={28} className="text-red-600" />
            </div>
            <DialogTitle className="text-center text-lg">确认退出登录</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-slate-600">
            <p>确定要退出当前账号吗？</p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              确认退出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
