// Application routes configuration
export const routes = {
  // Public routes
  home: '/',
  pricing: '/pricing',
  
  // Auth routes
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    registerGuest: (token: string) => `/auth/register?token=${token}`,
    forgotPassword: '/auth/forgot-password',
    resetPassword: (token: string) => `/auth/reset-password?token=${token}`,
  },
  
  // Protected routes
  dashboard: '/dashboard',
  superAdmin: '/super-admin',
  
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
  
  retours: {
    list: '/dashboard',
    detail: (questionnaireId: string) => `/retours/${questionnaireId}`,
  },
  
  account: {
    profile: '/account',
    settings: '/account/settings',
    billing: '/account/billing',
  },
} as const;




