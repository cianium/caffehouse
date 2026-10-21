import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2, MapPin, Clock, Zap, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalCount, isCartOpen, setIsCartOpen, addOrder, quickBuyProfile } = useCart();
  const { setIsCheckoutOpen } = useSiteSettings();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(0);

  const handleApplyPromo = () => {
    coffeeSoundManager.playClickSound();
    if (promoCode.trim().toUpperCase() === 'BODRIN' || promoCode.trim() === 'بودرین') {
      setPromoDiscount(0.15); // 15% discount
      setPromoStatus('کد تخفیف با موفقیت اعمال شد: ۱۵٪ کسر گردید!');
    } else if (promoCode.trim().length > 0) {
      setPromoStatus('کد نامعتبر است (کد BODRIN را امتحان کنید)');
    }
  };

  const finalPrice = Math.max(0, Math.round(totalPrice * (1 - promoDiscount)));

  const handleCheckout = () => {
    coffeeSoundManager.playClickSound();
    const randomOrderNum = Math.floor(100 + Math.random() * 900);
    setOrderNumber(randomOrderNum);

    // Record order in persistent history
    addOrder({
      orderNumber: randomOrderNum,
      items,
      totalPrice,
      discount: Math.round(totalPrice * promoDiscount),
      finalPrice,
      deliveryType,
    });

    setOrderSuccess(true);
  };

  const handleResetOrder = () => {
    coffeeSoundManager.playClickSound();
    clearCart();
    setOrderSuccess(false);
    setIsCartOpen(false);
    setPromoCode('');
    setPromoDiscount(0);
    setPromoStatus(null);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none text-right" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#241712] via-[#1E120E] to-[#160D0B] border-r border-[#C68A52]/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#3C2922] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2B1B16] border border-[#C68A52]/30">
                <ShoppingBag className="w-5 h-5 text-[#78BDB6]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F3DDC4] font-display">
                  سبد سفارش شما
                </h3>
                <span className="text-xs text-[#E2B88F]/60">
                  {totalCount} {totalCount === 1 ? 'نوشیدنی انتخابی' : 'نوشیدنی'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setIsCartOpen(false);
              }}
              className="p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderSuccess ? (
              /* Order Confirmation Screen */
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 rounded-full bg-[#78BDB6]/20 border border-[#78BDB6] flex items-center justify-center mb-6 text-[#78BDB6] shadow-[0_0_30px_rgba(120,189,182,0.4)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#78BDB6] uppercase mb-1">
                  سفارش شما با موفقیت ثبت شد!
                </span>
                <h4 className="text-3xl font-black text-[#F3DDC4] font-display mb-2">
                  سفارش #{orderNumber}
                </h4>
                <p className="text-sm text-[#E2B88F]/80 max-w-xs mb-6 leading-relaxed">
                  باریستا در حال آسیاب و عصاره‌گیری قهوه تخصصی شماست.
                </p>

                <div className="w-full p-4 rounded-2xl bg-[#2B1B16] border border-[#3C2922] space-y-3 mb-8 text-right text-xs">
                  <div className="flex items-center gap-2 text-[#E2B88F]">
                    <Clock className="w-4 h-4 text-[#C68A52] shrink-0" />
                    <span>زمان آماده‌سازی و سرو: <strong>حدود ۵ الی ۷ دقیقه</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#E2B88F]">
                    <MapPin className="w-4 h-4 text-[#78BDB6] shrink-0" />
                    <span>
                      {deliveryType === 'pickup'
                        ? 'تحویل حضوری: شعبه مرکزی بودرین (تهران، خیابان ولیعصر)'
                        : `تحویل فوری با پیک به آدرس: ${quickBuyProfile.address}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResetOrder}
                  className="w-full py-3.5 rounded-full bg-[#78BDB6] text-[#160D0B] font-bold text-sm tracking-wide hover:bg-[#68ada6] transition-all cursor-pointer"
                >
                  عالی، سپاسگزارم!
                </button>
              </div>
            ) : items.length === 0 ? (
              /* Empty Cart State */
              <div className="flex flex-col items-center justify-center text-center py-16 text-[#E2B88F]/60">
                <ShoppingBag className="w-16 h-16 stroke-[1.2] mb-4 text-[#3C2922]" />
                <p className="text-base font-medium text-[#F3DDC4] mb-1">
                  سبد سفارش شما در حال حاضر خالی است
                </p>
                <p className="text-xs text-[#E2B88F]/60 max-w-xs mb-6 leading-relaxed">
                  می‌توانید از منوی بالا قهوه مورد علاقه خود را انتخاب کنید یا آزمون هوشمند سلیقه را امتحان نمایید.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#C68A52] text-[#160D0B] font-bold text-xs uppercase tracking-wider hover:bg-[#d8995e] transition-all cursor-pointer"
                >
                  مشاهده منو
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <>
                <div className="space-y-3">
                  {items.map(({ product, quantity, selectedMilk, selectedSyrup, customSleeveText, sleeveColor }, idx) => (
                    <div
                      key={`${product.id}-${idx}`}
                      className="p-4 rounded-2xl bg-[#2B1B16]/90 border border-[#3C2922] flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <h5 className="font-bold text-[#F3DDC4] text-sm">
                            {product.name}
                          </h5>
                          <span className="text-sm font-bold text-[#C68A52]">
                            {(product.price * quantity).toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                        <div className="text-[11px] text-[#E2B88F]/60 flex items-center gap-2">
                          <span>{product.volume}</span>
                          <span>•</span>
                          <span>{product.price.toLocaleString('fa-IR')} تومان/عدد</span>
                        </div>
                        {(selectedMilk || selectedSyrup) && (
                          <div className="text-[10px] text-[#78BDB6] mt-1">
                            {selectedMilk && <span>شیر: {selectedMilk} </span>}
                            {selectedSyrup && <span>• سیروپ: {selectedSyrup}</span>}
                          </div>
                        )}
                        {customSleeveText && (
                          <div className="text-[10px] text-[#E2B88F] font-semibold mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#160D0B] border border-[#C68A52]/30 w-fit">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: sleeveColor || '#78BDB6' }}
                            />
                            <span>حک کمربند کاپ: «{customSleeveText}»</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-xl bg-[#160D0B] border border-[#3C2922] p-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#E2B88F] hover:bg-[#3C2922] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-[#F3DDC4]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#E2B88F] hover:bg-[#3C2922] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-[#E2B88F]/40 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup or Delivery Option */}
                <div className="p-3.5 rounded-2xl bg-[#241712] border border-[#3C2922] space-y-2 mt-4">
                  <span className="text-[11px] font-semibold text-[#E2B88F]/80 uppercase tracking-wider block">
                    شیوه دریافت سفارش
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                          : 'bg-[#160D0B] text-[#E2B88F]/70 border border-[#3C2922]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      تحویل حضوری
                    </button>
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-[#78BDB6] text-[#160D0B] shadow-md'
                          : 'bg-[#160D0B] text-[#E2B88F]/70 border border-[#3C2922]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      پیک فوری ۲۰دقیقه
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="کد تخفیف (BODRIN)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#160D0B] border border-[#3C2922] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none focus:border-[#C68A52] text-right"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-[#2B1B16] border border-[#C68A52]/40 hover:border-[#C68A52] text-xs font-semibold text-[#E2B88F] transition-all cursor-pointer"
                    >
                      اعمال کد
                    </button>
                  </div>
                  {promoStatus && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        promoDiscount > 0 ? 'text-[#78BDB6]' : 'text-[#E2B88F]/70'
                      }`}
                    >
                      {promoStatus}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Button */}
          {!orderSuccess && items.length > 0 && (
            <div className="p-6 border-t border-[#3C2922] bg-[#1A100C] space-y-4">
              <div className="space-y-1.5 text-xs text-[#E2B88F]/80">
                <div className="flex justify-between">
                  <span>مجموع سفارش:</span>
                  <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#78BDB6]">
                    <span>تخفیف ویژه ۱۵٪:</span>
                    <span>- {Math.round(totalPrice * promoDiscount).toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-[#F3DDC4] pt-2 border-t border-[#3C2922]">
                  <span>مبلغ نهایی قابل پرداخت:</span>
                  <span className="text-xl text-[#78BDB6] font-display">
                    {finalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-4 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(120,189,182,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <CreditCard className="w-4 h-4" />
                <span>ادامه به صفحه تسویه حساب (Checkout)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
