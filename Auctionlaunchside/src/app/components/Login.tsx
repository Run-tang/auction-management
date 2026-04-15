import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Check } from 'lucide-react';
import { login } from '../lib/store';
import { toast } from 'sonner';
import { AgreementModal } from './AgreementModal';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 协议勾选状态
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementType, setAgreementType] = useState<'user' | 'privacy'>('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('请输入账号');
      return;
    }

    if (!password.trim()) {
      toast.error('请输入密码');
      return;
    }

    // 协议勾选校验（小程序规范要求）
    if (!agreed) {
      toast.error('请先阅读并同意用户协议和隐私政策');
      return;
    }

    setLoading(true);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = login(username, password);

    setLoading(false);

    if (result.success) {
      toast.success('登录成功');
      navigate('/', { replace: true });
    } else {
      if (result.message.includes('不存在')) {
        toast.error('仅限内部员工使用，请前往申请');
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleWechatLogin = () => {
    // 协议勾选校验（小程序规范要求）
    if (!agreed) {
      toast.error('请先阅读并同意用户协议和隐私政策');
      return;
    }
    
    // 模拟微信小程序登录
    toast.info('正在唤起微信小程序...', { duration: 2000 });
    
    // 模拟获取手机号并验证权限
    setTimeout(() => {
      const mockPhone = '138****8000';
      const hasPermission = true; // 模拟权限判定
      
      if (hasPermission) {
        toast.success(`已获取手机号 ${mockPhone}，正在登录...`);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        toast.error('该手机号暂无权限，请联系管理员');
      }
    }, 2000);
  };

  // 打开协议弹窗
  const openAgreement = (type: 'user' | 'privacy') => {
    setAgreementType(type);
    setShowAgreement(true);
  };

  // 切换协议勾选状态
  const toggleAgreement = () => {
    if (!agreed) {
      // 首次勾选前提示用户阅读协议
      toast.info('请先阅读用户协议和隐私政策', { duration: 1500 });
    }
    setAgreed(!agreed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF8533] to-[#FF6B00] flex flex-col">
      {/* Logo区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 20L24 8L36 20M14 18V38H34V18" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 38V28H28V38" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-white text-[28px] font-semibold mb-2">优加发拍</h1>
        <p className="text-white/80 text-[14px]">欢迎回来，请登录您的账号</p>
      </div>

      {/* 登录表单区域 */}
      <div className="bg-white rounded-t-[24px] px-6 pt-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 账号输入 */}
          <div>
            <label className="block text-[14px] text-[#374151] mb-2">账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入账号"
              className="w-full h-12 px-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[15px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors"
              disabled={loading}
            />
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-[14px] text-[#374151] mb-2">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full h-12 px-4 pr-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[15px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#FF6B00] text-white rounded-lg text-[16px] font-medium mt-6 hover:bg-[#FF5500] active:bg-[#E65000] disabled:bg-[#FFAC7A] disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '登录中...' : '登录'}
          </button>

          {/* 协议勾选区域 */}
          <div className="flex items-start gap-2.5 mt-4 px-1">
            <button
              type="button"
              onClick={toggleAgreement}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                agreed 
                  ? 'bg-[#FF6B00] border-[#FF6B00]' 
                  : 'border-[#D1D5DB] hover:border-[#9CA3AF]'
              }`}
            >
              {agreed && <Check size={12} color="white" strokeWidth={3} />}
            </button>
            <div className="text-[13px] text-[#6B7280] leading-5">
              <span>我已阅读并同意</span>
              <button 
                type="button"
                onClick={() => openAgreement('user')}
                className="text-[#FF6B00] hover:underline"
              >
                《用户协议》
              </button>
              <span>和</span>
              <button 
                type="button"
                onClick={() => openAgreement('privacy')}
                className="text-[#FF6B00] hover:underline"
              >
                《隐私政策》
              </button>
            </div>
          </div>
        </form>

        {/* 分割线 */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="px-4 text-[13px] text-[#9CA3AF]">其他登录方式</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>
          
          {/* 微信登录按钮 */}
          <button
            type="button"
            onClick={handleWechatLogin}
            disabled={loading}
            className="w-full h-12 bg-[#07C160] text-white rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-[#06AD56] active:bg-[#059A47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.526 5.55 3.926 7.227l-.926 2.784 3.537-2.337a11.16 11.16 0 003.463.78c5.523 0 10-4.145 10-9.243S17.523 2 12 2z"/>
            </svg>
            微信小程序一键登录
          </button>
          <div className="text-center text-[12px] text-[#9CA3AF] mt-2">
            使用微信授权登录，自动识别账号权限
          </div>
        </div>

        {/* 测试账号提示 */}
        <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
          <div className="text-[12px] text-[#9CA3AF] space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#D1D5DB]">━━━━</span>
              <span className="text-[#9CA3AF]">测试账号</span>
              <span className="text-[#D1D5DB]">━━━━</span>
            </div>
            <div className="text-[#6B7280]">经销商：dealer001 / 123456</div>
          </div>
        </div>
      </div>

      {/* 用户协议和隐私政策弹窗 */}
      <AgreementModal 
        isOpen={showAgreement}
        type={agreementType}
        onClose={() => setShowAgreement(false)}
      />
    </div>
  );
}
