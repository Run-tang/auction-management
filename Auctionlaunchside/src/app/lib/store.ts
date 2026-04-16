// Application data types and store

// 车辆状态枚举（与后台端统一，无审核流程）
export type VehicleStatus = 
  | 'draft'         // 草稿
  | 'scheduled'     // 待拍卖
  | 'auctioning'    // 拍卖中
  | 'sold'          // 交易成功
  | 'unsold'        // 流拍
  | 'offshelf';     // 已下架

// 状态配置
export const STATUS_CONFIG: Record<VehicleStatus, { text: string; cls: string; bgCls: string }> = {
  draft: { text: '草稿', cls: 'bg-[#E5E7EB] text-[#6B7280]', bgCls: 'bg-[#E5E7EB]' },
  scheduled: { text: '待拍卖', cls: 'bg-[#E0E7FF] text-[#4338CA]', bgCls: 'bg-[#E0E7FF]' },
  auctioning: { text: '拍卖中', cls: 'bg-[#FEE2E2] text-[#DC2626]', bgCls: 'bg-[#FEE2E2]' },
  sold: { text: '交易成功', cls: 'bg-[#D1FAE5] text-[#059669]', bgCls: 'bg-[#D1FAE5]' },
  unsold: { text: '流拍', cls: 'bg-[#FEF3C7] text-[#D97706]', bgCls: 'bg-[#FEF3C7]' },
  offshelf: { text: '已下架', cls: 'bg-[#F3F4F6] text-[#6B7280]', bgCls: 'bg-[#F3F4F6]' },
};

// 图片类型（与后台端统一）
export interface ApplyImages {
  front?: string;      // 前脸
  frontLeft?: string; // 左前45°
  rearRight?: string; // 右后45°
  interior?: string;  // 内饰
  dashboard?: string; // 仪表盘
  engine?: string;    // 发动机舱
  trunk?: string;     // 后备箱
  defectImages?: string[];  // 瑕疵照片
  modifiedImages?: string[]; // 改装照片
  otherImages?: string[];   // 其他照片
}

export interface Application {
  id: string;
  applyNo: string;           // 发拍单号
  dealerName?: string;        // 经销商名称
  dealerId?: string;          // 经销商ID
  // 车辆识别信息
  vin: string;                // VIN码
  licensePlate?: string;      // 车牌号
  // 品牌车型（与后台端统一命名）
  carBrand: string;           // 品牌
  carSeries: string;          // 车系
  carModel: string;           // 车型名称
  carYear?: number;           // 年款
  // 车辆配置（与后台端统一命名）
  engineCapacity: string;     // 排量
  transmission: string;       // 变速箱
  fuelType?: string;          // 燃料类型
  exteriorColor?: string;     // 外饰颜色
  interiorColor?: string;     // 内饰颜色
  // 车辆详情（与后台端统一命名）
  mileage: number;            // 表显里程（万公里）
  registrationDate: string;   // 上牌日期
  transferCount?: number;      // 过户次数
  vehicleNature?: string;      // 车辆性质
  // 价格设置
  reservePrice: number | null; // 保留价（万元）
  // 照片（与后台端统一）
  images: ApplyImages;
  // 扩展字段
  province?: string;          // 所在省份
  city?: string;              // 所在城市
  storeName?: string;         // 门店名称
  auctionSessionName?: string; // 起拍场次名称
  auctionStartTime?: string;  // 起拍时间
  auctionCount?: number;      // 拍卖次数
  finalPrice?: number;        // 成交价
  // 状态
  status: VehicleStatus;
  applyTime: string;          // 申请时间
  submitterName?: string;     // 提交人姓名
  submitterPhone?: string;    // 提交人电话
  // 下架来源标记（记录从哪个状态下架的）
  offshelfSource?: 'draft' | 'scheduled';
}

