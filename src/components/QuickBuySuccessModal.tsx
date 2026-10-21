import React from 'react';
import { CheckCircle2, Zap, Clock, MapPin, CreditCard, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

export const QuickBuySuccessModal: React.FC = () => {
  const { quickBuySuccessOrder, setQuickBuySuccessOrder, quickBuyProfile } = useCart();

  if (!quickBuySuccessOrder) return null;

  const handleClose = () => {
    coffeeSoundManager.playClickSound();
    setQuickBuySuccessOrder(null);
  };

  const item = quickBuySuccessOrder.items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-right select-none" dir="rtl">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#281813] via-[#20120E] to-[#160D0B] border border-[#78BDB6]/50 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Animated Lightning Icon */}
          <div className="w-16 h-16 rounded-full bg-[#78BDB6]/20 border border-[#78BDB6] flex items-center justify-center text-[#78BDB6] mb-4 shadow-[0_0_30px_rgba(120,189,182,0.4)]">
            <Zap className="w-8 h-8 fill-current" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78BDB6]/15 border border-[#78BDB6]/40 text-[#78BDB6] text-xs font-bold mb-2">
            <span>خرید سریع با یک کلیک (Quick Buy)</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#F3DDC4] font-display mb-1">
            سفارش #{quickBuySuccessOrder.orderNumber} ثبت شد!
          </h3>

          <p className="text-xs sm:text-sm text-[#E2B88F]/75 mb-6">
            سفارش شما بدون نیاز به مراحل سبد خرید و مستقیماً با اطلاعات پیش‌فرض شما تایید شد.
          </p>

          {/* Receipt Breakdown Card */}
          <div className="w-full p-4 rounded-2xl bg-[#1A100C] border border-[#3C2922] space-y-3 mb-6 text-right text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C1B15]">
              <span className="font-bold text-[#F3DDC4] text-sm">{item.product.name}</span>
              <span className="font-bold text-[#78BDB6] text-sm">
                {quickBuySuccessOrder.finalPrice.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <div className="flex items-start gap-2 text-[#E2B88F]/80">
              <MapPin className="w-4 h-4 text-[#78BDB6] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F3DDC4]">آدرس ارسال پیک: </span>
                <span className="text-[11px]">{quickBuyProfile.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#E2B88F]/80">
              <CreditCard className="w-4 h-4 text-[#C68A52] shrink-0" />
              <div>
                <span className="font-semibold text-[#F3DDC4]">شیوه پرداخت: </span>
                <span className="text-[11px]">{quickBuyProfile.paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#E2B88F]/80">
              <Clock className="w-4 h-4 text-[#78BDB6] shrink-0" />
              <div>
                <span className="font-semibold text-[#F3DDC4]">زمان تخمینی تحویل: </span>
                <span className="text-[11px]">حدود ۱۵ الی ۲۰ دقیقه با پیک محلی</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-3.5 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg"
          >
            متوجه شدم، تشکر
          </button>
        </div>
      </div>
    </div>
  );
};
