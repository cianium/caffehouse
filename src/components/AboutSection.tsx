import React, { useState } from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Coffee, Users, ChevronLeft } from 'lucide-react';
import { coffeeSoundManager } from '../utils/soundAmbience';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface FeatureItem {
  num: string;
  title: string;
  description: string;
  subtext: string;
  icon: React.ReactNode;
  tag: string;
}

export const AboutSection: React.FC = () => {
  const { siteInfo } = useSiteSettings();
  const [activeFeature, setActiveFeature] = useState(0);

  const features: FeatureItem[] = [
    {
      num: '۰۱',
      title: 'بالاترین کیفیت دانه‌های قهوه',
      description:
        'ما با وسواس دانه‌های ۱۰۰٪ عربیکا کلاس اسپشیالتی (Q-Score +85) را مستقیماً از برترین مزارع مرتفع اتیوپی، کلمبیا و کنیا تامین می‌کنیم. برشته‌کاری در دسته‌های کوچک و به صورت هفتگی انجام می‌شود تا ترپین‌ها و طعم زنده میوه قهوه حفظ شود.',
      subtext: 'برشته‌کاری هفتگی • واردات مستقیم مزرعه',
      icon: <Coffee className="w-6 h-6 text-[#C68A52]" />,
      tag: 'مزارع و برشته‌کاری',
    },
    {
      num: '۰۲',
      title: 'رویکرد اختصاصی برای هر میهمان',
      description:
        'قهوه‌ای پرملات یا سبک و ابریشمی؟ نسبت‌های عصاره‌گیری، زمان پیش‌خیس‌خوردگی، میزان آسیاب و دمای دقیق سرو را متناسب با سلیقه شما سفارشی‌سازی می‌کنیم.',
      subtext: '۵ مدل شیر گیاهی • تنظیم غلظت و دما',
      icon: <HeartHandshake className="w-6 h-6 text-[#78BDB6]" />,
      tag: 'شخصی‌سازی طعم',
    },
    {
      num: '۰۳',
      title: 'فضایی دلنشین، آرام و الهام‌بخش',
      description:
        'کافه بودرین واحه و پناهگاهی آرام در قلب هیاهوی پایتخت است. نورپردازی ملایم، معماری با چوب بلوط، عطر شگفت‌انگیز آسیاب دانه و پلی‌لیست‌های اختصاصی آرامش‌بخش.',
      subtext: 'محیط کار اختصاصی با لپ‌تاپ • صندلی‌های ارگونومیک',
      icon: <Sparkles className="w-6 h-6 text-[#E2B88F]" />,
      tag: 'معماری و اتمسفر',
    },
    {
      num: '۰۴',
      title: 'تیم حرفه‌ای و باریستاهای برتر',
      description:
        'باریستاهای ما دوره‌های پیشرفته بین‌المللی انجمن قهوه تخصصی (SCA) را گذرانده‌اند. دانش شیمی آب، کالیبره میکرونی تیغه‌ها و لاته آرت ظریف، ضامن کیفیت هر فنجان است.',
      subtext: 'گواهی‌نامه رسمی SCA • باریستاهای مدال‌آور',
      icon: <Users className="w-6 h-6 text-[#C68A52]" />,
      tag: 'مهارت و تخصص',
    },
  ];

  const handleFeatureClick = (index: number) => {
    coffeeSoundManager.playClickSound();
    setActiveFeature(index);
  };

  return (
    <section id="about" className="relative py-28 bg-[#1A100D] overflow-hidden text-right">
      {/* Background Ambience & Large Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(198,138,82,0.12)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(120,189,182,0.1)_0%,_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B1B16] border border-[#C68A52]/30 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#78BDB6]" />
            <span className="text-xs font-semibold tracking-wider text-[#E2B88F]">
              فلسفه و اصالت برند
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F3DDC4] tracking-tight font-display">
            داستان و تعهدات {siteInfo.siteName}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#E2B88F]/75 leading-relaxed">
            چهار اصل بنیادین که هویت هر فنجان قهوه ما بر آن‌ها استوار است. تعهدی بی‌قید و شرط به اصالت طعم و احساس خوشایند شما.
          </p>
        </div>

        {/* Feature Grid: 2 columns with giant watermark numbers & editorial styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((item, index) => (
            <div
              key={item.num}
              onClick={() => handleFeatureClick(index)}
              className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-500 border cursor-pointer select-none overflow-hidden ${
                activeFeature === index
                  ? 'bg-gradient-to-bl from-[#2D1C17] via-[#241712] to-[#1C110D] border-[#C68A52]/60 shadow-[0_20px_45px_rgba(198,138,82,0.15)] scale-[1.01]'
                  : 'bg-[#211410]/80 border-[#3C2922]/50 hover:border-[#C68A52]/30 hover:bg-[#251712]'
              }`}
            >
              {/* Giant Translucent Background Number (01, 02, 03, 04) */}
              <span
                className={`absolute -bottom-6 -left-4 font-black font-display text-[120px] sm:text-[140px] leading-none pointer-events-none transition-colors duration-500 ${
                  activeFeature === index ? 'text-[#C68A52]/15' : 'text-[#3C2922]/20'
                }`}
              >
                {item.num}
              </span>

              {/* Top Tag & Icon */}
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#160D0B]/80 border border-[#C68A52]/30 shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-[#C68A52]">
                    {item.tag}
                  </span>
                </div>

                <span className="font-mono font-bold text-lg text-[#78BDB6]/80">
                  {item.num} / ۰۴
                </span>
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-[#F3DDC4] mb-4 font-display">
                {item.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm sm:text-base text-[#E2B88F]/80 leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Subtext Highlight */}
              <div className="relative z-10 pt-4 border-t border-[#3C2922]/60 flex items-center justify-between text-xs font-semibold text-[#E2B88F]/60">
                <span>{item.subtext}</span>
                <ChevronLeft
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeFeature === index ? '-translate-x-1 text-[#C68A52]' : 'text-[#E2B88F]/30'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