let applications: Application[] = [
  {
    id: '1', applyNo: 'FP20260414001',
    dealerName: '上海ABC二手车', dealerId: 'DLR001',
    vin: 'LBV3Z3C53NC123456',
    licensePlate: '沪A12345',
    carBrand: '宝马', carSeries: '5系', carModel: '2022款 530Li 领先型',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '白色', interiorColor: '黑色',
    mileage: 3.2, registrationDate: '2022-06', transferCount: 0, vehicleNature: '非营运',
    reservePrice: null,
    images: {},
    province: '上海', city: '上海', storeName: 'ABC二手车总店',
    status: 'draft', applyTime: '2026-04-14 10:30',
    submitterName: '张三', submitterPhone: '138****8000'
  },
  {
    id: '2', applyNo: 'FP20260413001',
    dealerName: '上海ABC二手车', dealerId: 'DLR001',
    vin: 'LRH3Z3C58NC234567',
    licensePlate: '沪F66666',
    carBrand: '特斯拉', carSeries: 'Model 3', carModel: '2023款 长续航全轮驱动版',
    engineCapacity: '纯电动', transmission: '自动', fuelType: '电动',
    exteriorColor: '白色', interiorColor: '白色',
    mileage: 0.8, registrationDate: '2023-08', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 20.5,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '上海', city: '上海', storeName: 'ABC二手车总店',
    auctionSessionName: '2026春季拍卖会', auctionStartTime: '2026-04-15 14:00',
    status: 'auctioning', applyTime: '2026-04-13 16:45',
    submitterName: '张三', submitterPhone: '138****8000'
  },
  {
    id: '3', applyNo: 'FP20260412001',
    dealerName: '北京XYZ车行', dealerId: 'DLR002',
    vin: 'WDD3Z3C59NC345678',
    licensePlate: '沪B67890',
    carBrand: '奔驰', carSeries: 'E级', carModel: '2023款 E300L 豪华型',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '黑色', interiorColor: '棕色',
    mileage: 1.8, registrationDate: '2023-03', transferCount: 1, vehicleNature: '非营运',
    reservePrice: 40.0,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '北京', city: '北京', storeName: 'XYZ车行总店',
    auctionSessionName: '2026春季拍卖会', auctionStartTime: '2026-04-10 10:00',
    auctionCount: 1, finalPrice: 43.5,
    status: 'sold', applyTime: '2026-04-12 10:15',
    submitterName: '李四', submitterPhone: '139****9000'
  },
  {
    id: '4', applyNo: 'FP20260411001',
    dealerName: '上海ABC二手车', dealerId: 'DLR001',
    vin: 'LGWE3C50NC456789',
    licensePlate: '沪E55555',
    carBrand: '丰田', carSeries: '凯美瑞', carModel: '2024款 2.5L 混动豪华版',
    engineCapacity: '2.5L', transmission: '自动', fuelType: '混动',
    exteriorColor: '银色', interiorColor: '黑色',
    mileage: 0.5, registrationDate: '2024-01', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 22.0,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '上海', city: '上海', storeName: 'ABC二手车总店',
    auctionSessionName: '2026春季拍卖会', auctionStartTime: '2026-04-16 14:00',
    status: 'scheduled', applyTime: '2026-04-11 09:30',
    submitterName: '张三', submitterPhone: '138****8000'
  },
  {
    id: '5', applyNo: 'FP20260410001',
    dealerName: '北京XYZ车行', dealerId: 'DLR002',
    vin: 'LBV5Z3C51NC567890',
    licensePlate: '沪A77777',
    carBrand: '宝马', carSeries: '3系', carModel: '2022款 325Li M运动套装',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '蓝色', interiorColor: '黑色',
    mileage: 2.5, registrationDate: '2022-08', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 25.0,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '北京', city: '北京', storeName: 'XYZ车行总店',
    auctionSessionName: '2026春季拍卖会', auctionStartTime: '2026-04-08 14:00',
    auctionCount: 1,
    status: 'unsold', applyTime: '2026-04-10 14:00',
    submitterName: '李四', submitterPhone: '139****9000'
  },
  {
    id: '6', applyNo: 'FP20260409001',
    dealerName: '上海ABC二手车', dealerId: 'DLR001',
    vin: 'LAV3Z3C52NC678901',
    licensePlate: '沪B88888',
    carBrand: '奥迪', carSeries: 'Q5L', carModel: '2023款 45TFSI 豪华型',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '灰色', interiorColor: '黑色',
    mileage: 1.5, registrationDate: '2023-06', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 28.0,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '上海', city: '上海', storeName: 'ABC二手车总店',
    status: 'offshelf', applyTime: '2026-04-09 10:00',
    submitterName: '张三', submitterPhone: '138****8000',
    offshelfSource: 'scheduled'  // 来自待拍卖下架
  },
  {
    id: '7', applyNo: 'FP20260408001',
    dealerName: '北京XYZ车行', dealerId: 'DLR002',
    vin: 'LBV6Z3C53NC789012',
    licensePlate: '沪C99999',
    carBrand: '宝马', carSeries: 'X3', carModel: '2023款 xDrive30i 领先型',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '白色', interiorColor: '黑色',
    mileage: 1.2, registrationDate: '2023-05', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 32.0,
    images: {},
    province: '北京', city: '北京', storeName: 'XYZ车行总店',
    status: 'scheduled', applyTime: '2026-04-08 09:00',
    submitterName: '李四', submitterPhone: '139****9000'
  },
  {
    id: '8', applyNo: 'FP20260407001',
    dealerName: '上海ABC二手车', dealerId: 'DLR001',
    vin: 'LJC3Z3C59NC345678',
    licensePlate: '沪D55555',
    carBrand: '奔驰', carSeries: 'GLC', carModel: '2023款 GLC 300 L 4MATIC',
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油',
    exteriorColor: '黑色', interiorColor: '棕色',
    mileage: 2.0, registrationDate: '2023-04', transferCount: 0, vehicleNature: '非营运',
    reservePrice: 38.0,
    images: { front: 'p1', frontLeft: 'p2', rearRight: 'p3', interior: 'p4', dashboard: 'p5', engine: 'p6' },
    province: '上海', city: '上海', storeName: 'ABC二手车总店',
    status: 'offshelf', applyTime: '2026-04-07 10:00',
    submitterName: '张三', submitterPhone: '138****8000',
    offshelfSource: 'draft'  // 来自草稿下架
  },
];

