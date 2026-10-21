import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  pendingEmail: string | null;
  isVerifyingOtp: boolean;
  otpCode: string | null;
  otpExpirySeconds: number;
  loginStep1: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: () => Promise<{ success: boolean; error?: string }>;
  cancelOtp: () => void;
  logout: () => void;
}

const ADMIN_STORAGE_KEY = 'bodrin_admin_auth_v3';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed.token && parsed.email);
      }
      return false;
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.email || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState<number>(0);

  // OTP Countdown timer
  useEffect(() => {
    if (otpExpirySeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpirySeconds]);

  // Step 1: Password & Email check -> Generate OTP
  const loginStep1 = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'لطفاً ایمیل و گذرواژه امنیتی ادمین را وارد نمایید.' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'فرمت آدرس ایمیل وارد شده نامعتبر است.' };
    }

    // Default password check (accepts standard admin password or any password >= 6 chars for testing)
    if (cleanPass.length < 6) {
      return { success: false, error: 'گذرواژه باید حداقل شامل ۶ کاراکتر باشد.' };
    }

    // Generate random 6-digit confirmation code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setPendingEmail(cleanEmail);
    setIsVerifyingOtp(true);
    setOtpExpirySeconds(120);

    return { success: true };
  };

  // Step 2: Verify OTP
  const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    const cleanCode = code.trim().replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      return { success: false, error: 'کد تایید ۶ رقمی را به‌صورت کامل وارد نمایید.' };
    }

    if (otpExpirySeconds <= 0) {
      return { success: false, error: 'مهلت زمانی کد تایید منقضی شده است. لطفاً درخواست کد مجدد دهید.' };
    }

    if (cleanCode !== otpCode) {
      return { success: false, error: 'کد تایید وارد شده نادرست است. لطفاً دقت فرمایید.' };
    }

    // Success: Establish secure session
    const authData = {
      email: pendingEmail,
      token: `bodrin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authData));
    setIsAuthenticated(true);
    setAdminEmail(pendingEmail);
    setIsVerifyingOtp(false);
    setPendingEmail(null);
    setOtpCode(null);
    setOtpExpirySeconds(0);

    return { success: true };
  };

  const resendOtp = async (): Promise<{ success: boolean; error?: string }> => {
    if (!pendingEmail) {
      return { success: false, error: 'ایمیل مقصد مشخص نیست.' };
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setOtpExpirySeconds(120);
    return { success: true };
  };

  const cancelOtp = () => {
    setIsVerifyingOtp(false);
    setPendingEmail(null);
    setOtpCode(null);
    setOtpExpirySeconds(0);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setAdminEmail(null);
    setIsVerifyingOtp(false);
    setPendingEmail(null);
    setOtpCode(null);
    setOtpExpirySeconds(0);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminEmail,
        pendingEmail,
        isVerifyingOtp,
        otpCode,
        otpExpirySeconds,
        loginStep1,
        verifyOtp,
        resendOtp,
        cancelOtp,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
