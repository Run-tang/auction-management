// ===== 发拍申请状态 =====
export type AuctionApplyStatus = 'draft' | 'ready' | 'scheduled' | 'auctioning' | 'sold' | 'unsold' | 'offshelf'

/** 审核流转记录节点 */
export interface ApplyAuditNode {
  id: string
  operator: string        // 操作人
  action: 'submit' | 'approve' | 'reject' | 'resubmit' | 'offshelf' | 'edit'
  actionLabel: string      // 显示文案
  time: string             // ISO 时间戳
  remark?: string          // 驳回原因
}

/** 完整发拍申请 */
export interface AuctionApply {
  id: string
  applyNo: string
  dealerName: string
  dealerId: string
  // 步骤1 - 基础信息
  vin: string
  licensePlate?: string    // 车牌号
  carBrand: string
  carSeries: string
  carModel: string
  carYear: number
  engineCapacity: string   // 排量
  transmission: string     // 变速箱
  fuelType: string         // 燃料类型
  exteriorColor: string    // 外饰颜色
  interiorColor: string   // 内饰颜色
  // 步骤2 - 登牌信息
  registrationDate: string // 上牌日期 YYYY-MM
  mileage: number          // 表显里程（万公里）
  transferCount: number    // 过户次数
  vehicleNature: string    // 车辆性质
  // 步骤3 - 价格
  reservePrice: number     // 保留价（万元）
  // 步骤4 - 照片
  images: ApplyImages
  // 扩展字段
  province?: string        // 所在省份
  city?: string            // 所在城市
  storeName?: string       // 门店名称
  auctionSessionName?: string // 起拍场次名称
  auctionStartTime?: string // 起拍时间
  auctionCount: number     // 拍卖次数
  finalPrice?: number      // 车款（成交价，仅交易成功时显示）
  // 元信息
  applyTime: string
  updateTime?: string
  status: AuctionApplyStatus
  // 操作人信息
  submitterName?: string   // 提交人姓名
  submitterPhone?: string  // 提交人电话
  // 审核信息（已废弃，仅保留字段）
  reviewer?: string
  reviewTime?: string
  auditTrail: ApplyAuditNode[]
}

export interface ApplyImages {
  front?: string     // 前脸
  frontLeft?: string // 左前45°
  rearRight?: string // 右后45°
  interior?: string  // 内饰
  dashboard?: string // 仪表盘
  engine?: string    // 发动机舱
  trunk?: string     // 后备箱
  defectImages?: string[]  // 瑕疵照片（最多5张）
  modifiedImages?: string[] // 改装照片（最多5张）
  otherImages?: string[]    // 其他照片
}
