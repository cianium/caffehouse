export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  rating: number;
  reviewsCount: number;
  volume: string;
  calories: number;
  description: string;
  notes: string[];
  roastLevel: 'روشن' | 'متوسط' | 'تیره' | 'Светлая' | 'Средняя' | 'Темная';
  milkType?: string;
  badge?: string;
  imageColor: string;
  accentColor: string;
  category: 'espresso' | 'milk' | 'specialty' | 'cold';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMilk?: string;
  selectedSyrup?: string;
  customSleeveText?: string;
  sleeveColor?: string;
}

export interface QuizAnswer {
  intensity: 'strong' | 'balanced' | 'mild';
  milk: 'classic' | 'plant' | 'none';
  sweetness: 'none' | 'caramel' | 'chocolate' | 'nutty';
  temperature: 'hot' | 'iced';
}

export interface Order {
  id: string;
  orderNumber: number;
  date: string;
  items: CartItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  deliveryType: 'pickup' | 'delivery';
  status: 'در حال آماده‌سازی' | 'تحویل داده شده' | 'ارسال با پیک' | 'Готовится' | 'Выдан' | 'Доставлен';
  isQuickBuy?: boolean;
}

export interface QuickBuyProfile {
  isEnabled: boolean;
  recipientName: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export interface BrewStep {
  timeSeconds: number;
  title: string;
  description: string;
  waterTargetGrams: number;
}

export interface BrewMethod {
  id: 'v60' | 'french-press' | 'aeropress';
  name: string;
  nameEn: string;
  ratio: string;
  coffeeGrams: number;
  waterGrams: number;
  temperature: string;
  grindSize: string;
  totalTimeSeconds: number;
  steps: BrewStep[];
  tips: string[];
}
