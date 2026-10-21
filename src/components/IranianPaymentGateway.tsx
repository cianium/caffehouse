import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  RefreshCw,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  X,
  Coffee,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface IranianPaymentGatewayProps {
  amountTomans: number;
  orderNumber: number;
  recipientName: string;
  phone: string;
  onSuccess: (paymentResult: {
    gateway: string;
    trackingCode: string;
    referenceId: string;
    cardMask: string;
    paidAt: string;
  }) => void;
  onCancel: () => void;
}

// Iranian Bank BIN prefix detection
const IRANIAN_BANKS: Record<string, { name: string; color: string; bg: string }> = {
  '603799': { name: 'بانک ملی ایران', color: '#1B365D', bg: '#DDE6F0' },
  '610433': { name: 'بانک ملت', color: '#A30014', bg: '#F9DADB' },
  '621986': { name: 'بانک سامان', color: '#005596', bg: '#D6E9F7' },
  '502229': { name: 'بانک پاسارگاد', color: '#D4AF37', bg: '#FFF5D6' },
  '627412': { name: 'بانک اقتصاد نوین', color: '#6A1A24', bg: '#F4DEE1' },
  '589210': { name: 'بانک سپه', color: '#006633', bg: '#D6F2E2' },
  '504706': { name: 'بانک شهر', color: '#E30613', bg: '#FDDADF' },
  '622106': { name: 'بانک پارسیان', color: '#800020', bg: '#F8DFE5' },
  '603770': { name: 'بانک کشاورزی', color: '#005E34', bg: '#D7F5E5' },
  '589463': { name: 'بانک رفاه کارگران', color: '#002B49', bg: '#DAE7F0' },
  '627381': { name: 'بانک انصار', color: '#1A365D', bg: '#DFEAF5' },
  '639346': { name: 'بانک سینا', color: '#007078', bg: '#DAF2F4' },
  '505785': { name: 'بانک ایران‌زمین', color: '#4A154B', bg: '#F2DEF4' },
  '628023': { name: 'بانک مسکن', color: '#E84E0F', bg: '#FCE0D4' },
};

