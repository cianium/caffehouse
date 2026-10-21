import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'admin' | 'admin-login' | 'checkout';

export interface RouteState {
  currentRoute: AppRoute;
  path: string;
}

export function parseRoute(location: Location): AppRoute {
  const path = location.pathname.toLowerCase();
  const hash = location.hash.toLowerCase().replace(/^#\/?/, '');

  // Check path first, then hash fallback
  if (path.includes('/admin/login') || hash.includes('admin/login')) {
    return 'admin-login';
  }
  if (path.includes('/admin') || hash.includes('admin')) {
    return 'admin';
  }
  if (path.includes('/checkout') || hash.includes('checkout')) {
    return 'checkout';
  }
  return 'home';
}

export function useRouter() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location));

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseRoute(window.location));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((target: AppRoute | string) => {
    let newPath = '/';
    let newRoute: AppRoute = 'home';

    if (target === 'admin' || target === '/admin' || target === '#/admin') {
      newPath = '/admin';
      newRoute = 'admin';
    } else if (target === 'admin-login' || target === '/admin/login' || target === '#/admin/login') {
      newPath = '/admin/login';
      newRoute = 'admin-login';
    } else if (target === 'checkout' || target === '/checkout' || target === '#/checkout') {
      newPath = '/checkout';
      newRoute = 'checkout';
    } else {
      newPath = '/';
      newRoute = 'home';
    }

    try {
      window.history.pushState(null, '', newPath);
    } catch {
      // In strict sandboxes, fallback to hash
      window.location.hash = newPath;
    }

    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}