let listeners: (() => void)[] = [];

export function getApplications() { return applications; }

export function getApplication(id: string) { return applications.find(a => a.id === id); }

export function addApplication(app: Application) {
  applications = [app, ...applications];
  notify();
}

export function updateApplication(id: string, data: Partial<Application>) {
  applications = applications.map(a => a.id === id ? { ...a, ...data } : a);
  notify();
}

export function deleteApplication(id: string) {
  applications = applications.filter(a => a.id !== id);
  notify();
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

function notify() { listeners.forEach(fn => fn()); }

// User authentication
export interface User {
  id: string;
  username: string;
  name: string;
  phone?: string;
  role?: 'dealer'; // 角色：仅支持经销商
  permissions?: string[]; // 权限列表
}

const STORAGE_KEY = 'fapai_user';

let currentUser: User | null = null;

// Initialize user from localStorage
const storedUser = localStorage.getItem(STORAGE_KEY);
if (storedUser) {
  try {
    currentUser = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function login(username: string, password: string): { success: boolean; message: string; user?: User } {
  // Mock authentication - 仅支持经销商账号
  const mockAccounts: Record<string, { password: string; user: User }> = {
    'dealer001': {
      password: '123456',
      user: { id: 'D001', username: 'dealer001', name: '张三', phone: '138****8000', role: 'dealer' }
    },
    'dealer002': {
      password: '123456',
      user: { id: 'D002', username: 'dealer002', name: '李四', phone: '139****9000', role: 'dealer' }
    },
  };

  const account = mockAccounts[username];

  if (!account) {
    return { success: false, message: '仅限内部员工使用，请前往申请' };
  }

  if (account.password !== password) {
    return { success: false, message: '密码错误' };
  }

  currentUser = account.user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  notify();

  return { success: true, message: '登录成功', user: account.user };
}

export function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}

// Auction Orders
export interface AuctionOrder {
  id: string;
  applicationId: string; // 关联的发拍申请ID
  applicationInfo: {
    brand: string;
    series: string;
    model: string;
    plateNumber: string;
    mileage: number;
  };
  startPrice: number; // 起拍价
  reservePrice: number; // 保留价
  finalPrice: number; // 成交价
  increment: number; // 加价幅度
  bidCount: number; // 出价次数
  winnerInfo: {
    bidderId: string;
    bidderName: string;
    bidderPhone: string;
    bidderCompany?: string;
  };
  auctionStartTime: string; // 拍卖开始时间
  auctionEndTime: string; // 拍卖结束时间
  dealTime: string; // 成交时间
  status: 'completed' | 'cancelled' | 'pending_payment'; // 已完成、已取消、待支付
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'; // 支付状态
  createTime: string;
}

let auctionOrders: AuctionOrder[] = [
  {
    id: 'AO20260331001',
    applicationId: 'FP20260330002',
    applicationInfo: {
      brand: '奔驰',
      series: 'E级',
      model: '2023款 E300L 豪华型',
      plateNumber: '沪B·67890',
      mileage: 1.8
    },
    startPrice: 38.0,
    reservePrice: 40.0,
    finalPrice: 43.5,
    increment: 1000,
    bidCount: 28,
    winnerInfo: {
      bidderId: 'B10001',
      bidderName: '王经理',
      bidderPhone: '13912345678',
      bidderCompany: '上海XX二手车行'
    },
    auctionStartTime: '2026-03-31 10:00',
    auctionEndTime: '2026-03-31 10:30',
    dealTime: '2026-03-31 10:28:45',
    status: 'completed',
    paymentStatus: 'paid',
    createTime: '2026-03-31 10:28:45'
  },
  {
    id: 'AO20260330001',
    applicationId: 'FP20260329002',
    applicationInfo: {
      brand: '宝马',
      series: '3系',
      model: '2022款 325Li M运动套装',
      plateNumber: '沪C·88888',
      mileage: 2.5
    },
    startPrice: 28.0,
    reservePrice: 30.0,
    finalPrice: 31.8,
    increment: 500,
    bidCount: 45,
    winnerInfo: {
      bidderId: 'B10002',
      bidderName: '张总',
      bidderPhone: '13898765432',
      bidderCompany: '杭州YY汽车'
    },
    auctionStartTime: '2026-03-30 14:00',
    auctionEndTime: '2026-03-30 14:30',
    dealTime: '2026-03-30 14:29:12',
    status: 'completed',
    paymentStatus: 'paid',
    createTime: '2026-03-30 14:29:12'
  },
  {
    id: 'AO20260329001',
    applicationId: 'FP20260328003',
    applicationInfo: {
      brand: '奥迪',
      series: 'Q5L',
      model: '2023款 45TFSI 豪华型',
      plateNumber: '沪D·77777',
      mileage: 1.2
    },
    startPrice: 32.0,
    reservePrice: 34.0,
    finalPrice: 36.2,
    increment: 500,
    bidCount: 38,
    winnerInfo: {
      bidderId: 'B10003',
      bidderName: '李经理',
      bidderPhone: '13756781234',
      bidderCompany: '苏州ZZ车行'
    },
    auctionStartTime: '2026-03-29 15:00',
    auctionEndTime: '2026-03-29 15:30',
    dealTime: '2026-03-29 15:28:33',
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    createTime: '2026-03-29 15:28:33'
  },
];

export function getAuctionOrders() {
  return auctionOrders;
}

export function getAuctionOrder(id: string) {
  return auctionOrders.find(o => o.id === id);
}

export function addAuctionOrder(order: AuctionOrder) {
  auctionOrders = [order, ...auctionOrders];
  notify();
}

export function updateAuctionOrder(id: string, data: Partial<AuctionOrder>) {
  auctionOrders = auctionOrders.map(o => o.id === id ? { ...o, ...data } : o);
  notify();
}

// System Management
export interface AdminAccount {
  id: string;
  username: string;
  name: string;
  role: 'admin';  // 管理员角色
  permissions: string[];
  phone?: string;
  email?: string;
  status: 'active' | 'disabled';
  createTime: string;
  lastLoginTime?: string;
}

export interface DealerAccount {
  id: string;
  username: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  status: 'active' | 'disabled';
  createTime: string;
  applicationCount: number; // 申请数量
  dealCount: number; // 成交数量
}

let adminAccounts: AdminAccount[] = [
  {
    id: 'ADM001',
    username: 'admin',
    name: '超级管理员',
    role: 'admin',
    permissions: ['all'],
    phone: '13800000000',
    email: 'admin@fapai.com',
    status: 'active',
    createTime: '2026-01-01 00:00',
    lastLoginTime: '2026-03-31 09:00'
  },
];

let dealerAccounts: DealerAccount[] = [
  {
    id: 'DLR001',
    username: 'dealer001',
    name: '张三',
    company: '上海ABC二手车',
    phone: '13800138000',
    email: 'zhangsan@abc.com',
    status: 'active',
    createTime: '2026-02-01 10:00',
    applicationCount: 156,
    dealCount: 128
  },
  {
    id: 'DLR002',
    username: 'dealer002',
    name: '李四',
    company: '北京XYZ车行',
    phone: '13900139000',
    status: 'active',
    createTime: '2026-02-10 14:30',
    applicationCount: 89,
    dealCount: 72
  },
];

export function getAdminAccounts() {
  return adminAccounts;
}

export function getDealerAccounts() {
  return dealerAccounts;
}

export function addAdminAccount(account: AdminAccount) {
  adminAccounts = [...adminAccounts, account];
  notify();
}

export function updateAdminAccount(id: string, data: Partial<AdminAccount>) {
  adminAccounts = adminAccounts.map(a => a.id === id ? { ...a, ...data } : a);
  notify();
}

export function addDealerAccount(account: DealerAccount) {
  dealerAccounts = [...dealerAccounts, account];
  notify();
}

export function updateDealerAccount(id: string, data: Partial<DealerAccount>) {
  dealerAccounts = dealerAccounts.map(a => a.id === id ? { ...a, ...data } : a);
  notify();
}
