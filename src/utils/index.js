// Utility functions for robotjaol Finance application

import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { CURRENCY_CONFIG, DEFAULT_PREFERENCES } from '../constants/index.js';

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
export const generateId = () => uuidv4();

/**
 * Hash a password with salt using SHA-256
 * @param {string} password - Plain text password
 * @param {string} [salt] - Optional salt, generates new one if not provided
 * @returns {Object} Object containing hash and salt
 */
export const hashPassword = (password, salt = null) => {
  const passwordSalt = salt || CryptoJS.lib.WordArray.random(128/8).toString();
  const hash = CryptoJS.SHA256(password + passwordSalt).toString();
  return { hash, salt: passwordSalt };
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash
 * @param {string} salt - Stored salt
 * @returns {boolean} True if password matches
 */
export const verifyPassword = (password, hash, salt) => {
  const { hash: computedHash } = hashPassword(password, salt);
  return computedHash === hash;
};

/**
 * Format currency amount
 * @param {number} amount - Amount in cents
 * @param {string} [currency='IDR'] - Currency code
 * @param {string} [locale] - Locale for formatting
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'IDR', locale = null) => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.IDR;
  const actualAmount = amount / Math.pow(10, config.decimals);
  const formatLocale = locale || config.locale;
  
  return new Intl.NumberFormat(formatLocale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  }).format(actualAmount);
};

/**
 * Parse currency string to cents
 * @param {string} currencyString - Formatted currency string
 * @param {string} [currency='IDR'] - Currency code
 * @returns {number} Amount in cents
 */
export const parseCurrency = (currencyString, currency = 'IDR') => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.IDR;
  const cleanString = currencyString.replace(/[^\d.,]/g, '');
  const amount = parseFloat(cleanString.replace(',', '.'));
  return Math.round(amount * Math.pow(10, config.decimals));
};

/**
 * Format date according to user preferences
 * @param {Date} date - Date to format
 * @param {string} [format='dd/MM/yyyy'] - Date format
 * @param {string} [locale='id-ID'] - Locale for formatting
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'dd/MM/yyyy', locale = 'id-ID') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Simple format mapping
  const formatMap = {
    'dd/MM/yyyy': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'MM/dd/yyyy': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'yyyy-MM-dd': { year: 'numeric', month: '2-digit', day: '2-digit' },
    'dd MMM yyyy': { day: '2-digit', month: 'short', year: 'numeric' }
  };
  
  const options = formatMap[format] || formatMap['dd/MM/yyyy'];
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Calculate date difference in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in days
 */
export const dateDifferenceInDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round((firstDate - secondDate) / oneDay);
};

/**
 * Get start and end of month for a given date
 * @param {Date} [date=new Date()] - Reference date
 * @returns {Object} Object with startOfMonth and endOfMonth
 */
export const getMonthBounds = (date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return { startOfMonth, endOfMonth };
};

/**
 * Get start and end of year for a given date
 * @param {Date} [date=new Date()] - Reference date
 * @returns {Object} Object with startOfYear and endOfYear
 */
export const getYearBounds = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const endOfYear = new Date(date.getFullYear(), 11, 31);
  
  return { startOfYear, endOfYear };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
};

/**
 * Generate random color
 * @returns {string} Hex color code
 */
export const generateRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
  const result = {
    score: 0,
    feedback: [],
    isValid: false
  };
  
  if (password.length >= 8) {
    result.score += 1;
  } else {
    result.feedback.push('Password must be at least 8 characters long');
  }
  
  if (/[A-Z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain at least one uppercase letter');
  }
  
  if (/[a-z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain at least one lowercase letter');
  }
  
  if (/\d/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain at least one number');
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain at least one special character');
  }
  
  result.isValid = result.score >= 4;
  
  return result;
};

/**
 * Generate session token
 * @returns {string} Session token
 */
export const generateSessionToken = () => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

/**
 * Check if session is valid
 * @param {Object} session - Session object
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = (session) => {
  if (!session || !session.expiresAt) return false;
  return new Date(session.expiresAt) > new Date();
};

/**
 * Sanitize HTML string
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Convert file to base64
 * @param {File} file - File object
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Export data as JSON file
 * @param {any} data - Data to export
 * @param {string} filename - Filename for download
 */
export const exportToJson = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import data from JSON file
 * @param {File} file - JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
export const importFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

