import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order, QuickBuyProfile } from '../types/coffee';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { coffeeSoundManager } from '../utils/soundAmbience';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedMilk?: string,
    selectedSyrup?: string,
    customSleeveText?: string,
    sleeveColor?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isBrewGuideOpen: boolean;
  setIsBrewGuideOpen: (open: boolean) => void;
  toastMessage: string | null;
  closeToast: () => void;
  // Order history & BODRIN Rewards
  orders: Order[];
  claimRewardFreeDrink: () => void;
  addOrder: (orderData: {
    orderNumber: number;
    items: CartItem[];
    totalPrice: number;
    discount: number;
    finalPrice: number;
    deliveryType: 'pickup' | 'delivery';
    isQuickBuy?: boolean;
  }) => Order;
  repeatOrder: (order: Order) => void;
  // Quick Buy Mode
  quickBuyProfile: QuickBuyProfile;
  updateQuickBuyProfile: (profile: Partial<QuickBuyProfile>) => void;
  triggerQuickBuy: (product: Product) => Order;
  quickBuySuccessOrder: Order | null;
  setQuickBuySuccessOrder: (order: Order | null) => void;
  // Cinematic Film Grain & Bloom toggle
  isCinematicEnabled: boolean;
  toggleCinematicOverlay: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bodrin_cart_items_v2';
const ORDERS_STORAGE_KEY = 'bodrin_orders_history_v2';
const QUICK_BUY_STORAGE_KEY = 'bodrin_quick_buy_profile_v2';
const CINEMATIC_STORAGE_KEY = 'bodrin_cinematic_mode_v2';

// Seed initial realistic Persian order for demonstration
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-389',
    orderNumber: 389,
    date: 'دیروز، ساعت ۱۶:۴۰',
    items: [
      {
        product: COFFEE_PRODUCTS[0], // Cappuccino
        quantity: 1,
        selectedMilk: 'شیر تازه محلی',
      },
      {
        product: COFFEE_PRODUCTS[1], // Latte
        quantity: 1,
        selectedMilk: 'شیر جو دوسر',
        selectedSyrup: 'کارامل نمکی',
      },
    ],
    totalPrice: 260000,
    discount: 26000,
    finalPrice: 234000,
    deliveryType: 'pickup',
    status: 'تحویل داده شده',
  },
];

