import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Car, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'

const MOCK_USERS = [
  { username: '13800138001', password: '123456', name: '陈建国', role: 'admin', dealerId: 'd1', dealerName: '北京华远汽车' },
  { username: '13900139002', password: '123456', name: '李明轩', role: 'admin', dealerId: 'd2', dealerName: '上海骏马汽贸' },
  { username: 'admin', password: 'admin', name: '超级管理员', role: 'super_admin', dealerId: '', dealerName: '平台运营' },
]

interface LoginUser {
  username: string
  name: string
  role: string
  dealerId: string
  dealerName: string
  token: string
}

export function getStoredUser(): LoginUser | null {
  try {
    const raw = sessionStorage.getItem('auction_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logout() {
  sessionStorage.removeItem('auction_user')
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('请输入登录账号'); return }
    if (!password.trim()) { setError('请输入登录密码'); return }

    setLoading(true)
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username.trim() && u.password === password)
      if (!user) {
        setError('账号或密码错误，请重试')
        setLoading(false)
        return
      }
      const loginUser: LoginUser = {
        username: user.username,
        name: user.name,
        role: user.role,
        dealerId: user.dealerId,
        dealerName: user.dealerName,
        token: `tok_${Date.now()}`,
      }
      sessionStorage.setItem('auction_user', JSON.stringify(loginUser))
      setLoading(false)
      navigate(from, { replace: true })
    }, 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Car size={26} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-2xl leading-tight">发拍管理平台</div>
              <div className="text-slate-400 text-sm">Used Car Auction Management</div>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-white text-4xl font-bold leading-snug mb-6">
            让二手车发拍<br />
            <span className="text-blue-400">更高效、更透明</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-16 max-w-md">
            整合经销商资源，优化拍卖流程，全链路数据追踪，助力二手车交易市场数字化升级。
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: '🚗', title: '智能发拍申请', desc: '标准化的车辆信息采集与审核流程' },
              { icon: '⚡', title: '实时拍卖管理', desc: '多维度数据看板，掌控拍卖全局' },
              { icon: '🔐', title: '分级权限体系', desc: '经销商独立账号，数据隔离安全可控' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <span className="text-2xl mt-0.5">{f.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{f.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <div className="text-slate-900 font-bold text-lg leading-tight">发拍管理平台</div>
              <div className="text-slate-400 text-xs">Used Car Auction</div>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-slate-900 font-bold text-2xl">欢迎回来</h2>
              <p className="text-slate-500 text-sm mt-2">请输入您的账号信息登录系统</p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">登录账号</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  placeholder="请输入手机号或用户名"
                  maxLength={20}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">登录密码</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="请输入密码（6-16位）"
                    minLength={6}
                    maxLength={16}
                    className="w-full h-11 px-4 pr-12 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm
                  transition-all shadow-sm shadow-blue-600/20 active:scale-[.98] flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    验证中...
                  </>
                ) : (
                  '登录系统'
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-green-500" /> 演示账号
              </p>
              <div className="space-y-1.5 text-xs text-slate-500 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">账号：</span><span>admin</span><span className="text-slate-400">密码：</span><span>admin</span></div>
                <div className="flex justify-between"><span className="text-slate-400">账号：</span><span>13800138001</span><span className="text-slate-400">密码：</span><span>123456</span></div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            © 2026 发拍管理平台 v2.7 · 二手车拍卖系统
          </p>
        </div>
      </div>
    </div>
  )
}
