import React, { useState, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { ProductCustomizerModal } from './ProductCustomizerModal';
import { Product } from '../types/coffee';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Sparkles, Layers, SlidersHorizontal, BookOpen, Clock, Edit3, Grid3X3, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { coffeeSoundManager } from '../utils/soundAmbience';

export const ProductShowcase: React.FC = () => {
  const { setIsBrewGuideOpen } = useCart();
  const { products } = useSiteSettings();
  const [filter, setFilter] = useState<'all' | 'espresso' | 'milk' | 'specialty' | 'cold'>('all');
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'grid'>('horizontal');
  const [selectedCustomizerProduct, setSelectedCustomizerProduct] = useState<Product | null>(null);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    filter === 'all'
      ? products
      : products.filter((p) => p.category === filter);

  const handleFilterClick = (newFilter: 'all' | 'espresso' | 'milk' | 'specialty' | 'cold') => {
    coffeeSoundManager.playClickSound();
    setFilter(newFilter);
  };

  const scrollHorizontal = (direction: 'left' | 'right') => {
    coffeeSoundManager.playClickSound();
    if (horizontalScrollRef.current) {
      const scrollAmount = 360;
      horizontalScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="menu" className="relative py-28 bg-[#160D0B] overflow-hidden text-right" dir="rtl">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(60,41,34,0.3)_0%,_transparent_70%)] pointer-events-none" />

      {/* Decorative large background text */}
      <div className="absolute top-12 left-0 right-0 overflow-hidden select-none pointer-events-none opacity-[0.03]">
        <div className="text-[14vw] font-black text-center text-[#F3DDC4] font-display whitespace-nowrap">
          SIGNATURE BLENDS
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B1B16] border border-[#C68A52]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C68A52]" />
              <span className="text-xs font-semibold tracking-wider text-[#E2B88F]">
                منوی حرفه‌ای و دسته‌بندی محصولات
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F3DDC4] tracking-tight font-display">
              مجموعه طعم‌های اصیل بودرین
            </h2>
            <p className="mt-4 text-base text-[#E2B88F]/75 leading-relaxed">
              هر دستورالعمل با دقت میلی‌گرمی کالیبره شده است: دمای ایده‌آل شیر، آسیاب دقیق دانه‌ها قبل از عصاره‌گیری و عطر مسحورکننده عربیکای صد در صد دست‌چین.
            </p>
          </div>

          {/* Controls: Category Filter Bar & Layout Toggle */}
          <div className="flex flex-col gap-3">
            {/* Category Filter Horizontal Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#221511] border border-[#3C2922] backdrop-blur-md overflow-x-auto max-w-full">
              <button
                onClick={() => handleFilterClick('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                همه ({products.length})
              </button>
              <button
                onClick={() => handleFilterClick('espresso')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === 'espresso'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                اسپرسو بار
              </button>
              <button
                onClick={() => handleFilterClick('milk')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === 'milk'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                پایه شیر
              </button>
              <button
                onClick={() => handleFilterClick('specialty')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === 'specialty'
                    ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                دم‌آوری تخصصی
              </button>
              <button
                onClick={() => handleFilterClick('cold')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === 'cold'
                    ? 'bg-[#78BDB6] text-[#160D0B] shadow-md'
                    : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                سرد و خنک
              </button>
            </div>

            {/* Layout switch & Brew guide trigger */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#221511] border border-[#3C2922]">
                <button
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    setLayoutMode('horizontal');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    layoutMode === 'horizontal'
                      ? 'bg-[#78BDB6] text-[#160D0B] shadow-sm'
                      : 'text-[#E2B88F]/60 hover:text-[#F3DDC4]'
                  }`}
                  title="منوی گرید افقی با اسکرول نرم"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>گرید افقی</span>
                </button>

                <button
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    setLayoutMode('grid');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    layoutMode === 'grid'
                      ? 'bg-[#C68A52] text-[#160D0B] shadow-sm'
                      : 'text-[#E2B88F]/60 hover:text-[#F3DDC4]'
                  }`}
                  title="نمایش شبکه‌ای ستونی"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>شبکه‌ای</span>
                </button>
              </div>

              {/* Horizontal Navigation Arrows (visible in horizontal mode) */}
              {layoutMode === 'horizontal' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollHorizontal('right')}
                    className="p-2 rounded-xl bg-[#221511] hover:bg-[#322019] text-[#E2B88F] border border-[#3C2922] transition-colors cursor-pointer"
                    title="مشاهده بعدی"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollHorizontal('left')}
                    className="p-2 rounded-xl bg-[#221511] hover:bg-[#322019] text-[#E2B88F] border border-[#3C2922] transition-colors cursor-pointer"
                    title="مشاهده قبلی"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Brew Guide Trigger Button */}
              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setIsBrewGuideOpen(true);
                }}
                title="راهنمای تعاملی دم‌آوری قهوه در خانه با تایمر باریستا"
                className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#78BDB6]/15 hover:bg-[#78BDB6] text-[#78BDB6] hover:text-[#160D0B] border border-[#78BDB6]/40 transition-all text-xs font-bold cursor-pointer hover:scale-105 shadow-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>راهنمای دم‌آوری</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Container: Horizontal Grid vs Multi-Column Grid */}
        {layoutMode === 'horizontal' ? (
          <div
            ref={horizontalScrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="min-w-[320px] sm:min-w-[360px] max-w-[380px] shrink-0 snap-start">
                <ProductCard
                  product={product}
                  index={index}
                  onCustomize={(p) => setSelectedCustomizerProduct(p)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onCustomize={(p) => setSelectedCustomizerProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Feature Banner: 3D Custom Sleeve & Plant Milks */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-l from-[#241712] via-[#2D1B16] to-[#241712] border border-[#C68A52]/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-[#C68A52]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#F3DDC4]">
                  سرو انواع شیر گیاهی بدون هزینه مازاد
                </h4>
                <p className="text-xs sm:text-sm text-[#E2B88F]/70 mt-1">
                  شیر جو دوسر، بادام، فندق و نارگیل نسخه باریستا — فقط کافیست سلیقه خود را در سفارش مشخص کنید.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              coffeeSoundManager.playClickSound();
              setSelectedCustomizerProduct(filteredProducts[0] || products[0]);
            }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-l from-[#192B28] via-[#162422] to-[#141F1D] border border-[#78BDB6]/30 flex items-center justify-between gap-4 cursor-pointer hover:border-[#78BDB6] transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#78BDB6]/20 border border-[#78BDB6]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Edit3 className="w-6 h-6 text-[#78BDB6]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#D9F7F4]">
                  امکان طراحی ۳بعدی و حک نام اختصاصی روی کمربند کاپ
                </h4>
                <p className="text-xs sm:text-sm text-[#A2E0DA]/80 mt-1">
                  متن دلخواه یا پیام محبت‌آمیز خود را بنویسید تا روی لیوان قهوه حک و ارسال شود.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#78BDB6] underline shrink-0 hidden sm:inline">
              شروع طراحی
            </span>
          </div>
        </div>
      </div>

      {/* 3D Takeaway Cup Sleeve Customizer Modal with Real-time Preview */}
      <ProductCustomizerModal
        product={selectedCustomizerProduct}
        onClose={() => setSelectedCustomizerProduct(null)}
      />
    </section>
  );
};