export const IranianPaymentGateway: React.FC<IranianPaymentGatewayProps> = ({
  amountTomans,
  orderNumber,
  recipientName,
  phone,
  onSuccess,
  onCancel,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<'shaparak_zarinpal' | 'mellat' | 'saman'>('shaparak_zarinpal');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('06');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('5839');
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [simulatedSms, setSimulatedSms] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate new captcha
  const refreshCaptcha = () => {
    coffeeSoundManager.playClickSound();
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(newCode);
  };

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Request Dynamic Password (رمز پویا)
  const handleRequestOtp = () => {
    coffeeSoundManager.playClickSound();
    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 16) {
      setErrorMessage('لطفاً ابتدا شماره ۱۶ رقمی کارت بانکی خود را وارد فرمایید.');
      return;
    }
    setErrorMessage(null);
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpTimer(120);
    setSimulatedSms(`پیامک رمز پویا شاپرک: رمز یکبار مصرف شما ${mockOtp} است.`);
    setTimeout(() => {
      setOtpValue(mockOtp);
    }, 1200);
  };

  // Card Number formatting (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  // Detect bank
  const rawDigits = cardNumber.replace(/\D/g, '');
  const bankPrefix = rawDigits.slice(0, 6);
  const detectedBank = IRANIAN_BANKS[bankPrefix];

  const amountRials = amountTomans * 10;

  // Handle Pay submit
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();

    if (rawDigits.length !== 16) {
      setErrorMessage('شماره کارت بانکی شتاب باید دقیقاً ۱۶ رقم باشد.');
      return;
    }
    if (cvv2.length < 3) {
      setErrorMessage('کد شناسایی دوم (CVV2) معتبر نیست.');
      return;
    }
    if (!otpValue) {
      setErrorMessage('لطفاً رمز پویا (رمز دوم) را وارد کنید یا دکمه دریافت رمز پویا را بزنید.');
      return;
    }
    if (captchaInput.trim() !== captchaCode) {
      setErrorMessage('کد امنیتی (کپچا) وارد شده صحیح نمی‌باشد.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const trackingCode = Math.floor(100000 + Math.random() * 900000).toString();
      const referenceId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const cardMask = `${rawDigits.slice(0, 4)}-${rawDigits.slice(4, 6)}**-****-${rawDigits.slice(12, 16)}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('fa-IR');
      const paidAt = `امروز، ساعت ${timeStr}`;

      const gatewayNames = {
        shaparak_zarinpal: 'درگاه پرداخت شاپرک / زرین‌پال',
        mellat: 'درگاه به‌پرداخت ملت (شاپرک)',
        saman: 'پرداخت الکترونیک سامان کیش (شاپرک)',
      };

      onSuccess({
        gateway: gatewayNames[selectedGateway],
        trackingCode,
        referenceId,
        cardMask,
        paidAt,
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#0F0A08] border border-[#C68A52]/50 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden text-right select-none my-auto">
        {/* Shaparak Official Top Header */}
        <div className="bg-gradient-to-r from-[#1E120D] via-[#2D1B15] to-[#1E120D] border-b border-[#3C2922] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
              {/* Shaparak official style emblem */}
              <div className="w-full h-full rounded-xl bg-[#004B87] flex flex-col items-center justify-center text-white font-black text-[9px] leading-tight text-center">
                <span>شاپرک</span>
                <span className="text-[7px] text-[#FFD700]">SHAPARAK</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#F3DDC4]">
                  درگاه پرداخت اینترنتی شاپرک
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] border border-[#78BDB6]/40 flex items-center gap-1 font-mono">
                  <Lock className="w-2.5 h-2.5" />
                  SSL 256-bit Secure
                </span>
              </div>
              <p className="text-[11px] text-[#E2B88F]/70">
                شبکه الکترونیکی پرداخت کارت بانکی • تحت نظارت بانک مرکزی جمهوری اسلامی ایران
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              onCancel();
            }}
            className="p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
            title="انصراف و بازگشت"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated SMS Arrival Toast Banner */}
        {simulatedSms && (
          <div className="bg-[#1C2C29] border-y border-[#78BDB6]/50 p-2.5 px-4 flex items-center justify-between text-xs text-[#78BDB6] animate-slide-up">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 shrink-0" />
              <span>{simulatedSms}</span>
            </div>
            <button
              onClick={() => setSimulatedSms(null)}
              className="text-[11px] text-[#78BDB6] hover:underline cursor-pointer"
            >
              بستن
            </button>
          </div>
        )}

        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Merchant & Order Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#180E0B] border border-[#3C2922]">
            <div>
              <span className="text-[11px] text-[#E2B88F]/60 block">پذیرنده رسمی:</span>
              <span className="text-xs font-bold text-[#F3DDC4]">کافه تخصصی بودرین (BODRIN)</span>
            </div>
            <div>
              <span className="text-[11px] text-[#E2B88F]/60 block">شماره سفارش و پایانه:</span>
              <span className="text-xs font-mono font-bold text-[#78BDB6]">
                #{orderNumber} • TERM-8820
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#E2B88F]/60 block">مبلغ قابل پرداخت:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-[#F3DDC4] font-display">
                  {amountTomans.toLocaleString('fa-IR')}
                </span>
                <span className="text-[11px] text-[#C68A52] font-bold">تومان</span>
                <span className="text-[10px] text-[#E2B88F]/50 font-mono">
                  ({amountRials.toLocaleString('fa-IR')} ریال)
                </span>
              </div>
            </div>
          </div>

          {/* Gateway Provider Selection */}
          <div>
            <label className="text-xs font-bold text-[#E2B88F] block mb-2">
              انتخاب ارائه‌دهنده درگاه پرداخت:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setSelectedGateway('shaparak_zarinpal');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedGateway === 'shaparak_zarinpal'
                    ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                    : 'bg-[#180E0B] border-[#3C2922] text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <div className="text-xs font-bold">زرین‌پال (ZarinPal)</div>
                <div className="text-[10px] text-[#78BDB6]">شتاب هوشمند</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setSelectedGateway('mellat');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedGateway === 'mellat'
                    ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                    : 'bg-[#180E0B] border-[#3C2922] text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <div className="text-xs font-bold">به‌پرداخت ملت</div>
                <div className="text-[10px] text-[#78BDB6]">شاپرک مستقیم</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  setSelectedGateway('saman');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedGateway === 'saman'
                    ? 'bg-[#C68A52]/20 border-[#C68A52] text-[#F3DDC4] shadow-md'
                    : 'bg-[#180E0B] border-[#3C2922] text-[#E2B88F]/70 hover:text-[#F3DDC4]'
                }`}
              >
                <div className="text-xs font-bold">سامان کیش (SEP)</div>
                <div className="text-[10px] text-[#78BDB6]">شاپرک پرسرعت</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handlePay} className="space-y-4">
            {/* Card Number Input with Bank Detection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#F3DDC4] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#78BDB6]" />
                  <span>شماره ۱۶ رقمی کارت بانکی شتاب:</span>
                </label>
                {detectedBank ? (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: detectedBank.bg, color: detectedBank.color }}
                  >
                    {detectedBank.name}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#E2B88F]/50">کلیه کارت‌های عضو شتاب</span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-2xl px-4 py-3 text-center text-base sm:text-lg font-mono font-bold tracking-widest text-[#F3DDC4] placeholder:text-[#E2B88F]/20 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* CVV2 and Expiry Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CVV2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">
                  کد شناسایی دوم (CVV2):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  dir="ltr"
                  placeholder="۳ یا ۴ رقم"
                  value={cvv2}
                  onChange={(e) => setCvv2(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-2xl px-4 py-2.5 text-center text-sm font-mono font-bold text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                />
              </div>

              {/* Expiration Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">
                  تاریخ انقضای کارت (ماه / سال):
                </label>
                <div className="grid grid-cols-2 gap-2" dir="ltr">
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="ماه (۰۸)"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ''))}
                    className="bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-2xl px-2 py-2.5 text-center text-sm font-mono font-bold text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="سال (۰۶)"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ''))}
                    className="bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-2xl px-2 py-2.5 text-center text-sm font-mono font-bold text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Password (رمز پویا) */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#180E0B] border border-[#3C2922]">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#F3DDC4] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#C68A52]" />
                  <span>رمز اینترنتی یکبار مصرف (رمز پویا):</span>
                </label>
                {otpTimer > 0 && (
                  <span className="text-[11px] font-mono font-bold text-[#78BDB6] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{otpTimer} ثانیه اعتبار</span>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={8}
                  dir="ltr"
                  placeholder="رمز پیامک‌شده"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#120907] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-4 py-2.5 text-center text-sm font-mono font-bold text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpTimer > 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    otpTimer > 0
                      ? 'bg-[#2B1B16] text-[#E2B88F]/40 cursor-not-allowed border border-[#3C2922]'
                      : 'bg-[#C68A52] hover:bg-[#d49963] text-[#160D0B] shadow-sm'
                  }`}
                >
                  {otpTimer > 0 ? `ارسال مجدد (${otpTimer})` : 'درخواست رمز پویا'}
                </button>
              </div>
            </div>

            {/* Security Captcha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">
                  کد امنیتی (کپچا):
                </label>
                <input
                  type="text"
                  maxLength={5}
                  dir="ltr"
                  placeholder="کد ۴ رقمی روبرو"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full bg-[#180E0B] border border-[#3C2922] focus:border-[#78BDB6] rounded-2xl px-4 py-2 text-center text-sm font-mono font-bold text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <div className="flex-1 py-2 rounded-2xl bg-[#241712] border border-[#3C2922] text-center font-mono text-xl tracking-[0.35em] text-[#78BDB6] font-black select-none line-through">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-3 rounded-2xl bg-[#180E0B] border border-[#3C2922] text-[#E2B88F] hover:text-[#78BDB6] transition-colors cursor-pointer"
                  title="تغییر کد امنیتی"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Pay & Cancel */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#78BDB6] via-[#A2E0DA] to-[#78BDB6] hover:from-[#68ada6] hover:to-[#91cec8] text-[#160D0B] font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(120,189,182,0.4)] hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#160D0B]" />
                    <span>در حال برقراری ارتباط با سوییچ مرکزی شاپرک...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      پرداخت امن {amountTomans.toLocaleString('fa-IR')} تومان
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  coffeeSoundManager.playClickSound();
                  onCancel();
                }}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#1E120E] hover:bg-[#2B1B16] border border-[#3C2922] text-[#E2B88F] font-bold text-xs transition-colors cursor-pointer"
              >
                انصراف و بازگشت
              </button>
            </div>
          </form>

          {/* Shaparak Security Notice */}
          <div className="p-3.5 rounded-2xl bg-[#140B08] border border-[#3C2922]/80 text-[11px] text-[#E2B88F]/60 space-y-1">
            <p className="flex items-center gap-1.5 text-[#78BDB6] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>نکات امنیتی درگاه رسمی شاپرک:</span>
            </p>
            <p>
              همواره دقت نمایید که آدرس درگاه پرداخت با پسوند شاپرک (shaparak.ir) ختم شده و دارای گواهینامه معتبر SSL باشد. کافه بودرین به هیچ‌وجه اطلاعات محرمانه بانکی شما را ذخیره نمی‌کند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
