import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ANALYTICS_EVENTS } from './constants';

declare global {
  interface Window {
    fbq: any;
    gtag: any;
  }
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private fbq: any;
  private gtag: any;

  private constructor() {
    this.fbq = window.fbq;
    this.gtag = window.gtag;
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public trackEvent(eventName: string, properties: Record<string, any> = {}) {
    // Track in Facebook Pixel
    if (this.fbq) {
      this.fbq('track', eventName, properties);
    }

    // Track in Google Analytics
    if (this.gtag) {
      this.gtag('event', eventName, properties);
    }

    // Track in HubSpot
    this.trackHubSpotEvent(eventName, properties);
  }

  private async trackHubSpotEvent(eventName: string, properties: Record<string, any>) {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          properties,
        }),
      });

      if (!response.ok) {
        console.error('Failed to track event in HubSpot');
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  public trackPageView(url: string) {
    if (this.gtag) {
      this.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }

  public trackConversion(value: number, currency: string = 'USD') {
    if (this.fbq) {
      this.fbq('track', 'Purchase', {
        value: value,
        currency: currency,
      });
    }

    if (this.gtag) {
      this.gtag('event', 'conversion', {
        value: value,
        currency: currency,
      });
    }
  }
}

export const useAnalytics = () => {
  const router = useRouter();
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return analytics;
};

export const useUTMTracking = () => {
  const router = useRouter();

  useEffect(() => {
    const utmParams = {
      utm_source: router.query.utm_source,
      utm_medium: router.query.utm_medium,
      utm_campaign: router.query.utm_campaign,
      utm_term: router.query.utm_term,
      utm_content: router.query.utm_content,
    };

    if (Object.values(utmParams).some(param => param)) {
      // Store UTM parameters in localStorage
      localStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
  }, [router.query]);
};

export const trackUserEvent = (eventName: keyof typeof ANALYTICS_EVENTS, properties: Record<string, any> = {}) => {
  const analytics = AnalyticsService.getInstance();
  analytics.trackEvent(eventName, properties);
};

export const trackConversion = (value: number, currency: string = 'USD') => {
  const analytics = AnalyticsService.getInstance();
  analytics.trackConversion(value, currency);
}; 