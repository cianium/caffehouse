import React, { useState } from 'react';
import { Sparkles, Check, ArrowLeft, RotateCcw, Coffee, ShoppingBag, Flame, Droplets, Thermometer, Candy } from 'lucide-react';
import { QuizAnswer, Product } from '../types/coffee';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { useCart } from '../context/CartContext';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface QuizQuestion {
  id: keyof QuizAnswer;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: {
    value: string;
    label: string;
    description: string;
    badge?: string;
  }[];
}

export const CoffeeQuiz: React.FC = () => {
  const { addToCart, triggerQuickBuy, quickBuyProfile } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 'intensity',
      title: 'میزان گیرایی و تلخی قهوه را چطور می‌پسندید؟',
      subtitle: 'تعیین‌کننده درجه برشته‌کاری و غلظت عصاره‌گیری دانه',
      icon: <Flame className="w-5 h-5 text-[#C68A52]" />,
      options: [
        {
          value: 'strong',
          label: 'پرملات، قوی و تلخ دلنشین',
          description: 'بادی سنگین، بیداری کامل، ته‌مزه شکلات تلخ و کاکائو غلیظ.',
          badge: 'حداکثر انرژی',
        },
        {
          value: 'balanced',
          label: 'متعادل، نرم و بالانس',
          description: 'ترکیب طلایی طعم قهوه اصیل با بافت ابریشمی و دلپذیر شیر.',
          badge: 'کلاسیک محبوب',
        },
        {
          value: 'mild',
          label: 'سبک، لطیف و خامه‌ای',
          description: 'نوشیدنی ملایم با حداقل تلخی و تمرکز بر نت‌های شیری و وانیلی.',
          badge: 'نرم و لطیف',
        },
      ],
    },
    {
      id: 'milk',
      title: 'ترجیح شما برای افزودن شیر چیست؟',
      subtitle: 'تاثیرگذار بر کالری و بافت میکروفوم روی فنجان',
      icon: <Droplets className="w-5 h-5 text-[#78BDB6]" />,
      options: [
        {
          value: 'classic',
          label: 'شیر تازه پاستوریزه محلی',
          description: 'شیر پرچرب محلی با دمای کنترل‌شده برای فوم خامه‌ای براق.',
          badge: 'طعم خامه‌ای اصیل',
        },
        {
          value: 'plant',
          label: 'شیر گیاهی (جو دوسر / بادام)',
          description: 'شیر بدون لاکتوز و صد در صد وگان برای هضم آسان و گوارایی بیشتر.',
          badge: '۱۰۰٪ گیاهی',
        },
        {
          value: 'none',
          label: 'بدون شیر (قهوه خالص و سیاه)',
          description: 'اسپرسوی دوپیو یا عصاره‌گیری قطره‌ای برای لمس تک‌تک نت‌های مزرعه.',
          badge: 'خالص و ناب',
        },
      ],
    },
    {
      id: 'sweetness',
      title: 'آیا به افزودن سیروپ یا شیرینی ملایم علاقه‌مندید؟',
      subtitle: 'انتخاب طعم‌یادهای مکمل برای افزایش لذت نوشیدنی',
      icon: <Candy className="w-5 h-5 text-[#C68A52]" />,
      options: [
        {
          value: 'none',
          label: 'بدون هیچ‌گونه قند یا سیروپ',
          description: 'صرفاً شیرینی طبیعی میوه قهوه و قند طبیعی لاکتوز شیر.',
        },
        {
          value: 'caramel',
          label: 'کارامل نمکی دست‌ساز',
          description: 'سیروپ کارامل کره‌ای پخته‌شده با بلورهای نمک دریا و وانیل.',
          badge: 'انتخاب اول میهمانان',
        },
        {
          value: 'chocolate',
          label: 'شکلات تلخ بلژیکی',
          description: 'گاناش دست‌ساز از ۷۰٪ کاکائوی خالص وارداتی.',
        },
        {
          value: 'nutty',
          label: 'نت‌های آجیلی یا گل اسطوخودوس',
          description: 'ترکیب فندق بو داده، دارچین سیلان یا شکوفه آرامش‌بخش لاوندر.',
        },
      ],
    },
    {
      id: 'temperature',
      title: 'در حال حاضر چه دمایی از نوشیدنی را تمایل دارید؟',
      subtitle: 'گرمای آرام‌بخش زمستانه یا خنکای باطراوت تابستانه',
      icon: <Thermometer className="w-5 h-5 text-[#78BDB6]" />,
      options: [
        {
          value: 'hot',
          label: 'گرم و صمیمی (Hot)',
          description: 'دمای استاندارد ۶۵ درجه سانتی‌گراد جهت حفظ شیرینی و غلظت خامه.',
          badge: 'آرامش و گرما',
        },
        {
          value: 'iced',
          label: 'آیس و خنک با یخ بلوری (Iced)',
          description: 'سرو روی قطعات کریستالی یخ برای یک تجربه به‌یادماندنی و پرانرژی.',
          badge: 'نهایت خنکی',
        },
      ],
    },
  ];

  const handleSelectOption = (value: string) => {
    coffeeSoundManager.playClickSound();
    const currentQ = questions[currentStep];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateRecommendation(newAnswers as QuizAnswer);
    }
  };

  const calculateRecommendation = (finalAnswers: QuizAnswer) => {
    let matchId = 'latte';

    if (finalAnswers.temperature === 'iced') {
      matchId = 'cold-brew-tonic';
    } else if (finalAnswers.sweetness === 'chocolate') {
      matchId = 'mocha';
    } else if (finalAnswers.sweetness === 'nutty' || finalAnswers.milk === 'plant') {
      matchId = 'raf-lavender';
    } else if (finalAnswers.intensity === 'strong' && finalAnswers.milk === 'none') {
      matchId = 'flat-white';
    } else if (finalAnswers.intensity === 'strong') {
      matchId = 'cappuccino';
    } else if (finalAnswers.intensity === 'mild') {
      matchId = 'latte';
    } else {
      matchId = 'cappuccino';
    }

    const found = COFFEE_PRODUCTS.find((p) => p.id === matchId) || COFFEE_PRODUCTS[0];
    setRecommendedProduct(found);
    setIsCompleted(true);
  };

  const handleReset = () => {
    coffeeSoundManager.playClickSound();
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setRecommendedProduct(null);
    setIsAdded(false);
  };

  const handleAddToCart = () => {
    if (!recommendedProduct) return;
    coffeeSoundManager.playClickSound();
    addToCart(recommendedProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const currentQuestion = questions[currentStep];
  const progressPercent = ((currentStep + (isCompleted ? 1 : 0)) / questions.length) * 100;

  return (
    <section id="quiz" className="relative py-28 bg-[#160D0B] overflow-hidden text-right">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,_rgba(198,138,82,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B1B16] border border-[#C68A52]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#78BDB6]" />
            <span className="text-xs font-semibold tracking-wider text-[#E2B88F]">
              آزمون انتخاب هوشمند قهوه
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F3DDC4] tracking-tight font-display">
            کدام قهوه دقیقاً مناسب ذائقه شماست؟
          </h2>
          <p className="mt-4 text-base text-[#E2B88F]/75 leading-relaxed">
            با ۴ پرسش کوتاه، باریستای هوشمند بودرین اختصاصی‌ترین نوشیدنی را برای شما آماده می‌کند.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#2B1B16]/90 via-[#231511]/90 to-[#1A100C]/95 border border-[#C68A52]/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-[#E2B88F]/70 font-semibold mb-2">
              <span>
                {isCompleted
                  ? 'آزمون به پایان رسید!'
                  : `پرسش ${currentStep + 1} از ${questions.length}`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#3C2922] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C68A52] to-[#78BDB6] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {!isCompleted ? (
            /* Active Question State */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#160D0B] border border-[#C68A52]/30 shrink-0">
                  {currentQuestion.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F3DDC4] font-display">
                    {currentQuestion.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E2B88F]/70 mt-1">
                    {currentQuestion.subtitle}
                  </p>
                </div>
              </div>

              {/* Options Cards */}
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className="group relative flex items-center justify-between text-right p-4 sm:p-5 rounded-2xl bg-[#211410] hover:bg-[#2F1D17] border border-[#3C2922] hover:border-[#C68A52]/60 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-x-1"
                  >
                    <div className="pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base sm:text-lg font-bold text-[#F3DDC4] group-hover:text-[#C68A52] transition-colors">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78BDB6]/20 text-[#78BDB6] font-semibold">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#E2B88F]/65 leading-relaxed">{opt.description}</p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#160D0B] border border-[#3C2922] group-hover:border-[#C68A52] flex items-center justify-center shrink-0 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-[#E2B88F]/50 group-hover:text-[#C68A52] group-hover:-translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results State: Personalized Recommendation */
            recommendedProduct && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78BDB6]/15 border border-[#78BDB6]/40 text-[#78BDB6] text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-4 h-4" />
                  پیشنهاد ویژه بر اساس ذائقه شما
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-[#F3DDC4] font-display mb-3">
                  {recommendedProduct.name}
                </h3>

                <p className="text-sm sm:text-base text-[#E2B88F]/80 max-w-lg mb-6 leading-relaxed">
                  {recommendedProduct.description}
                </p>

                {/* Flavor Notes Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {recommendedProduct.notes.map((note, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-[#160D0B] text-[#C68A52] border border-[#C68A52]/30 font-medium"
                    >
                      ✦ {note}
                    </span>
                  ))}
                  <span className="text-xs px-3 py-1 rounded-full bg-[#160D0B] text-[#78BDB6] border border-[#78BDB6]/30 font-medium">
                    {recommendedProduct.volume}
                  </span>
                </div>

                {/* Price and CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                  <button
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#78BDB6] hover:bg-[#68ada6] text-[#160D0B] font-bold text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(120,189,182,0.35)] cursor-pointer hover:scale-105"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5 text-[#160D0B]" />
                        <span>به سبد خرید افزوده شد!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 text-[#160D0B]" />
                        <span>سفارش با قیمت {recommendedProduct.price.toLocaleString('fa-IR')} تومان</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#2B1B16] hover:bg-[#3C2922] text-[#E2B88F] border border-[#C68A52]/40 font-semibold text-sm transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>انجام مجدد آزمون</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
