import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Phone, CreditCard, LogOut, ChevronRight, ExternalLink, RefreshCw } from 'lucide-react';
import { getCurrentUser, logout, subscribe, getApplications } from '../lib/store';
import { toast } from 'sonner';

// 检测管理登录状态
const DETECTION_LOGIN_KEY = 'detection_login_time';
const DETECTION_LOGIN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30天

export function Profile() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const currentUser = getCurrentUser();
  
  // 计算统计数据
  const allApps = getApplications();
  const totalCount = allApps.length;
  const soldCount = allApps.filter(a => a.status === 'sold').length;
  const dealRate = totalCount > 0 ? Math.round((soldCount / totalCount) * 100) : 0;

  // 处理退出登录
  const handleLogout = () => {
    if (confirm('确定退出登录？')) {
      logout();
      toast.success('已退出登录');
      navigate('/login', { replace: true });
    }
  };

  // 处理检测管理
  const handleDetection = () => {
    const lastLogin = localStorage.getItem(DETECTION_LOGIN_KEY);
    const now = Date.now();
    
    if (lastLogin && (now - parseInt(lastLogin)) < DETECTION_LOGIN_EXPIRY) {
      // 30天内不需要重新登录，直接跳转
      const daysLeft = Math.ceil((DETECTION_LOGIN_EXPIRY - (now - parseInt(lastLogin))) / (24 * 60 * 60 * 1000));
      toast.success(`登录有效，剩余 ${daysLeft} 天`);
      window.open('https://detection.example.com', '_blank');
    } else {
      // 需要重新登录，模拟输入账号
      const account = prompt('请输入检测管理账号：');
      if (account) {
        localStorage.setItem(DETECTION_LOGIN_KEY, String(now));
        toast.success('登录成功，有效期30天');
        window.open('https://detection.example.com', '_blank');
      }
    }
  };

  return (
    <div className="pb-[80px]">
      {/* Profile Header */}
      <div className="text-white px-4 pt-10 pb-[60px]" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A3D 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-[28px] shrink-0">
            {currentUser?.name?.charAt(0) || '用'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[20px] font-semibold mb-1">{currentUser?.name || '未登录'}</div>
            <div className="text-[13px] opacity-80 flex items-center gap-2">
              <Phone size={12} />
              <span>{currentUser?.phone || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="flex bg-white -mt-10 mx-4 rounded-xl px-5 py-5 shadow-lg relative z-10">
        <div className="flex-1 text-center border-r border-[#E5E5E5]">
          <div className="text-[22px] font-bold text-[#1F2937]">{totalCount}</div>
          <div className="text-[12px] text-[#6B7280] mt-1">发拍总数</div>
        </div>
        <div className="flex-1 text-center border-r border-[#E5E5E5]">
          <div className="text-[22px] font-bold text-[#10B981]">{soldCount}</div>
          <div className="text-[12px] text-[#6B7280] mt-1">成交数量</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-[22px] font-bold text-[#FF6B00]">{dealRate}%</div>
          <div className="text-[12px] text-[#6B7280] mt-1">成交率</div>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-4 bg-white">
        <div className="text-[13px] text-[#9CA3AF] px-4 pt-4 pb-2">账号信息</div>
        <div className="flex items-center px-4 py-3.5 border-b border-[#F3F4F6]">
          <User size={18} className="text-[#6B7280] mr-3 shrink-0" />
          <span className="text-[14px] text-[#6B7280] shrink-0">账号ID</span>
          <span className="flex-1 text-right text-[14px] text-[#1F2937] ml-4">{currentUser?.id || '-'}</span>
        </div>
        <div className="flex items-center px-4 py-3.5">
          <Phone size={18} className="text-[#6B7280] mr-3 shrink-0" />
          <span className="text-[14px] text-[#6B7280] shrink-0">手机号</span>
          <span className="flex-1 text-right text-[14px] text-[#1F2937] ml-4">{currentUser?.phone || '-'}</span>
        </div>
      </div>

      {/* Function Entry */}
      <div className="mt-4 bg-white">
        <div className="text-[13px] text-[#9CA3AF] px-4 pt-4 pb-2">功能入口</div>
        
        <div 
          className="flex items-center px-4 py-3.5 cursor-pointer active:bg-[#F9FAFB] transition-colors"
          onClick={handleDetection}
        >
          <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center mr-3 shrink-0">
            <ExternalLink size={18} className="text-[#0284C7]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] text-[#1F2937]">检测管理</div>
            <div className="text-[12px] text-[#9CA3AF]">查看车辆检测报告</div>
          </div>
          <ChevronRight size={16} className="text-[#9CA3AF] shrink-0" />
        </div>

        <div 
          className="flex items-center px-4 py-3.5 cursor-pointer active:bg-[#F9FAFB] transition-colors"
          onClick={() => toast.info('功能开发中')}
        >
          <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center mr-3 shrink-0">
            <CreditCard size={18} className="text-[#D97706]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] text-[#1F2937]">财务结算</div>
            <div className="text-[12px] text-[#9CA3AF]">查看结算记录</div>
          </div>
          <ChevronRight size={16} className="text-[#9CA3AF] shrink-0" />
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-6 mx-4">
        <div 
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white rounded-xl cursor-pointer active:bg-[#FEF2F2] transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} className="text-[#EF4444]" />
          <span className="text-[14px] text-[#EF4444] font-medium">退出登录</span>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-[12px] text-[#D1D5DB] mt-6">
        优加发拍 v1.0.0
      </div>
    </div>
  );
}
