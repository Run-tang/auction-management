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
  carYear: number
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
