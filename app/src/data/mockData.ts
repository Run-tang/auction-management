import type { AuctionApply, AuctionApplyStatus, ApplyAuditNode, AuctionOrder, Dealer, DealerAccount, SysUser, Role, Permission } from '@/types'

// ===== 发拍申请数据 =====
export const mockAuctionApplies: AuctionApply[] = [
  {
    id: '1', applyNo: 'FP20260414001', dealerName: '北京华远汽车', dealerId: 'd1',
    vin: 'LFV2A21K9M3456789', licensePlate: '京A88888',
    carBrand: '奔驰', carSeries: 'C级', carModel: 'C300L 运动版', carYear: 2022,
    engineCapacity: '1.5T', transmission: '自动', fuelType: '汽油', exteriorColor: '石墨灰', interiorColor: '黑色',
    registrationDate: '2022-03', mileage: 2.8, transferCount: 1, vehicleNature: '非营运',
    reservePrice: 28.5,
    province: '北京', city: '北京', storeName: '华远旗舰店',
    auctionSessionName: '第128期精选车源', auctionStartTime: '2026-04-20 10:00',
    auctionCount: 1, finalPrice: undefined,
    images: { front: '/mock/car-front.jpg', frontLeft: '/mock/car-fl.jpg', rearRight: '/mock/car-rr.jpg', interior: '/mock/int.jpg', dashboard: '/mock/dash.jpg', engine: '/mock/eng.jpg', trunk: '/mock/trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-14 09:12:00', updateTime: '2026-04-14 09:12:00',
    status: 'scheduled',
    submitterName: '陈建国', submitterPhone: '13800138001',
    auditTrail: [{ id: 'a1', operator: '陈建国', action: 'submit', actionLabel: '提交发拍', time: '2026-04-14T09:12:00' }]
  },
  {
    id: '2', applyNo: 'FP20260414002', dealerName: '上海骏马汽贸', dealerId: 'd2',
    vin: 'WBAFR41020C123456', licensePlate: '沪B99999',
    carBrand: '宝马', carSeries: '5系', carModel: '525Li 豪华套装', carYear: 2021,
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油', exteriorColor: '矿石白', interiorColor: '棕色',
    registrationDate: '2021-06', mileage: 4.5, transferCount: 0, vehicleNature: '非营运',
    reservePrice: 26.0,
    province: '上海', city: '上海', storeName: '骏马总店',
    auctionSessionName: '第128期精选车源', auctionStartTime: '2026-04-20 14:00',
    auctionCount: 1, finalPrice: undefined,
    images: { front: '/mock/bmw-f.jpg', frontLeft: '/mock/bmw-fl.jpg', rearRight: '/mock/bmw-rr.jpg', interior: '/mock/bmw-int.jpg', dashboard: '/mock/bmw-dash.jpg', engine: '/mock/bmw-eng.jpg', trunk: '/mock/bmw-trunk.jpg', defectImages: ['/mock/bmw-defect1.jpg'], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-13 10:05:00', updateTime: '2026-04-13 10:05:00',
    status: 'auctioning',
    submitterName: '李明轩', submitterPhone: '13900139002',
    auditTrail: [{ id: 'a2-1', operator: '李明轩', action: 'submit', actionLabel: '提交发拍', time: '2026-04-13T10:05:00' }]
  },
  {
    id: '3', applyNo: 'FP20260413001', dealerName: '广州粤宝汽车', dealerId: 'd3',
    vin: 'WAUZZZ4G3MN023456', licensePlate: undefined,
    carBrand: '奥迪', carSeries: 'A6L', carModel: 'A6L 40TFSI 豪华动感型', carYear: 2020,
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油', exteriorColor: '天云灰', interiorColor: '黑色',
    registrationDate: '2020-11', mileage: 6.2, transferCount: 2, vehicleNature: '非营运',
    reservePrice: 22.5,
    province: '广东', city: '广州', storeName: '粤宝天河店',
    auctionSessionName: '第125期', auctionStartTime: '2026-04-10 10:00',
    auctionCount: 1, finalPrice: undefined,
    images: { front: '/mock/a6-f.jpg', frontLeft: '/mock/a6-fl.jpg', rearRight: '/mock/a6-rr.jpg', interior: '/mock/a6-int.jpg', dashboard: '/mock/a6-dash.jpg', engine: '/mock/a6-eng.jpg', trunk: '/mock/a6-trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-12 14:22:00', updateTime: '2026-04-12 14:22:00',
    status: 'unsold',
    submitterName: '王大为', submitterPhone: '13700137003',
    auditTrail: [{ id: 'a3-1', operator: '王大为', action: 'submit', actionLabel: '提交发拍', time: '2026-04-12T14:22:00' }]
  },
  {
    id: '4', applyNo: 'FP20260413002', dealerName: '深圳鹏程二手车', dealerId: 'd4',
    vin: 'JTDBZ3EH7J3456789', licensePlate: '粤B12345',
    carBrand: '丰田', carSeries: '凯美瑞', carModel: '凯美瑞 2.0S 锋尚版', carYear: 2023,
    engineCapacity: '2.0L', transmission: '自动', fuelType: '汽油', exteriorColor: '珍珠白', interiorColor: '米色',
    registrationDate: '2023-01', mileage: 1.2, transferCount: 0, vehicleNature: '非营运',
    reservePrice: 17.0,
    province: '广东', city: '深圳', storeName: '鹏程南山店',
    auctionSessionName: undefined, auctionStartTime: undefined,
    auctionCount: 0, finalPrice: undefined,
    images: { front: '/mock/kmr-f.jpg', frontLeft: '/mock/kmr-fl.jpg', rearRight: '/mock/kmr-rr.jpg', interior: '/mock/kmr-int.jpg', dashboard: '/mock/kmr-dash.jpg', engine: '/mock/kmr-eng.jpg', trunk: '/mock/kmr-trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-13 16:40:00', updateTime: '2026-04-13 16:40:00',
    status: 'draft',
    submitterName: '张志远', submitterPhone: '13600136004',
    auditTrail: [{ id: 'a4-1', operator: '张志远', action: 'submit', actionLabel: '保存草稿', time: '2026-04-13T16:40:00' }]
  },
  {
    id: '5', applyNo: 'FP20260412001', dealerName: '成都蓉城优车', dealerId: 'd5',
    vin: 'JHMCM56557C123890', licensePlate: '川A77777',
    carBrand: '本田', carSeries: '雅阁', carModel: '雅阁 260TURBO 旗舰版', carYear: 2021,
    engineCapacity: '1.5T', transmission: '自动', fuelType: '汽油', exteriorColor: '极夜流影', interiorColor: '黑色',
    registrationDate: '2021-09', mileage: 3.8, transferCount: 1, vehicleNature: '非营运',
    reservePrice: 15.5,
    province: '四川', city: '成都', storeName: '蓉城武侯店',
    auctionSessionName: '第120期', auctionStartTime: '2026-04-08 10:00',
    auctionCount: 1, finalPrice: 168000,
    images: { front: '/mock/yg-f.jpg', frontLeft: '/mock/yg-fl.jpg', rearRight: '/mock/yg-rr.jpg', interior: '/mock/yg-int.jpg', dashboard: '/mock/yg-dash.jpg', engine: '/mock/yg-eng.jpg', trunk: '/mock/yg-trunk.jpg', defectImages: [], modifiedImages: ['/mock/yg-mod1.jpg'], otherImages: [] },
    applyTime: '2026-04-08 09:55:00', updateTime: '2026-04-08 16:30:00',
    status: 'sold',
    submitterName: '刘晓梅', submitterPhone: '13500135005',
    auditTrail: [{ id: 'a5-1', operator: '刘晓梅', action: 'submit', actionLabel: '提交发拍', time: '2026-04-08T09:55:00' }]
  },
  {
    id: '6', applyNo: 'FP20260411001', dealerName: '北京华远汽车', dealerId: 'd1',
    vin: 'LGBV2AE10N3456012', licensePlate: '京A55555',
    carBrand: '大众', carSeries: '帕萨特', carModel: '帕萨特 330TSI 星空精英版', carYear: 2022,
    engineCapacity: '1.4T', transmission: '自动', fuelType: '汽油', exteriorColor: '玄武灰', interiorColor: '米色',
    registrationDate: '2022-07', mileage: 3.1, transferCount: 0, vehicleNature: '非营运',
    reservePrice: 14.8,
    province: '北京', city: '北京', storeName: '华远朝阳店',
    auctionSessionName: undefined, auctionStartTime: undefined,
    auctionCount: 0, finalPrice: undefined,
    images: { front: '/mock/pss-f.jpg', frontLeft: '/mock/pss-fl.jpg', rearRight: '/mock/pss-rr.jpg', interior: '/mock/pss-int.jpg', dashboard: '/mock/pss-dash.jpg', engine: '/mock/pss-eng.jpg', trunk: '/mock/pss-trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-11 13:10:00', updateTime: '2026-04-11 13:10:00',
    status: 'ready',
    submitterName: '赵明达', submitterPhone: '13800138011',
    auditTrail: [{ id: 'a6-1', operator: '赵明达', action: 'submit', actionLabel: '提交发拍', time: '2026-04-11T13:10:00' }]
  },
  {
    id: '7', applyNo: 'FP20260410001', dealerName: '杭州浙商汽车', dealerId: 'd7',
    vin: '5YJ3E1EB7LF012345', licensePlate: '浙A66666',
    carBrand: '特斯拉', carSeries: 'Model 3', carModel: 'Model 3 标准续航后驱升级版', carYear: 2022,
    engineCapacity: '纯电动', transmission: '自动', fuelType: '纯电动', exteriorColor: '纯黑', interiorColor: '黑色',
    registrationDate: '2022-04', mileage: 5.5, transferCount: 1, vehicleNature: '非营运',
    reservePrice: 18.5,
    province: '浙江', city: '杭州', storeName: '浙商西湖店',
    auctionSessionName: '第118期', auctionStartTime: '2026-04-05 10:00',
    auctionCount: 1, finalPrice: undefined,
    images: { front: '/mock/m3-f.jpg', frontLeft: '/mock/m3-fl.jpg', rearRight: '/mock/m3-rr.jpg', interior: '/mock/m3-int.jpg', dashboard: '/mock/m3-dash.jpg', engine: '/mock/m3-eng.jpg', trunk: '/mock/m3-trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-05 10:30:00', updateTime: '2026-04-05 10:30:00',
    status: 'unsold',
    submitterName: '孙文波', submitterPhone: '13300133007',
    auditTrail: [{ id: 'a7-1', operator: '孙文波', action: 'submit', actionLabel: '提交发拍', time: '2026-04-05T10:30:00' }]
  },
  {
    id: '8', applyNo: 'FP20260409001', dealerName: '南京苏宁汽贸', dealerId: 'd8',
    vin: 'LSGMA25E4LF123456', licensePlate: '苏A33333',
    carBrand: '别克', carSeries: 'GL8', carModel: 'GL8 ES陆尊 653T 智慧旗舰型', carYear: 2021,
    engineCapacity: '2.0T', transmission: '自动', fuelType: '汽油', exteriorColor: '珍珠白', interiorColor: '干邑棕',
    registrationDate: '2021-12', mileage: 4.8, transferCount: 0, vehicleNature: '非营运',
    reservePrice: 24.0,
    province: '江苏', city: '南京', storeName: '苏宁鼓楼店',
    auctionSessionName: undefined, auctionStartTime: undefined,
    auctionCount: 0, finalPrice: undefined,
    images: { front: '/mock/gl8-f.jpg', frontLeft: '/mock/gl8-fl.jpg', rearRight: '/mock/gl8-rr.jpg', interior: '/mock/gl8-int.jpg', dashboard: '/mock/gl8-dash.jpg', engine: '/mock/gl8-eng.jpg', trunk: '/mock/gl8-trunk.jpg', defectImages: [], modifiedImages: [], otherImages: [] },
    applyTime: '2026-04-09 15:22:00', updateTime: '2026-04-09 15:22:00',
    status: 'offshelf',
    submitterName: '周建华', submitterPhone: '13200132008',
    auditTrail: [{ id: 'a8-1', operator: '周建华', action: 'submit', actionLabel: '提交发拍', time: '2026-04-09T15:22:00' }, { id: 'a8-2', operator: '周建华', action: 'offshelf', actionLabel: '强制下架', time: '2026-04-10T09:00:00', remark: '车辆已售，自行下架' }]
  },
]

// ===== 拍卖订单数据 =====
export const mockAuctionOrders: AuctionOrder[] = [
  { id: '1', orderNo: 'AO2026041301', applyNo: 'AP2026041302', dealerName: '上海骏马汽贸', carBrand: '宝马', carModel: '5系525Li', carYear: 2021, vin: 'WBAFR41020C123456', startPrice: 250000, finalPrice: 292000, reservePrice: 260000, auctionStart: '2026-04-14 10:00:00', auctionEnd: '2026-04-14 12:00:00', status: 'sold', buyerName: '北京优驾科技', bidCount: 18, commission: 8760 },
  { id: '2', orderNo: 'AO2026041302', applyNo: 'AP2026041305', dealerName: '成都蓉城优车', carBrand: '本田', carModel: '雅阁2.0T', carYear: 2021, vin: 'JHMCM56557C123890', startPrice: 140000, reservePrice: 150000, auctionStart: '2026-04-15 14:00:00', auctionEnd: '2026-04-15 16:00:00', status: 'scheduled', bidCount: 0, commission: 0 },
  { id: '3', orderNo: 'AO2026041303', applyNo: 'AP2026041307', dealerName: '杭州浙商汽车', carBrand: '特斯拉', carModel: 'Model 3', carYear: 2022, vin: '5YJ3E1EB7LF012345', startPrice: 195000, finalPrice: 228000, reservePrice: 200000, auctionStart: '2026-04-13 09:00:00', auctionEnd: '2026-04-13 11:00:00', status: 'ongoing', buyerName: undefined, bidCount: 12, commission: 0 },
  { id: '4', orderNo: 'AO2026041304', applyNo: 'AP2026041001', dealerName: '北京华远汽车', carBrand: '奔驰', carModel: 'E300L', carYear: 2020, vin: 'W1KZF8HB2MA123456', startPrice: 320000, reservePrice: 340000, auctionStart: '2026-04-08 10:00:00', auctionEnd: '2026-04-08 12:00:00', status: 'unsold', bidCount: 5, commission: 0 },
  { id: '5', orderNo: 'AO2026041305', applyNo: 'AP2026040901', dealerName: '广州粤宝汽车', carBrand: '奥迪', carModel: 'Q5L 2.0T', carYear: 2021, vin: 'WAUZZZ80XMD123456', startPrice: 260000, finalPrice: 275000, reservePrice: 250000, auctionStart: '2026-04-09 14:00:00', auctionEnd: '2026-04-09 16:00:00', status: 'sold', buyerName: '上海卓越汽车', bidCount: 9, commission: 8250 },
  { id: '6', orderNo: 'AO2026041306', applyNo: 'AP2026041004', dealerName: '深圳鹏程二手车', carBrand: '丰田', carModel: '汉兰达2.0T', carYear: 2022, vin: 'LGTKB8EH4N3456789', startPrice: 240000, reservePrice: 250000, auctionStart: '2026-04-16 10:00:00', auctionEnd: '2026-04-16 12:00:00', status: 'scheduled', bidCount: 0, commission: 0 },
]

// ===== 经销商数据 =====
export const mockDealers: Dealer[] = [
  { id: 'd1', dealerNo: 'DL2023001', name: '北京华远汽车有限公司', shortName: '北京华远', contactPerson: '陈建国', phone: '13800138001', email: 'bjhy@example.com', province: '北京', city: '北京', address: '朝阳区建国路88号', licenseNo: '91110000MA001234', level: 'gold', status: 'active', createTime: '2023-03-15', expireTime: '2026-03-15', balance: 125000, deposit: 50000, totalAuctions: 128, successAuctions: 98, accountCount: 5 },
  { id: 'd2', dealerNo: 'DL2023002', name: '上海骏马汽贸有限公司', shortName: '上海骏马', contactPerson: '李明轩', phone: '13900139002', email: 'shjm@example.com', province: '上海', city: '上海', address: '浦东新区张江高科技园区', licenseNo: '91310000MA002345', level: 'platinum', status: 'active', createTime: '2023-01-10', expireTime: '2026-01-10', balance: 380000, deposit: 100000, totalAuctions: 256, successAuctions: 228, accountCount: 8 },
  { id: 'd3', dealerNo: 'DL2023003', name: '广州粤宝汽车贸易有限公司', shortName: '广州粤宝', contactPerson: '王大为', phone: '13700137003', email: 'gzyb@example.com', province: '广东', city: '广州', address: '天河区花城大道100号', licenseNo: '91440100MA003456', level: 'silver', status: 'active', createTime: '2023-06-20', expireTime: '2025-06-20', balance: 56000, deposit: 30000, totalAuctions: 88, successAuctions: 65, accountCount: 3 },
  { id: 'd4', dealerNo: 'DL2023004', name: '深圳鹏程二手车交易有限公司', shortName: '深圳鹏程', contactPerson: '张志远', phone: '13600136004', email: 'szpc@example.com', province: '广东', city: '深圳', address: '南山区科技南路10号', licenseNo: '91440300MA004567', level: 'gold', status: 'active', createTime: '2023-04-05', expireTime: '2026-04-05', balance: 210000, deposit: 50000, totalAuctions: 162, successAuctions: 138, accountCount: 6 },
  { id: 'd5', dealerNo: 'DL2024001', name: '成都蓉城优车汽贸有限公司', shortName: '成都蓉城', contactPerson: '刘晓梅', phone: '13500135005', email: 'cdrc@example.com', province: '四川', city: '成都', address: '武侯区人民南路四段99号', licenseNo: '91510100MA005678', level: 'silver', status: 'active', createTime: '2024-01-15', expireTime: '2027-01-15', balance: 88000, deposit: 30000, totalAuctions: 52, successAuctions: 41, accountCount: 4 },
  { id: 'd6', dealerNo: 'DL2023005', name: '武汉楚天汽贸有限公司', shortName: '武汉楚天', contactPerson: '赵明达', phone: '13400134006', email: 'whct@example.com', province: '湖北', city: '武汉', address: '江汉区汉正街200号', licenseNo: '91420100MA006789', level: 'bronze', status: 'inactive', createTime: '2023-09-10', expireTime: '2024-09-10', balance: 12000, deposit: 10000, totalAuctions: 23, successAuctions: 15, accountCount: 2 },
  { id: 'd7', dealerNo: 'DL2024002', name: '杭州浙商汽车服务有限公司', shortName: '杭州浙商', contactPerson: '孙文波', phone: '13300133007', email: 'hzzs@example.com', province: '浙江', city: '杭州', address: '西湖区文三路188号', licenseNo: '91330100MA007890', level: 'gold', status: 'active', createTime: '2024-03-20', expireTime: '2027-03-20', balance: 165000, deposit: 50000, totalAuctions: 76, successAuctions: 65, accountCount: 5 },
  { id: 'd8', dealerNo: 'DL2024003', name: '南京苏宁汽贸有限公司', shortName: '南京苏宁', contactPerson: '周建华', phone: '13200132008', email: 'njsn@example.com', province: '江苏', city: '南京', address: '鼓楼区中山北路10号', licenseNo: '91320100MA008901', level: 'silver', status: 'pending', createTime: '2024-04-01', expireTime: '2027-04-01', balance: 0, deposit: 0, totalAuctions: 0, successAuctions: 0, accountCount: 1 },
]

// ===== 经销商账号数据 =====
export const mockDealerAccounts: DealerAccount[] = [
  { id: 'da1', dealerId: 'd1', dealerName: '北京华远汽车', username: 'bjhy_admin', realName: '陈建国', phone: '13800138001', email: 'admin@bjhy.com', role: 'admin', status: 'active', lastLogin: '2026-04-13 08:30', createTime: '2023-03-15', permissions: ['apply:create','apply:view','order:view','account:manage'] },
  { id: 'da2', dealerId: 'd1', dealerName: '北京华远汽车', username: 'bjhy_op01', realName: '李小红', phone: '13811138011', email: 'op01@bjhy.com', role: 'operator', status: 'active', lastLogin: '2026-04-13 09:00', createTime: '2023-04-01', permissions: ['apply:create','apply:view','order:view'] },
  { id: 'da3', dealerId: 'd2', dealerName: '上海骏马汽贸', username: 'shjm_admin', realName: '李明轩', phone: '13900139002', email: 'admin@shjm.com', role: 'admin', status: 'active', lastLogin: '2026-04-13 07:45', createTime: '2023-01-10', permissions: ['apply:create','apply:view','order:view','account:manage'] },
  { id: 'da4', dealerId: 'd2', dealerName: '上海骏马汽贸', username: 'shjm_op01', realName: '张伟', phone: '13922139022', email: 'op01@shjm.com', role: 'operator', status: 'active', lastLogin: '2026-04-12 18:20', createTime: '2023-02-15', permissions: ['apply:create','apply:view','order:view'] },
  { id: 'da5', dealerId: 'd3', dealerName: '广州粤宝汽车', username: 'gzyb_admin', realName: '王大为', phone: '13700137003', email: 'admin@gzyb.com', role: 'admin', status: 'active', lastLogin: '2026-04-11 10:00', createTime: '2023-06-20', permissions: ['apply:create','apply:view','order:view','account:manage'] },
  { id: 'da6', dealerId: 'd4', dealerName: '深圳鹏程二手车', username: 'szpc_admin', realName: '张志远', phone: '13600136004', email: 'admin@szpc.com', role: 'admin', status: 'active', lastLogin: '2026-04-13 09:30', createTime: '2023-04-05', permissions: ['apply:create','apply:view','order:view','account:manage'] },
  { id: 'da7', dealerId: 'd6', dealerName: '武汉楚天汽贸', username: 'whct_admin', realName: '赵明达', phone: '13400134006', email: 'admin@whct.com', role: 'admin', status: 'inactive', lastLogin: '2025-12-01 14:00', createTime: '2023-09-10', permissions: ['apply:create','apply:view','order:view','account:manage'] },
]

// ===== 系统用户数据 =====
export const mockSysUsers: SysUser[] = [
  { id: 'u1', username: 'superadmin', realName: '超级管理员', phone: '18600000001', email: 'super@auction.com', role: 'super_admin', department: '信息技术部', status: 'active', lastLogin: '2026-04-13 08:00', createTime: '2022-01-01' },
  { id: 'u2', username: 'admin01', realName: '张系统', phone: '18600000002', email: 'admin01@auction.com', role: 'admin', department: '运营管理部', status: 'active', lastLogin: '2026-04-13 09:15', createTime: '2022-06-15' },
  { id: 'u3', username: 'reviewer01', realName: '李审核', phone: '18600000003', email: 'reviewer01@auction.com', role: 'operator', department: '车辆审核部', status: 'active', lastLogin: '2026-04-13 08:45', createTime: '2023-03-01' },
  { id: 'u4', username: 'reviewer02', realName: '王复核', phone: '18600000004', email: 'reviewer02@auction.com', role: 'operator', department: '车辆审核部', status: 'active', lastLogin: '2026-04-12 17:30', createTime: '2023-05-10' },
  { id: 'u5', username: 'ops01', realName: '陈运营', phone: '18600000005', email: 'ops01@auction.com', role: 'operator', department: '拍卖运营部', status: 'active', lastLogin: '2026-04-13 10:00', createTime: '2023-08-20' },
  { id: 'u6', username: 'viewer01', realName: '赵查看', phone: '18600000006', email: 'viewer01@auction.com', role: 'viewer', department: '财务管理部', status: 'inactive', lastLogin: '2026-03-20 14:00', createTime: '2024-01-05' },
]

// ===== 角色数据 =====
export const mockRoles: Role[] = [
  { id: 'r1', name: '超级管理员', code: 'super_admin', description: '拥有所有权限，可管理系统所有配置', permissions: [], userCount: 1, createTime: '2022-01-01', status: 'active' },
  { id: 'r2', name: '系统管理员', code: 'admin', description: '管理用户、角色、权限及系统配置', permissions: ['sys:user','sys:role','sys:permission','dealer:manage'], userCount: 2, createTime: '2022-01-01', status: 'active' },
  { id: 'r3', name: '拍卖运营', code: 'operator', description: '处理发拍申请审核和拍卖订单运营', permissions: ['apply:review','apply:view','order:manage','order:view'], userCount: 3, createTime: '2022-06-01', status: 'active' },
  { id: 'r4', name: '财务查看', code: 'viewer', description: '只读权限，查看订单财务数据', permissions: ['order:view','apply:view'], userCount: 1, createTime: '2023-01-01', status: 'active' },
  { id: 'r5', name: '经销商管理', code: 'dealer_manager', description: '管理经销商账号和资质', permissions: ['dealer:manage','dealer:view'], userCount: 0, createTime: '2024-01-01', status: 'inactive' },
]

// ===== 权限树 =====
export const mockPermissions: Permission[] = [
  { id: 'p1', name: '发拍管理', code: 'apply', type: 'menu', sort: 1, icon: 'Car', children: [
    { id: 'p1-1', name: '申请列表', code: 'apply:view', type: 'menu', parentId: 'p1', path: '/applies', sort: 1 },
    { id: 'p1-2', name: '提交申请', code: 'apply:create', type: 'button', parentId: 'p1', sort: 2 },
    { id: 'p1-3', name: '审核申请', code: 'apply:review', type: 'button', parentId: 'p1', sort: 3 },
    { id: 'p1-4', name: '删除申请', code: 'apply:delete', type: 'button', parentId: 'p1', sort: 4 },
  ]},
  { id: 'p2', name: '拍卖订单', code: 'order', type: 'menu', sort: 2, icon: 'ShoppingCart', children: [
    { id: 'p2-1', name: '订单列表', code: 'order:view', type: 'menu', parentId: 'p2', path: '/orders', sort: 1 },
    { id: 'p2-2', name: '管理订单', code: 'order:manage', type: 'button', parentId: 'p2', sort: 2 },
    { id: 'p2-3', name: '取消订单', code: 'order:cancel', type: 'button', parentId: 'p2', sort: 3 },
  ]},
  { id: 'p3', name: '经销商管理', code: 'dealer', type: 'menu', sort: 3, icon: 'Building2', children: [
    { id: 'p3-1', name: '经销商列表', code: 'dealer:view', type: 'menu', parentId: 'p3', path: '/dealers', sort: 1 },
    { id: 'p3-2', name: '管理经销商', code: 'dealer:manage', type: 'button', parentId: 'p3', sort: 2 },
    { id: 'p3-3', name: '账号管理', code: 'account:manage', type: 'button', parentId: 'p3', sort: 3 },
  ]},
  { id: 'p4', name: '系统管理', code: 'sys', type: 'menu', sort: 4, icon: 'Settings', children: [
    { id: 'p4-1', name: '系统用户', code: 'sys:user', type: 'menu', parentId: 'p4', path: '/sys/users', sort: 1 },
    { id: 'p4-2', name: '角色管理', code: 'sys:role', type: 'menu', parentId: 'p4', path: '/sys/roles', sort: 2 },
    { id: 'p4-3', name: '权限管理', code: 'sys:permission', type: 'menu', parentId: 'p4', path: '/sys/permissions', sort: 3 },
  ]},
]

// ===== 系统账号 =====
import type { Account } from '@/types'

export const mockAccounts: Account[] = [
  { id: 'U20231024001', phone: '13800138001', realName: '张三', accountType: 'system_admin', status: 'active', createTime: '2023-10-24 09:30:00', lastLogin: '2026-04-14 08:00:00' },
  { id: 'U20231024002', phone: '13800138002', realName: '李四', accountType: 'system_admin', status: 'active', createTime: '2023-10-24 10:15:00', lastLogin: '2026-04-13 17:30:00' },
  { id: 'U20231115001', phone: '13900139001', realName: '王五', accountType: 'group', status: 'active', createTime: '2023-11-15 14:20:00', lastLogin: '2026-04-14 09:15:00' },
  { id: 'U20231115002', phone: '13900139002', realName: '赵六', accountType: 'group', status: 'inactive', createTime: '2023-11-15 15:00:00', lastLogin: '2026-03-01 10:00:00' },
  { id: 'U20231201001', phone: '13700137001', realName: '钱七', accountType: 'store', groupName: '华远汽车集团', status: 'active', createTime: '2023-12-01 11:30:00', lastLogin: '2026-04-14 07:45:00' },
  { id: 'U20231201002', phone: '13700137002', realName: '孙八', accountType: 'store', groupName: '华远汽车集团', status: 'active', createTime: '2023-12-01 12:00:00', lastLogin: '2026-04-13 16:00:00' },
  { id: 'U20231215001', phone: '13600136001', realName: '周九', accountType: 'store', groupName: '浙商汽车集团', status: 'active', createTime: '2023-12-15 09:00:00', lastLogin: '2026-04-12 14:30:00' },
  { id: 'U20231215002', phone: '13600136002', realName: '吴十', accountType: 'store', groupName: '浙商汽车集团', status: 'inactive', createTime: '2023-12-15 10:30:00' },
  { id: 'U20240110001', phone: '13500135001', realName: '郑十一', accountType: 'store', groupName: '苏宁汽贸集团', status: 'active', createTime: '2024-01-10 13:45:00', lastLogin: '2026-04-11 11:20:00' },
  { id: 'U20240110002', phone: '13500135002', realName: '冯十二', accountType: 'store', groupName: '苏宁汽贸集团', status: 'active', createTime: '2024-01-10 14:15:00', lastLogin: '2026-04-10 09:00:00' },
  { id: 'U20240220001', phone: '13400134001', realName: '陈十三', accountType: 'group', status: 'active', createTime: '2024-02-20 16:00:00', lastLogin: '2026-04-09 15:45:00' },
  { id: 'U20240220002', phone: '13400134002', realName: '褚十四', accountType: 'store', groupName: '广汇汽车集团', status: 'active', createTime: '2024-02-20 17:30:00', lastLogin: '2026-04-08 10:30:00' },
]
