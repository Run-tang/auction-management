import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { getApplication, updateApplication, subscribe, STATUS_CONFIG, type VehicleStatus } from '../lib/store';
import { toast } from 'sonner';

const PHOTO_LABELS: Record<string, string> = {
  front: '前脸', frontLeft: '左前45°', rearRight: '右后45°', interior: '内饰',
  dashboard: '仪表盘', engine: '发动机舱', trunk: '后备箱',
  defect: '瑕疵', modify_photo: '改装', other: '其他',
};

const TABS = ['基础信息', '车辆详情', '价格设置', '照片'];

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const app = getApplication(id!);
  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
        <div className="text-[#9CA3AF] text-[14px] mb-4">申请不存在或已被删除</div>
        <button 
          className="px-6 py-2.5 bg-[#FF6B00] text-white rounded-full text-[14px] cursor-pointer border-none"
          onClick={() => navigate('/')}
        >
          返回列表
        </button>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[app.status];

  // 处理下架 - 使用原生 ActionSheet
  const handleOffshelf = () => {
    // 弹出确认弹窗
    if (confirm('您正在下架该发拍申请，下架后数据将冻结，是否确认？')) {
      updateApplication(app.id, { status: 'offshelf' });
      toast.success('已下架');
      setTimeout(() => navigate('/'), 1000);
    }
  };

  // 处理重新发拍 - 重新发拍后进入"待拍卖"状态
  const handleResubmit = () => {
    if (confirm('是否确认重新进行上拍？发拍单将调整为待拍卖状态。')) {
      updateApplication(app.id, { status: 'scheduled' });
      toast.success('已重新发拍');
      setTimeout(() => navigate('/'), 1000);
    }
  };

  // 根据状态渲染底部按钮
  const renderFooterButtons = () => {
    const baseBtn = "flex-1 py-3 rounded-xl text-[14px] font-medium border cursor-pointer transition-all";
    
    switch (app.status) {
      case 'draft':
        return (
          <>
            <button className={`${baseBtn} border-[#E5E5E5] text-[#6B7280] bg-white`} onClick={handleOffshelf}>下架车辆</button>
            <button className={`${baseBtn} bg-[#FF6B00] text-white border-[#FF6B00]`} onClick={() => navigate(`/form?edit=${app.id}`)}>编辑发拍单</button>
          </>
        );
      case 'scheduled':
      case 'auctioning':
      case 'sold':
        return null;
      case 'unsold':
      case 'offshelf':
        return (
          <button className={`${baseBtn} bg-[#FF6B00] text-white border-[#FF6B00] w-full`} onClick={handleResubmit}>
            <RefreshCw size={14} className="inline mr-1" />重新发拍
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-[90px]">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-[100] border-b border-[#E5E5E5] relative">
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
        </div>
        <div className="text-[18px] font-semibold text-center">发拍管理</div>
      </div>

      {/* Detail Header */}
      <div className="bg-white p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <div className="text-[17px] font-semibold mb-1 truncate">
              {app.carBrand} {app.carSeries} {app.carModel}
            </div>
            <div className="text-[13px] text-[#6B7280] flex items-center gap-2">
              <span>{app.licensePlate || '未上牌'}</span>
              <span className="text-[#E5E5E5]">|</span>
              <span>{app.engineCapacity}</span>
              <span>/</span>
              <span>{app.transmission}</span>
            </div>
          </div>
          {/* 车辆状态标签 */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium shrink-0 ${statusConfig.cls}`}>
            {statusConfig.text}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-[#E5E5E5] sticky top-[57px] z-[99] overflow-x-auto">
        {TABS.map((t, i) => (
          <div key={t} 
            className={`px-4 py-3 text-[13px] cursor-pointer border-b-2 transition-all shrink-0 ${
              tab === i ? 'text-[#FF6B00] border-[#FF6B00] font-medium' : 'text-[#6B7280] border-transparent'
            }`} 
            onClick={() => setTab(i)}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {/* 基础信息 */}
        {tab === 0 && (
          <div className="bg-white">
            <DetailRow label="申请单号" value={app.applyNo} />
            <DetailRow label="车牌号" value={app.licensePlate || '-'} />
            <DetailRow label="VIN码" value={app.vin || '-'} />
            <DetailRow label="品牌" value={app.carBrand} />
            <DetailRow label="车系" value={app.carSeries} />
            <DetailRow label="车型" value={app.carModel} />
            <DetailRow label="年款" value={app.carYear ? `${app.carYear}款` : '-'} />
            <DetailRow label="排量" value={app.engineCapacity} />
            <DetailRow label="变速箱" value={app.transmission} />
            <DetailRow label="燃料类型" value={app.fuelType || '-'} />
            <DetailRow label="车身颜色" value={app.exteriorColor || '-'} />
            <DetailRow label="内饰颜色" value={app.interiorColor || '-'} />
            <DetailRow label="申请时间" value={app.applyTime} last />
          </div>
        )}

        {/* 车辆详情 */}
        {tab === 1 && (
          <div className="bg-white">
            <DetailRow label="上牌日期" value={app.registrationDate || '-'} />
            <DetailRow label="表显里程" value={`${app.mileage}万公里`} />
            <DetailRow label="过户次数" value={app.transferCount ? `${app.transferCount}次` : '-'} />
            <DetailRow label="车辆性质" value={app.vehicleNature || '-'} last />
          </div>
        )}

        {/* 价格设置 */}
        {tab === 2 && (
          <div className="bg-white">
            <DetailRow label="保留价" value={app.reservePrice ? `${app.reservePrice.toFixed(1)}万元` : '-'} highlight />
            <div className="px-4 py-3 text-[12px] text-[#6B7280] bg-[#F9FAFB]">
              保留价对买家不可见，低于保留价不成交
            </div>
          </div>
        )}

        {/* 照片 */}
        {tab === 3 && (
          <div className="bg-white p-4">
            {(() => {
              const allPhotos = Object.entries(app.images || {})
                .filter(([_, v]) => typeof v === 'string' && v)
                .map(([k, _]) => k);
              const count = allPhotos.length;
              return (
                <>
                  <div className="text-[13px] text-[#6B7280] mb-3">已上传 {count} 张照片</div>
                  {count > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {allPhotos.map(p => (
                        <div key={p} className="aspect-square bg-[#555] rounded-lg flex items-center justify-center text-white text-[12px] relative overflow-hidden">
                          <span className="relative z-10">{PHOTO_LABELS[p] || p}</span>
                          <div className="absolute top-1 right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-[#9CA3AF] py-12">暂无照片</div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white px-4 py-3 flex gap-3 border-t border-[#E5E5E5] z-[100]">
        {renderFooterButtons()}
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight, last }: { label: string; value: string; highlight?: boolean; last?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 min-h-[48px] ${!last ? 'border-b border-[#F3F4F6]' : ''}`}>
      <span className="text-[13px] text-[#6B7280] shrink-0">{label}</span>
      <span className={`text-[13px] font-medium text-right truncate ml-4 ${highlight ? 'text-[#FF6B00]' : 'text-[#1F2937]'}`}>{value}</span>
    </div>
  );
}
