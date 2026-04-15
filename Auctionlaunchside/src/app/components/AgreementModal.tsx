import { useState } from 'react';
import { X } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  type: 'user' | 'privacy';
  onClose: () => void;
}

export function AgreementModal({ isOpen, type, onClose }: AgreementModalProps) {
  if (!isOpen) return null;

  const userAgreement = `
用户注册协议

一、服务条款的确认和接纳
本应用所有权和运营权归广联二手车有限公司（以下简称"本公司"）所有。本公司依照本协议以下条款向用户提供服务，用户在使用本公司提供的服务时，必须遵守以下条款。

二、服务内容
1. 发拍申请提交
2. 发拍进度查询
3. 订单管理
4. 其他本公司不时推出的服务

三、用户注册
1. 用户在使用本服务前需要注册账号
2. 用户应提供真实、准确、完整的注册信息
3. 用户有义务妥善保管账号和密码

四、用户权利与义务
1. 用户有权使用本应用提供的各项服务
2. 用户不得利用本应用从事违法违规活动
3. 用户不得侵害他人合法权益
4. 用户不得干扰本应用的正常运行

五、知识产权
本应用的所有内容，包括但不限于文字、图片、视频、代码等，其知识产权归本公司所有，未经授权不得擅自使用。

六、免责声明
1. 因不可抗力导致的服务中断，本公司不承担责任
2. 用户因自身原因造成的损失，本公司不承担责任
3. 本公司保留随时修改或中断服务的权利

七、协议修改
本公司保留随时修改本协议的权利，修改后的协议一经公布即生效。

八、法律管辖
本协议的解释、执行及争议解决均适用中华人民共和国法律。
  `;

  const privacyPolicy = `
隐私政策

一、信息收集
我们收集您在使用服务时主动提供的信息，包括：
1. 个人身份信息（手机号、姓名等）
2. 车辆信息（VIN、车牌、品牌型号等）
3. 设备信息（设备型号、操作系统等）
4. 位置信息（需获取权限时）

二、信息使用
我们收集的信息用于：
1. 提供核心服务功能
2. 身份验证和安全防护
3. 产品优化和改进
4. 法律合规要求

三、信息共享
未经您同意，我们不会与任何第三方共享您的个人信息，以下情况除外：
1. 法律法规要求
2. 保护我们的权益
3. 紧急情况保护用户安全

四、信息存储
1. 我们按照法律法规要求存储您的信息
2. 您可以联系我们删除您的个人信息
3. 信息超过保存期限后将被删除或匿名化

五、信息安全
我们采用行业标准的安全措施保护您的信息安全，包括：
1. 数据加密传输
2. 访问权限控制
3. 安全审计和监控

六、您的权利
您有权：
1. 访问您的个人信息
2. 更正不准确的信息
3. 删除您的个人信息
4. 撤回同意
5. 投诉和举报

七、未成年人保护
我们非常重视对未成年人信息的保护。如果您是未成年人，请在监护人的陪同下阅读本政策。

八、政策更新
我们可能会不时更新本隐私政策，更新后将在应用内显著位置提醒您。

九、联系我们
如您对本隐私政策有任何疑问，请联系我们：
- 邮箱：privacy@example.com
- 电话：400-xxx-xxxx
  `;

  const content = type === 'user' ? userAgreement : privacyPolicy;
  const title = type === 'user' ? '用户协议' : '隐私政策';

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md max-h-[85vh] rounded-t-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* 协议内容 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-[14px] text-gray-700 leading-6 whitespace-pre-line">
            {content}
          </div>
        </div>

        {/* 关闭按钮 */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full h-11 bg-[#FF6B00] text-white rounded-lg text-[15px] font-medium hover:bg-[#FF5500] active:bg-[#E65000] transition-colors"
          >
            已阅读并关闭
          </button>
        </div>
      </div>
    </div>
  );
}
