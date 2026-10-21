import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { useRouter } from './utils/router';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CoffeeQuiz } from './components/CoffeeQuiz';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { FloatingBeansLayer } from './components/FloatingBeansLayer';
import { CoffeeSmokeDivider } from './components/CoffeeSmokeDivider';
import { CinematicOverlay } from './components/CinematicOverlay';
import { QuickBuySuccessModal } from './components/QuickBuySuccessModal';
import { BrewGuideModal } from './components/BrewGuideModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Check, X } from 'lucide-react';
import { coffeeSoundManager } from './utils/soundAmbience';

const ToastNotification: React.FC = () => {
  const { toastMessage, closeToast, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#241712] border border-[#78BDB6]/50 text-[#F3DDC4] shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-slide-up select-none"
      dir="rtl"
    >
      <div className="w-8 h-8 rounded-full bg-[#78BDB6]/20 flex items-center justify-center text-[#78BDB6] shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <div className="text-xs sm:text-sm font-medium">
        <span>{toastMessage}</span>
      </div>
      <button
        onClick={() => {
          coffeeSoundManager.playClickSound();
          closeToast();
          setIsCartOpen(true);
        }}
        className="mr-2 text-xs font-bold text-[#78BDB6] hover:underline cursor-pointer"
      >
        مشاهده سفارش
      </button>
      <button
        onClick={() => {
          coffeeSoundManager.playClickSound();
          closeToast();
        }}
        className="p-1 text-[#E2B88F]/50 hover:text-[#F3DDC4] cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface MainExperienceProps {
  onNavigate: (route: string) => void;
}

const MainExperience: React.FC<MainExperienceProps> = ({ onNavigate }) => {
  const { isCinematicEnabled, isBrewGuideOpen, setIsBrewGuideOpen } = useCart();
  const [showPreloader, setShowPreloader] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    // Initiate subtle ambient coffee shop audio
    coffeeSoundManager.start().catch(() => {
      const resumeOnGesture = () => {
        coffeeSoundManager.start();
        window.removeEventListener('pointerdown', resumeOnGesture);
        window.removeEventListener('keydown', resumeOnGesture);
      };
      window.addEventListener('pointerdown', resumeOnGesture, { once: true });
      window.addEventListener('keydown', resumeOnGesture, { once: true });
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    coffeeSoundManager.playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#160D0B] text-[#F3DDC4] relative selection:bg-[#78BDB6] selection:text-[#160D0B]">
      {/* Scroll Depth Progress Bar (Turquoise Brand Accent) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-black/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#78BDB6]/60 via-[#78BDB6] to-[#A2E0DA] shadow-[0_0_10px_rgba(120,189,182,0.8)] transition-[width] duration-150 ease-out origin-right"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Full-screen Subtle Cinematic Film Grain & Bloom Overlay */}
      <CinematicOverlay isEnabled={isCinematicEnabled} />

      {/* Cinematic Preloader */}
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Branded Interactive Cursor (Desktop) */}
      <CustomCursor />

      {/* GSAP Scroll-Driven Parallax Floating Beans Across All Sections */}
      <FloatingBeansLayer />

      {/* Floating Clean Navigation (No public admin buttons in customer bar) */}
      <Navbar onNavClick={scrollToSection} />

      {/* Main Customer Sections */}
      <main>
        <Hero
          onExploreClick={() => scrollToSection('menu')}
          onQuizClick={() => scrollToSection('quiz')}
          scrollProgress={scrollProgress}
        />

        {/* Coffee Smoke Divider 1 */}
        <CoffeeSmokeDivider intensity={1.2} />

        {/* Product Showcase with Horizontal and Grid View */}
        <ProductShowcase />

        {/* Coffee Smoke Divider 2 */}
        <CoffeeSmokeDivider intensity={0.9} />

        <AboutSection />
        <ReviewsSection />
        <CoffeeQuiz />
      </main>

      {/* Quick Buy Instant 1-Click Confirmation Receipt Modal */}
      <QuickBuySuccessModal />

      {/* Brew Guide Modal with Interactive Countdown Timers */}
      <BrewGuideModal
        isOpen={isBrewGuideOpen}
        onClose={() => setIsBrewGuideOpen(false)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Dedicated Step-by-Step Checkout Modal with Iranian Payment Gateway */}
      <CheckoutModal />

      {/* Toast Feedback */}
      <ToastNotification />

      {/* Branded Footer with Discrete Staff Portal Link */}
      <Footer
        onReplayPreloader={() => setShowPreloader(true)}
        onNavClick={scrollToSection}
        onNavigate={onNavigate}
      />
    </div>
  );
};

const RootApp: React.FC = () => {
  const { route, navigate } = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const { setIsCheckoutOpen } = useSiteSettings();

  useEffect(() => {
    if (route === 'checkout') {
      setIsCheckoutOpen(true);
    }
  }, [route, setIsCheckoutOpen]);

  // Route: Dedicated Admin Login Page
  if (route === 'admin-login') {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  // Route: Dedicated Standalone Admin Dashboard (Protected Route)
  if (route === 'admin') {
    if (!isAuthenticated) {
      return <AdminLoginPage onNavigate={navigate} />;
    }
    return <AdminDashboardPage onNavigate={navigate} />;
  }

  // Default: Customer Storefront Experience
  return <MainExperience onNavigate={navigate} />;
};

export default function App() {
  return (
    <SiteSettingsProvider>
      <CartProvider>
        <AdminAuthProvider>
          <RootApp />
        </AdminAuthProvider>
      </CartProvider>
    </SiteSettingsProvider>
  );
}
