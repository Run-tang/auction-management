// ===== 通用类型 =====
export type Status = 'active' | 'inactive' | 'pending' | 'rejected'

// ===== 发拍申请（完整类型） =====
export type { AuctionApply, AuctionApplyStatus, ApplyAuditNode, ApplyImages } from './auctionApply'

// ===== 拍卖订单 =====
export type OrderStatus = 'scheduled' | 'ongoing' | 'sold' | 'unsold' | 'cancelled'

export interface AuctionOrder {
  id: string
  orderNo: string
  applyNo: string
  dealerName: string
  carBrand: string
  carModel: string

  vin: string
  startPrice: number
  finalPrice?: number
  reservePrice: number
  auctionStart: string
  auctionEnd: string
  status: OrderStatus
  buyerName?: string
  bidCount: number
  commission: number
}

// ===== 经销商 =====
export type DealerStatus = 'active' | 'inactive' | 'pending' | 'rejected'
export type DealerLevel = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Dealer {
  id: string
  dealerNo: string
  name: string
  shortName: string
  contactPerson: string
  phone: string
  email: string
  province: string
  city: string
  address: string
  licenseNo: string
  level: DealerLevel
  status: DealerStatus
  createTime: string
  expireTime: string
  balance: number
  deposit: number
  totalAuctions: number
  successAuctions: number
  accountCount: number
  remark?: string
}

export interface DealerAccount {
  id: string
  dealerId: string
  dealerName: string
  username: string
  realName: string
  phone: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  status: 'active' | 'inactive'
  lastLogin?: string
  createTime: string
  permissions: string[]
}

// ===== 系统用户 =====
export type SysRole = 'super_admin' | 'admin' | 'operator' | 'viewer'

export interface SysUser {
  id: string
  username: string
  realName: string
  phone: string
  email: string
  role: SysRole
  department: string
  status: 'active' | 'inactive'
  lastLogin?: string
  createTime: string
}

// ===== 角色权限 =====
export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId?: string
  path?: string
  icon?: string
  sort: number
  children?: Permission[]
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  userCount: number
  createTime: string
  status: 'active' | 'inactive'
}

// ===== 系统账号 =====
export type AccountType = 'system_admin' | 'group' | 'store'
export type AccountStatus = 'active' | 'inactive'

export const ACCOUNT_TYPE_MAP: Record<AccountType, { label: string; color: string }> = {
  system_admin: { label: '系统管理员', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  group: { label: '集团账号', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  store: { label: '门店账号', color: 'text-green-600 bg-green-50 border-green-200' },
}

export const ACCOUNT_STATUS_MAP: Record<AccountStatus, { label: string; color: string }> = {
  active: { label: '正常', color: 'text-green-600 bg-green-50 border-green-200' },
  inactive: { label: '停用', color: 'text-gray-500 bg-gray-50 border-gray-200' },
}

export interface Account {
  id: string                  // 账号ID，如 U20231024001
  phone: string               // 手机号码（登录账号）
  realName: string            // 用户姓名
  accountType: AccountType    // 账号类型
  groupName?: string          // 所属集团（门店账号时显示）
  status: AccountStatus       // 账号状态
  createTime: string          // 创建时间
  lastLogin?: string          // 最近登录时间
}
