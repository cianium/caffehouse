import React, { useState } from 'react';
import {
  Coffee,
  MapPin,
  Clock,
  Send,
  Play,
  Sparkles,
  Phone,
  Sliders,
  Instagram,
  Send as TelegramIcon,
  MessageCircle,
  Twitter,
  Youtube,
  ExternalLink,
  Shield,
  Download
} from 'lucide-react';
import { coffeeSoundManager } from '../utils/soundAmbience';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface FooterProps {
  onReplayPreloader: () => void;
  onNavClick: (sectionId: string) => void;
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayPreloader, onNavClick, onNavigate }) => {
  const { siteInfo, socialLinks } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    coffeeSoundManager.playClickSound();
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3500);
  };

  const handleNav = (id: string) => {
    coffeeSoundManager.playClickSound();
    onNavClick(id);
  };

  return (
    <footer className="relative bg-[#120907] border-t border-[#3C2922] pt-20 pb-12 overflow-hidden select-none text-right" dir="rtl">
      {/* Background radial highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,_rgba(198,138,82,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#2B1B16]">
          {/* Col 1: Brand & Slogan (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#C68A52]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-widest text-[#F3DDC4] font-display block leading-none">
                  {siteInfo.siteNameEn || 'BODRIN'}
                </span>
                <span className="text-[11px] text-[#78BDB6] font-bold tracking-wider">
                  {siteInfo.siteName}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#C68A52] tracking-wide">
              {siteInfo.slogan}
            </p>

            <p className="text-xs text-[#E2B88F]/70 leading-relaxed max-w-sm">
              {siteInfo.description}
            </p>

            {/* Social Media Links with Real working URLs */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2B88F]/80 block mb-2.5">
                شبکه‌های اجتماعی رسمی {siteInfo.siteName}:
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="اینستاگرام"
                    className="w-8 h-8 rounded-xl bg-[#241712] hover:bg-[#e1306c]/20 border border-[#3C2922] hover:border-[#e1306c] text-[#E2B88F] hover:text-[#e1306c] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.telegram && (
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="تلگرام"
                    className="w-8 h-8 rounded-xl bg-[#241712] hover:bg-[#0088cc]/20 border border-[#3C2922] hover:border-[#0088cc] text-[#E2B88F] hover:text-[#0088cc] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                  >
                    <TelegramIcon className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="واتس‌اپ"
                    className="w-8 h-8 rounded-xl bg-[#241712] hover:bg-[#25d366]/20 border border-[#3C2922] hover:border-[#25d366] text-[#E2B88F] hover:text-[#25d366] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="توییتر / X"
                    className="w-8 h-8 rounded-xl bg-[#241712] hover:bg-[#1da1f2]/20 border border-[#3C2922] hover:border-[#1da1f2] text-[#E2B88F] hover:text-[#1da1f2] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="یوتیوب"
                    className="w-8 h-8 rounded-xl bg-[#241712] hover:bg-red-500/20 border border-[#3C2922] hover:border-red-500 text-[#E2B88F] hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  onReplayPreloader();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241712] hover:bg-[#322019] border border-[#C68A52]/40 text-[11px] font-semibold text-[#E2B88F] transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#78BDB6] fill-[#78BDB6] rotate-180" />
                <span>پخش مجدد ۳D اینترو</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C68A52]">
              بخش‌های سایت
            </h4>
            <ul className="space-y-2 text-xs text-[#E2B88F]/75">
              <li>
                <button
                  onClick={() => handleNav('hero')}
                  className="hover:text-[#78BDB6] transition-colors cursor-pointer"
                >
                  خانه و معرفی
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-[#78BDB6] transition-colors cursor-pointer"
                >
                  منوی قهوه‌ها و سفارش
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#78BDB6] transition-colors cursor-pointer"
                >
                  فلسفه برند {siteInfo.siteName}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="hover:text-[#78BDB6] transition-colors cursor-pointer"
                >
                  دیدگاه میهمانان
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('quiz')}
                  className="hover:text-[#78BDB6] transition-colors cursor-pointer"
                >
                  آزمون سلیقه طعم
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Locations & Working Hours & Phone (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C68A52]">
              شعب و اطلاعات تماس
            </h4>
            <div className="space-y-3 text-xs text-[#E2B88F]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#78BDB6] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#F3DDC4]">شعبه مرکزی:</p>
                  <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">{siteInfo.address}</p>
                </div>
              </div>

              {siteInfo.branchSecondary && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C68A52] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#F3DDC4]">شعبه دوم:</p>
                    <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">{siteInfo.branchSecondary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#78BDB6] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#F3DDC4]">تلفن سفارشات و پشتیبانی:</p>
                  <p className="text-[11px] text-[#E2B88F]/70 font-mono">{siteInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#C68A52] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#E2B88F]/70">
                  {siteInfo.workingHours} • ارسال فوری با بسته‌بندی عایق
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Club (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C68A52]">
              باشگاه همراهان {siteInfo.siteName}
            </h4>
            <p className="text-xs text-[#E2B88F]/70 leading-relaxed">
              با ثبت ایمیل خود، کد تخفیف فوری ۱۵٪ به همراه دعوت‌نامه اختصاصی دریافت کنید.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A100C] border border-[#3C2922] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/40 focus:outline-none focus:border-[#78BDB6] text-right"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-[#78BDB6]">
                  سپاسگزاریم! کد تخفیف ۱۵٪ به ایمیل شما ارسال گردید.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Credits, Staff Portal & Award Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E2B88F]/50">
          <p>© ۲۰۲۴–۲۰۲۶ تمامی حقوق متعلق به کافه {siteInfo.siteName} ({siteInfo.siteNameEn}) است.</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Project ZIP Download Link */}
            <a
              href="/bodrin-coffee-project.zip"
              download="bodrin-coffee-project.zip"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B88F]/10 hover:bg-[#78BDB6]/20 border border-[#E2B88F]/20 hover:border-[#78BDB6]/50 text-[11px] text-[#F3DDC4] hover:text-[#78BDB6] transition-all duration-300"
              title="دانلود فایل کامل پروژه به صورت فایل زیپ (ZIP)"
              onClick={() => coffeeSoundManager.playClickSound()}
            >
              <Download className="w-3.5 h-3.5 text-[#78BDB6]" />
              <span className="font-medium">دانلود سورس کامل پروژه (ZIP)</span>
            </a>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                onNavigate?.('admin-login');
              }}
              className="flex items-center gap-1.5 text-[11px] text-[#E2B88F]/60 hover:text-[#78BDB6] transition-colors cursor-pointer"
              title="ورود به سامانه پرسنل و مدیریت کافه"
            >
              <Shield className="w-3.5 h-3.5 text-[#C68A52]" />
              <span>پورتال مدیریت</span>
            </button>

            <div className="flex items-center gap-1.5 text-[#78BDB6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider text-[11px]">
                طراحی مدرن و تخصصی
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
