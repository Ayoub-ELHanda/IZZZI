// Application routes configuration
export const routes = {
  // Public routes
  home: '/',
  pricing: '/pricing',
  
  // Auth routes
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
  },
  
  // Protected routes
  dashboard: '/dashboard',
  
  classes: {
    list: '/classes',
    detail: (id: string) => `/classes/${id}`,
    create: '/classes/create',
  },
  
  subjects: {
    list: '/subjects',
    detail: (id: string) => `/subjects/${id}`,
    create: '/subjects/create',
  },
  
  questionnaires: {
    list: '/questionnaires',
    detail: (id: string) => `/questionnaires/${id}`,
    create: '/questionnaires/create',
  },
  
  feedback: {
    public: (token: string) => `/feedback/${token}`,
  },
  
  account: {
    profile: '/account',
    settings: '/account/settings',
    billing: '/account/billing',
  },
} as const;

