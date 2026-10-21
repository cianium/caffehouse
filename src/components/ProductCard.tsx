import React, { useState } from 'react';
import { Plus, Check, Star, Zap, Edit3, Sparkles } from 'lucide-react';
import { Product } from '../types/coffee';
import { useCart } from '../context/CartContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface ProductCardProps {
  product: Product;
  index: number;
  onCustomize?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, onCustomize }) => {
  const { addToCart, triggerQuickBuy, quickBuyProfile } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    coffeeSoundManager.playHoverSound();
  };

  const handleCardClick = () => {
    if (onCustomize) {
      coffeeSoundManager.playClickSound();
      onCustomize(product);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    coffeeSoundManager.playClickSound();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    coffeeSoundManager.playClickSound();
    triggerQuickBuy(product);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-500 ease-out border border-[#C68A52]/20 hover:border-[#C68A52]/50 bg-gradient-to-b from-[#2B1B16]/90 via-[#221511]/85 to-[#1A100C]/95 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(198,138,82,0.18)] hover:-translate-y-2 cursor-pointer select-none overflow-hidden text-right"
    >
      {/* Background radial spotlight on hover */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(198,138,82,0.15)_0%,_transparent_75%)] transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Card Bar: Rating & Category Badge */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#160D0B]/80 border border-[#C68A52]/30 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-[#C68A52] text-[#C68A52]" />
          <span className="text-xs font-bold text-[#F3DDC4]">{product.rating.toFixed(1)}</span>
          <span className="text-[10px] text-[#E2B88F]/60">({product.reviewsCount})</span>
        </div>

        {product.badge && (
          <span className="px-3 py-1 rounded-full bg-[#78BDB6]/15 border border-[#78BDB6]/40 text-[#78BDB6] text-[11px] font-semibold tracking-wider">
            {product.badge}
          </span>
        )}
      </div>

      {/* Floating 3D Cup Visual with Realistic Perspective & Inertia */}
      <div className="relative z-10 my-4 h-56 sm:h-64 flex items-center justify-center">
        {/* Cup Contact Shadow */}
        <div
          className={`absolute bottom-2 w-36 h-6 rounded-full bg-black/60 blur-md transition-all duration-500 ${
            isHovered ? 'scale-75 opacity-40 translate-y-3' : 'scale-100 opacity-60'
          }`}
        />

        {/* Realistic Cup Graphic */}
        <div
          className={`relative transition-all duration-500 ease-out transform ${
            isHovered ? '-translate-y-4 scale-105 -rotate-2' : 'translate-y-0 scale-100 rotate-0'
          }`}
        >
          {/* Layered Photorealistic Cup with BODRIN sleeve */}
          <div className="relative w-36 h-48 sm:w-40 sm:h-52 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
            {/* Cup Lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-7 bg-gradient-to-b from-[#2B1B16] via-[#1A100C] to-[#120805] rounded-t-xl border-t border-[#C68A52]/30 shadow-md flex items-center justify-center">
              {/* Lid spout */}
              <div className="w-5 h-1.5 rounded-full bg-[#0A0503] -translate-y-1" />
            </div>

            {/* Lid Rim */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[90%] h-3 bg-[#241712] rounded-full border border-[#C68A52]/20 shadow-sm" />

            {/* Cup Body Container with trapezoid clip */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-[#2A1B16] via-[#1E120D] to-[#150B07] rounded-b-2xl overflow-hidden shadow-inner flex flex-col justify-center items-center">
              {/* Cup subtle vertical sheen */}
              <div className="absolute inset-y-0 right-3 w-4 bg-gradient-to-l from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* BODRIN Kraft Paper Sleeve */}
              <div className="relative w-full py-4 px-2 bg-gradient-to-r from-[#241713] via-[#331F18] to-[#241713] border-y border-[#C68A52]/40 shadow-md flex flex-col items-center justify-center">
                <span className="text-[9px] tracking-[0.25em] text-[#C68A52] font-semibold uppercase">
                  BODRIN
                </span>
                <span className="text-[12px] tracking-[0.2em] font-extrabold text-[#F3DDC4] font-display">
                  COFFEE
                </span>
                <div className="w-8 h-[1px] bg-[#78BDB6] my-0.5" />
                <span className="text-[9px] text-[#E2B88F]/80 font-medium tracking-wider">
                  {product.volume}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Cue for 3D Customizer */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#160D0B]/90 border border-[#78BDB6]/50 text-[10px] text-[#78BDB6] font-bold flex items-center gap-1.5 shadow-lg transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <Edit3 className="w-3 h-3" />
          <span>طراحی کمربند سه‌بعدی</span>
        </div>
      </div>

      {/* Flavor Notes Pill Tags */}
      <div className="relative z-10 flex flex-wrap gap-1.5 mb-3">
        {product.notes.map((note, i) => (
          <span
            key={i}
            className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#160D0B]/60 text-[#E2B88F]/90 border border-[#3C2922]"
          >
            {note}
          </span>
        ))}
      </div>

      {/* Product Titles & Description */}
      <div className="relative z-10 mb-6">
        <div className="flex items-baseline justify-between mb-1.5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#F3DDC4] font-display">
            {product.name}
          </h3>
          <span className="text-xs text-[#E2B88F]/50 font-sans">{product.nameEn}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#E2B88F]/70 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Card Bottom Bar: Price, Customizer button, Quick Buy, and Add to Cart */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#3C2922]/70 mt-auto gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#E2B88F]/60 uppercase tracking-wider font-medium">
            قیمت نهایی
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#F3DDC4] font-display">
              {product.price.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs font-bold text-[#C68A52]">تومان</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customizer Sleeve Button */}
          {onCustomize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                coffeeSoundManager.playClickSound();
                onCustomize(product);
              }}
              title="طراحی و حک متن دلخواه روی کمربند کاپ"
              className="flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-2xl bg-[#241712] hover:bg-[#322019] text-[#C68A52] hover:text-[#F3DDC4] border border-[#C68A52]/30 transition-all text-xs font-bold cursor-pointer hover:scale-105 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">طراحی کاپ</span>
            </button>
          )}

          {/* Quick Buy 1-Click Button */}
          {quickBuyProfile.isEnabled && (
            <button
              onClick={handleQuickBuy}
              title="خرید سریع با یک کلیک (بدون طی مراحل سبد خرید)"
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-2xl bg-[#78BDB6]/15 hover:bg-[#78BDB6] text-[#78BDB6] hover:text-[#160D0B] border border-[#78BDB6]/40 transition-all duration-300 text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">خرید سریع</span>
            </button>
          )}

          {/* Morphing Standard Add to Cart Button */}
          <button
            onClick={handleAdd}
            aria-label={`افزودن ${product.name} به سبد خرید`}
            className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl transition-all duration-300 shadow-lg cursor-pointer ${
              isAdded
                ? 'bg-[#78BDB6] text-[#160D0B] scale-105'
                : 'bg-[#C68A52] hover:bg-[#d8995e] text-[#160D0B] hover:scale-105'
            }`}
          >
            {isAdded ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus
                className={`w-5 h-5 transition-transform duration-300 ${
                  isHovered ? 'rotate-90' : 'rotate-0'
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
