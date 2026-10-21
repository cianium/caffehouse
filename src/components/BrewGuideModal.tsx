import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Droplets, Thermometer, Clock, Sparkles, Scale, Info, CheckCircle2 } from 'lucide-react';
import { BrewMethod } from '../types/coffee';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface BrewGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BREW_METHODS: BrewMethod[] = [
  {
    id: 'v60',
    name: 'پور اور V60 (چکه‌ای تخصصی)',
    nameEn: 'Hario V60 Pour Over',
    ratio: '۱:۱۶',
    coffeeGrams: 15,
    waterGrams: 240,
    temperature: '۹۲°C',
    grindSize: 'متوسط رو به ریز (شبیه نمک دریا)',
    totalTimeSeconds: 180,
    steps: [
      {
        timeSeconds: 45,
        title: 'شکوفایی و بلومینگ (Bloom)',
        description: '۵۰ گرم آب را به آرامی روی قهوه بریزید تا گازهای CO2 خارج شده و عطر دانه آزاد شود.',
        waterTargetGrams: 50,
      },
      {
        timeSeconds: 90,
        title: 'ریزش دورانی اول',
        description: 'با حرکات دایره‌ای ملایم از مرکز به سمت خارج، وزن آب را به ۱۵۰ گرم برسانید.',
        waterTargetGrams: 150,
      },
      {
        timeSeconds: 135,
        title: 'ریزش دورانی دوم و پایانی',
        description: 'جریان مداوم آب را تا رسیدن به ۲۴۰ گرم ادامه دهید و از ریختن روی دیواره فیلتر خودداری کنید.',
        waterTargetGrams: 240,
      },
      {
        timeSeconds: 180,
        title: 'عصاره‌گیری نهایی (Drawdown)',
        description: 'اجازه دهید تمام عصاره با جاذبه زمین درون سرور فیلتر شود. بستر قهوه باید کاملاً صاف باشد.',
        waterTargetGrams: 240,
      },
    ],
    tips: [
      'فیلتر کاغذی را قبل از ریختن پودر با آب داغ بشویید تا طعم کاغذ به فنجان منتقل نشود.',
      'آب تصفیه شده با املاح استاندارد (TDS بین ۱۰۰ تا ۱۵۰) استفاده نمایید.',
    ],
  },
  {
    id: 'french-press',
    name: 'فرنچ پرس (غوطه‌وری غلیظ)',
    nameEn: 'French Press',
    ratio: '۱:۱۵',
    coffeeGrams: 20,
    waterGrams: 300,
    temperature: '۹۴°C',
    grindSize: 'درشت و یکنواخت (شبیه نمک کریستال)',
    totalTimeSeconds: 240,
    steps: [
      {
        timeSeconds: 60,
        title: 'ریختن کل آب و حل کردن پودر',
        description: 'تمامی ۳۰۰ گرم آب داغ را اضافه کنید و به آرامی با قاشق چوبی هم بزنید تا تمام ذرات خیس شوند.',
        waterTargetGrams: 300,
      },
      {
        timeSeconds: 210,
        title: 'دم‌آوری و استراحت (Brewing)',
        description: 'اهرم فرنچ پرس را روی ظرف بگذارید اما پایین ندهید. اجازه دهید قهوه کاملاً دم بکشد.',
        waterTargetGrams: 300,
      },
      {
        timeSeconds: 240,
        title: 'فشردن اهرم و سرو فوری',
        description: 'اهرم پیستون را به آرامی و با فشار یکنواخت به پایین هدایت کنید و قهوه را فوراً سرو نمایید.',
        waterTargetGrams: 300,
      },
    ],
    tips: [
      'هرگز قهوه دم‌شده را درون فرنچ پرس رها نکنید چون تلخی بیش از حد ایجاد خواهد شد.',
      'آسیاب یکدست و درشت مانع از عبور ذرات ریز (لِرد قهوه) به داخل فنجان می‌شود.',
    ],
  },
  {
    id: 'aeropress',
    name: 'ائروپرس (عصاره‌گیری تحت فشار)',
    nameEn: 'AeroPress Inverted',
    ratio: '۱:۱۲',
    coffeeGrams: 16,
    waterGrams: 200,
    temperature: '۸۸°C',
    grindSize: 'متوسط (شبیه شن نرم ساحل)',
    totalTimeSeconds: 105,
    steps: [
      {
        timeSeconds: 30,
        title: 'روش معکوس و بلومینگ',
        description: 'ائروپرس را به صورت وارونه قرار داده، ۱۰۰ گرم آب اضافه کنید و ۱۰ ثانیه با ملایمت هم بزنید.',
        waterTargetGrams: 100,
      },
      {
        timeSeconds: 75,
        title: 'تکمیل آب و بستن فیلتر',
        description: '۱۰۰ گرم باقی‌مانده را اضافه کنید. درپوش فیلتر شسته شده را روی دستگاه محکم ببندید.',
        waterTargetGrams: 200,
      },
      {
        timeSeconds: 105,
        title: 'برگرداندن و پرس کردن',
        description: 'ائروپرس را روی ماگ برگردانده و پیستون را طی ۳۰ ثانیه تا شنیدن صدای خروج هوا به پایین فشار دهید.',
        waterTargetGrams: 200,
      },
    ],
    tips: [
      'دمای آب کمتر (۸۸ درجه) باعث استخراج بیشتر نت‌های میوه‌ای و اسیدیته شیرین می‌شود.',
      'به محض شنیدن صدای هیس هوا، فشردن پیستون را متوقف کنید.',
    ],
  },
];

