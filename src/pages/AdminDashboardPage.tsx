import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Share2,
  Building,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Edit2,
  Save,
  Coffee,
  Info,
  LogOut,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Truck,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  FileText
} from 'lucide-react';
import { useSiteSettings, SocialLinks } from '../context/SiteSettingsContext';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Product, Order } from '../types/coffee';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    siteInfo,
    updateSiteInfo,
    socialLinks,
    updateSocialLinks,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
  } = useSiteSettings();

  const { orders } = useCart();
  const { isAuthenticated, adminEmail, logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'branding' | 'social' | 'gateway' | 'orders'>('overview');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Local state for branding
  const [siteName, setSiteName] = useState(siteInfo.siteName);
  const [siteNameEn, setSiteNameEn] = useState(siteInfo.siteNameEn);
  const [slogan, setSlogan] = useState(siteInfo.slogan);
  const [description, setDescription] = useState(siteInfo.description);
  const [phone, setPhone] = useState(siteInfo.phone);
  const [address, setAddress] = useState(siteInfo.address);
  const [branchSecondary, setBranchSecondary] = useState(siteInfo.branchSecondary);
  const [workingHours, setWorkingHours] = useState(siteInfo.workingHours);

  // Local state for social links
  const [socialForm, setSocialForm] = useState<SocialLinks>(socialLinks);

  // Iranian Payment Gateway Settings
  const [merchantId, setMerchantId] = useState('BODRIN-MERCHANT-8820');
  const [terminalId, setTerminalId] = useState('88209941');
  const [defaultGateway, setDefaultGateway] = useState<'zarinpal' | 'mellat' | 'saman'>('zarinpal');
  const [isSandbox, setIsSandbox] = useState(false);

  // Quick edit product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingName, setEditingName] = useState<string>('');

  // Add Product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameEn: '',
    price: 150000,
    category: 'espresso' as Product['category'],
    description: '',
    volume: '۲۲۰ میلی‌لیتر',
    calories: 120,
    roastLevel: 'متوسط' as Product['roastLevel'],
    rating: 4.9,
    reviewsCount: 1,
    notes: ['کارامل', 'شکلات تلخ'],
    imageColor: '#78BDB6',
    accentColor: '#C68A52',
    badge: 'جدید',
  });

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleLogout = () => {
    coffeeSoundManager.playClickSound();
    logout();
    onNavigate('admin-login');
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    updateSiteInfo({
      siteName,
      siteNameEn,
      slogan,
      description,
      phone,
      address,
      branchSecondary,
      workingHours,
    });
    showNotification('اطلاعات برند، شعار و آدرس با موفقیت ذخیره گردید.');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    updateSocialLinks(socialForm);
    showNotification('لینک‌های شبکه‌های اجتماعی بروزرسانی شدند.');
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    showNotification('پیکربندی درگاه پرداخت شاپرک با موفقیت ثبت شد.');
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    coffeeSoundManager.playClickSound();
    addProduct(newProduct);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      nameEn: '',
      price: 150000,
      category: 'espresso',
      description: '',
      volume: '۲۲۰ میلی‌لیتر',
      calories: 120,
      roastLevel: 'متوسط',
      rating: 4.9,
      reviewsCount: 1,
      notes: ['کارامل', 'شکلات تلخ'],
      imageColor: '#78BDB6',
      accentColor: '#C68A52',
      badge: 'جدید',
    });
    showNotification('نوشیدنی جدید به منوی کافه اضافه شد.');
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.finalPrice, 0);
  const totalCupsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((c, it) => c + it.quantity, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#110A08] text-[#F3DDC4] flex flex-col relative selection:bg-[#78BDB6] selection:text-[#110A08]" dir="rtl">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1C2C29] border border-[#78BDB6] text-[#78BDB6] shadow-2xl text-xs font-bold animate-slide-up">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1A0E0A]/95 border-b border-[#3C2922] backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center text-[#C68A52]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-[#F3DDC4] font-display">
                پنل مدیریت جامع {siteInfo.siteNameEn || 'BODRIN'}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] font-mono border border-[#78BDB6]/30">
                Staff Portal
              </span>
            </div>
            <p className="text-[11px] text-[#E2B88F]/60">
              مدیر ارشد: <span className="font-mono text-[#78BDB6]">{adminEmail || 'admin@bodrincoffee.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Live Store Button */}
          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              onNavigate('home');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#2B1B16] hover:bg-[#3C2922] border border-[#3C2922] text-[#E2B88F] hover:text-[#F3DDC4] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مشاهده فروشگاه زنده</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="خروج از حساب مدیریت"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="p-3 rounded-2xl bg-[#180E0B] border border-[#3C2922] space-y-1">
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('overview');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>داشبورد و آمار زنده</span>
            </button>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('products');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>منو، محصولات و قیمت‌ها</span>
              <span className="mr-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#110A08] text-[#78BDB6] font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('orders');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>مدیریت سفارشات میهمانان</span>
              <span className="mr-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#110A08] text-[#78BDB6] font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('branding');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'branding'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>هویت برند، شعار و آدرس</span>
            </button>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('social');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>شبکه‌های اجتماعی و فوتر</span>
            </button>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setActiveTab('gateway');
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'gateway'
                  ? 'bg-[#C68A52] text-[#110A08] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4] hover:bg-[#22130F]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>تنظیمات درگاه شاپرک</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 space-y-6">
          {activeTab === 'overview' && (
            /* TAB: OVERVIEW & STATS */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#1A0E0A] border border-[#3C2922] space-y-1">
                  <span className="text-xs text-[#E2B88F]/70">مجموع فروش و درآمد:</span>
                  <div className="flex items-baseline gap-1 text-2xl font-black text-[#78BDB6] font-display">
                    <span>{totalRevenue.toLocaleString('fa-IR')}</span>
                    <span className="text-xs text-[#C68A52]">تومان</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1A0E0A] border border-[#3C2922] space-y-1">
                  <span className="text-xs text-[#E2B88F]/70">تعداد فنجان‌های آماده شده:</span>
                  <div className="flex items-baseline gap-1 text-2xl font-black text-[#F3DDC4] font-display">
                    <span>{totalCupsSold.toLocaleString('fa-IR')}</span>
                    <span className="text-xs text-[#E2B88F]/60">کاپ</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1A0E0A] border border-[#3C2922] space-y-1">
                  <span className="text-xs text-[#E2B88F]/70">سفارشات ثبت‌شده:</span>
                  <div className="flex items-baseline gap-1 text-2xl font-black text-[#C68A52] font-display">
                    <span>{orders.length.toLocaleString('fa-IR')}</span>
                    <span className="text-xs text-[#E2B88F]/60">فاکتور</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-3xl bg-[#180E0B] border border-[#3C2922] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F3DDC4]">آخرین سفارش‌های دریافتی:</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#78BDB6] hover:underline cursor-pointer"
                  >
                    مشاهده تمام سفارشات
                  </button>
                </div>

                <div className="space-y-2">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl bg-[#21130E] border border-[#3C2922] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#78BDB6]">#{ord.orderNumber}</span>
                        <span className="text-[#E2B88F]/60 mr-2">{ord.date}</span>
                        <div className="text-[11px] text-[#F3DDC4] mt-0.5">
                          {ord.items.map((it) => `${it.product.name} (${it.quantity}×)`).join(' • ')}
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="font-mono font-bold text-[#F3DDC4] block">
                          {ord.finalPrice.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-[10px] text-[#C68A52]">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            /* TAB: PRODUCTS & PRICING */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F3DDC4]">مدیریت محصولات، منو و قیمت‌ها</h2>
                  <p className="text-xs text-[#E2B88F]/60">
                    قیمت هر نوشیدنی را مستقیم ویرایش کرده یا محصول جدید اضافه کنید.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetProductsToDefault}
                    className="px-3 py-2 rounded-xl bg-[#2B1B16] hover:bg-[#3C2922] border border-[#3C2922] text-[#E2B88F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">بازنشانی پیش‌فرض</span>
                  </button>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#110A08] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن نوشیدنی</span>
                  </button>
                </div>
              </div>

              {/* Products Table/List */}
              <div className="space-y-3">
                {products.map((p) => {
                  const isEditing = editingProductId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#180E0B] border border-[#3C2922] hover:border-[#C68A52]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-sm"
                          style={{ backgroundColor: `${p.accentColor}25`, color: p.accentColor }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="bg-[#110A08] border border-[#78BDB6] rounded px-2 py-1 text-xs text-[#F3DDC4]"
                            />
                          ) : (
                            <h4 className="text-sm font-bold text-[#F3DDC4]">{p.name}</h4>
                          )}
                          <span className="text-[10px] text-[#E2B88F]/60 font-mono">
                            {p.nameEn} • {p.volume} • دسته: {p.category}
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(Number(e.target.value))}
                              className="w-28 bg-[#110A08] border border-[#78BDB6] rounded-lg px-2 py-1 text-xs font-mono text-[#78BDB6] font-bold"
                            />
                            <span className="text-xs text-[#E2B88F]">تومان</span>
                            <button
                              onClick={() => {
                                updateProduct(p.id, { price: editingPrice, name: editingName });
                                setEditingProductId(null);
                                showNotification(`قیمت «${p.name}» بروزرسانی شد.`);
                              }}
                              className="p-1.5 rounded-lg bg-[#78BDB6] text-[#110A08] cursor-pointer"
                              title="ذخیره"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-left font-mono">
                              <span className="text-sm font-black text-[#78BDB6]">
                                {p.price.toLocaleString('fa-IR')}
                              </span>
                              <span className="text-[10px] text-[#C68A52] mr-1">تومان</span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingProductId(p.id);
                                setEditingPrice(p.price);
                                setEditingName(p.name);
                              }}
                              className="p-2 rounded-xl bg-[#241712] hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
                              title="ویرایش قیمت و نام"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            deleteProduct(p.id);
                            showNotification(`«${p.name}» از منو حذف شد.`);
                          }}
                          className="p-2 rounded-xl bg-[#241712] hover:bg-red-950/60 text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                          title="حذف محصول"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            /* TAB: ORDERS MANAGEMENT */
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#F3DDC4]">سوابق و پیگیری سفارشات میهمانان</h2>
                <p className="text-xs text-[#E2B88F]/60">
                  سفارشات ثبت‌شده مشتریان، آدرس، فاکتور و وضعیت تحویل
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 rounded-3xl bg-[#180E0B] border border-[#3C2922] text-xs text-[#E2B88F]/60">
                  هنوز سفارشی ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#180E0B] border border-[#3C2922] space-y-3"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[#3C2922]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#78BDB6]">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-[#E2B88F]/60">{order.date}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C68A52]/20 text-[#C68A52] font-semibold">
                            {order.deliveryType === 'delivery' ? 'ارسال پیک' : 'تحویل حضوری'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F3DDC4] font-mono">
                            {order.finalPrice.toLocaleString('fa-IR')} تومان
                          </span>
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] font-bold">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] text-[#E2B88F]/60 font-semibold block">اقلام:</span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[#F3DDC4]">
                            <span>
                              {it.quantity}× {it.product.name} ({it.selectedMilk || 'شیر تازه'})
                              {it.customSleeveText && (
                                <span className="mr-2 text-[10px] text-[#78BDB6]">
                                  [کمربند: {it.customSleeveText}]
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-[#E2B88F]/70">
                              {(it.product.price * it.quantity).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            /* TAB: BRANDING & CONTACT INFO */
            <form onSubmit={handleSaveBranding} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#F3DDC4]">هویت برند، لوگو، شعار و آدرس شعب</h2>
                <p className="text-xs text-[#E2B88F]/60">
                  این اطلاعات در هدر، فوتر و رسید سفارشات منعکس می‌گردد.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">نام برند (فارسی):</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">نام برند (انگلیسی):</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteNameEn}
                    onChange={(e) => setSiteNameEn(e.target.value)}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none text-right font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">شعار برند (Slogan):</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">توضیحات و داستان برند:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">شماره تماس پشتیبانی:</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#F3DDC4] focus:outline-none text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">ساعات کاری کافه:</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">آدرس شعبه اصلی:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">آدرس شعبه دوم (اختیاری):</label>
                <input
                  type="text"
                  value={branchSecondary}
                  onChange={(e) => setBranchSecondary(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#110A08] font-bold text-xs cursor-pointer shadow-md"
              >
                ذخیره تغییرات برند و آدرس
              </button>
            </form>
          )}

          {activeTab === 'social' && (
            /* TAB: SOCIAL MEDIA LINKS */
            <form onSubmit={handleSaveSocial} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#F3DDC4]">شبکه‌های اجتماعی رسمی</h2>
                <p className="text-xs text-[#E2B88F]/60">
                  لینک‌های اینستاگرام، تلگرام، واتس‌اپ و یوتیوب نمایش‌داده‌شده در فوتر
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">اینستاگرام:</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={socialForm.instagram}
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">تلگرام:</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={socialForm.telegram}
                    onChange={(e) => setSocialForm({ ...socialForm, telegram: e.target.value })}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">واتس‌اپ:</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={socialForm.whatsapp}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">توییتر / X:</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={socialForm.twitter}
                    onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">یوتیوب:</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={socialForm.youtube}
                    onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                    className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#110A08] font-bold text-xs cursor-pointer shadow-md"
              >
                بروزرسانی شبکه‌های اجتماعی
              </button>
            </form>
          )}

          {activeTab === 'gateway' && (
            /* TAB: IRANIAN PAYMENT GATEWAY SETTINGS */
            <form onSubmit={handleSaveGateway} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#F3DDC4]">تنظیمات درگاه پرداخت اینترنتی شاپرک</h2>
                <p className="text-xs text-[#E2B88F]/60">
                  اتصال به زرین‌پال، به‌پرداخت ملت یا سامان کیش جهت تسویه حساب سفارشات مشتریان
                </p>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-[#180E0B] border border-[#3C2922]">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">
                    کد پذیرنده / مرچنت کد (Merchant ID):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full bg-[#110A08] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#78BDB6] font-bold focus:outline-none text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">
                    شماره پایانه شاپرک (Terminal ID):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={terminalId}
                    onChange={(e) => setTerminalId(e.target.value)}
                    className="w-full bg-[#110A08] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#78BDB6] font-bold focus:outline-none text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F3DDC4] block">
                    درگاه پیش‌فرض در تسویه حساب:
                  </label>
                  <select
                    value={defaultGateway}
                    onChange={(e) => setDefaultGateway(e.target.value as any)}
                    className="w-full bg-[#110A08] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] focus:outline-none cursor-pointer"
                  >
                    <option value="zarinpal">زرین‌پال (ZarinPal) — مسیردهی هوشمند شتاب</option>
                    <option value="mellat">به‌پرداخت ملت (شاپرک مستقیم)</option>
                    <option value="saman">پرداخت الکترونیک سامان کیش (SEP)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#110A08] font-bold text-xs cursor-pointer shadow-md"
              >
                ذخیره تنظیمات درگاه شاپرک
              </button>
            </form>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
          <div className="relative w-full max-w-lg bg-[#1A0E0A] border border-[#C68A52]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#F3DDC4]">افزودن نوشیدنی تخصصی جدید</h3>

            <form onSubmit={handleAddNewProduct} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F3DDC4] block">نام نوشیدنی (فارسی):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فلت وایت ماداگاسکار"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#110A08] border border-[#3C2922] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">نام انگلیسی:</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="Flat White"
                    value={newProduct.nameEn}
                    onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                    className="w-full bg-[#110A08] border border-[#3C2922] rounded-xl px-3 py-2 text-xs font-mono text-[#F3DDC4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F3DDC4] block">قیمت (تومان):</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#110A08] border border-[#3C2922] rounded-xl px-3 py-2 text-xs font-mono text-[#78BDB6] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F3DDC4] block">دسته‌بندی:</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                  className="w-full bg-[#110A08] border border-[#3C2922] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none cursor-pointer"
                >
                  <option value="espresso">اسپرسو بار</option>
                  <option value="milk">پایه شیر</option>
                  <option value="specialty">طعم‌های امضا (Specialty)</option>
                  <option value="cold">سرددم و آیس</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F3DDC4] block">توضیحات طعم:</label>
                <textarea
                  rows={2}
                  placeholder="توضیح کوتاه در مورد نت‌های عطری..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#110A08] border border-[#3C2922] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#241712] text-[#E2B88F] text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#78BDB6] text-[#110A08] text-xs font-bold cursor-pointer"
                >
                  افزودن به منو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
