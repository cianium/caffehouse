import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface AdminLoginPageProps {
  onNavigate: (route: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const {
    loginStep1,
    verifyOtp,
    resendOtp,
    cancelOtp,
    isVerifyingOtp,
    pendingEmail,
    otpCode,
    otpExpirySeconds,
  } = useAdminAuth();

  const [email, setEmail] = useState('admin@bodrincoffee.com');
  const [password, setPassword] = useState('admin1234');
  const [showPassword, setShowPassword] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Submit email & password
  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await loginStep1(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'خطایی رخ داده است.');
    } else {
      coffeeSoundManager.playClickSound();
    }
  };

  // Step 2: Submit OTP confirmation code
  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    coffeeSoundManager.playClickSound();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await verifyOtp(enteredOtp);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'کد تایید نادرست است.');
    } else {
      coffeeSoundManager.playCelebrationSound();
      onNavigate('admin');
    }
  };

  // Quick helper to fill simulated OTP code
  const handleAutoFillOtp = () => {
    if (otpCode) {
      setEnteredOtp(otpCode);
      setErrorMsg(null);
      coffeeSoundManager.playClickSound();
    }
  };

  return (
    <div className="min-h-screen bg-[#110A08] text-[#F3DDC4] flex flex-col justify-between p-4 sm:p-8 relative selection:bg-[#78BDB6] selection:text-[#110A08]" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(198,138,82,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Header / Back Link */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={() => {
            coffeeSoundManager.playClickSound();
            onNavigate('home');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-[#E2B88F]/70 hover:text-[#78BDB6] transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>بازگشت به سایت کافه بودرین</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center text-[#C68A52]">
            <Coffee className="w-4 h-4" />
          </div>
          <span className="font-black text-sm tracking-wider font-display">BODRIN COFFEE</span>
        </div>
      </header>

      {/* Simulated Email OTP Arrival Toast Banner */}
      {isVerifyingOtp && otpCode && (
        <div className="relative z-20 max-w-md mx-auto w-full mb-4 p-3.5 rounded-2xl bg-[#1C2C29] border border-[#78BDB6]/50 shadow-2xl flex items-center justify-between text-xs text-[#78BDB6] animate-slide-up">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 shrink-0 text-[#78BDB6]" />
            <div>
              <span className="font-bold block">شبیه‌سازی ایمیل تایید ادمین:</span>
              <span className="font-mono text-sm font-black text-white">{otpCode}</span>
            </div>
          </div>
          <button
            onClick={handleAutoFillOtp}
            className="px-3 py-1 rounded-xl bg-[#78BDB6] text-[#110A08] font-bold text-[11px] hover:bg-[#68ada6] transition-colors cursor-pointer"
          >
            درج خودکار کد
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-[#21140F] via-[#1A0E0A] to-[#140A07] border border-[#C68A52]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6">
          {/* Security Badge & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C68A52]/20 to-[#78BDB6]/20 border border-[#C68A52]/50 flex items-center justify-center mx-auto text-[#C68A52] shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F3DDC4] font-display">
              پورتال اختصاصی مدیریت بودرین
            </h1>
            <p className="text-xs text-[#E2B88F]/60">
              {isVerifyingOtp
                ? 'مرحله دوم: تایید هویت با کد ارسالی به ایمیل'
                : 'ورود امن مدیران محتوا، قیمت‌گذاری و سفارشات'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isVerifyingOtp ? (
            /* STEP 1: EMAIL & PASSWORD */
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C68A52]" />
                  <span>ایمیل اختصاصی ادمین:</span>
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bodrincoffee.com"
                  className="w-full bg-[#120805] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#F3DDC4] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#78BDB6]" />
                    <span>رمز عبور مدیریتی:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#E2B88F]/60 hover:text-[#F3DDC4] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'پنهان' : 'نمایش'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#120805] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-3.5 py-2.5 text-xs text-[#F3DDC4] placeholder:text-[#E2B88F]/30 focus:outline-none font-mono"
                  required
                />
              </div>

              {/* Demo Credentials Tip */}
              <div className="p-3 rounded-xl bg-[#160D0A] border border-[#3C2922]/80 text-[11px] text-[#E2B88F]/70 space-y-1">
                <p className="font-bold text-[#78BDB6]">اطلاعات دسترسی پیش‌فرض:</p>
                <p className="font-mono">ایمیل: admin@bodrincoffee.com</p>
                <p className="font-mono">رمز عبور: admin1234</p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C68A52] to-[#E2B88F] hover:from-[#b97d46] hover:to-[#d4a97f] text-[#110A08] font-black text-xs tracking-wider transition-all shadow-lg hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال بررسی اعتبارنامه...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>ادامه و ارسال کد تایید به ایمیل</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: EMAIL OTP CONFIRMATION */
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#160D0A] border border-[#3C2922] text-xs text-[#E2B88F]/80 space-y-1">
                <p>
                  کد تایید امنیتی به نشانی <span className="text-[#78BDB6] font-mono font-bold">{pendingEmail}</span> ارسال گردید.
                </p>
                {otpExpirySeconds > 0 ? (
                  <p className="text-[11px] text-[#78BDB6] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>مهلت اعتبار: {otpExpirySeconds} ثانیه</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-red-400">کد منقضی شده است.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3DDC4] block">
                  کد تایید ۶ رقمی را وارد نمایید:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  dir="ltr"
                  placeholder="xxxxxx"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#120805] border border-[#3C2922] focus:border-[#78BDB6] rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-[0.35em] text-[#F3DDC4] placeholder:text-[#E2B88F]/20 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    coffeeSoundManager.playClickSound();
                    await resendOtp();
                  }}
                  disabled={otpExpirySeconds > 0}
                  className={`text-[11px] cursor-pointer ${
                    otpExpirySeconds > 0
                      ? 'text-[#E2B88F]/40 cursor-not-allowed'
                      : 'text-[#78BDB6] hover:underline'
                  }`}
                >
                  ارسال مجدد کد تایید
                </button>

                <button
                  type="button"
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    cancelOtp();
                  }}
                  className="text-[11px] text-[#E2B88F]/60 hover:text-[#F3DDC4] cursor-pointer"
                >
                  تغییر ایمیل و رمز
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#78BDB6] via-[#A2E0DA] to-[#78BDB6] hover:from-[#68ada6] hover:to-[#91cec8] text-[#110A08] font-black text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(120,189,182,0.35)] hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال تایید کد امنیتی...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید نهایی و ورود به پنل مدیریت</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-[11px] text-[#E2B88F]/40 font-mono">
        BODRIN Specialty Coffee Roastery • Protected Admin Gateway
      </footer>
    </div>
  );
};
