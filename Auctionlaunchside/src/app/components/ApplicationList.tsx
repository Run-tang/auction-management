import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { getApplications, updateApplication, subscribe, STATUS_CONFIG, type VehicleStatus } from '../lib/store';
import type { Application } from '../lib/store';
import { toast } from 'sonner';

// Tab 配置（含待审核）
const TABS: { key: VehicleStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'pending_audit', label: '待审核' },
  { key: 'scheduled', label: '待拍卖' },
  { key: 'auctioning', label: '拍卖中' },
  { key: 'sold', label: '交易成功' },
  { key: 'unsold', label: '流拍' },
  { key: 'offshelf', label: '已下架' },
];

export function ApplicationList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // ★ 支持从 URL ?tab=pending_audit 跳转到指定 Tab
  const initialTab = (searchParams.get('tab') as VehicleStatus | 'all') || 'all';
  const [filter, setFilter] = useState<VehicleStatus | 'all'>(initialTab);
  const [keyword, setKeyword] = useState('');
  const [, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const apps = getApplications();

  const filtered = apps.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      return a.carBrand.toLowerCase().includes(kw) || a.carSeries.toLowerCase().includes(kw) ||
        (a.licensePlate?.toLowerCase() || '').includes(kw) || a.applyNo.toLowerCase().includes(kw);
    }
    return true;
  });

  // 计算统计数据
  const totalCount = apps.length;
  const soldCount = apps.filter(a => a.status === 'sold').length;
  const dealRate = totalCount > 0 ? Math.round((soldCount / totalCount) * 100) : 0;

  // 处理下架
  const [offshelfTarget, setOffshelfTarget] = useState<string | null>(null);
  const handleOffshelf = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOffshelfTarget(id);
  }, []);

  const confirmOffshelf = () => {
    if (offshelfTarget) {
      updateApplication(offshelfTarget, { status: 'offshelf' });
      toast.success('已下架');
      setOffshelfTarget(null);
    }
  };

  // 处理重新发拍（仅用于草稿编辑跳转）
  const handleResubmit = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/form?edit=${id}`);
  }, [navigate]);

  // 重新发拍确认
  const [resubmitTarget, setResubmitTarget] = useState<string | null>(null);
  const confirmResubmit = () => {
    if (resubmitTarget) {
      updateApplication(resubmitTarget, { status: 'ready' });
      toast.success('已重新发拍，状态调整为待发拍');
      setResubmitTarget(null);
    }
  };

  // 渲染操作按钮
  const renderActions = (app: Application) => {
    const btnBase = "px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all whitespace-nowrap flex items-center gap-1";
    
    switch (app.status) {
      case 'draft':
        return (
          <>
            <button className={`${btnBase} bg-[#FF6B00] text-white border border-[#FF6B00]`} onClick={e => { e.stopPropagation(); navigate(`/form?edit=${app.id}`); }}>
              编辑发拍单
            </button>
            <button className={`${btnBase} border border-[#E5E5E5] text-[#6B7280] bg-white`} onClick={e => handleOffshelf(e, app.id)}>
              下架车辆
            </button>
            <button className={`${btnBase} border border-[#E5E5E5] text-[#6B7280] bg-white`} onClick={e => { e.stopPropagation(); navigate(`/detail/${app.id}`); }}>
              查看
            </button>
          </>
        );
      case 'scheduled':
      case 'auctioning':
      case 'sold':
        return (
          <button className={`${btnBase} border border-[#E5E5E5] text-[#6B7280] bg-white`} onClick={e => { e.stopPropagation(); navigate(`/detail/${app.id}`); }}>
            查看
          </button>
        );
      case 'unsold':
      case 'offshelf':
        return (
          <>
            <button className={`${btnBase} bg-[#FF6B00] text-white border border-[#FF6B00]`} onClick={e => { e.stopPropagation(); setResubmitTarget(app.id); }}>
              <RefreshCw size={12} />重新发拍
            </button>
            <button className={`${btnBase} border border-[#E5E5E5] text-[#6B7280] bg-white`} onClick={e => { e.stopPropagation(); navigate(`/detail/${app.id}`); }}>
              查看
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-[100px]" ref={containerRef}>
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-[100] border-b border-[#E5E5E5] relative">
        <div className="text-[18px] font-semibold text-center">发拍管理</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#FF6B00] cursor-pointer" onClick={() => navigate('/form')}>+ 新建</div>
      </div>

      {/* Filter Tabs - 横向滚动 */}
      <div className="flex bg-white px-2 border-b border-[#E5E5E5] overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <div key={tab.key}
            className={`px-3 py-3 text-[13px] whitespace-nowrap cursor-pointer border-b-2 transition-all relative shrink-0 ${
              filter === tab.key 
                ? 'text-[#FF6B00] border-[#FF6B00] font-medium' 
                : 'text-[#6B7280] border-transparent'
            }`}
            onClick={() => setFilter(tab.key)}>
            {tab.label}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="p-3 bg-white">
        <div className="flex items-center bg-[#F5F5F5] rounded-lg px-3 py-2.5">
          <Search size={16} className="text-[#6B7280] mr-2 shrink-0" />
          <input 
            className="flex-1 border-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
            placeholder="搜索车辆品牌/车牌号/申请单号" 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
          />
        </div>
      </div>

      {/* List */}
      <div className="px-3 py-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <EmptyIcon />
            <div className="text-[14px] text-[#6B7280] mb-4">{keyword ? '未找到相关申请' : '暂无发拍申请'}</div>
            {!keyword && (
              <div 
                className="inline-block px-6 py-2.5 bg-[#FF6B00] text-white rounded-full text-[14px] cursor-pointer"
                onClick={() => navigate('/form')}
              >
                + 新增申请
              </div>
            )}
          </div>
        ) : (
          filtered.map(app => {
            const statusConfig = STATUS_CONFIG[app.status];
            return (
              <div key={app.id} 
                className="bg-white rounded-xl p-4 mb-3 shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => navigate(`/detail/${app.id}`)}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[12px] text-[#6B7280] font-mono">{app.applyNo}</span>
                      {app.province && app.city && (
                        <>
                          <span className="text-[#E5E5E5]">·</span>
                          <span className="text-[12px] text-[#9CA3AF]">{app.province} {app.city}</span>
                        </>
                      )}
                    </div>
                    <div className="text-[15px] font-semibold text-[#1F2937] mb-1 truncate">
                      {app.carBrand} {app.carSeries}
                    </div>
                    <div className="text-[13px] text-[#6B7280] flex items-center gap-2">
                      <span>{app.licensePlate || '未上牌'}</span>
                      <span className="text-[#E5E5E5]">|</span>
                      <span>{app.engineCapacity}</span>
                      <span>/</span>
                      <span>{app.transmission}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[12px] font-medium shrink-0 ${statusConfig.cls}`}>
                    {statusConfig.text}
                  </span>
                </div>

                {/* Card Body - 价格和里程 */}
                <div className="flex justify-between py-3 border-t border-b border-[#F3F4F6]">
                  <div className="flex-1 text-center">
                    <div className="text-[11px] text-[#9CA3AF] mb-0.5">保留价</div>
                    <div className={`text-[15px] font-semibold ${app.reservePrice ? 'text-[#FF6B00]' : 'text-[#9CA3AF]'}`}>
                      {app.reservePrice ? `¥${app.reservePrice.toFixed(1)}万` : '待填写'}
                    </div>
                  </div>
                  <div className="w-px bg-[#F3F4F6]" />
                  <div className="flex-1 text-center">
                    <div className="text-[11px] text-[#9CA3AF] mb-0.5">里程</div>
                    <div className="text-[15px] font-semibold text-[#1F2937]">
                      {app.mileage}万公里
                    </div>
                  </div>
                  <div className="w-px bg-[#F3F4F6]" />
                  <div className="flex-1 text-center">
                    <div className="text-[11px] text-[#9CA3AF] mb-0.5">申请时间</div>
                    <div className="text-[12px] text-[#6B7280] truncate">
                      {app.applyTime.slice(5, 10)}
                    </div>
                  </div>
                </div>

                {/* Card Footer - 操作按钮 */}
                <div className="flex justify-end items-center mt-3 gap-2" onClick={e => e.stopPropagation()}>
                  {renderActions(app)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Float Button */}
      <div 
        className="fixed bottom-[90px] w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg cursor-pointer z-50 active:scale-95 transition-transform"
        style={{ right: 'calc(50% - 195px + 16px)' }}
        onClick={() => navigate('/form')}
      >
        <Plus size={24} className="text-white" />
      </div>

      {/* Offshelf Confirmation Modal */}
      {offshelfTarget && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setOffshelfTarget(null)}>
          <div className="bg-white w-[300px] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div className="text-[16px] font-semibold text-[#1F2937] mb-2">确认下架</div>
              <div className="text-[14px] text-[#6B7280]">您正在下架该发拍申请，下架后数据将冻结，是否确认？</div>
            </div>
            <div className="flex border-t border-[#E5E5E5]">
              <button 
                className="flex-1 py-3 text-[14px] text-[#6B7280] border-r border-[#E5E5E5] active:bg-[#F5F5F5]"
                onClick={() => setOffshelfTarget(null)}
              >
                取消
              </button>
              <button 
                className="flex-1 py-3 text-[14px] text-[#DC2626] font-medium active:bg-[#FEE2E2]"
                onClick={confirmOffshelf}
              >
                确认下架
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resubmit Confirmation Modal */}
      {resubmitTarget && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setResubmitTarget(null)}>
          <div className="bg-white w-[300px] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                </svg>
              </div>
              <div className="text-[16px] font-semibold text-[#1F2937] mb-2">确认重新发拍</div>
              <div className="text-[14px] text-[#6B7280]">是否确认重新进行上拍？发拍单将调整为待发拍状态。</div>
            </div>
            <div className="flex border-t border-[#E5E5E5]">
              <button 
                className="flex-1 py-3 text-[14px] text-[#6B7280] border-r border-[#E5E5E5] active:bg-[#F5F5F5]"
                onClick={() => setResubmitTarget(null)}
              >
                取消
              </button>
              <button 
                className="flex-1 py-3 text-[14px] text-[#FF6B00] font-medium active:bg-[#FFF7ED]"
                onClick={confirmResubmit}
              >
                确认重新发拍
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyIcon() {
  return (
    <svg className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
