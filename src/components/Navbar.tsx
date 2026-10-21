import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Volume2, VolumeX, Menu, X, Coffee, Award, Sparkles, Clock, RotateCcw, Package, CheckCircle2, MapPin, Zap, Settings, Film, Gift, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { coffeeSoundManager } from '../utils/soundAmbience';
import { BodrinRewards } from './BodrinRewards';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const {
    totalCount,
    setIsCartOpen,
    orders,
    claimRewardFreeDrink,
    repeatOrder,
    quickBuyProfile,
    updateQuickBuyProfile,
    isCinematicEnabled,
    toggleCinematicOverlay,
    setIsBrewGuideOpen,
  } = useCart();
  const { siteInfo } = useSiteSettings();

  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userTab, setUserTab] = useState<'loyalty' | 'orders' | 'settings'>('loyalty');

  // Local state for editing Quick Buy address
  const [editAddress, setEditAddress] = useState(quickBuyProfile.address);
  const [editPhone, setEditPhone] = useState(quickBuyProfile.phone);

  useEffect(() => {
    setEditAddress(quickBuyProfile.address);
    setEditPhone(quickBuyProfile.phone);
  }, [quickBuyProfile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'menu', 'about', 'reviews', 'quiz'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state with audio manager
  useEffect(() => {
    const unsubscribe = coffeeSoundManager.subscribe((playing) => {
      setIsAudioPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    coffeeSoundManager.playClickSound();
    coffeeSoundManager.toggle();
  };

  const navItems = [
    { id: 'hero', label: 'خانه' },
    { id: 'menu', label: 'منو و قیمت‌ها' },
    { id: 'about', label: 'درباره بودرین' },
    { id: 'reviews', label: 'دیدگاه میهمانان' },
    { id: 'quiz', label: 'آزمون سلیقه' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    updateQuickBuyProfile({
      address: editAddress,
      phone: editPhone,
    });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 pointer-events-none select-none`}
        dir="rtl"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 px-5 sm:px-7 py-3 rounded-full transition-all duration-500 max-w-6xl w-full ${
            isScrolled
              ? 'bg-[#1A100C]/90 border border-[#C68A52]/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl'
              : 'bg-[#221511]/60 border border-[#C68A52]/15 backdrop-blur-md'
          }`}
        >
          {/* Brand Logo with dynamic Site Name */}
          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              onNavClick('hero');
            }}
            className="flex items-center gap-2.5 text-right group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Coffee className="w-4 h-4 text-[#C68A52]" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-[#F3DDC4] font-display leading-tight">
                {siteInfo.siteNameEn || 'BODRIN'}
              </span>
              <span className="text-[10px] text-[#78BDB6] font-bold tracking-wider leading-none">
                {siteInfo.siteName}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#160D0B]/80 border border-[#3C2922]/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  onNavClick(item.id);
                }}
                onMouseEnter={() => coffeeSoundManager.playHoverSound()}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-sm'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right-side Actions: Sound, Admin, Brew Guide, User, Cart, CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dedicated Audio Ambience Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioPlaying ? 'قطع موسیقی محیطی کافه' : 'پخش موسیقی ملایم و صمیمی کافه'}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#78BDB6]/20 text-[#78BDB6] border border-[#78BDB6]/50 shadow-[0_0_15px_rgba(120,189,182,0.25)]'
                  : 'bg-[#2B1B16]/80 text-[#E2B88F]/70 hover:text-[#F3DDC4] border border-[#3C2922]'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#78BDB6]" />
                  <div className="hidden sm:flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#78BDB6] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                    <span className="w-0.5 bg-[#78BDB6] rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-3" />
                    <span className="w-0.5 bg-[#78BDB6] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-1.5" />
                  </div>
                </>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Brew Guide Modal Button */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsBrewGuideOpen(true);
              }}
              title="راهنمای دم‌آوری قهوه در خانه (تایمر V60، فرنچ پرس، ائروپرس)"
              className="relative p-2 sm:p-2.5 rounded-full bg-[#2B1B16]/80 text-[#E2B88F]/80 hover:text-[#78BDB6] border border-[#3C2922] hover:border-[#78BDB6]/50 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4" />
            </button>

            {/* User Account Button with Orders indicator */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsUserModalOpen(true);
              }}
              title="حساب کاربری، سوابق سفارش‌ها و پاداش‌ها"
              className="relative p-2 sm:p-2.5 rounded-full bg-[#2B1B16]/80 text-[#E2B88F]/70 hover:text-[#F3DDC4] border border-[#3C2922] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              {orders.length > 0 && (
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#78BDB6]" />
              )}
            </button>

            {/* Shopping Cart Button with Animated Badge */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsCartOpen(true);
              }}
              title="مشاهده سبد خرید و ثبت سفارش"
              className="relative p-2 sm:p-2.5 rounded-full bg-[#2B1B16]/80 text-[#E2B88F]/90 hover:text-[#F3DDC4] border border-[#C68A52]/40 hover:border-[#C68A52] transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#78BDB6] text-[#160D0B] text-[10px] font-black flex items-center justify-center animate-bounce shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Quick Order CTA */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                onNavClick('menu');
              }}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(120,189,182,0.3)] hover:scale-105 cursor-pointer"
            >
              <span>سفارش منو</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-full bg-[#2B1B16] text-[#E2B88F] border border-[#3C2922] cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#160D0B]/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden text-right" dir="rtl">
          <div className="flex items-center justify-between pb-6 border-b border-[#3C2922]">
            <span className="text-2xl font-black text-[#F3DDC4] font-display">
              {siteInfo.siteNameEn || 'BODRIN'}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-[#2B1B16] text-[#E2B88F] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavClick(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xl font-bold text-right text-[#F3DDC4] hover:text-[#C68A52] transition-colors cursor-pointer font-display"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsUserModalOpen(true);
                setUserTab('orders');
              }}
              className="text-xl font-bold text-right text-[#78BDB6] hover:text-[#F3DDC4] transition-colors cursor-pointer font-display flex items-center justify-between"
            >
              <span>سفارش‌های من</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6]">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsMobileMenuOpen(false);
                setIsBrewGuideOpen(true);
              }}
              className="text-xl font-bold text-right text-[#C68A52] hover:text-[#F3DDC4] transition-colors cursor-pointer font-display flex items-center justify-between"
            >
              <span>راهنمای دم‌آوری خانگی</span>
              <Clock className="w-5 h-5 text-[#C68A52]" />
            </button>
          </nav>

          <div className="pt-6 border-t border-[#3C2922] space-y-3">
            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-4 rounded-full bg-[#78BDB6] text-[#160D0B] font-bold text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سبد سفارش ({totalCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* User Account / Loyalty / Orders / Settings Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-right select-none" dir="rtl">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#261813] via-[#1F130F] to-[#160D0B] border border-[#C68A52]/40 p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsUserModalOpen(false);
              }}
              className="absolute top-5 left-5 p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 pl-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C68A52] to-[#78BDB6] p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#160D0B] flex items-center justify-center text-[#F3DDC4] font-black text-lg font-display">
                  ک‌ر
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#F3DDC4] font-display">
                  {quickBuyProfile.recipientName}
                </h4>
                <p className="text-xs text-[#E2B88F]/70 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#78BDB6]" />
                  <span>عضو طلایی باشگاه میهمانان BODRIN Friends</span>
                </p>
              </div>
            </div>

            {/* Tab Navigation: باشگاه مشتریان, سفارش‌های من, تنظیمات خرید سریع */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#160D0B] border border-[#3C2922] mb-6">
              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setUserTab('loyalty');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userTab === 'loyalty'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>پاداش‌های بودرین</span>
              </button>

              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setUserTab('orders');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userTab === 'orders'
                    ? 'bg-[#78BDB6] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>سفارش‌ها</span>
                {orders.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      userTab === 'orders' ? 'bg-[#160D0B] text-[#78BDB6]' : 'bg-[#78BDB6]/20 text-[#78BDB6]'
                    }`}
                  >
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setUserTab('settings');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userTab === 'settings'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>خرید سریع</span>
              </button>
            </div>

            {/* Modal Body with Scrollable Area */}
            <div className="flex-1 overflow-y-auto pl-1 space-y-4">
              {userTab === 'loyalty' ? (
                /* BODRIN Rewards Component */
                <BodrinRewards onCloseParentDrawer={() => setIsUserModalOpen(false)} />
              ) : userTab === 'orders' ? (
                /* My Orders Tab */
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 text-[#E2B88F]/60">
                      <Package className="w-12 h-12 stroke-[1.2] mb-3 text-[#3C2922]" />
                      <p className="text-base font-semibold text-[#F3DDC4] mb-1">
                        تاریخچه سفارشات شما خالی است
                      </p>
                      <p className="text-xs text-[#E2B88F]/60 max-w-xs mb-4">
                        پس از ثبت نخستین سفارش، جزئیات آن در این بخش ثبت و قابل تکرار خواهد بود.
                      </p>
                      <button
                        onClick={() => {
                          setIsUserModalOpen(false);
                          onNavClick('menu');
                        }}
                        className="px-5 py-2.5 rounded-full bg-[#C68A52] text-[#160D0B] font-bold text-xs uppercase tracking-wider hover:bg-[#d8995e] transition-all cursor-pointer"
                      >
                        مشاهده منو
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl bg-[#1E120D] border border-[#3C2922] hover:border-[#C68A52]/40 transition-all space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#2C1B15]">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-[#F3DDC4]">
                              سفارش #{order.orderNumber}
                            </span>
                            {order.isQuickBuy && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] font-bold flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" />
                                خرید سریع
                              </span>
                            )}
                            <span className="text-[11px] text-[#E2B88F]/50">
                              {order.date}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                              order.status === 'در حال آماده‌سازی' || order.status === 'Готовится'
                                ? 'bg-[#78BDB6]/20 text-[#78BDB6] border border-[#78BDB6]/40'
                                : 'bg-[#C68A52]/20 text-[#C68A52] border border-[#C68A52]/30'
                            }`}
                          >
                            {(order.status === 'در حال آماده‌سازی' || order.status === 'Готовится') && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#78BDB6] animate-pulse" />
                            )}
                            {(order.status === 'تحویل داده شده' || order.status === 'Выдан') && (
                              <CheckCircle2 className="w-3 h-3 text-[#C68A52]" />
                            )}
                            <span>{order.status}</span>
                          </span>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs text-[#E2B88F]/90"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#F3DDC4]">
                                  {item.quantity} × {item.product.name}
                                </span>
                                <span className="text-[11px] text-[#E2B88F]/50">
                                  ({item.product.volume})
                                </span>
                                {(item.selectedMilk || item.selectedSyrup) && (
                                  <span className="text-[10px] text-[#78BDB6]">
                                    [{item.selectedMilk || ''}
                                    {item.selectedSyrup ? ` + ${item.selectedSyrup}` : ''}]
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-[#C68A52]">
                                {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer: Delivery info, Total, and Repeat Order Button */}
                        <div className="pt-2 border-t border-[#2C1B15] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#E2B88F]/70">
                            {order.deliveryType === 'pickup' ? (
                              <>
                                <MapPin className="w-3.5 h-3.5 text-[#C68A52]" />
                                <span>تحویل حضوری</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-[#78BDB6]" />
                                <span>ارسال فوری با پیک</span>
                              </>
                            )}
                            <span className="text-[#3C2922]">•</span>
                            <span className="font-bold text-[#F3DDC4]">
                              مجموع: {order.finalPrice.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>

                          {/* Re-order Button */}
                          <button
                            onClick={() => {
                              repeatOrder(order);
                              setIsUserModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B1B16] hover:bg-[#3C2922] text-[#78BDB6] border border-[#78BDB6]/40 hover:border-[#78BDB6] text-[11px] font-bold transition-all cursor-pointer hover:scale-105"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>سفارش مجدد</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Settings & Quick Buy Configuration Tab */
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {/* Quick Buy Toggle Card */}
                  <div className="p-4 rounded-2xl bg-[#1E120D] border border-[#78BDB6]/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#78BDB6]/20 flex items-center justify-center text-[#78BDB6]">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#F3DDC4]">حالت خرید فوق سریع با یک کلیک</p>
                        <p className="text-[11px] text-[#E2B88F]/70 mt-0.5">ثبت آنی سفارش بدون طی مراحل سبد خرید</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={quickBuyProfile.isEnabled}
                      onChange={(e) => updateQuickBuyProfile({ isEnabled: e.target.checked })}
                      className="w-5 h-5 accent-[#78BDB6] cursor-pointer"
                    />
                  </div>

                  {/* Cinematic Film Grain & Bloom Toggle */}
                  <div className="p-4 rounded-2xl bg-[#1E120D] border border-[#C68A52]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C68A52]/20 flex items-center justify-center text-[#C68A52]">
                        <Film className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#F3DDC4]">افکت سینمایی فیلم‌گرین و بلوم</p>
                        <p className="text-[11px] text-[#E2B88F]/70 mt-0.5">افزودن بافت آنالوگ ۳۵ میلی‌متری و هاله نور</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCinematicOverlay}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isCinematicEnabled
                          ? 'bg-[#78BDB6] text-[#160D0B]'
                          : 'bg-[#2B1B16] text-[#E2B88F]/60 border border-[#3C2922]'
                      }`}
                    >
                      {isCinematicEnabled ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>

                  {/* Saved Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#E2B88F]/80 block">
                      نشانی پیش‌فرض جهت تحویل فوری پیک
                    </label>
                    <textarea
                      rows={2}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full bg-[#160D0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl p-3 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/40 focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#E2B88F]/80 block">
                      شماره تماس همراه جهت هماهنگی پیک
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#160D0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3 py-2 text-xs text-[#F3DDC4] focus:outline-none text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    ذخیره تغییرات تنظیمات
                  </button>
                </form>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="pt-4 mt-auto border-t border-[#3C2922]">
              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setIsUserModalOpen(false);
                }}
                className="w-full py-3 rounded-full bg-[#C68A52] text-[#160D0B] font-bold text-xs uppercase tracking-wider hover:bg-[#d8995e] transition-all cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
