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

// 省份城市数据
const PROVINCES = ['北京市', '上海市', '天津市', '重庆市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '湖南省', '河南省', '河北省', '山东省', '山西省', '辽宁省', '吉林省', '黑龙江省', '安徽省', '福建省', '江西省', '陕西省', '甘肃省', '青海省', '内蒙古', '广西省', '海南省', '贵州省', '云南省', '西藏区', '宁夏区', '新疆区'];

const CITIES_MAP: Record<string, string[]> = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '天津市': ['天津市'],
  '重庆市': ['重庆市'],
  '广东省': ['广州市', '深圳市', '佛山市', '东莞市', '珠海市', '中山市', '惠州市', '江门市', '湛江市', '茂名市', '肇庆市', '汕头市', '韶关市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '潮州市', '揭阳市', '云浮市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市', '徐州市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  '四川省': ['成都市', '绵阳市', '德阳市', '南充市', '宜宾市', '自贡市', '攀枝花市', '泸州市', '广元市', '遂宁市', '内江市', '乐山市', '资阳市', '眉山市', '达州市', '雅安市', '广安市', '巴中市', '眉山市'],
  '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆州市', '孝感市', '黄冈市', '咸宁市', '随州市', '恩施州', '仙桃市', '潜江市', '天门市'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西州'],
  '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'],
  '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
  '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边州'],
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
  '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏州', '甘南州'],
  '青海省': ['西宁市', '海东市', '海北州', '黄南州', '海南州', '果洛州', '玉树州', '海西州'],
  '内蒙古': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  '广西省': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '海南省': ['海口市', '三亚市', '三沙市', '儋州市'],
  '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南州', '黔东南州', '黔南州'],
  '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄州', '红河州', '文山州', '西双版纳州', '大理州', '德宏州', '怒江州', '迪庆州'],
  '西藏区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  '宁夏区': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  '新疆区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '阿克苏地区', '喀什地区', '和田地区', '伊犁州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市', '北屯市', '铁门关市', '双河市', '可克达拉市', '昆玉市']
};

// 草稿自动持久化 key
const DRAFT_STORAGE_KEY = 'fapai_draft_form';
const DRAFT_STEP_KEY = 'fapai_draft_step';

// 必拍位置（7个全部必填）
const REQUIRED_PHOTOS = [
  { key: 'front', label: '前脸' }, 
  { key: 'frontLeft', label: '左前45°' },
  { key: 'rearRight', label: '右后45°' }, 
  { key: 'interior', label: '内饰' },
  { key: 'dashboard', label: '仪表盘' }, 
  { key: 'engine', label: '发动机舱' },
  { key: 'trunk', label: '后备箱' },
];

