import React, { useState } from 'react';
import { X, Check, ShoppingBag, Zap, Sparkles, Star, Heart, Edit3, Palette } from 'lucide-react';
import { Product } from '../types/coffee';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface ProductCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
}

interface SleeveStyle {
  id: string;
  name: string;
  bgGrad: string;
  borderColor: string;
  textColor: string;
  accentDot: string;
}

const SLEEVE_STYLES: SleeveStyle[] = [
  {
    id: 'kraft',
    name: 'کرفت ارگانیک (کلاسیک)',
    bgGrad: 'from-[#2B1B15] via-[#3B251D] to-[#2B1B15]',
    borderColor: '#C68A52',
    textColor: '#F3DDC4',
    accentDot: '#78BDB6',
  },
  {
    id: 'espresso',
    name: 'اسپرسوی دارک مات',
    bgGrad: 'from-[#190E0B] via-[#241510] to-[#190E0B]',
    borderColor: '#E2B88F',
    textColor: '#F3DDC4',
    accentDot: '#C68A52',
  },
  {
    id: 'turquoise',
    name: 'فیروزه‌ای اختصاصی بودرین',
    bgGrad: 'from-[#142C2A] via-[#1E423F] to-[#142C2A]',
    borderColor: '#78BDB6',
    textColor: '#D9F7F4',
    accentDot: '#C68A52',
  },
  {
    id: 'caramel',
    name: 'کارامل سلطنتی',
    bgGrad: 'from-[#3A2210] via-[#523118] to-[#3A2210]',
    borderColor: '#E2B88F',
    textColor: '#FBEEDF',
    accentDot: '#78BDB6',
  },
];

