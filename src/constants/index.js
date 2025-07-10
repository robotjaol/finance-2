// Application constants for robotjaol Finance

// Database and Storage
export const DATABASE_NAME = 'robotjaol-finance';
export const DATABASE_VERSION = 1;

// Object Store Names
export const STORES = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  RECURRING_TRANSACTIONS: 'recurringTransactions',
  FINANCIAL_HEALTH_SCORES: 'financialHealthScores'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  SESSION: 'robotjaol-session',
  PREFERENCES: 'robotjaol-preferences',
  APP_STATE: 'robotjaol-app-state',
  CACHE_CONTROL: 'robotjaol-cache-control',
  PERFORMANCE: 'robotjaol-performance'
};

// Default User Preferences
export const DEFAULT_PREFERENCES = {
  currency: 'IDR',
  locale: 'id-ID',
  theme: 'dark',
  dateFormat: 'dd/MM/yyyy',
  numberFormat: 'id-ID',
  timezone: 'Asia/Jakarta',
  defaultDashboardTab: 'overview',
  dashboardLayout: {},
  notifications: {
    budgetAlerts: true,
    goalReminders: true,
    billReminders: true,
    weeklyReports: false,
    monthlyReports: true
  },
  privacy: {
    dataRetention: 365,
    autoBackup: true,
    encryptionEnabled: true
  }
};

// Dashboard Tabs
export const DASHBOARD_TABS = {
  OVERVIEW: 'overview',
  TRANSACTIONS: 'transactions',
  BUDGETING: 'budgeting',
  REPORTS: 'reports',
  GOALS: 'goals',
  MANAGEMENT: 'management',
  EXPORT: 'export',
  SETTINGS: 'settings',
  SIMULATION: 'simulation',
  VISUALIZER: 'visualizer'
};

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CLEARED: 'cleared',
  RECONCILED: 'reconciled'
};

// Budget Types
export const BUDGET_TYPES = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
  VARIABLE: 'variable'
};

// Budget Status
export const BUDGET_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Goal Categories
export const GOAL_CATEGORIES = {
  EMERGENCY: 'emergency',
  VACATION: 'vacation',
  PURCHASE: 'purchase',
  INVESTMENT: 'investment',
  DEBT: 'debt',
  OTHER: 'other'
};

// Goal Priorities
export const GOAL_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// User Roles
export const USER_ROLES = {
  PERSONAL: 'personal',
  EXECUTIVE: 'executive',
  ADMIN: 'admin'
};

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Currency Formatting
export const CURRENCY_CONFIG = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    locale: 'id-ID',
    decimals: 0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    decimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    decimals: 2
  }
};

// Default Categories
export const DEFAULT_CATEGORIES = {
  INCOME: [
    { name: 'Salary', icon: 'Briefcase', color: '#10B981' },
    { name: 'Freelance', icon: 'Laptop', color: '#3B82F6' },
    { name: 'Investment', icon: 'TrendingUp', color: '#8B5CF6' },
    { name: 'Business', icon: 'Building', color: '#F59E0B' },
    { name: 'Other Income', icon: 'Plus', color: '#6B7280' }
  ],
  EXPENSE: [
    { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#EF4444' },
    { name: 'Transportation', icon: 'Car', color: '#F97316' },
    { name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899' },
    { name: 'Entertainment', icon: 'Film', color: '#8B5CF6' },
    { name: 'Bills & Utilities', icon: 'Receipt', color: '#06B6D4' },
    { name: 'Healthcare', icon: 'Heart', color: '#EF4444' },
    { name: 'Education', icon: 'GraduationCap', color: '#3B82F6' },
    { name: 'Travel', icon: 'Plane', color: '#10B981' },
    { name: 'Insurance', icon: 'Shield', color: '#6366F1' },
    { name: 'Savings', icon: 'PiggyBank', color: '#059669' },
    { name: 'Other Expenses', icon: 'Minus', color: '#6B7280' }
  ]
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  ACCENT: '#F59E0B',
  DANGER: '#EF4444',
  WARNING: '#F97316',
  INFO: '#06B6D4',
  SUCCESS: '#059669',
  MUTED: '#6B7280'
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// API Endpoints (for future external integrations)
export const API_ENDPOINTS = {
  EXCHANGE_RATES: 'https://api.exchangerate-api.com/v4/latest/',
  STOCK_PRICES: 'https://api.polygon.io/v2/aggs/ticker/',
  CRYPTO_PRICES: 'https://api.coingecko.com/api/v3/simple/price'
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true
  },
  TRANSACTION: {
    DESCRIPTION_MAX_LENGTH: 500,
    AMOUNT_MAX: 999999999999, // 999 billion cents
    AMOUNT_MIN: 1
  },
  CATEGORY: {
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500
  },
  GOAL: {
    NAME_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'Invalid username or password',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    ACCESS_DENIED: 'Access denied. Insufficient permissions.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    INVALID_AMOUNT: 'Please enter a valid amount',
    INVALID_DATE: 'Please enter a valid date'
  },
  DATABASE: {
    CONNECTION_ERROR: 'Unable to connect to database',
    SAVE_ERROR: 'Failed to save data',
    LOAD_ERROR: 'Failed to load data',
    DELETE_ERROR: 'Failed to delete data'
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION: {
    CREATED: 'Transaction created successfully',
    UPDATED: 'Transaction updated successfully',
    DELETED: 'Transaction deleted successfully'
  },
  BUDGET: {
    CREATED: 'Budget created successfully',
    UPDATED: 'Budget updated successfully',
    DELETED: 'Budget deleted successfully'
  },
  GOAL: {
    CREATED: 'Goal created successfully',
    UPDATED: 'Goal updated successfully',
    DELETED: 'Goal deleted successfully',
    COMPLETED: 'Congratulations! Goal completed successfully'
  },
  SETTINGS: {
    SAVED: 'Settings saved successfully',
    THEME_CHANGED: 'Theme changed successfully'
  },
  DATA: {
    EXPORTED: 'Data exported successfully',
    IMPORTED: 'Data imported successfully',
    BACKUP_CREATED: 'Backup created successfully'
  }
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_3D_VISUALIZER: true,
  ENABLE_AI_INSIGHTS: true,
  ENABLE_EXPORT_PDF: true,
  ENABLE_RECURRING_TRANSACTIONS: true,
  ENABLE_GOAL_TRACKING: true,
  ENABLE_BUDGET_ALERTS: true,
  ENABLE_FINANCIAL_HEALTH_SCORE: true,
  ENABLE_SIMULATION_MODE: true
};