const DEFAULT_QUICK_BUY_PROFILE: QuickBuyProfile = {
  isEnabled: true,
  recipientName: 'کیان رضایی',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، مجتمع تجاری بهاران، واحد ۴۰۲',
  paymentMethod: 'اعتبار کیف پول طلایی بودرین (شارژ خودکار)',
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [quickBuyProfile, setQuickBuyProfile] = useState<QuickBuyProfile>(() => {
    try {
      const saved = localStorage.getItem(QUICK_BUY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_QUICK_BUY_PROFILE;
    } catch {
      return DEFAULT_QUICK_BUY_PROFILE;
    }
  });

  const [isCinematicEnabled, setIsCinematicEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(CINEMATIC_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBrewGuideOpen, setIsBrewGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickBuySuccessOrder, setQuickBuySuccessOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage safety
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Storage safety
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(QUICK_BUY_STORAGE_KEY, JSON.stringify(quickBuyProfile));
    } catch {
      // Storage safety
    }
  }, [quickBuyProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(CINEMATIC_STORAGE_KEY, JSON.stringify(isCinematicEnabled));
    } catch {
      // Storage safety
    }
  }, [isCinematicEnabled]);

  const toggleCinematicOverlay = () => {
    coffeeSoundManager.playClickSound();
    setIsCinematicEnabled((prev) => !prev);
  };

  const updateQuickBuyProfile = (partial: Partial<QuickBuyProfile>) => {
    setQuickBuyProfile((prev) => ({ ...prev, ...partial }));
    setToastMessage('تنظیمات خرید سریع با موفقیت ذخیره شد!');
  };

  const addToCart = (
    product: Product,
    selectedMilk?: string,
    selectedSyrup?: string,
    customSleeveText?: string,
    sleeveColor?: string
  ) => {
    coffeeSoundManager.playClickSound();
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMilk === selectedMilk &&
          item.selectedSyrup === selectedSyrup &&
          item.customSleeveText === customSleeveText
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedMilk,
          selectedSyrup,
          customSleeveText,
          sleeveColor,
        },
      ];
    });

    const sleeveNote = customSleeveText ? ` با کمربند اختصاصی «${customSleeveText}»` : '';
    setToastMessage(`«${product.name}»${sleeveNote} به سبد سفارش شما افزوده شد!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Claim Free Reward Drink
  const claimRewardFreeDrink = () => {
    coffeeSoundManager.playClickSound();
    const freeProduct = COFFEE_PRODUCTS[0]; // Free Signature Cappuccino / Drink
    const freeItem: CartItem = {
      product: {
        ...freeProduct,
        price: 0,
        name: `${freeProduct.name} هدیه بودرین (پاداش ۵ فنجان)`,
      },
      quantity: 1,
      selectedMilk: 'شیر جو دوسر Barista (رایگان)',
      customSleeveText: 'BODRIN REWARD VIP',
      sleeveColor: '#78BDB6',
    };

    setItems((prev) => [freeItem, ...prev]);
    setIsCartOpen(true);
    setToastMessage('🎉 تبریک! نوشیدنی رایگان پاداش اعضا با کمربند VIP به سبد سفارش شما افزوده شد!');
  };

  const removeFromCart = (productId: string) => {
    coffeeSoundManager.playClickSound();
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    coffeeSoundManager.playClickSound();
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const addOrder = (orderData: {
    orderNumber: number;
    items: CartItem[];
    totalPrice: number;
    discount: number;
    finalPrice: number;
    deliveryType: 'pickup' | 'delivery';
    isQuickBuy?: boolean;
  }): Order => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = `امروز، ساعت ${timeStr}`;

    const newOrder: Order = {
      id: `ORD-${orderData.orderNumber}`,
      orderNumber: orderData.orderNumber,
      date: dateStr,
      items: [...orderData.items],
      totalPrice: orderData.totalPrice,
      discount: orderData.discount,
      finalPrice: orderData.finalPrice,
      deliveryType: orderData.deliveryType,
      status: 'در حال آماده‌سازی',
      isQuickBuy: orderData.isQuickBuy,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Instant 1-Click Checkout via Quick Buy
  const triggerQuickBuy = (product: Product): Order => {
    coffeeSoundManager.playClickSound();
    const randomOrderNum = Math.floor(100 + Math.random() * 900);
    const quickOrderItem: CartItem = {
      product,
      quantity: 1,
      selectedMilk: 'شیر تازه محلی',
    };

    const newOrder = addOrder({
      orderNumber: randomOrderNum,
      items: [quickOrderItem],
      totalPrice: product.price,
      discount: Math.round(product.price * 0.1), // 10% instant club member perk
      finalPrice: Math.round(product.price * 0.9),
      deliveryType: 'delivery',
      isQuickBuy: true,
    });

    setQuickBuySuccessOrder(newOrder);
    setToastMessage(`⚡ سفارش سریع #${newOrder.orderNumber} با یک کلیک ثبت شد!`);
    return newOrder;
  };

  const repeatOrder = (order: Order) => {
    coffeeSoundManager.playClickSound();
    setItems((prev) => {
      const next = [...prev];
      order.items.forEach((orderItem) => {
        const existingIndex = next.findIndex(
          (item) =>
            item.product.id === orderItem.product.id &&
            item.selectedMilk === orderItem.selectedMilk &&
            item.selectedSyrup === orderItem.selectedSyrup
        );
        if (existingIndex > -1) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + orderItem.quantity,
          };
        } else {
          next.push({ ...orderItem });
        }
      });
      return next;
    });

    setToastMessage(`سفارش قبلی #${order.orderNumber} به سبد سفارش افزوده شد!`);
    setIsCartOpen(true);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isBrewGuideOpen,
        setIsBrewGuideOpen,
        toastMessage,
        closeToast: () => setToastMessage(null),
        orders,
        claimRewardFreeDrink,
        addOrder,
        repeatOrder,
        quickBuyProfile,
        updateQuickBuyProfile,
        triggerQuickBuy,
        quickBuySuccessOrder,
        setQuickBuySuccessOrder,
        isCinematicEnabled,
        toggleCinematicOverlay,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
