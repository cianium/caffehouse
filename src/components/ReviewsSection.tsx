import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface Review {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  rating: number;
  date: string;
  comment: string;
  favoriteDrink: string;
}

export const ReviewsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews: Review[] = [
    {
      id: '1',
      name: 'آرش مهرابی',
      role: 'معمار و طراح ارشد فضای داخلی',
      avatarText: 'آم',
      rating: 5,
      date: 'دیروز',
      comment:
        'بهترین کاپوچینویی که بدون اغراق در تهران چشیده‌ام. فوم ابریشمی با دمای استاندارد ۶۵ درجه و شیرین بدون قند. مشخص است که دانه‌ها به صورت تخصصی و هفتگی برشته می‌شوند.',
      favoriteDrink: 'کاپوچینو ابریشمی ۳۰۰ میلی‌لیتر',
    },
    {
      id: '2',
      name: 'سارا دانشور',
      role: 'مدیر ارشد محصول (فناوری)',
      avatarText: 'س‌د',
      rating: 5,
      date: '۳ روز پیش',
      comment:
        'هر روز کاری من با لاته کارامل بودرین شروع می‌شود. سرو شیر جو دوسر باریستا بدون اضافه شدن مبالغ عجیب و غریب، نشانه مشتری‌مداری واقعی این برند است.',
      favoriteDrink: 'لاته مخملی با شیر جو دوسر',
    },
    {
      id: '3',
      name: 'نیما فرهمند',
      role: 'متخصص کنترل کیفی دانه (Q-Grader)',
      avatarText: 'ن‌ف',
      rating: 5,
      date: 'هفته گذشته',
      comment:
        'مهارت باریستاها در کالیبره کردن تیغه‌ها و بالانس طعمی کلد برو اتیوپی فوق‌العاده است. طعم‌یادهای شکوفه یاس و توت وحشی کاملاً در کاپ احساس می‌شوند.',
      favoriteDrink: 'کلد برو تونیک خنک',
    },
  ];

  const handlePrev = () => {
    coffeeSoundManager.playClickSound();
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    coffeeSoundManager.playClickSound();
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const activeReview = reviews[currentIndex];

  return (
    <section id="reviews" className="relative py-28 bg-[#1B110E] overflow-hidden text-right">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(120,189,182,0.08)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B1B16] border border-[#C68A52]/30 mb-4">
              <Star className="w-3.5 h-3.5 fill-[#C68A52] text-[#C68A52]" />
              <span className="text-xs font-semibold tracking-wider text-[#E2B88F]">
                دیدگاه همراهان و میهمانان
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F3DDC4] tracking-tight font-display">
              تجربه نوشیدن قهوه بودرین
            </h2>
            <p className="mt-4 text-base text-[#E2B88F]/75 leading-relaxed">
              بیش از ۴,۰۰۰ میهمان وفادار روزانه قهوه تخصصی و تازه خود را از شعب و سفارش آنلاین بودرین انتخاب می‌کنند.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="نظر قبلی"
              className="w-12 h-12 rounded-full bg-[#241712] border border-[#3C2922] hover:border-[#C68A52] text-[#E2B88F] flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="نظر بعدی"
              className="w-12 h-12 rounded-full bg-[#241712] border border-[#3C2922] hover:border-[#C68A52] text-[#E2B88F] flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-bl from-[#261813] via-[#20130F] to-[#180E0B] border border-[#C68A52]/30 backdrop-blur-xl shadow-2xl">
          <Quote className="absolute top-8 left-8 w-16 h-16 text-[#C68A52]/10 pointer-events-none rotate-180" />

          {/* Rating stars */}
          <div className="flex items-center gap-1.5 mb-6">
            {[...Array(activeReview.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#C68A52] text-[#C68A52]" />
            ))}
            <span className="mr-2 text-xs font-bold text-[#78BDB6] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              میهمان تاییدشده باشگاه بودرین
            </span>
          </div>

          {/* Comment */}
          <p className="text-xl sm:text-2xl text-[#F3DDC4] font-medium leading-relaxed mb-8 italic">
            «{activeReview.comment}»
          </p>

          {/* Author info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#3C2922]/70">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C68A52] to-[#78BDB6] p-0.5">
                <div className="w-full h-full rounded-full bg-[#160D0B] flex items-center justify-center font-bold text-sm text-[#F3DDC4]">
                  {activeReview.avatarText}
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#F3DDC4] font-display">
                  {activeReview.name}
                </h4>
                <p className="text-xs text-[#E2B88F]/60 mt-0.5">{activeReview.role}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#160D0B] border border-[#3C2922] text-xs text-[#E2B88F]/80">
              <span className="text-[#C68A52]">نوشیدنی محبوب:</span>
              <strong className="text-[#F3DDC4]">{activeReview.favoriteDrink}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
