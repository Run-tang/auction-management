import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Camera, Check, X } from 'lucide-react';
import { addApplication, updateApplication, getApplication } from '../lib/store';
import type { VehicleStatus } from '../lib/store';
import { toast } from 'sonner';

const STEPS = ['基本信息', '车辆详情', '价格设置', '照片上传'];

// 品牌列表
const BRANDS = ['宝马', '奔驰', '奥迪', '保时捷', '丰田', '本田', '大众', '特斯拉', '蔚来', '理想', '比亚迪', '小鹏', '吉利'];
const SERIES_MAP: Record<string, string[]> = {
  '宝马': ['3系', '5系', '7系', 'X3', 'X5'], 
  '奔驰': ['C级', 'E级', 'S级', 'GLC', 'GLE'],
  '奥迪': ['A4L', 'A6L', 'Q5L', 'Q7'], 
  '保时捷': ['Macan', 'Cayenne', 'Panamera'],
  '丰田': ['凯美瑞', '汉兰达', '卡罗拉', '雷克萨斯'], 
  '本田': ['雅阁', 'CR-V', '思域'],
  '大众': ['帕萨特', '迈腾', '途观L'], 
  '特斯拉': ['Model 3', 'Model Y', 'Model S'],
  '蔚来': ['ES6', 'ET5', 'ET7'], 
  '理想': ['L7', 'L8', 'L9'],
  '比亚迪': ['汉', '唐', '宋', '秦'],
  '小鹏': ['P7', 'P5', 'G3'],
  '吉利': ['星瑞', '星越L', '帝豪'],
};
const YEARS = Array.from({ length: 10 }, (_, i) => `${2026 - i}款`);
const FUELS = ['汽油', '柴油', '电动', '混动'];
const COLORS = ['黑色', '白色', '银色', '灰色', '红色', '蓝色', '绿色', '棕色'];
const GEARBOX = ['手动', '自动'];
const NATURE_OPTIONS = ['营运', '非营运'];

// 必拍位置
const REQUIRED_PHOTOS = [
  { key: 'front', label: '前脸' }, 
  { key: 'frontLeft', label: '左前45°' },
  { key: 'rearRight', label: '右后45°' }, 
  { key: 'interior', label: '内饰' },
  { key: 'dashboard', label: '仪表盘' }, 
  { key: 'engine', label: '发动机舱' },
  { key: 'trunk', label: '后备箱' },
];

// 补充照片
const OPTIONAL_PHOTOS = [
  { key: 'defect', label: '瑕疵照片' }, 
  { key: 'modify_photo', label: '改装照片' }, 
  { key: 'other', label: '其他' },
];

interface FormData {
  // 车辆识别
  vin: string;
  licensePlate: string;
  // 品牌车型
  carBrand: string;
  carSeries: string;
  carModel: string;
  carYear: string;
  // 车辆配置
  engineCapacity: string;
  transmission: string;
  fuelType: string;
  exteriorColor: string;
  interiorColor: string;
  // 车辆详情
  registrationDate: string;
  mileage: string;
  transferCount: number;
  vehicleNature: string;
  // 价格设置
  reservePrice: string;
  // 照片
  photos: Record<string, boolean>;
}

const defaultForm: FormData = {
  vin: '', 
  licensePlate: '', 
  carBrand: '', 
  carSeries: '', 
  carModel: '', 
  carYear: '',
  engineCapacity: '', 
  transmission: '自动', 
  fuelType: '汽油', 
  exteriorColor: '', 
  interiorColor: '',
  registrationDate: '', 
  mileage: '', 
  transferCount: 0, 
  vehicleNature: '非营运',
  reservePrice: '',
  photos: {},
};

