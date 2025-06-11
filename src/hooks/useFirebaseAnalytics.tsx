
import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export const useFirebaseAnalytics = () => {
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      logEvent(analytics, 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    trackPageView();
  }, []);

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    logEvent(analytics, eventName, parameters);
  };

  const trackLogin = (method: string) => {
    logEvent(analytics, 'login', { method });
  };

  const trackSignUp = (method: string) => {
    logEvent(analytics, 'sign_up', { method });
  };

  return {
    trackEvent,
    trackLogin,
    trackSignUp,
  };
};