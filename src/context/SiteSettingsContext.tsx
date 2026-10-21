import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/coffee';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';

export interface SocialLinks {
  instagram: string;
  telegram: string;
  whatsapp: string;
  twitter: string;
  youtube: string;
}

export interface SiteInfo {
  siteName: string;
  siteNameEn: string;
  slogan: string;
  description: string;
  phone: string;
  address: string;
  branchSecondary: string;
  workingHours: string;
}

export interface SiteSettingsContextType {
  siteInfo: SiteInfo;
  updateSiteInfo: (info: Partial<SiteInfo>) => void;
  socialLinks: SocialLinks;
  updateSocialLinks: (links: Partial<SocialLinks>) => void;
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const DEFAULT_SITE_INFO: SiteInfo = {
  siteName: 'بودرین',
  siteNameEn: 'BODRIN COFFEE',
  slogan: 'طعم اصیل موج سوم، دم‌آوری فراگیر و سینمایی',
  description: 'زنجیره کافه‌های تخصصی بودرین؛ برشته‌کاری هفتگی مرغوب‌ترین دانه‌های ۱۰۰٪ عربیکا، فضایی آرامش‌بخش و تجربه متمایز طعم و هنر.',
  phone: '۰۲۱-۸۸۲۲۳۳۴۴',
  address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، نبش کوچه دهم، پلاک ۲۴',
  branchSecondary: 'تهران، بلوار اندرزگو، نبش سلیمی شمالی، پلاک ۱۸',
  workingHours: 'همه‌روزه از ۰۷:۳۰ صبح تا ۲۳:۳۰ شب',
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://instagram.com/bodrin_coffee',
  telegram: 'https://t.me/bodrin_coffee',
  whatsapp: 'https://wa.me/989123456789',
  twitter: 'https://twitter.com/bodrin_coffee',
  youtube: 'https://youtube.com/@bodrincoffee',
};

const SITE_INFO_KEY = 'bodrin_site_info_v3';
const SOCIAL_LINKS_KEY = 'bodrin_social_links_v3';
const PRODUCTS_KEY = 'bodrin_catalog_products_v3';

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => {
    try {
      const saved = localStorage.getItem(SITE_INFO_KEY);
      return saved ? { ...DEFAULT_SITE_INFO, ...JSON.parse(saved) } : DEFAULT_SITE_INFO;
    } catch {
      return DEFAULT_SITE_INFO;
    }
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    try {
      const saved = localStorage.getItem(SOCIAL_LINKS_KEY);
      return saved ? { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(saved) } : DEFAULT_SOCIAL_LINKS;
    } catch {
      return DEFAULT_SOCIAL_LINKS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : COFFEE_PRODUCTS;
    } catch {
      return COFFEE_PRODUCTS;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync siteInfo
  useEffect(() => {
    try {
      localStorage.setItem(SITE_INFO_KEY, JSON.stringify(siteInfo));
    } catch (err) {
      console.error('Error saving siteInfo:', err);
    }
  }, [siteInfo]);

  // Sync socialLinks
  useEffect(() => {
    try {
      localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(socialLinks));
    } catch (err) {
      console.error('Error saving socialLinks:', err);
    }
  }, [socialLinks]);

  // Sync products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Error saving products:', err);
    }
  }, [products]);

  const updateSiteInfo = (info: Partial<SiteInfo>) => {
    setSiteInfo((prev) => ({ ...prev, ...info }));
  };

  const updateSocialLinks = (links: Partial<SocialLinks>) => {
    setSocialLinks((prev) => ({ ...prev, ...links }));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addProduct = (newProductData: Omit<Product, 'id'>): Product => {
    const id = `coffee-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(COFFEE_PRODUCTS);
    localStorage.removeItem(PRODUCTS_KEY);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        siteInfo,
        updateSiteInfo,
        socialLinks,
        updateSocialLinks,
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        isAdminOpen,
        setIsAdminOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
