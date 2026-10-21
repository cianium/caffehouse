import React, { useState } from 'react';
import {
  X,
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
  Info
} from 'lucide-react';
import { useSiteSettings, SocialLinks } from '../context/SiteSettingsContext';
import { Product } from '../types/coffee';
import { coffeeSoundManager } from '../utils/soundAmbience';

export const AdminPanelModal: React.FC = () => {
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
    isAdminOpen,
    setIsAdminOpen,
  } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'branding' | 'products' | 'social'>('branding');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Local state for branding form
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

  // State for adding a new product
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

  // State for quick-editing a single product price
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingName, setEditingName] = useState<string>('');

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
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
      notes: ['کارامل', 'فندق'],
      imageColor: '#78BDB6',
      accentColor: '#C68A52',
      badge: 'جدید',
    });
    showNotification('محصول جدید با موفقیت به منو افزوده شد.');
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditingPrice(p.price);
    setEditingName(p.name);
  };

  const saveProductPrice = (id: string) => {
    coffeeSoundManager.playClickSound();
    updateProduct(id, { price: editingPrice, name: editingName });
    setEditingProductId(null);
    showNotification('مشخصات و قیمت محصول ذخیره شد.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          coffeeSoundManager.playClickSound();
          setIsAdminOpen(false);
        }}
      />

      {/* Main Admin Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#160D0B] border border-[#C68A52]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden text-right">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3C2922] bg-[#20130E]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center text-[#C68A52]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F3DDC4] flex items-center gap-2">
                <span>پنل مدیریت و تنظیمات محتوای سایت</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] border border-[#78BDB6]/40 font-mono">
                  Admin Panel
                </span>
              </h2>
              <p className="text-xs text-[#E2B88F]/60">
                ویرایش آنلاین متن‌ها، نام سایت، شعار، قیمت‌ها، محصولات، آدرس و شبکه‌های اجتماعی
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setIsAdminOpen(false);
            }}
            className="p-2 rounded-xl bg-[#2B1B16] text-[#E2B88F]/60 hover:text-[#F3DDC4] border border-[#3C2922] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#3C2922] bg-[#1A100C]">
          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setActiveTab('branding');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'branding'
                ? 'border-[#C68A52] text-[#F3DDC4] bg-[#241712]'
                : 'border-transparent text-[#E2B88F]/60 hover:text-[#E2B88F]'
            }`}
          >
            <Building className="w-4 h-4 text-[#C68A52]" />
            <span>اطلاعات برند، شعار و آدرس</span>
          </button>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setActiveTab('products');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#78BDB6] text-[#F3DDC4] bg-[#241712]'
                : 'border-transparent text-[#E2B88F]/60 hover:text-[#E2B88F]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#78BDB6]" />
            <span>مدیریت محصولات و قیمت‌ها ({products.length})</span>
          </button>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setActiveTab('social');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'social'
                ? 'border-[#C68A52] text-[#F3DDC4] bg-[#241712]'
                : 'border-transparent text-[#E2B88F]/60 hover:text-[#E2B88F]'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#C68A52]" />
            <span>شبکه‌های اجتماعی و تماس</span>
          </button>
        </div>

        {/* Modal Body / Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Notification Toast */}
          {successToast && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#78BDB6]/15 border border-[#78BDB6]/40 text-[#78BDB6] text-xs font-medium animate-fadeIn">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* TAB 1: BRANDING & SITE INFO */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#E2B88F]">
                    نام برند / اسم سایت من (فارسی):
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="مثال: بودرین"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#E2B88F]">
                    نام انگلیسی برند (Header/Logo):
                  </label>
                  <input
                    type="text"
                    value={siteNameEn}
                    onChange={(e) => setSiteNameEn(e.target.value)}
                    placeholder="مثال: BODRIN SPECIALTY"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2B88F]">شعار برند (Slogan):</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="مثال: طعم اصیل موج سوم، دم‌آوری فراگیر"
                  className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2B88F]">
                  توضیحات معرفی کافه (نمایش در فوتر و درباره ما):
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl p-3.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#E2B88F]">شماره تلفن و سفارشات:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۲۱-۸۸۲۲۳۳۴۴"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#E2B88F]">ساعات کاری کافه:</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="همه‌روزه از ۰۷:۳۰ صبح تا ۲۳:۳۰ شب"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2B88F]">آدرس اصلی شعبه مرکزی:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2B88F]">آدرس شعبه دوم (اختیاری):</label>
                <input
                  type="text"
                  value={branchSecondary}
                  onChange={(e) => setBranchSecondary(e.target.value)}
                  className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات برند و اطلاعات سایت</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRODUCTS & PRICING */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#20130E] border border-[#3C2922]">
                <div className="flex items-center gap-2 text-xs text-[#E2B88F]">
                  <Coffee className="w-4 h-4 text-[#78BDB6]" />
                  <span>
                    تعداد کل محصولات فعال منو: <strong className="text-[#F3DDC4]">{products.length}</strong> عدد
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      coffeeSoundManager.playClickSound();
                      setShowAddProductModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن محصول جدید به منو</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('آیا مایلید لیست محصولات به حالت پیش‌فرض اولیه بازگردد؟')) {
                        resetProductsToDefault();
                        showNotification('کاتالوگ به حالت اولیه بازگردانی شد.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#241712] hover:bg-[#322019] border border-[#3C2922] text-[#E2B88F]/70 text-xs flex items-center gap-1.5 cursor-pointer"
                    title="بازگردانی به کاتالوگ پیش‌فرض"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>بازنشانی پیش‌فرض</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="space-y-3">
                {products.map((p) => {
                  const isEditing = editingProductId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#1A100C] border border-[#3C2922] hover:border-[#C68A52]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs text-[#160D0B] shadow-inner"
                          style={{ backgroundColor: p.imageColor || '#C68A52' }}
                        >
                          <Coffee className="w-6 h-6" />
                        </div>

                        <div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="bg-[#241712] border border-[#C68A52] rounded-lg px-2.5 py-1 text-xs text-[#F3DDC4] font-bold w-48 mb-1"
                            />
                          ) : (
                            <h4 className="font-bold text-sm text-[#F3DDC4] flex items-center gap-2">
                              <span>{p.name}</span>
                              <span className="text-[10px] text-[#E2B88F]/50 font-mono">({p.nameEn})</span>
                              {p.badge && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C68A52]/20 text-[#C68A52] border border-[#C68A52]/40">
                                  {p.badge}
                                </span>
                              )}
                            </h4>
                          )}
                          <p className="text-xs text-[#E2B88F]/60 line-clamp-1 max-w-md">
                            {p.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#E2B88F]/50">
                            <span>دسته‌بندی: {p.category}</span>
                            <span>•</span>
                            <span>رست: {p.roastLevel}</span>
                            <span>•</span>
                            <span>{p.volume}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2B1B16]">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#E2B88F]">قیمت (تومان):</span>
                            <input
                              type="number"
                              step="5000"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(Number(e.target.value))}
                              className="w-28 bg-[#241712] border border-[#78BDB6] rounded-xl px-2.5 py-1.5 text-xs text-[#78BDB6] font-bold text-center focus:outline-none"
                            />
                            <button
                              onClick={() => saveProductPrice(p.id)}
                              className="p-2 rounded-xl bg-[#78BDB6] text-[#160D0B] font-bold text-xs hover:scale-105 cursor-pointer"
                              title="ذخیره قیمت"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="p-2 rounded-xl bg-[#2B1B16] text-[#E2B88F] text-xs cursor-pointer"
                              title="انصراف"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-left">
                              <span className="text-xs text-[#E2B88F]/60 block text-right">قیمت فعلی:</span>
                              <span className="text-sm font-bold text-[#78BDB6] font-display">
                                {p.price.toLocaleString('fa-IR')} تومان
                              </span>
                            </div>

                            <button
                              onClick={() => startEditProduct(p)}
                              className="p-2 rounded-xl bg-[#241712] hover:bg-[#322019] text-[#C68A52] border border-[#C68A52]/30 text-xs transition-colors cursor-pointer"
                              title="ویرایش قیمت و نام"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`آیا از حذف "${p.name}" از منو اطمینان دارید؟`)) {
                                  deleteProduct(p.id);
                                  showNotification(`محصول ${p.name} با موفقیت حذف شد.`);
                                }
                              }}
                              className="p-2 rounded-xl bg-[#241712] hover:bg-red-950/40 text-red-400 border border-red-900/30 text-xs transition-colors cursor-pointer"
                              title="حذف از منو"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Product Modal Inline */}
              {showAddProductModal && (
                <div className="p-5 rounded-3xl bg-[#20130E] border border-[#78BDB6]/50 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#3C2922] pb-3">
                    <h3 className="font-bold text-sm text-[#F3DDC4] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#78BDB6]" />
                      <span>افزودن نوشیدنی یا قهوه جدید به منوی کافه</span>
                    </h3>
                    <button
                      onClick={() => setShowAddProductModal(false)}
                      className="p-1.5 rounded-lg text-[#E2B88F]/60 hover:text-[#F3DDC4]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddNewProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-[#E2B88F]">نام فارسی نوشیدنی:</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="مثال: کورتادو اسپشیال اتیوپی"
                        className="w-full bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#78BDB6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#E2B88F]">نام لاتین (English Name):</label>
                      <input
                        type="text"
                        value={newProduct.nameEn}
                        onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                        placeholder="مثال: Ethiopian Cortado"
                        className="w-full bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#78BDB6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#E2B88F]">قیمت (تومان):</label>
                      <input
                        type="number"
                        required
                        step="5000"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        className="w-full bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#78BDB6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#E2B88F]">دسته‌بندی منو:</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value as Product['category'],
                          })
                        }
                        className="w-full bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#78BDB6]"
                      >
                        <option value="espresso">اسپرسو بار (Espresso)</option>
                        <option value="milk">ترکیبات شیری (Milk based)</option>
                        <option value="specialty">دم‌آوری تخصصی (Specialty / V60)</option>
                        <option value="cold">نوشیدنی سرد (Cold Brew / Iced)</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs text-[#E2B88F]">توضیحات و مشخصات طعمی:</label>
                      <input
                        type="text"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="طعم‌یادهای یاسمن، لیمو ترش، بافتی ابریشمی و ماندگار"
                        className="w-full bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#78BDB6]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 md:col-span-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProductModal(false)}
                        className="px-4 py-2 rounded-xl bg-[#160D0B] border border-[#3C2922] text-xs text-[#E2B88F]/70"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ثبت و انتشار محصول</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOCIAL LINKS & CONTACTS */}
          {activeTab === 'social' && (
            <form onSubmit={handleSaveSocial} className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#20130E] border border-[#3C2922] flex items-center gap-3 text-xs text-[#E2B88F]">
                <Info className="w-5 h-5 text-[#C68A52] shrink-0" />
                <span>
                  لینک‌های زیر به صورت زنده در فوتر سایت، بخش تماس با ما و شبکه‌های اجتماعی نمایش داده می‌شوند و با کلیک کاربران مستقیماً صفحه شما باز خواهد شد.
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#E2B88F]">
                    <span className="font-semibold flex items-center gap-2">
                      <span>پیج اینستاگرام (Instagram):</span>
                    </span>
                    <a
                      href={socialForm.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#78BDB6] hover:underline flex items-center gap-1"
                    >
                      <span>تست لینک</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={socialForm.instagram}
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourcafe"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#E2B88F]">
                    <span className="font-semibold">کانال / آیدی تلگرام (Telegram):</span>
                    <a
                      href={socialForm.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#78BDB6] hover:underline flex items-center gap-1"
                    >
                      <span>تست لینک</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={socialForm.telegram}
                    onChange={(e) => setSocialForm({ ...socialForm, telegram: e.target.value })}
                    placeholder="https://t.me/yourcafe"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#E2B88F]">
                    <span className="font-semibold">پشتیبانی واتس‌اپ (WhatsApp):</span>
                    <a
                      href={socialForm.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#78BDB6] hover:underline flex items-center gap-1"
                    >
                      <span>تست لینک</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={socialForm.whatsapp}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                    placeholder="https://wa.me/989123456789"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#E2B88F]">
                    <span className="font-semibold">توییتر / X (Twitter):</span>
                    <a
                      href={socialForm.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#78BDB6] hover:underline flex items-center gap-1"
                    >
                      <span>تست لینک</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={socialForm.twitter}
                    onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourcafe"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#E2B88F]">
                    <span className="font-semibold">کانال یوتیوب یا آپارات (YouTube):</span>
                    <a
                      href={socialForm.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#78BDB6] hover:underline flex items-center gap-1"
                    >
                      <span>تست لینک</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={socialForm.youtube}
                    onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                    placeholder="https://youtube.com/@yourcafe"
                    className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-4 py-2.5 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52] font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره لینک‌های شبکه‌های اجتماعی</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#3C2922] bg-[#20130E]/70 text-xs text-[#E2B88F]/50">
          <span>تغییرات شما به صورت خودکار در حافظه مرورگر ذخیره می‌شوند.</span>
          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setIsAdminOpen(false);
            }}
            className="px-4 py-1.5 rounded-xl bg-[#2B1B16] text-[#E2B88F] hover:text-[#F3DDC4] border border-[#3C2922] transition-colors cursor-pointer"
          >
            بستن پنل
          </button>
        </div>
      </div>
    </div>
  );
};
