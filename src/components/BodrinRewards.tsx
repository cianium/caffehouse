import React, { useState } from 'react';
import { Coffee, Gift, Sparkles, Award, CheckCircle2, ChevronLeft, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface BodrinRewardsProps {
  onCloseParentDrawer?: () => void;
}

export const BodrinRewards: React.FC<BodrinRewardsProps> = ({ onCloseParentDrawer }) => {
  const { orders, claimRewardFreeDrink, quickBuyProfile } = useCart();
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  // Compute total cups ordered across all stored order history
  const totalCupsInHistory = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((c, it) => c + it.quantity, 0),
    0
  );

  // Target cups required for a free specialty drink
  const targetCups = 5;

  // If user has orders, calculate real modulo; if brand new with demo order, default to 4 cups so user experiences the excitement of being 1 cup away!
  const currentCups =
    totalCupsInHistory > 0
      ? totalCupsInHistory % targetCups === 0
        ? targetCups
        : totalCupsInHistory % targetCups
      : 4;

  const remainingCups = Math.max(0, targetCups - currentCups);
  const ratio = Math.min(1, currentCups / targetCups);
  const isReadyForReward = currentCups >= targetCups;

  // Circular progress SVG calculations
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);

  // Loyalty Points calculation: 50 points per cup + bonus
  const loyaltyPoints = (totalCupsInHistory || 4) * 50 + 80;

  const handleClaim = () => {
    coffeeSoundManager.playCelebrationSound();
    claimRewardFreeDrink();
    setClaimedSuccess(true);
    setTimeout(() => {
      setClaimedSuccess(false);
      if (onCloseParentDrawer) {
        onCloseParentDrawer();
      }
    }, 1500);
  };

  return (
    <div className="space-y-4 text-right select-none" dir="rtl">
      {/* Main Circular Progress Card */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#291812] via-[#20120E] to-[#160B08] border border-[#C68A52]/40 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle,_rgba(120,189,182,0.15)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[radial-gradient(circle,_rgba(198,138,82,0.18)_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Radial / Circular Progress Visualization */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform filter drop-shadow-[0_0_12px_rgba(120,189,182,0.25)]" viewBox="0 0 130 130">
              <defs>
                <linearGradient id="bodrinRewardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78BDB6" />
                  <stop offset="65%" stopColor="#A2E0DA" />
                  <stop offset="100%" stopColor="#C68A52" />
                </linearGradient>
                <filter id="rewardGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Inactive Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="#1B100C"
                strokeWidth={strokeWidth}
              />

              {/* Animated Progress Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="url(#bodrinRewardGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                filter="url(#rewardGlow)"
              />
            </svg>

            {/* Inner Ring Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="w-7 h-7 rounded-full bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center mb-0.5">
                <Coffee className="w-3.5 h-3.5 text-[#C68A52]" />
              </div>
              <div className="flex items-baseline gap-1 text-[#F3DDC4] font-black font-display text-xl leading-none">
                <span>{currentCups.toLocaleString('fa-IR')}</span>
                <span className="text-xs text-[#E2B88F]/50">از</span>
                <span className="text-xs text-[#78BDB6]">{targetCups.toLocaleString('fa-IR')}</span>
              </div>
              <span className="text-[10px] font-bold text-[#78BDB6] mt-0.5">
                {Math.round(ratio * 100).toLocaleString('fa-IR')}٪ فنجان
              </span>
            </div>
          </div>

          {/* Reward Info & CTA */}
          <div className="flex-1 text-center sm:text-right space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78BDB6]/15 border border-[#78BDB6]/35 text-[11px] font-bold text-[#78BDB6]">
              <Gift className="w-3.5 h-3.5" />
              <span>پاداش وفاداری BODRIN Rewards</span>
            </div>

            <h4 className="text-lg font-black text-[#F3DDC4] font-display">
              {isReadyForReward
                ? '🎉 تبریک! فنجان رایگان شما آماده سفارش است!'
                : `تنها ${remainingCups.toLocaleString('fa-IR')} فنجان تا نوشیدنی رایگان بعدی!`}
            </h4>

            <p className="text-xs text-[#E2B88F]/75 leading-relaxed">
              با هر فنجان قهوه تازه بودرین، یک قدم به فنجان رایگان آرتیزان نزدیک‌تر می‌شوید. تمام سفارش‌ها به‌صورت خودکار محاسبه و ذخیره می‌شوند.
            </p>

            {/* Reward Action Button */}
            <div className="pt-2">
              <button
                onClick={handleClaim}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isReadyForReward
                    ? 'bg-gradient-to-r from-[#78BDB6] via-[#A2E0DA] to-[#78BDB6] text-[#160D0B] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(120,189,182,0.4)]'
                    : 'bg-[#C68A52] hover:bg-[#d49963] text-[#160D0B] hover:scale-102 active:scale-98 shadow-[0_0_15px_rgba(198,138,82,0.3)]'
                }`}
              >
                {claimedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#160D0B]" />
                    <span>نوشیدنی هدیه به سبد افزوده شد!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>
                      {isReadyForReward
                        ? 'دریافت فوری نوشیدنی رایگان (هدیه)'
                        : 'افزودن نوشیدنی تست رایگان به سبد'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Ladder */}
        <div className="mt-5 pt-4 border-t border-[#3C2922]/80">
          <div className="flex items-center justify-between text-xs text-[#E2B88F] font-bold mb-2.5">
            <span>مسیر پاداش‌های فصلی باشگاه میهمانان:</span>
            <span className="text-[#78BDB6] font-mono">{loyaltyPoints.toLocaleString('fa-IR')} امتیاز فعال</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Level 1: 5 Cups */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                currentCups >= 5
                  ? 'bg-[#1D2B29]/70 border-[#78BDB6]/60 text-[#78BDB6]'
                  : 'bg-[#19100C]/70 border-[#78BDB6]/30 text-[#E2B88F]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#78BDB6]/20 text-[#78BDB6] flex items-center justify-center font-black text-xs font-display">
                  ۵
                </div>
                <span className="font-bold text-[#F3DDC4]">نوشیدنی رایگان</span>
              </div>
              <p className="text-[10px] text-[#78BDB6]">
                {currentCups >= 5 ? '✓ آماده دریافت' : `${remainingCups.toLocaleString('fa-IR')} فنجان باقی‌مانده`}
              </p>
            </div>

            {/* Level 2: 10 Cups */}
            <div className="p-3 rounded-2xl bg-[#19100C]/70 border border-[#3C2922] text-[#E2B88F]/80">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#C68A52]/20 text-[#C68A52] flex items-center justify-center font-black text-xs font-display">
                  ۱۰
                </div>
                <span className="font-bold text-[#F3DDC4]">تیرامیسو آرتیزان</span>
              </div>
              <p className="text-[10px] text-[#E2B88F]/60">
                {Math.max(0, 10 - totalCupsInHistory).toLocaleString('fa-IR')} فنجان تا هدیه
              </p>
            </div>

            {/* Level 3: 15 Cups */}
            <div className="p-3 rounded-2xl bg-[#19100C]/70 border border-[#3C2922] text-[#E2B88F]/80">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#C68A52]/20 text-[#C68A52] flex items-center justify-center font-black text-xs font-display">
                  ۱۵
                </div>
                <span className="font-bold text-[#F3DDC4]">دانه کلمبیا ۲۵۰g</span>
              </div>
              <p className="text-[10px] text-[#E2B88F]/60">
                {Math.max(0, 15 - totalCupsInHistory).toLocaleString('fa-IR')} فنجان تا هدیه
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold Membership Digital Pass Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#241510] via-[#1D110D] to-[#150B07] border border-[#C68A52]/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center text-[#C68A52]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F3DDC4]">کارت عضویت طلایی BODRIN VIP</p>
              <p className="text-[10px] text-[#78BDB6] font-mono">BOD-8820-994</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#C68A52]/15 text-[#C68A52] border border-[#C68A52]/30 font-bold">
            سطح طلایی
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#3C2922]/60 text-xs">
          <div>
            <span className="text-[10px] text-[#E2B88F]/60 block">نام دارنده:</span>
            <span className="font-bold text-[#F3DDC4]">{quickBuyProfile.recipientName}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#E2B88F]/60 block">اعتبار تخفیف دائمی:</span>
            <span className="font-bold text-[#78BDB6]">۱۰٪ در تمام فاکتورها</span>
          </div>
        </div>
      </div>
    </div>
  );
};
