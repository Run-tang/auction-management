import { Outlet, useNavigate, useLocation } from 'react-router';
import { FileText, User } from 'lucide-react';

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isListActive = location.pathname === '/' || location.pathname.startsWith('/detail') || location.pathname.startsWith('/form');
  const isProfileActive = location.pathname === '/profile';
  const showNav = location.pathname === '/' || location.pathname === '/profile';

  return (
    <div className="max-w-[390px] mx-auto bg-[#F5F5F5] min-h-screen relative" style={{ fontFamily: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Outlet />
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white flex justify-around pt-2 pb-6 border-t border-[#E5E5E5] z-[100]">
          <div className="flex flex-col items-center px-8 py-1 cursor-pointer" onClick={() => navigate('/')}>
            <FileText size={24} className={isListActive ? 'text-[#FF6B00]' : 'text-[#6B7280]'} />
            <span className={`text-[11px] ${isListActive ? 'text-[#FF6B00] font-medium' : 'text-[#6B7280]'}`}>发拍管理</span>
          </div>
          <div className="flex flex-col items-center px-8 py-1 cursor-pointer relative" onClick={() => navigate('/profile')}>
            <User size={24} className={isProfileActive ? 'text-[#FF6B00]' : 'text-[#6B7280]'} />
            <span className={`text-[11px] ${isProfileActive ? 'text-[#FF6B00] font-medium' : 'text-[#6B7280]'}`}>我的</span>
          </div>
        </div>
      )}
    </div>
  );
}