export const BrewGuideModal: React.FC<BrewGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<'v60' | 'french-press' | 'aeropress'>('v60');
  const [cupsCount, setCupsCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  const activeMethod = BREW_METHODS.find((m) => m.id === selectedMethodId) || BREW_METHODS[0];

  // Reset timer on method change
  useEffect(() => {
    setTimeLeft(activeMethod.totalTimeSeconds);
    setIsRunning(false);
    setTimerFinished(false);
  }, [selectedMethodId, activeMethod.totalTimeSeconds]);

  // Countdown loop
  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimerFinished(true);
            coffeeSoundManager.playClickSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const toggleTimer = () => {
    coffeeSoundManager.playClickSound();
    if (timeLeft === 0) {
      setTimeLeft(activeMethod.totalTimeSeconds);
      setTimerFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    coffeeSoundManager.playClickSound();
    setIsRunning(false);
    setTimeLeft(activeMethod.totalTimeSeconds);
    setTimerFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const elapsedSeconds = activeMethod.totalTimeSeconds - timeLeft;
  const currentStepIndex = activeMethod.steps.findIndex((s) => elapsedSeconds <= s.timeSeconds);
  const currentStep = activeMethod.steps[currentStepIndex > -1 ? currentStepIndex : activeMethod.steps.length - 1];

  // Scaled coffee and water amounts
  const scaledCoffee = activeMethod.coffeeGrams * cupsCount;
  const scaledWater = activeMethod.waterGrams * cupsCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-right select-none" dir="rtl">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#261712] via-[#1E120E] to-[#150B07] border border-[#C68A52]/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3C2922] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C68A52]/20 border border-[#C68A52]/40 flex items-center justify-center text-[#C68A52]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F3DDC4] font-display">
                راهنمای دم‌آوری قهوه تخصصی در خانه
              </h3>
              <p className="text-xs text-[#E2B88F]/70 mt-0.5">
                تایمر تعاملی و نسبت‌های استاندارد باریستاهای بودرین
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-[#3C2922] text-[#E2B88F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#160D0B] border border-[#3C2922] mb-6">
          {BREW_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                coffeeSoundManager.playClickSound();
                setSelectedMethodId(method.id);
              }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                selectedMethodId === method.id
                  ? 'bg-[#C68A52] text-[#160D0B] shadow-md'
                  : 'text-[#E2B88F]/70 hover:text-[#F3DDC4]'
              }`}
            >
              {method.name.split(' ')[0]} {method.name.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pl-1 space-y-6">
          {/* Method Specs Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#1C110D] border border-[#3C2922]">
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-[#78BDB6] shrink-0" />
              <div>
                <span className="text-[10px] text-[#E2B88F]/60 block">نسبت دم‌آوری</span>
                <span className="text-xs font-bold text-[#F3DDC4] font-mono">{activeMethod.ratio}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-[#C68A52] shrink-0" />
              <div>
                <span className="text-[10px] text-[#E2B88F]/60 block">دمای ایده‌آل آب</span>
                <span className="text-xs font-bold text-[#F3DDC4] font-mono">{activeMethod.temperature}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-[#78BDB6] shrink-0" />
              <div>
                <span className="text-[10px] text-[#E2B88F]/60 block">آب / قهوه</span>
                <span className="text-xs font-bold text-[#F3DDC4] font-mono">{scaledCoffee}g / {scaledWater}g</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C68A52] shrink-0" />
              <div>
                <span className="text-[10px] text-[#E2B88F]/60 block">درجه آسیاب</span>
                <span className="text-xs font-bold text-[#F3DDC4] line-clamp-1">{activeMethod.grindSize.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Interactive Countdown Timer Banner */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#291A14] via-[#20120D] to-[#160D0B] border border-[#C68A52]/40 text-center overflow-hidden shadow-xl">
            <span className="text-xs font-bold text-[#78BDB6] uppercase tracking-widest block mb-1">
              {timerFinished ? 'عصاره‌گیری به پایان رسید!' : isRunning ? 'تایمر فعال است' : 'تایمر آماده شروع'}
            </span>

            {/* Big Digital Clock */}
            <div className="text-5xl sm:text-6xl font-black text-[#F3DDC4] font-mono my-3 tracking-wider">
              {timeFormatted}
            </div>

            {/* Active Stage Indicator */}
            {currentStep && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#160D0B]/80 border border-[#C68A52]/30 text-xs text-[#E2B88F] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#78BDB6] animate-pulse" />
                <span>مرحله فعال: <strong>{currentStep.title}</strong> (تا وزن {currentStep.waterTargetGrams * cupsCount} گرم)</span>
              </div>
            )}

            {/* Timer Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={toggleTimer}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-sm transition-all shadow-[0_0_20px_rgba(120,189,182,0.4)] cursor-pointer hover:scale-105"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>توقف تایمر</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current rotate-180" />
                    <span>{timerFinished ? 'شروع دوباره' : 'آغاز عصاره‌گیری'}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#241712] hover:bg-[#322019] text-[#E2B88F] border border-[#3C2922] text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>بازنشانی</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#F3DDC4] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C68A52]" />
              <span>مراحل دقیق عصاره‌گیری:</span>
            </h4>

            <div className="space-y-2.5">
              {activeMethod.steps.map((step, idx) => {
                const isPast = elapsedSeconds > step.timeSeconds;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-[#2B1B16] border-[#78BDB6]/60 shadow-md'
                        : isPast
                        ? 'bg-[#180E0B] border-[#3C2922]/50 opacity-70'
                        : 'bg-[#1C110D] border-[#3C2922]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-[#78BDB6] text-[#160D0B]'
                          : isPast
                          ? 'bg-[#C68A52]/20 text-[#C68A52]'
                          : 'bg-[#160D0B] text-[#E2B88F]/50'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs sm:text-sm font-bold text-[#F3DDC4]">{step.title}</span>
                        <span className="text-[10px] text-[#78BDB6] font-mono">
                          (تا ثانیه {step.timeSeconds} • آب: {step.waterTargetGrams * cupsCount}g)
                        </span>
                      </div>
                      <p className="text-xs text-[#E2B88F]/75 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barista Pro Tips */}
          <div className="p-4 rounded-2xl bg-[#1A100C] border border-[#C68A52]/30 space-y-2">
            <h5 className="text-xs font-bold text-[#C68A52] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>نکات حرفه‌ای باریستاهای بودرین:</span>
            </h5>
            <ul className="space-y-1 text-xs text-[#E2B88F]/70 list-disc list-inside leading-relaxed">
              {activeMethod.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="pt-4 mt-auto border-t border-[#3C2922] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#E2B88F]/80">
            <span>تعداد فنجان:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    coffeeSoundManager.playClickSound();
                    setCupsCount(num);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cupsCount === num
                      ? 'bg-[#C68A52] text-[#160D0B]'
                      : 'bg-[#241712] text-[#E2B88F]/60 border border-[#3C2922]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              coffeeSoundManager.playClickSound();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-[#2B1B16] hover:bg-[#3C2922] text-[#F3DDC4] border border-[#C68A52]/40 text-xs font-bold transition-all cursor-pointer"
          >
            بستن راهنما
          </button>
        </div>
      </div>
    </div>
  );
};
