import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  FileText,
  Printer,
  ChevronLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { coffeeSoundManager } from '../utils/soundAmbience';
import { Order } from '../types/coffee';
import { IranianPaymentGateway } from './IranianPaymentGateway';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
    addOrder,
    quickBuyProfile,
  } = useCart();
  const { isCheckoutOpen, setIsCheckoutOpen, siteInfo } = useSiteSettings();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showIranianGateway, setShowIranianGateway] = useState(false);

  // Form states
  const [recipientName, setRecipientName] = useState(quickBuyProfile.recipientName || 'کیان رضایی');
  const [phone, setPhone] = useState(quickBuyProfile.phone || '۰۹۱۲۳۴۵۶۷۸۹');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState(quickBuyProfile.address || 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، مجتمع تجاری بهاران، واحد ۴۰۲');
  const [postalNote, setPostalNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pos'>('online');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleApplyCoupon = () => {
    coffeeSoundManager.playClickSound();
    const code = couponCode.trim().toUpperCase();
    if (code === 'BODRIN' || code === 'SPECIALTY15') {
      setCouponDiscountPercent(0.15);
      setCouponMessage('کد تخفیف ۱۵٪ با موفقیت اعمال گردید!');
    } else if (code === 'FIRST' || code === 'VIP20') {
      setCouponDiscountPercent(0.20);
      setCouponMessage('کد تخفیف ویژه ۲۰٪ اعضای ویژه اعمال شد!');
    } else {
      setCouponDiscountPercent(0);
      setCouponMessage('کد تخفیف وارد شده معتبر نمی‌باشد.');
    }
  };

  const deliveryFee = deliveryType === 'delivery' ? (totalPrice > 250000 ? 0 : 35000) : 0;
  const discountAmount = Math.round(totalPrice * couponDiscountPercent);
  const packagingFee = 0; // Free gift thermal sleeve
  const finalPrice = Math.max(0, totalPrice - discountAmount + deliveryFee + packagingFee);

  // Validate step 2
  const validateStep2 = (): boolean => {
    if (!recipientName.trim()) {
      setValidationError('لطفاً نام تحویل‌گیرنده را وارد فرمایید.');
      return false;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('لطفاً شماره تماس معتبر (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return false;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setValidationError('لطفاً آدرس دقیق ارسال برای پیک موتوری را وارد فرمایید.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleProceedToStep2 = () => {
    coffeeSoundManager.playClickSound();
    if (items.length === 0) {
      setValidationError('سبد سفارش شما در حال حاضر خالی است.');
      return;
    }
    setValidationError(null);
    setActiveStep(2);
  };

  const handleProceedToStep3 = () => {
    coffeeSoundManager.playClickSound();
    if (validateStep2()) {
      setActiveStep(3);
    }
  };

  // Final confirmation action button handler
  const handleFinalConfirmOrder = () => {
    coffeeSoundManager.playClickSound();
    if (!validateStep2()) {
      setActiveStep(2);
      return;
    }

    if (paymentMethod === 'online') {
      // Launch Iranian Payment Gateway (Shaparak / ZarinPal)
      setShowIranianGateway(true);
    } else {
      // Cash on delivery / POS
      const orderNum = Math.floor(100 + Math.random() * 900);
      const newOrder = addOrder({
        orderNumber: orderNum,
        items: [...items],
        totalPrice,
        discount: discountAmount,
        finalPrice,
        deliveryType,
      });

      setCreatedOrder(newOrder);
      clearCart();
      coffeeSoundManager.playCelebrationSound();
    }
  };

  // Handler when Iranian Payment Gateway succeeds
  const handlePaymentGatewaySuccess = (paymentResult: {
    gateway: string;
    trackingCode: string;
    referenceId: string;
    cardMask: string;
    paidAt: string;
  }) => {
    setShowIranianGateway(false);
    const orderNum = Math.floor(100 + Math.random() * 900);

    const newOrder = addOrder({
      orderNumber: orderNum,
      items: [...items],
      totalPrice,
      discount: discountAmount,
      finalPrice,
      deliveryType,
    });

    setCreatedOrder({
      ...newOrder,
      status: 'در حال آماده‌سازی',
    });

    clearCart();
    coffeeSoundManager.playCelebrationSound();
  };

  const handleClose = () => {
    coffeeSoundManager.playClickSound();
    setIsCheckoutOpen(false);
    setShowIranianGateway(false);
    setTimeout(() => {
      setActiveStep(1);
      setCreatedOrder(null);
      setValidationError(null);
    }, 300);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#160D0B] border border-[#C68A52]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden text-right select-none">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3C2922] bg-[#20130E]/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#78BDB6]/20 border border-[#78BDB6]/40 flex items-center justify-center text-[#78BDB6]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#F3DDC4] flex items-center gap-2">
                  <span>تسویه حساب و ثبت نهایی سفارش</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C68A52]/20 text-[#C68A52] border border-[#C68A52]/40 font-mono">
                    Checkout
                  </span>
                </h2>
                <p className="text-xs text-[#E2B88F]/60">
                  خلاصه اقلام، اطلاعات ارسال، درگاه پرداخت شتاب و فاکتور نهایی
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step-by-Step Progress Bar Indicator (Only when order not completed) */}
          {!createdOrder && (
            <div className="bg-[#1D110D] px-6 py-3 border-b border-[#3C2922]/80 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 w-full max-w-2xl mx-auto">
                {/* Step 1 */}
                <button
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    setActiveStep(1);
                  }}
                  className={`flex-1 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    activeStep >= 1 ? 'text-[#78BDB6]' : 'text-[#E2B88F]/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      activeStep === 1
                        ? 'bg-[#78BDB6] text-[#160D0B]'
                        : activeStep > 1
                        ? 'bg-[#78BDB6]/20 text-[#78BDB6]'
                        : 'bg-[#2B1B16] text-[#E2B88F]/50'
                    }`}
                  >
                    ۱
                  </span>
                  <span className="hidden sm:inline">بررسی اقلام سفارش</span>
                  <span className="sm:hidden">اقلام</span>
                </button>

                <div className={`h-0.5 w-6 sm:w-12 ${activeStep >= 2 ? 'bg-[#78BDB6]' : 'bg-[#3C2922]'}`} />

                {/* Step 2 */}
                <button
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    if (items.length > 0) setActiveStep(2);
                  }}
                  className={`flex-1 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    activeStep >= 2 ? 'text-[#78BDB6]' : 'text-[#E2B88F]/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      activeStep === 2
                        ? 'bg-[#78BDB6] text-[#160D0B]'
                        : activeStep > 2
                        ? 'bg-[#78BDB6]/20 text-[#78BDB6]'
                        : 'bg-[#2B1B16] text-[#E2B88F]/50'
                    }`}
                  >
                    ۲
                  </span>
                  <span className="hidden sm:inline">مشخصات ارسال</span>
                  <span className="sm:hidden">ارسال</span>
                </button>

                <div className={`h-0.5 w-6 sm:w-12 ${activeStep >= 3 ? 'bg-[#78BDB6]' : 'bg-[#3C2922]'}`} />

                {/* Step 3 */}
                <button
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    if (validateStep2()) setActiveStep(3);
                  }}
                  className={`flex-1 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    activeStep === 3 ? 'text-[#78BDB6]' : 'text-[#E2B88F]/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      activeStep === 3
                        ? 'bg-[#78BDB6] text-[#160D0B]'
                        : 'bg-[#2B1B16] text-[#E2B88F]/50'
                    }`}
                  >
                    ۳
                  </span>
                  <span className="hidden sm:inline">پرداخت و تایید نهایی</span>
                  <span className="sm:hidden">پرداخت</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="bg-red-950/70 border-b border-red-500/50 px-6 py-2.5 flex items-center gap-2 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {createdOrder ? (
              /* Success & Receipt Screen */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#78BDB6] to-[#A2E0DA] p-1 mx-auto shadow-[0_0_30px_rgba(120,189,182,0.4)]">
                  <div className="w-full h-full rounded-full bg-[#160D0B] flex items-center justify-center text-[#78BDB6]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-black text-[#F3DDC4] font-display">
                    سفارش شما با موفقیت ثبت گردید!
                  </h3>
                  <p className="text-xs text-[#E2B88F]/80 leading-relaxed">
                    بارکد و فاکتور الکترونیکی صادر شده و باریستاهای بودرین شروع به آسیاب دانه‌ها و آماده‌سازی نوشیدنی شما کرده‌اند.
                  </p>
                </div>

                {/* Printable Invoice Card */}
                <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#1E120D] border border-[#C68A52]/40 text-right space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#3C2922]">
                    <div>
                      <span className="text-[10px] text-[#E2B88F]/60 block">کد رهگیری فاکتور:</span>
                      <span className="text-base font-black text-[#78BDB6] font-mono">
                        {createdOrder.id}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-[#E2B88F]/60 block">وضعیت سفارش:</span>
                      <span className="text-xs font-bold text-[#C68A52] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#C68A52] animate-ping" />
                        <span>{createdOrder.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-[#E2B88F]">اقلام تحویلی:</span>
                    {createdOrder.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-[#3C2922]/40"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#2B1B16] text-[#78BDB6] font-mono text-[11px] flex items-center justify-center">
                            {it.quantity}×
                          </span>
                          <span className="font-semibold text-[#F3DDC4]">{it.product.name}</span>
                          {it.customSleeveText && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#78BDB6]/15 text-[#78BDB6]">
                              کمربند: {it.customSleeveText}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[#E2B88F]">
                          {(it.product.price * it.quantity).toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-[#E2B88F]/70">مبلغ پرداخت شده:</span>
                    <span className="text-base font-black text-[#78BDB6] font-display">
                      {createdOrder.finalPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-full bg-[#2B1B16] hover:bg-[#3C2922] border border-[#3C2922] text-[#E2B88F] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>چاپ رسید فاکتور</span>
                  </button>

                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] text-xs font-bold transition-colors cursor-pointer"
                  >
                    بازگشت به کافه
                  </button>
                </div>
              </div>
            ) : activeStep === 1 ? (
              /* STEP 1: VISUAL ORDER REVIEW & ITEMS BREAKDOWN */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#F3DDC4] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C68A52]" />
                    <span>بررسی دقیق و شخصی‌سازی اقلام سفارش ({items.length} آیتم)</span>
                  </h3>
                  <span className="text-xs text-[#78BDB6] font-mono">
                    جمع اقلام: {totalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12 rounded-3xl bg-[#1A100C] border border-[#3C2922] space-y-3">
                    <Coffee className="w-12 h-12 text-[#E2B88F]/40 mx-auto" />
                    <p className="text-sm font-bold text-[#F3DDC4]">سبد سفارش شما در حال حاضر خالی است.</p>
                    <p className="text-xs text-[#E2B88F]/60">
                      می‌توانید از منوی کافه، انواع نوشیدنی‌های تخصصی را انتخاب و شخصی‌سازی کنید.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={`${item.product.id}-${index}`}
                        className="p-4 rounded-2xl bg-[#1C110D] border border-[#3C2922] hover:border-[#C68A52]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Product Info & Visual Breakdown */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-md"
                            style={{
                              backgroundColor: `${item.product.accentColor}25`,
                              borderColor: item.product.accentColor,
                            }}
                          >
                            <Coffee className="w-6 h-6" style={{ color: item.product.accentColor }} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#F3DDC4]">{item.product.name}</h4>
                              <span className="text-[10px] text-[#E2B88F]/50 font-mono">
                                ({item.product.nameEn})
                              </span>
                            </div>

                            {/* Tags: Milk, Syrup, Custom Sleeve Text */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              {item.selectedMilk && (
                                <span className="px-2 py-0.5 rounded-md bg-[#2B1B16] text-[#E2B88F] border border-[#3C2922]">
                                  {item.selectedMilk}
                                </span>
                              )}
                              {item.selectedSyrup && item.selectedSyrup !== 'بدون سیروپ' && (
                                <span className="px-2 py-0.5 rounded-md bg-[#2B1B16] text-[#E2B88F] border border-[#3C2922]">
                                  {item.selectedSyrup}
                                </span>
                              )}
                              {item.customSleeveText && (
                                <span className="px-2 py-0.5 rounded-md bg-[#78BDB6]/15 text-[#78BDB6] border border-[#78BDB6]/30 flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  <span>کمربند: «{item.customSleeveText}»</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#3C2922]">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-[#140A07] border border-[#3C2922] rounded-xl p-1">
                            <button
                              onClick={() => {
                                updateQuantity(item.product.id, item.quantity - 1);
                              }}
                              className="w-6 h-6 rounded-lg bg-[#241712] hover:bg-[#3C2922] text-[#E2B88F] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-[#F3DDC4] font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                updateQuantity(item.product.id, item.quantity + 1);
                              }}
                              className="w-6 h-6 rounded-lg bg-[#241712] hover:bg-[#3C2922] text-[#E2B88F] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-left min-w-[90px]">
                            <span className="text-xs sm:text-sm font-black text-[#F3DDC4] font-mono block">
                              {(item.product.price * item.quantity).toLocaleString('fa-IR')}
                            </span>
                            <span className="text-[10px] text-[#C68A52] font-semibold">تومان</span>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
                            title="حذف از سفارش"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 1 Footer CTA */}
                <div className="pt-4 flex items-center justify-between border-t border-[#3C2922]">
                  <div className="text-xs text-[#E2B88F]/70">
                    مرحله بعد: تکمیل اطلاعات آدرس و نحوه ارسال
                  </div>
                  <button
                    onClick={handleProceedToStep2}
                    disabled={items.length === 0}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#78BDB6] to-[#A2E0DA] hover:from-[#68ada6] hover:to-[#91cec8] text-[#160D0B] font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>ادامه به مشخصات ارسال</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : activeStep === 2 ? (
              /* STEP 2: SHIPPING ADDRESS & RECIPIENT FIELDS */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#F3DDC4] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#78BDB6]" />
                    <span>مشخصات تحویل‌گیرنده و آدرس ارسال سفارش</span>
                  </h3>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-[#78BDB6] hover:underline cursor-pointer"
                  >
                    بازگشت به اقلام
                  </button>
                </div>

                {/* Delivery Type Selection: Express Courier vs Pickup */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      coffeeSoundManager.playClickSound();
                      setDeliveryType('delivery');
                    }}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                        : 'bg-[#1C110D] border-[#3C2922] text-[#E2B88F]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-[#78BDB6]" />
                      <span className="font-bold text-xs">ارسال با پیک اکسپرس بودرین</span>
                    </div>
                    <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">
                      بسته‌بندی عایق گرما با کمربندهای چاپ‌شده، تحویل در کمتر از ۴۵ دقیقه
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      coffeeSoundManager.playClickSound();
                      setDeliveryType('pickup');
                    }}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                        : 'bg-[#1C110D] border-[#3C2922] text-[#E2B88F]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Coffee className="w-4 h-4 text-[#C68A52]" />
                      <span className="font-bold text-xs">تحویل حضوری در کافه</span>
                    </div>
                    <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">
                      آماده‌سازی بدون معطلی و تحویل در شعبه مرکزی ولیعصر
                    </p>
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-4 p-5 rounded-2xl bg-[#1C110D] border border-[#3C2922]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Recipient Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C68A52]" />
                        <span>نام و نام خانوادگی تحویل‌گیرنده:</span>
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="کیان رضایی"
                        className="w-full bg-[#140A07] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#78BDB6]" />
                        <span>شماره همراه (جهت هماهنگی پیک):</span>
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full bg-[#140A07] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none text-right"
                      />
                    </div>
                  </div>

                  {/* Address Field (when delivery selected) */}
                  {deliveryType === 'delivery' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#78BDB6]" />
                        <span>آدرس دقیق پستی، خیابان، پلاک و واحد:</span>
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="تهران، خیابان ولیعصر..."
                        className="w-full bg-[#140A07] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Postal Note */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#E2B88F]/80 block">
                      یادداشت ویژه برای باریستا یا پیک (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={postalNote}
                      onChange={(e) => setPostalNote(e.target.value)}
                      placeholder="مثلاً: لطفاً زنگ واحد ۴ را نزنید، نوزاد خواب است."
                      className="w-full bg-[#140A07] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Step 2 Footer CTA */}
                <div className="pt-4 flex items-center justify-between border-t border-[#3C2922]">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-[#E2B88F]/70 hover:text-[#F3DDC4] cursor-pointer"
                  >
                    بازگشت به اقلام
                  </button>

                  <button
                    onClick={handleProceedToStep3}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#78BDB6] to-[#A2E0DA] hover:from-[#68ada6] hover:to-[#91cec8] text-[#160D0B] font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>ادامه به پرداخت و فاکتور</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 3: PAYMENT METHOD, COUPON & FINAL ORDER CONFIRMATION */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#F3DDC4] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#78BDB6]" />
                    <span>انتخاب شیوه پرداخت و فاکتور نهایی</span>
                  </h3>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs text-[#78BDB6] hover:underline cursor-pointer"
                  >
                    ویرایش آدرس
                  </button>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#E2B88F] block">
                    شیوه پرداخت را انتخاب فرمایید:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        coffeeSoundManager.playClickSound();
                        setPaymentMethod('online');
                      }}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                        paymentMethod === 'online'
                          ? 'bg-[#78BDB6]/15 border-[#78BDB6] text-[#F3DDC4] shadow-md'
                          : 'bg-[#1C110D] border-[#3C2922] text-[#E2B88F]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#78BDB6]" />
                          <span className="font-bold text-xs">درگاه پرداخت اینترنتی شاپرک (شتاب)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] font-mono">
                          آنلاین فوری
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">
                        اتصال امن به شبکه شاپرک با کلیه کارت‌های بانکی، رمز پویا و زرین‌پال
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        coffeeSoundManager.playClickSound();
                        setPaymentMethod('pos');
                      }}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                        paymentMethod === 'pos'
                          ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                          : 'bg-[#1C110D] border-[#3C2922] text-[#E2B88F]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#C68A52]" />
                          <span className="font-bold text-xs">پرداخت در محل (کارتخوان سیار پیک)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C68A52]/20 text-[#C68A52] font-mono">
                          حضوری
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E2B88F]/70 leading-relaxed">
                        کارت کشیدن روی دستگاه پوز بی‌سیم هنگام دریافت سفارش از پیک
                      </p>
                    </button>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="p-4 rounded-2xl bg-[#1C110D] border border-[#3C2922] space-y-2">
                  <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C68A52]" />
                    <span>کد تخفیف اختصاصی یا کوپن باشگاه میهمانان:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="کد تخفیف (مثال: BODRIN یا VIP20)"
                      className="w-full bg-[#140A07] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none text-right"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-[#C68A52] hover:bg-[#d49963] text-[#160D0B] font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      اعمال کد
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] font-semibold ${
                        couponDiscountPercent > 0 ? 'text-[#78BDB6]' : 'text-red-400'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* Financial Summary Breakdown */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1F130E] to-[#160D0B] border border-[#C68A52]/40 space-y-3 shadow-xl">
                  <h4 className="text-xs font-bold text-[#E2B88F] uppercase tracking-wider mb-2">
                    ریز فاکتور نهایی سفارش:
                  </h4>

                  <div className="flex items-center justify-between text-xs text-[#E2B88F]/80">
                    <span>مجموع اقلام سفارش ({items.length} نوشیدنی):</span>
                    <span className="font-mono text-[#F3DDC4]">
                      {totalPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#78BDB6]">
                      <span>تخفیف ویژه اعمال‌شده:</span>
                      <span className="font-mono">
                        - {discountAmount.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#E2B88F]/80">
                    <span>بسته‌بندی عایق گرما و کمربند اختصاصی:</span>
                    <span className="text-[#78BDB6] font-bold">هدیه کافه بودرین (رایگان)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#E2B88F]/80">
                    <span>هزینه ارسال با پیک موتوری:</span>
                    <span className="font-mono text-[#F3DDC4]">
                      {deliveryFee === 0 ? (
                        <span className="text-[#78BDB6] font-bold">رایگان (سفارش بالای ۲۵۰ هزار تومان)</span>
                      ) : (
                        `${deliveryFee.toLocaleString('fa-IR')} تومان`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#3C2922] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#E2B88F] block">مبلغ نهایی قابل پرداخت:</span>
                      <span className="text-[10px] text-[#E2B88F]/50 font-mono">
                        ({(finalPrice * 10).toLocaleString('fa-IR')} ریال)
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#78BDB6] font-display">
                      {finalPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {/* Final Action Button: Confirm Order / Pay */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleFinalConfirmOrder}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#78BDB6] via-[#A2E0DA] to-[#78BDB6] hover:from-[#68ada6] hover:to-[#91cec8] text-[#160D0B] font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(120,189,182,0.4)] hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {paymentMethod === 'online' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>تایید سفارش و اتصال به درگاه شاپرک</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>ثبت نهایی سفارش (پرداخت با پوز پیک)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#1E120E] hover:bg-[#2B1B16] border border-[#3C2922] text-[#E2B88F] font-bold text-xs transition-colors cursor-pointer"
                  >
                    مرحله قبل
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Iranian Payment Gateway Modal */}
      {showIranianGateway && (
        <IranianPaymentGateway
          amountTomans={finalPrice}
          orderNumber={Math.floor(100 + Math.random() * 900)}
          recipientName={recipientName}
          phone={phone}
          onSuccess={handlePaymentGatewaySuccess}
          onCancel={() => setShowIranianGateway(false)}
        />
      )}
    </>
  );
};
