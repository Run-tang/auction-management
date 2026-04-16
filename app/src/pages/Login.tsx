import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Car, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  // 校验状态：null=未校验, 'error'=错误, 'success'=成功, 'warning'=警告
  const [phoneStatus, setPhoneStatus] = useState<'error' | 'success' | 'warning' | null>(null)
  const [phoneError, setPhoneError] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<'error' | 'success' | null>(null)
  const [passwordError, setPasswordError] = useState('')
  const [globalError, setGlobalError] = useState('')

  // 模拟登录验证
  const mockAccounts = [
    { phone: '13800138001', password: '800138', name: '张三' },
    { phone: '13800138002', password: '800138', name: '李四' },
    { phone: '13800138003', password: '800138', name: '王五' },
  ]

  // 手机号实时校验
  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneStatus(null)
      setPhoneError('')
      return false
    }
    if (value.length < 11) {
      setPhoneStatus('warning')
      setPhoneError('手机号不足11位')
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      setPhoneStatus('error')
      setPhoneError('手机号格式不正确')
      return false
    }
    setPhoneStatus('success')
    setPhoneError('')
    return true
  }

  // 密码实时校验
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordStatus(null)
      setPasswordError('')
      return false
    }
    if (value.length < 6) {
      setPasswordStatus('error')
      setPasswordError('密码至少6位')
      return false
    }
    setPasswordStatus('success')
    setPasswordError('')
    return true
  }

  // 处理登录
  const handleLogin = async () => {
    setGlobalError('')

    // 表单校验
    const phoneValid = validatePhone(phone)
    const passwordValid = validatePassword(password)

    if (!phone || !password) {
      setGlobalError(phone ? '请输入密码' : '请输入手机号')
      return
    }

    if (!phoneValid || !passwordValid) {
      return
    }

    setLoading(true)

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 800))

    // 验证账号密码
    const account = mockAccounts.find(a => a.phone === phone && a.password === password)

    if (account) {
      // 保存登录状态
      localStorage.setItem('admin_token', 'mock_token_' + Date.now())
      localStorage.setItem('admin_user', JSON.stringify({
        phone: account.phone,
        name: account.name,
        loginTime: new Date().toISOString()
      }))
      if (remember) {
        localStorage.setItem('remember_phone', phone)
      }

      navigate('/applies')
    } else {
      setGlobalError('手机号或密码错误')
      setPasswordStatus('error')
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  // 获取输入框状态类名
  const getInputClassName = (status: 'error' | 'success' | 'warning' | null) => {
    const baseClass = 'h-12 pl-4 pr-12 text-base transition-all duration-200'
    if (status === 'error') {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500/20 ring-2 ring-red-500/10`
    }
    if (status === 'success') {
      return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-500/20 ring-2 ring-green-500/10`
    }
    if (status === 'warning') {
      return `${baseClass} border-amber-500 focus:border-amber-500 focus:ring-amber-500/20 ring-2 ring-amber-500/10`
    }
    return `${baseClass}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 动态渐变背景 */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl" />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
      </div>

      {/* 登录卡片 */}
      <div className="relative w-full max-w-md">
        {/* 卡片外发光效果 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[28px] blur opacity-30" />

        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 顶部装饰 - TDesign 风格渐变 */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-8 py-10 text-center relative overflow-hidden">
            {/* 装饰性背景图案 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 border-[40px] border-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-[30px] border-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Car size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">发拍管理后台</h1>
              <p className="text-blue-100 text-sm">二手车拍卖管理系统</p>
            </div>
          </div>

          {/* 表单区域 */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* 手机号 - 带实时校验 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    手机号码
                  </Label>
                  {phoneStatus === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle size={12} />
                      格式正确
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入11位手机号"
                    value={phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 11)
                      setPhone(val)
                      validatePhone(val)
                      setGlobalError('')
                    }}
                    onBlur={() => phone && validatePhone(phone)}
                    onKeyDown={handleKeyDown}
                    className={getInputClassName(phoneStatus)}
                    maxLength={11}
                  />
                  {/* 状态图标 */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {phoneStatus === 'success' && <CheckCircle size={18} className="text-green-500" />}
                    {phoneStatus === 'error' && <XCircle size={18} className="text-red-500" />}
                    {phoneStatus === 'warning' && <AlertCircle size={18} className="text-amber-500" />}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {/* 眼睛图标位置 */}
                  </button>
                </div>
                {/* 错误/警告提示 - TDesign 风格 */}
                {phoneError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>

              {/* 密码 - 带实时校验 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    登录密码
                  </Label>
                  {passwordStatus === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle size={12} />
                      密码可用
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value)
                      validatePassword(e.target.value)
                      setGlobalError('')
                    }}
                    onBlur={() => password && validatePassword(password)}
                    onKeyDown={handleKeyDown}
                    className={getInputClassName(passwordStatus)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              {/* 记住登录 */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(checked) => setRemember(checked as boolean)}
                      className="peer"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">记住手机号</span>
                </label>
              </div>

              {/* 全局错误提示 - 居中醒目展示 */}
              {globalError && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl animate-in fade-in zoom-in-95">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span className="font-medium">{globalError}</span>
                </div>
              )}

              {/* 登录按钮 - TDesign 主按钮风格 */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    登录中...
                  </span>
                ) : (
                  '登录'
                )}
              </Button>
            </div>

            {/* 提示信息 */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                测试账号：13800138001 / 800138
              </p>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <p className="text-center text-slate-400 text-xs mt-6">
          © 2026 发拍管理系统 v2.6.0
        </p>
      </div>
    </div>
  )
}
