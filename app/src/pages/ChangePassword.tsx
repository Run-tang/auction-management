import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X, ArrowLeft, CheckCircle2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'

// ===== 状态提示组件 =====
const StatusBadge = ({ type, message }: { type: 'error' | 'success'; message: string }) => {
  const config = {
    error: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', Icon: XCircle },
    success: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', Icon: CheckCircle },
  }
  const { bg, text, border, Icon } = config[type]
  return (
    <div className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg ${bg} ${text} border ${border} animate-in fade-in slide-in-from-top-2`}>
      <Icon size={12} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

// ===== 获取输入框状态类名 =====
const getInputStatusClass = (hasError: boolean, hasSuccess: boolean = false) => {
  if (hasError) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20 ring-2 ring-red-500/10'
  if (hasSuccess) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20 ring-2 ring-green-500/10'
  return ''
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errors, setErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  // 实时校验状态
  const [fieldStatus, setFieldStatus] = useState<{
    oldPassword?: 'success' | 'error'
    newPassword?: 'success' | 'error'
    confirmPassword?: 'success' | 'error'
  }>({})

  // 密码强度验证
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, text: '', color: '' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++

    if (score <= 2) return { level: 1, text: '弱', color: 'bg-red-500' }
    if (score <= 3) return { level: 2, text: '中', color: 'bg-yellow-500' }
    return { level: 3, text: '强', color: 'bg-green-500' }
  }

  const strength = getPasswordStrength(newPassword)

  // 实时校验密码字段
  const validatePasswordField = (value: string, field: 'oldPassword' | 'newPassword' | 'confirmPassword') => {
    if (field === 'oldPassword') {
      if (value.length > 0) {
        setFieldStatus(prev => ({ ...prev, oldPassword: 'success' }))
      }
    }
    if (field === 'newPassword') {
      if (value.length >= 6) {
        setFieldStatus(prev => ({ ...prev, newPassword: 'success' }))
      }
    }
    if (field === 'confirmPassword') {
      if (value === newPassword && value.length > 0) {
        setFieldStatus(prev => ({ ...prev, confirmPassword: 'success' }))
      }
    }
  }

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!oldPassword) {
      newErrors.oldPassword = '请输入原密码'
    }

    if (!newPassword) {
      newErrors.newPassword = '请输入新密码'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = '密码长度至少6位'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认新密码'
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    // 清除登录状态，强制重新登录
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">修改密码</h1>
          <p className="text-sm text-slate-500 mt-0.5">账户安全 · 密码管理</p>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto bg-slate-50 p-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-medium text-slate-800">修改登录密码</h2>
              <p className="text-sm text-slate-500 mt-1">为保障账户安全，请定期更换密码</p>
            </div>

            <div className="p-6 space-y-6">
              {/* 原密码 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="oldPassword" className="text-sm font-medium text-slate-700">
                    原密码 <span className="text-red-500">*</span>
                  </Label>
                  {fieldStatus.oldPassword === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle size={12} />
                      已输入
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOld ? 'text' : 'password'}
                    placeholder="请输入原密码"
                    value={oldPassword}
                    onChange={e => {
                      setOldPassword(e.target.value)
                      setErrors(prev => ({ ...prev, oldPassword: undefined }))
                      validatePasswordField(e.target.value, 'oldPassword')
                    }}
                    className={`h-11 pl-4 pr-12 ${getInputStatusClass(!!errors.oldPassword, fieldStatus.oldPassword === 'success')}`}
                  />
                  {/* 状态图标 */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {errors.oldPassword ? (
                      <XCircle size={16} className="text-red-500" />
                    ) : fieldStatus.oldPassword === 'success' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.oldPassword ? (
                  <StatusBadge type="error" message={errors.oldPassword} />
                ) : null}
              </div>

              {/* 新密码 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                    新密码 <span className="text-red-500">*</span>
                  </Label>
                  {fieldStatus.newPassword === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle size={12} />
                      格式正确
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    placeholder="请输入新密码（6-16位）"
                    value={newPassword}
                    onChange={e => {
                      const val = e.target.value.slice(0, 16)
                      setNewPassword(val)
                      setErrors(prev => ({ ...prev, newPassword: undefined }))
                      if (val.length >= 6) {
                        setFieldStatus(prev => ({ ...prev, newPassword: 'success' }))
                      } else {
                        setFieldStatus(prev => ({ ...prev, newPassword: undefined }))
                      }
                    }}
                    className={`h-11 pl-4 pr-12 ${getInputStatusClass(!!errors.newPassword, fieldStatus.newPassword === 'success')}`}
                  />
                  {/* 状态图标 */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {errors.newPassword ? (
                      <XCircle size={16} className="text-red-500" />
                    ) : fieldStatus.newPassword === 'success' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword ? (
                  <StatusBadge type="error" message={errors.newPassword} />
                ) : null}
                
                {/* 密码强度 */}
                {newPassword && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">密码强度：</span>
                      <div className="flex-1 flex gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.level >= 1 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.level >= 2 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.level >= 3 ? strength.color : 'bg-slate-200'}`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-yellow-500' : 'text-green-500'
                      }`}>{strength.text}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      建议：使用字母、数字和特殊符号的组合
                    </p>
                  </div>
                )}
              </div>

              {/* 确认密码 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    确认新密码 <span className="text-red-500">*</span>
                  </Label>
                  {fieldStatus.confirmPassword === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle size={12} />
                      密码一致
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="请再次输入新密码"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value)
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                      if (e.target.value === newPassword && newPassword.length >= 6) {
                        setFieldStatus(prev => ({ ...prev, confirmPassword: 'success' }))
                      } else {
                        setFieldStatus(prev => ({ ...prev, confirmPassword: undefined }))
                      }
                    }}
                    className={`h-11 pl-4 pr-12 ${getInputStatusClass(!!errors.confirmPassword, fieldStatus.confirmPassword === 'success')}`}
                  />
                  {/* 状态图标 */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {errors.confirmPassword ? (
                      <XCircle size={16} className="text-red-500" />
                    ) : fieldStatus.confirmPassword === 'success' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <StatusBadge type="error" message={errors.confirmPassword} />
                ) : confirmPassword && newPassword && confirmPassword === newPassword && !errors.confirmPassword ? (
                  <StatusBadge type="success" message="两次密码输入一致" />
                ) : null}
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 h-11"
              >
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </span>
                ) : '确认修改'}
              </Button>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">安全提示</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-700">
                  <li className="flex items-center gap-1.5">
                    <Check size={12} />密码长度建议6-16位
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check size={12} />建议使用字母、数字和特殊符号组合
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check size={12} />不要使用与其他网站相同的密码
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check size={12} />定期更换密码可提高账户安全性
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 成功弹窗 */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">密码修改成功</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-slate-600">
            <p>您的登录密码已成功修改</p>
            <p className="text-sm text-slate-400 mt-2">请使用新密码重新登录</p>
          </div>
          <DialogFooter>
            <Button onClick={handleSuccessClose} className="w-full bg-blue-600 hover:bg-blue-700">
              重新登录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
