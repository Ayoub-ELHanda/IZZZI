
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  appBaseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