interface FormData {
  // 车辆识别
  vin: string;
  licensePlate: string;
  // 车辆所在城市
  province: string;
  city: string;
  // 品牌车型
  carBrand: string;
  carSeries: string;
  carModel: string;

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
  province: '',
  city: '',
  carBrand: '',
  carSeries: '',
  carModel: '',

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
  // 重新发拍标识
  const isResubmit = searchParams.get('resubmit') !== null;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<number>(() => {
    // 非编辑模式时，从草稿恢复步骤
    if (!editId) {
      const saved = localStorage.getItem(DRAFT_STEP_KEY);
      if (saved) return parseInt(saved) || 1;
    }
    return 1;
  });

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
          province: app.province || '',
          city: app.city || '',
          carBrand: app.carBrand,
          carSeries: app.carSeries,
          carModel: app.carModel,

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
    // 非编辑模式：尝试从 localStorage 恢复草稿
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) return { ...defaultForm, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return defaultForm;
  });
  const [showPicker, setShowPicker] = useState<{ type: string; options: string[]; field: keyof FormData } | null>(null);
  const [priceError, setPriceError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // ★ 草稿防护：实时持久化到 localStorage（仅新建模式）
  useEffect(() => {
    if (editId) return; // 编辑模式不自动存草稿
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      localStorage.setItem(DRAFT_STEP_KEY, String(step));
    } catch { /* ignore storage errors */ }
  }, [form, step, editId]);

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
        if (!form.province || !form.city) { toast.error('请选择车辆所在省份和城市'); return false; }
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
        if (cnt < REQUIRED_PHOTOS.length) { 
          toast.error(`请上传全部 ${REQUIRED_PHOTOS.length} 张必拍照片（当前 ${cnt} 张）`); 
          return false; 
        }
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

  // 提交审核 - 提交后进入「待审核」状态，等待后台审核
  const handleSubmit = () => {
    if (submitting) return;
    setSubmitting(true);

    const applyNo = 'FP' + Date.now().toString().slice(-10);
    const app: any = {
      id: editId || String(Date.now()),
      applyNo: editId ? undefined : applyNo,
      vin: form.vin,
      licensePlate: form.licensePlate || undefined,
      province: form.province,
      city: form.city,
      carBrand: form.carBrand,
      carSeries: form.carSeries,
      carModel: form.carModel,
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
      status: isResubmit ? 'scheduled' as VehicleStatus : 'pending_audit' as VehicleStatus, // 重新发拍→待拍卖，新申请→待审核
      applyTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      images: Object.fromEntries(Object.keys(form.photos).filter(k => form.photos[k]).map(k => [k, k])),
    };
    
    if (editId) { 
      updateApplication(editId, app); 
    } else { 
      addApplication(app); 
    }

    // ★ 提交成功：清除草稿缓存
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_STEP_KEY);
    } catch { /* ignore */ }
    
    // ★ 全局 Toast
    if (isResubmit) {
      toast.success('重新发拍成功', { description: '发拍单已进入待拍卖状态' });
      setTimeout(() => navigate('/?tab=scheduled'), 1000);
    } else {
      toast.success('提交成功', { description: '审核结果将通过企业微信通知您' });
      setTimeout(() => {
        toast.info('已通知拍卖后台', { description: '后台已收到您的发拍申请，正在安排审核' });
      }, 1200);
      setTimeout(() => navigate('/?tab=pending_audit'), 1800);
    }
  };

  // 保存草稿
  const handleSaveDraft = () => {
    const app: any = {
      id: editId || String(Date.now()),
      applyNo: editId ? undefined : 'FP' + Date.now().toString().slice(-10),
      vin: form.vin,
      licensePlate: form.licensePlate || undefined,
      province: form.province,
      city: form.city,
      carBrand: form.carBrand || '未填写',
      carSeries: form.carSeries || '',
      carModel: form.carModel || '',
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

    // 清除临时草稿缓存（已持久化到 store）
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_STEP_KEY);
    } catch { /* ignore */ }
    
    toast.success('草稿已保存');
    setTimeout(() => navigate('/'), 800);
  };

  // 切换照片选中状态
  const togglePhoto = (key: string) => {
    setForm(f => ({ ...f, photos: { ...f.photos, [key]: !f.photos[key] } }));
  };

  const uploadedRequired = REQUIRED_PHOTOS.filter(p => form.photos[p.key]).length;
  const allRequiredDone = uploadedRequired === REQUIRED_PHOTOS.length;

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
    // 重新发拍模式：直接返回
    if (isResubmit) {
      navigate('/');
      return;
    }
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
        <div className="text-[18px] font-semibold text-center">{isResubmit ? '重新发拍' : editId ? '编辑申请' : '新增申请'}</div>
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
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-full placeholder:text-[#9CA3AF]"
                placeholder="请输入17位VIN码" 
                maxLength={17} 
                value={form.vin} 
                onChange={e => handleVinInput(e.target.value)} 
              />
            </FormRow>
            <FormRow label="车牌号" last>
              <input 
                className="flex-1 text-right border-none bg-transparent text-[14px] outline-none max-w-full placeholder:text-[#9CA3AF]"
                placeholder="非必填，7位/8位新能源" 
                maxLength={8}
                value={form.licensePlate} 
                onChange={e => set('licensePlate', e.target.value)} 
              />
            </FormRow>
          </Section>

          <Section title="车辆所在城市">
            <PickerRow
              label="省份"
              required
              value={form.province || '请选择'}
              placeholder={!form.province}
              onClick={() => setShowPicker({ type: '省份', options: PROVINCES, field: 'province' })}
            />
            <PickerRow
              label="城市"
              required
              value={form.city || (form.province ? '请选择' : '请先选择省份')}
              placeholder={!form.city}
              onClick={() => {
                if (!form.province) { toast.warning('请先选择省份'); return; }
                setShowPicker({ type: '城市', options: CITIES_MAP[form.province] || [], field: 'city' });
              }}
              last
            />
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
          <Section title="必拍位置" tip="7个锚位全部必填">
            <div className="grid grid-cols-3 gap-3 p-4">
              {REQUIRED_PHOTOS.map(p => (
                <div 
                  key={p.key} 
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all ${
                    form.photos[p.key] 
                      ? 'bg-[#1F2937] border-none shadow-sm' 
                      : 'bg-[#F9FAFB] border-2 border-dashed border-[#D1D5DB]'
                  }`} 
                  onClick={() => togglePhoto(p.key)}
                >
                  {form.photos[p.key] ? (
                    <>
                      {/* 已上传：深色背景 + 中央水印标签 */}
                      <div className="w-full h-full flex items-center justify-center relative">
                        <span className="text-[11px] text-white/70 font-medium tracking-wide select-none">{p.label}</span>
                      </div>
                      {/* 右上角已完成标记 */}
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center shadow">
                        <Check size={11} className="text-white" />
                      </div>
                      {/* 左上角删除 */}
                      <div 
                        className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/40 rounded-full flex items-center justify-center"
                        onClick={e => { e.stopPropagation(); togglePhoto(p.key); }}
                      >
                        <X size={11} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 未上传：虚线框 + Camera + 部位水印文字 */}
                      <Camera size={22} className="text-[#9CA3AF] mb-1.5" />
                      <span className="text-[11px] text-[#6B7280] font-medium">{p.label}</span>
                      <span className="text-[9px] text-[#D1D5DB] mt-0.5">点击上传</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* 进度提示 */}
            <div className={`text-[12px] px-4 pb-4 flex items-center gap-1.5 ${allRequiredDone ? 'text-[#10B981]' : 'text-[#6B7280]'}`}>
              {allRequiredDone ? (
                <>
                  <Check size={13} className="text-[#10B981]" />
                  <span>7 / 7 张必拍照片已全部上传 ✅</span>
                </>
              ) : (
                <>
                  <Camera size={13} />
                  <span>已上传 {uploadedRequired} / {REQUIRED_PHOTOS.length} 张，还差 {REQUIRED_PHOTOS.length - uploadedRequired} 张（全部必填）</span>
                </>
              )}
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white px-4 py-3 border-t border-[#E5E5E5] z-[100]">
        <div className="flex gap-3">
          {/* 价格仅改模式：仅提交按钮 */}
          {isPriceOnly ? (
            <button 
              className="flex-1 py-3 rounded-xl text-[14px] font-medium bg-[#FF6B00] text-white border-none cursor-pointer active:bg-[#E55A00] disabled:bg-[#9CA3AF]"
              onClick={handleNext}
              disabled={submitting}
            >
              确认重新发拍
            </button>
          ) : (
            <>
              {step > 1 && (
                <button 
                  className="py-3 px-4 rounded-xl text-[14px] font-medium bg-[#F5F5F5] text-[#1F2937] border-none cursor-pointer shrink-0"
                  onClick={() => setStep(step - 1)}
                >
                  上一步
                </button>
              )}
              {!isResubmit && (
                <button 
                  className="py-3 px-4 rounded-xl text-[14px] font-medium bg-white border border-[#E5E5E5] text-[#6B7280] border-none cursor-pointer shrink-0"
                  onClick={handleSaveDraft}
                >
                  保存草稿
                </button>
              )}
              <button 
                className="flex-1 py-3 rounded-xl text-[14px] font-medium bg-[#FF6B00] text-white border-none cursor-pointer active:bg-[#E55A00] disabled:bg-[#9CA3AF]"
                onClick={handleNext}
                disabled={submitting}
              >
                {step === 4 ? (isResubmit ? '确认重新发拍' : '提交审核') : '下一步'}
              </button>
            </>
          )}
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