const SUGGESTED_TEXTS = [
  'برای سارای عزیزم ❤️',
  'صبح پرانرژی و باطراوت ⚡',
  'نوش جان قهرمان!',
  'BODRIN SPECIALTY',
  'لبخند بزن و بنوش 😊',
];

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({ product, onClose }) => {
  const { addToCart, triggerQuickBuy } = useCart();
  const { products } = useSiteSettings();
  const [customText, setCustomText] = useState('BODRIN ARTISAN COFFEE');
  const [selectedStyle, setSelectedStyle] = useState<SleeveStyle>(SLEEVE_STYLES[0]);
  const [selectedMilk, setSelectedMilk] = useState('شیر تازه محلی');
  const [selectedSyrup, setSelectedSyrup] = useState('بدون سیروپ');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;
  const activeProduct = products.find((p) => p.id === product.id) || product;

  const handleClose = () => {
    coffeeSoundManager.playClickSound();
    onClose();
  };

  const handleAddToCart = () => {
    coffeeSoundManager.playClickSound();
    addToCart(
      activeProduct,
      selectedMilk,
      selectedSyrup,
      customText.trim() || 'BODRIN SPECIALTY',
      selectedStyle.borderColor
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleQuickBuy = () => {
    coffeeSoundManager.playClickSound();
    triggerQuickBuy(activeProduct);
    onClose();
  };

  const totalPrice = activeProduct.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-right select-none" dir="rtl">
      <div className="relative w-full max-w-4xl rounded-3xl bg-gradient-to-b from-[#281813] via-[#1F120E] to-[#150B07] border border-[#C68A52]/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-y-auto pl-1 pr-1">
          {/* Left / Center Column: Real-time 3D Cup Sleeve Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#1A100C] border border-[#3C2922] relative overflow-hidden min-h-[380px]">
            {/* Background radial spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(198,138,82,0.15)_0%,_transparent_70%)] pointer-events-none" />

            {/* Floating 3D Cup with Custom Engraved Sleeve */}
            <div className="relative w-44 h-64 sm:w-48 sm:h-72 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
              {/* Cup Lid */}
              <div className="w-[85%] h-8 bg-gradient-to-b from-[#2B1B16] via-[#1A100C] to-[#120805] rounded-t-2xl border-t border-[#C68A52]/30 shadow-md flex items-center justify-center relative">
                <div className="w-6 h-2 rounded-full bg-[#0A0503] -translate-y-1 shadow-inner" />
              </div>
              {/* Lid Rim */}
              <div className="w-[90%] h-3.5 bg-[#241712] rounded-full border border-[#C68A52]/20 shadow-sm -mt-0.5" />

              {/* Cup Body Container with 3D Perspective */}
              <div className="w-full h-52 bg-gradient-to-b from-[#2C1C16] via-[#20130E] to-[#140B07] rounded-b-3xl overflow-hidden shadow-inner flex flex-col justify-center items-center relative">
                {/* Surface Specular Highlight Sheen */}
                <div className="absolute inset-y-0 right-4 w-5 bg-gradient-to-l from-transparent via-white/12 to-transparent pointer-events-none" />

                {/* Custom Kraft Sleeve with Real-Time Dynamic Text */}
                <div
                  className={`relative w-full py-5 px-3 bg-gradient-to-r ${selectedStyle.bgGrad} border-y shadow-lg flex flex-col items-center justify-center transition-all duration-300`}
                  style={{ borderColor: selectedStyle.borderColor }}
                >
                  {/* Decorative embossed border */}
                  <div
                    className="absolute inset-1 border rounded-lg opacity-40 pointer-events-none"
                    style={{ borderColor: selectedStyle.borderColor }}
                  />

                  {/* Brand Top Header */}
                  <span
                    className="text-[9px] tracking-[0.25em] font-semibold uppercase mb-1"
                    style={{ color: selectedStyle.borderColor }}
                  >
                    BODRIN • 100% ARABICA
                  </span>

                  {/* REAL-TIME CUSTOM SLEEVE TEXT */}
                  <div className="max-w-[140px] text-center my-0.5 overflow-hidden">
                    <span
                      className="text-xs sm:text-sm font-extrabold tracking-wide font-display block truncate leading-tight transition-all"
                      style={{ color: selectedStyle.textColor }}
                    >
                      {customText.trim() || 'BODRIN COFFEE'}
                    </span>
                  </div>

                  {/* Accent Dot & Volume */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: selectedStyle.accentDot }}
                    />
                    <span className="text-[9px] text-[#E2B88F]/80 font-medium">
                      {activeProduct.volume} • دست‌ساز
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Preview Live Label */}
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#78BDB6] px-3 py-1 rounded-full bg-[#160D0B] border border-[#78BDB6]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پیش‌نمایش زنده کمربند کاپ اختصاصی</span>
            </div>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-right">
            {/* Title & Price Header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl sm:text-3xl font-black text-[#F3DDC4] font-display">
                  {activeProduct.name}
                </h3>
                <span className="text-xl font-black text-[#78BDB6] font-display">
                  {(activeProduct.price * quantity).toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E2B88F]/70 leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            {/* Custom Sleeve Text Input */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#1C110D] border border-[#3C2922]">
              <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-[#C68A52]" />
                <span>حک متن اختصاصی روی کمربند کاپ (ارسال با نام دلخواه):</span>
              </label>

              <input
                type="text"
                maxLength={35}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="متن دلخواه خود را بنویسید (مثلاً: برای سارا ❤️)..."
                className="w-full bg-[#160D0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
              />

              {/* Suggestion Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_TEXTS.map((sugg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      coffeeSoundManager.playClickSound();
                      setCustomText(sugg);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#241712] hover:bg-[#322019] text-[#E2B88F] border border-[#3C2922] transition-colors cursor-pointer"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleeve Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#E2B88F]/80 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#78BDB6]" />
                <span>رنگ و بافت کمربند کاپ:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SLEEVE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      coffeeSoundManager.playClickSound();
                      setSelectedStyle(style);
                    }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedStyle.id === style.id
                        ? 'bg-[#2B1B16] border-[#78BDB6] text-[#F3DDC4] shadow-md'
                        : 'bg-[#180E0B] border-[#3C2922] text-[#E2B88F]/60'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: style.borderColor }}
                    />
                    <span className="truncate">{style.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Milk and Syrup Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Milk Options */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#E2B88F]/80 block">
                  انتخاب شیر:
                </label>
                <select
                  value={selectedMilk}
                  onChange={(e) => setSelectedMilk(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                >
                  <option value="شیر تازه محلی">شیر تازه محلی (۳.۲٪)</option>
                  <option value="شیر جو دوسر">شیر جو دوسر Barista (وگان)</option>
                  <option value="شیر بادام">شیر بادام ارگانیک</option>
                  <option value="شیر نارگیل">شیر نارگیل کرمی</option>
                  <option value="بدون شیر">بدون شیر (قهوه سیاه)</option>
                </select>
              </div>

              {/* Syrup Options */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#E2B88F]/80 block">
                  سیروپ و طعم‌یاد:
                </label>
                <select
                  value={selectedSyrup}
                  onChange={(e) => setSelectedSyrup(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none focus:border-[#C68A52]"
                >
                  <option value="بدون سیروپ">بدون سیروپ (ارگانیک)</option>
                  <option value="کارامل نمکی">کارامل نمکی دست‌ساز</option>
                  <option value="شکلات بلژیکی">شکلات تلخ ۷۰٪ بلژیکی</option>
                  <option value="فندق بو داده">فندق بو داده</option>
                  <option value="وانیل ماداگاسکار">وانیل خالص ماداگاسکار</option>
                </select>
              </div>
            </div>

            {/* Action Buttons: Add to cart with custom sleeve & Quick Buy */}
            <div className="pt-4 border-t border-[#3C2922] flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(120,189,182,0.35)] cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>به سبد اضافه شد!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>افزودن به سبد با کاپ اختصاصی</span>
                  </>
                )}
              </button>

              <button
                onClick={handleQuickBuy}
                className="flex items-center justify-center gap-1.5 py-3.5 px-6 rounded-full bg-[#2B1B16] hover:bg-[#3C2922] text-[#78BDB6] border border-[#78BDB6]/50 font-bold text-sm transition-all cursor-pointer hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>خرید سریع یک کلیکه</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