export function NewApplication() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => {
    if (editId) {
      const app = getApplication(editId);
      if (app) {
        const photosMap: Record<string, boolean> = {};
        Object.keys(app.images || {}).forEach(k => {
          if (app.images[k as keyof typeof app.images]) photosMap[k] = true;
        });
        return {
          ...defaultForm,
          vin: app.vin,
          licensePlate: app.licensePlate || '',
          carBrand: app.carBrand, 
          carSeries: app.carSeries, 
          carModel: app.carModel, 
          carYear: app.carYear ? String(app.carYear) : '',
          engineCapacity: app.engineCapacity, 
          transmission: app.transmission,
          fuelType: app.fuelType || '汽油',
          exteriorColor: app.exteriorColor || '', 
          interiorColor: app.interiorColor || '',
          registrationDate: app.registrationDate, 
          mileage: String(app.mileage),
          transferCount: app.transferCount || 0, 
          vehicleNature: app.vehicleNature || '非营运',
          reservePrice: app.reservePrice ? String(app.reservePrice) : '',
          photos: photosMap,
        };
      }
    }
    return defaultForm;
  });
  const [showPicker, setShowPicker] = useState<{ type: string; options: string[]; field: keyof FormData } | null>(null);
  const [priceError, setPriceError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const set = useCallback((field: keyof FormData, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  }, []);

  // VIN 输入处理
  const handleVinInput = (val: string) => {
    const v = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
    set('vin', v);
    if (v.length === 17) {
      setTimeout(() => {
        setForm(f => ({ 
          ...f, 
          carBrand: '宝马', 
          carSeries: '5系', 
          carModel: '2022款 530Li', 
          carYear: '2022', 
          engineCapacity: '2.0T', 
          transmission: '自动' 
        }));
        toast.success('VIN解析成功');
      }, 500);
    }
  };

  // 校验当前步骤
  const validate = () => {
    switch (step) {
      case 1:
        if (!form.vin) { toast.error('请输入VIN码'); return false; }
        if (form.vin.length !== 17) { toast.error('VIN码必须为17位'); return false; }
        if (!form.carBrand || !form.carSeries || !form.carModel) { toast.error('请选择品牌、车系、车型'); return false; }
        return true;
      case 2:
        if (!form.registrationDate) { toast.error('请选择上牌日期'); return false; }
        if (!form.mileage) { toast.error('请输入表显里程'); return false; }
        return true;
      case 3:
        if (!form.reservePrice) { toast.error('请输入保留价'); return false; }
        return true;
      case 4:
        const cnt = REQUIRED_PHOTOS.filter(p => form.photos[p.key]).length;
        if (cnt < 6) { toast.error('请至少上传6张必拍照片'); return false; }
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  // 提交审核 - 提交后直接进入"待拍卖"状态（已移除待发拍状态）
  const handleSubmit = () => {
    if (submitting) return;
    setSubmitting(true);

    const applyNo = 'FP' + Date.now().toString().slice(-10);
    const app: any = {
      id: editId || String(Date.now()),
      applyNo: editId ? undefined : applyNo,
      vin: form.vin,
      licensePlate: form.licensePlate || undefined,
      carBrand: form.carBrand, 
      carSeries: form.carSeries, 
      carModel: form.carModel,
      carYear: form.carYear ? parseInt(form.carYear) : undefined,
      engineCapacity: form.engineCapacity || '未知',
      transmission: form.transmission || '自动', 
      fuelType: form.fuelType,
      exteriorColor: form.exteriorColor,
      interiorColor: form.interiorColor,
      mileage: parseFloat(form.mileage) || 0,
      registrationDate: form.registrationDate, 
      transferCount: form.transferCount,
      vehicleNature: form.vehicleNature,
      reservePrice: parseFloat(form.reservePrice) || null,
      status: 'scheduled' as VehicleStatus, // 提交后直接进入"待拍卖"状态
      applyTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      images: Object.fromEntries(Object.keys(form.photos).filter(k => form.photos[k]).map(k => [k, k])),
    };
    
    if (editId) { 
      updateApplication(editId, app); 
    } else { 
      addApplication(app); 
    }
    
    toast.success('提交成功');
    // 模拟发送企微消息通知
    setTimeout(() => {
      toast.info('拍卖后台已收到您的发拍申请');
    }, 1000);
    setTimeout(() => navigate('/'), 1500);
  };

  // 保存草稿
  const handleSaveDraft = () => {
    const app: any = {
      id: editId || String(Date.now()),
      applyNo: editId ? undefined : 'FP' + Date.now().toString().slice(-10),
      vin: form.vin,
      licensePlate: form.licensePlate || undefined,
      carBrand: form.carBrand || '未填写', 
      carSeries: form.carSeries || '', 
      carModel: form.carModel || '',
      carYear: form.carYear ? parseInt(form.carYear) : undefined,
      engineCapacity: form.engineCapacity || '',
      transmission: form.transmission || '自动', 
      fuelType: form.fuelType,
      exteriorColor: form.exteriorColor,
      interiorColor: form.interiorColor,
      mileage: parseFloat(form.mileage) || 0,
      registrationDate: form.registrationDate, 
      transferCount: form.transferCount,
      vehicleNature: form.vehicleNature,
      reservePrice: form.reservePrice ? parseFloat(form.reservePrice) : null,
      status: 'draft' as VehicleStatus,
      applyTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      images: Object.fromEntries(Object.keys(form.photos).filter(k => form.photos[k]).map(k => [k, k])),
    };
    
    if (editId) { 
      updateApplication(editId, app); 
    } else { 
      addApplication(app); 
    }
    
    toast.success('草稿已保存');
    setTimeout(() => navigate('/'), 800);
  };

  // 切换照片选中状态
  const togglePhoto = (key: string) => {
    setForm(f => ({ ...f, photos: { ...f.photos, [key]: !f.photos[key] } }));
  };

  const uploadedRequired = REQUIRED_PHOTOS.filter(p => form.photos[p.key]).length;

  // 实时价格校验
  useEffect(() => {
    setPriceError('');
  }, [form.reservePrice]);

  // 选择器选择
  const handlePickerSelect = (opt: string) => {
    if (!showPicker) return;
    const field = showPicker.field;

    if (field === 'brand') {
      setForm(f => ({ ...f, brand: opt, series: '', model: '', displacement: '', gearbox: '自动' }));
    } else if (field === 'series') {
      setForm(f => ({ ...f, series: opt, model: '' }));
    } else {
      set(field, opt);
    }
    setShowPicker(null);
  };

  // 返回
  const handleBack = () => {
    if (form.vin || form.carBrand || form.mileage || form.reservePrice) {
      if (confirm('确定离开？当前填写的内容将保存为草稿')) {
        handleSaveDraft();
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pb-[100px]" ref={scrollRef}>
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-[100] border-b border-[#E5E5E5] relative">
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </div>
        <div className="text-[18px] font-semibold text-center">{editId ? '编辑申请' : '新增申请'}</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#6B7280]">
          {step}/4
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center items-center py-4 bg-white border-b border-[#E5E5E5]">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && <div className={`w-8 h-0.5 mx-0.5 -mt-3.5 transition-all ${i < step ? 'bg-[#10B981]' : 'bg-[#E5E5E5]'}`} />}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium transition-all ${
                i + 1 < step ? 'bg-[#10B981] text-white' : i + 1 === step ? 'bg-[#FF6B00] text-white' : 'bg-[#E5E5E5] text-[#6B7280]'
              }`}>
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <div className={`text-[10px] mt-1.5 transition-all ${i + 1 === step ? 'text-[#FF6B00] font-medium' : 'text-[#6B7280]'}`}>
                {s}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div>
          <Section title="车辆识别">
            <FormRow label="VIN码" required>
              <div className="flex items-center gap-2">
                <input 
                  className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[180px] placeholder:text-[#9CA3AF]"
                  placeholder="请输入17位VIN码" 
                  maxLength={17} 
                  value={form.vin} 
                  onChange={e => handleVinInput(e.target.value)} 
                />
                <div 
                  className="w-9 h-9 bg-[#FFF3E6] rounded-lg flex items-center justify-center text-[#FF6B00] cursor-pointer shrink-0"
                  onClick={() => toast.info('扫描功能在实际设备上使用')}
                >
                  <Camera size={18} />
                </div>
              </div>
            </FormRow>
            <FormRow label="车牌号" last>
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[200px] placeholder:text-[#9CA3AF]"
                placeholder="非必填，7位数" 
                maxLength={7}
                value={form.licensePlate} 
                onChange={e => set('licensePlate', e.target.value)} 
              />
            </FormRow>
          </Section>

          <Section title="品牌车型">
            <PickerRow 
              label="品牌" 
              required 
              value={form.carBrand || '请选择'}
              placeholder={!form.carBrand} 
              onClick={() => setShowPicker({ type: '品牌', options: BRANDS, field: 'carBrand' })} 
            />
            <PickerRow 
              label="车系" 
              required 
              value={form.carSeries || (form.carBrand ? '请选择' : '请先选择品牌')}
              placeholder={!form.carSeries} 
              onClick={() => {
                if (!form.carBrand) { toast.warning('请先选择品牌'); return; }
                setShowPicker({ type: '车系', options: SERIES_MAP[form.carBrand] || [], field: 'carSeries' });
              }} 
            />
            <PickerRow 
              label="车型" 
              required 
              value={form.carModel || (form.carSeries ? '请选择' : '请先选择车系')}
              placeholder={!form.carModel} 
              onClick={() => {
                if (!form.carSeries) { toast.warning('请先选择车系'); return; }
                setShowPicker({ type: '车型', options: [`${new Date().getFullYear()}款 ${form.carSeries}`, `${new Date().getFullYear() - 1}款 ${form.carSeries}`, `${new Date().getFullYear() - 2}款 ${form.carSeries}`], field: 'carModel' });
              }} 
            />
            <PickerRow 
              label="年款" 
              required 
              value={form.carYear || '请选择'} 
              placeholder={!form.carYear} 
              last
              onClick={() => setShowPicker({ type: '年款', options: YEARS, field: 'carYear' })} 
            />
          </Section>

          <Section title="车辆配置">
            <FormRow label="排量">
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[200px] text-[#6B7280] placeholder:text-[#9CA3AF]"
                placeholder="输入排量" 
                maxLength={10}
                value={form.engineCapacity} 
                onChange={e => set('engineCapacity', e.target.value)} 
              />
            </FormRow>
            <PickerRow 
              label="变速箱" 
              value={form.transmission || '请选择'}
              onClick={() => setShowPicker({ type: '变速箱', options: GEARBOX, field: 'transmission' })} 
            />
            <PickerRow 
              label="燃料类型" 
              value={form.fuelType}
              onClick={() => setShowPicker({ type: '燃料类型', options: FUELS, field: 'fuelType' })} 
            />
            <PickerRow 
              label="车身颜色" 
              value={form.exteriorColor || '请选择'} 
              placeholder={!form.exteriorColor}
              onClick={() => setShowPicker({ type: '车身颜色', options: COLORS, field: 'exteriorColor' })} 
            />
            <PickerRow 
              label="内饰颜色" 
              value={form.interiorColor || '请选择'} 
              placeholder={!form.interiorColor} 
              last
              onClick={() => setShowPicker({ type: '内饰颜色', options: COLORS, field: 'interiorColor' })} 
            />
          </Section>
        </div>
      )}

      {/* Step 2: Vehicle Details */}
      {step === 2 && (
        <div>
          <Section title="登记信息">
            <PickerRow 
              label="上牌日期" 
              required 
              value={form.registrationDate || '请选择'} 
              placeholder={!form.registrationDate}
              onClick={() => {
                const months: string[] = [];
                for (let y = 2026; y >= 2000; y--) for (let m = 12; m >= 1; m--) months.push(`${y}-${String(m).padStart(2, '0')}`);
                setShowPicker({ type: '上牌日期', options: months, field: 'registrationDate' });
              }} 
            />
            <FormRow label="表显里程" required>
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[100px] placeholder:text-[#9CA3AF]"
                type="number" 
                step="0.01"
                placeholder="请输入" 
                value={form.mileage} 
                onChange={e => set('mileage', e.target.value)} 
              />
              <span className="text-[14px] text-[#6B7280] ml-1 shrink-0">万公里</span>
            </FormRow>
            <FormRow label="过户次数">
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[80px] placeholder:text-[#9CA3AF]"
                type="number"
                maxLength={1}
                placeholder="0" 
                value={form.transferCount || ''} 
                onChange={e => set('transferCount', parseInt(e.target.value) || 0)} 
              />
              <span className="text-[14px] text-[#6B7280] ml-1 shrink-0">次</span>
            </FormRow>
            <PickerRow 
              label="车辆性质" 
              value={form.vehicleNature}
              last
              onClick={() => setShowPicker({ type: '车辆性质', options: NATURE_OPTIONS, field: 'vehicleNature' })} 
            />
          </Section>
        </div>
      )}

      {/* Step 3: Price Settings */}
      {step === 3 && (
        <div>
          <Section title="拍卖参数">
            <FormRow label="保留价" required>
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-[120px] placeholder:text-[#9CA3AF]"
                type="number" 
                step="0.01"
                placeholder="请输入" 
                value={form.reservePrice}
                onChange={e => set('reservePrice', e.target.value)} 
              />
              <span className="text-[14px] text-[#6B7280] ml-1 shrink-0">万元</span>
            </FormRow>
          </Section>

          {priceError && (
            <div className="text-[12px] text-[#EF4444] px-4 py-2 bg-[#FEE2E2] mx-4 rounded-lg mb-2">{priceError}</div>
          )}

          <div className="text-[12px] text-[#6B7280] px-4 py-3 bg-white">
            <div className="bg-[#FFF7ED] rounded-lg p-3 flex items-start gap-2">
              <span className="text-[#F59E0B]">💡</span>
              <span>保留价对买家不可见，低于保留价不成交</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Photos */}
      {step === 4 && (
        <div>
          <Section title="必拍位置" tip="至少上传6张">
            <div className="grid grid-cols-3 gap-3 p-4">
              {REQUIRED_PHOTOS.map(p => (
                <div 
                  key={p.key} 
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all ${
                    form.photos[p.key] 
                      ? 'bg-[#333] border-none' 
                      : 'bg-[#F5F5F5] border-2 border-dashed border-[#E5E5E5]'
                  }`} 
                  onClick={() => togglePhoto(p.key)}
                >
                  {form.photos[p.key] ? (
                    <>
                      <div className="w-full h-full bg-[#444] flex items-center justify-center text-white text-[12px]">{p.label}</div>
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                      <div 
                        className="absolute top-1 left-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                        onClick={e => { e.stopPropagation(); togglePhoto(p.key); }}
                      >
                        <X size={12} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={24} className="text-[#6B7280] mb-1" />
                      <span className="text-[11px] text-[#6B7280]">{p.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className={`text-[12px] px-4 pb-3 ${uploadedRequired >= 6 ? 'text-[#10B981]' : 'text-[#6B7280]'}`}>
              已上传 {uploadedRequired}/{REQUIRED_PHOTOS.length} 张必拍照片 {uploadedRequired >= 6 ? '✅' : '(至少6张)'}
            </div>
          </Section>

          <Section title="补充照片" tip="可选，每类最多5张">
            <div className="grid grid-cols-3 gap-3 p-4">
              {OPTIONAL_PHOTOS.map(p => (
                <div 
                  key={p.key} 
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
                    form.photos[p.key] 
                      ? 'bg-[#333]' 
                      : 'bg-[#F5F5F5] border-2 border-dashed border-[#E5E5E5]'
                  }`} 
                  onClick={() => togglePhoto(p.key)}
                >
                  {form.photos[p.key] ? (
                    <>
                      <div className="w-full h-full bg-[#444] flex items-center justify-center text-white text-[12px]">{p.label}</div>
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                      <div 
                        className="absolute top-1 left-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                        onClick={e => { e.stopPropagation(); togglePhoto(p.key); }}
                      >
                        <X size={12} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={24} className="text-[#6B7280] mb-1" />
                      <span className="text-[11px] text-[#6B7280]">{p.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white px-4 py-3 border-t border-[#E5E5E5] z-[100]">
        <div className="flex gap-3">
          {step > 1 && (
            <button 
              className="py-3 px-4 rounded-xl text-[14px] font-medium bg-[#F5F5F5] text-[#1F2937] border-none cursor-pointer shrink-0"
              onClick={() => setStep(step - 1)}
            >
              上一步
            </button>
          )}
          <button 
            className="py-3 px-4 rounded-xl text-[14px] font-medium bg-white border border-[#E5E5E5] text-[#6B7280] border-none cursor-pointer shrink-0"
            onClick={handleSaveDraft}
          >
            保存草稿
          </button>
          <button 
            className="flex-1 py-3 rounded-xl text-[14px] font-medium bg-[#FF6B00] text-white border-none cursor-pointer active:bg-[#E55A00] disabled:bg-[#9CA3AF]"
            onClick={handleNext}
            disabled={submitting}
          >
            {step === 4 ? '提交审核' : '下一步'}
          </button>
        </div>
      </div>

      {/* Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-end justify-center" onClick={() => setShowPicker(null)}>
          <div className="w-[390px] bg-white rounded-t-2xl max-h-[60vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-3 border-b border-[#E5E5E5]">
              <span className="text-[#6B7280] cursor-pointer text-[14px]" onClick={() => setShowPicker(null)}>取消</span>
              <span className="font-semibold text-[16px]">选择{showPicker.type}</span>
              <span className="w-8" />
            </div>
            <div className="overflow-y-auto max-h-[50vh]">
              {showPicker.options.map(opt => (
                <div key={opt}
                  className="px-4 py-3.5 border-b border-[#F3F4F6] cursor-pointer active:bg-[#F5F5F5] text-[14px] flex justify-between items-center"
                  onClick={() => handlePickerSelect(opt)}
                >
                  <span>{opt}</span>
                  {(form as any)[showPicker.field] === opt && <Check size={16} className="text-[#FF6B00]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Section component
function Section({ title, tip, children }: { title: string; tip?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white mb-3">
      <div className="text-[14px] font-semibold px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
        <span className="flex items-center">
          <span className="w-[3px] h-[14px] bg-[#FF6B00] mr-2 rounded-sm" />
          {title}
        </span>
        {tip && <span className="text-[12px] text-[#9CA3AF] font-normal">{tip}</span>}
      </div>
      {children}
    </div>
  );
}

// FormRow component
function FormRow({ label, required, last, children }: { label: string; required?: boolean; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3.5 min-h-[52px] ${!last ? 'border-b border-[#F3F4F6]' : ''}`}>
      <div className="text-[14px] text-[#1F2937] shrink-0">
        {label}{required && <span className="text-[#EF4444] ml-1">*</span>}
      </div>
      <div className="flex items-center flex-1 justify-end">{children}</div>
    </div>
  );
}

// PickerRow component
function PickerRow({ label, required, value, placeholder, last, onClick }: {
  label: string; required?: boolean; value: string; placeholder?: boolean; last?: boolean; onClick: () => void;
}) {
  return (
    <div 
      className={`flex justify-between items-center px-4 py-3.5 min-h-[52px] cursor-pointer active:bg-[#F9FAFB] ${!last ? 'border-b border-[#F3F4F6]' : ''}`}
      onClick={onClick}
    >
      <div className="text-[14px] text-[#1F2937] shrink-0">
        {label}{required && <span className="text-[#EF4444] ml-1">*</span>}
      </div>
      <div className="flex items-center">
        <span className={`text-[14px] ${placeholder ? 'text-[#9CA3AF]' : 'text-[#1F2937]'}`}>{value}</span>
        <span className="text-[14px] text-[#9CA3AF] ml-1">›</span>
      </div>
    </div>
  );
}
