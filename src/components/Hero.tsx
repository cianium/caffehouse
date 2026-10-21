import React, { useState } from 'react';
import { ArrowRight, Sparkles, Coffee, Award, Star } from 'lucide-react';
import { CoffeeScene } from './3d/CoffeeScene';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface HeroProps {
  onExploreClick: () => void;
  onQuizClick: () => void;
  scrollProgress: number;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onQuizClick, scrollProgress }) => {
  const { siteInfo } = useSiteSettings();
  const [activeDrink, setActiveDrink] = useState<'cappuccino' | 'latte' | 'mocha'>('latte');

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#160D0B]"
    >
      {/* Background Subtle Watermark & Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Giant architectural watermark text behind the scene */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[18vw] font-black tracking-widest text-[#241510]/60 whitespace-nowrap font-display select-none">
          {siteInfo.siteNameEn || 'BODRIN'}
        </span>

        {/* Ambient warm radial spotlight behind the 3D cup */}
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(198,138,82,0.18)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

        {/* Mint Turquoise subtle rim accent glow */}
        <div className="absolute top-[20%] right-[35%] w-[350px] h-[350px] bg-[radial-gradient(circle,_rgba(120,189,182,0.1)_0%,_transparent_70%)] blur-2xl pointer-events-none" />

        {/* Bottom fade into product section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#160D0B] to-transparent pointer-events-none" />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
        {/* Left Column: Hero Editorial Typography & CTAs (5 to 6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center text-right pt-6 lg:pt-0">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B1B16]/90 border border-[#C68A52]/30 w-fit mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#78BDB6]" />
            <span className="text-xs font-semibold tracking-wider text-[#E2B88F]">
              برشته‌کاری تخصصی • ۱۰۰٪ عربیکای اصیل
            </span>
          </div>

          {/* Large Bold Persian Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F3DDC4] leading-[1.25] tracking-tight mb-6 font-display">
            طعم بی‌نظیر قهوه را{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#E2B88F] via-[#C68A52] to-[#78BDB6]">
              در هر جرعه
            </span>{' '}
            کشف کنید!
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-[#E2B88F]/80 font-normal leading-relaxed mb-8 max-w-xl">
            قهوه ما در {siteInfo.siteName} یک هنر دست‌ساز و ناب است؛ {siteInfo.slogan}. به چشیدن یک فنجان بی‌نقص از دست برترین باریستاها خوش آمدید.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            {/* Signature Mint Turquoise CTA Button */}
            <button
              onClick={onExploreClick}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(120,189,182,0.35)] hover:shadow-[0_0_40px_rgba(120,189,182,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Coffee className="w-5 h-5 text-[#160D0B]" />
              <span>انتخاب و سفارش قهوه</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 rotate-180" />
            </button>

            {/* Secondary Quiz CTA */}
            <button
              onClick={onQuizClick}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#2B1B16]/80 hover:bg-[#3C2922] text-[#F3DDC4] border border-[#C68A52]/40 hover:border-[#C68A52] font-semibold text-sm tracking-wide transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-[#C68A52]" />
              <span>آزمون سلیقه قهوه</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3C2922]/80 max-w-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#C68A52] font-display font-bold text-lg sm:text-xl">
                <span>۱۵+ گونه</span>
              </div>
              <span className="text-xs text-[#E2B88F]/60">خاستگاه مزارع</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#78BDB6] font-display font-bold text-lg sm:text-xl">
                <Star className="w-4 h-4 fill-[#78BDB6]" />
                <span>۴.۹</span>
              </div>
              <span className="text-xs text-[#E2B88F]/60">رضایت مشتریان</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#E2B88F] font-display font-bold text-lg sm:text-xl">
                <Award className="w-4 h-4" />
                <span>۱۰۰٪</span>
              </div>
              <span className="text-xs text-[#E2B88F]/60">برشته‌کاری هفتگی</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Coffee Cup & Spectacular Splash Scene (6 to 7 cols) */}
        <div className="lg:col-span-6 h-[480px] sm:h-[560px] lg:h-[680px] w-full relative flex items-center justify-center">
          {/* Interactive 3D Canvas */}
          <CoffeeScene
            scrollProgress={scrollProgress}
            activeDrink={activeDrink}
            className="w-full h-full"
          />

          {/* Quick Interactive Drink Selection Pills */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-[#1A100C]/90 border border-[#C68A52]/30 backdrop-blur-md shadow-xl z-20">
            <button
              onClick={() => setActiveDrink('cappuccino')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                activeDrink === 'cappuccino'
                  ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
              }`}
            >
              کاپوچینو
            </button>
            <button
              onClick={() => setActiveDrink('latte')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                activeDrink === 'latte'
                  ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
              }`}
            >
              لاته
            </button>
            <button
              onClick={() => setActiveDrink('mocha')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                activeDrink === 'mocha'
                  ? 'bg-[#78BDB6] text-[#160D0B] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
              }`}
            >
              موکا
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
