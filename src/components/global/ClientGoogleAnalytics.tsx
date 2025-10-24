'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-6SZZHD30W4';
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true';
const MAX_QUERY_LENGTH = 200; // przycinamy długie query, żeby nie wysyłać nadmiaru danych

export default function ClientGoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;
    const query = searchParams?.toString();
    const page_path = query ? `${pathname}?${query}` : pathname;

    const win = window as Window & { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('config', GA_ID, { page_path });
      try {
        win.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path,
        });
      } catch (e) {
        // nic — gtag może nie akceptować eventów w niektórych konfiguracjach
      }
    }
  }, [pathname, searchParams]);

  return null;
}
