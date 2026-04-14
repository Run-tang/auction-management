/**
 * 发拍管理后台 - 设计系统主题配置
 * 基于 Data-Dense Dashboard 风格
 */

// ===== 状态颜色配置 =====
export const STATUS_COLORS = {
  draft: {
    label: '草稿',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
  scheduled: {
    label: '待拍卖',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
  },
  auctioning: {
    label: '拍卖中',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
  },
  sold: {
    label: '交易成功',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  unsold: {
    label: '流拍',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
  offshelf: {
    label: '已下架',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
} as const

// ===== 账号类型颜色配置 =====
export const ACCOUNT_TYPE_COLORS = {
  system_admin: {
    label: '系统管理员',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  group: {
    label: '集团账号',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  store: {
    label: '门店账号',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
} as const

// ===== 账号状态颜色配置 =====
export const ACCOUNT_STATUS_COLORS = {
  active: {
    label: '正常',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  inactive: {
    label: '停用',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
} as const

// ===== 主题颜色 =====
export const THEME = {
  primary: {
    DEFAULT: '#2563eb', // blue-600
    hover: '#1d4ed8',   // blue-700
    light: '#dbeafe',   // blue-100
  },
  accent: {
    orange: '#f97316', // orange-500
  },
  success: {
    DEFAULT: '#22c55e', // green-500
    light: '#dcfce7',   // green-100
  },
  warning: {
    DEFAULT: '#f59e0b', // amber-500
    light: '#fef3c7',   // amber-100
  },
  danger: {
    DEFAULT: '#ef4444', // red-500
    light: '#fee2e2',   // red-100
  },
  text: {
    primary: '#1e293b',   // slate-800
    secondary: '#475569', // slate-600
    muted: '#94a3b8',     // slate-400
  },
  border: {
    DEFAULT: '#e2e8f0', // slate-200
  },
} as const

// ===== 间距规范 =====
export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const

// ===== 圆角规范 =====
export const RADIUS = {
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  '2xl': '1rem',  // 16px
} as const

// ===== 过渡动画 =====
export const TRANSITION = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const
