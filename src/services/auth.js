// Authentication Service for robotjaol Finance

import { databaseService } from './database.js';
import { 
  generateId, 
  hashPassword, 
  verifyPassword, 
  generateSessionToken, 
  isSessionValid 
} from '../utils/index.js';
import { 
  STORES, 
  STORAGE_KEYS, 
  DEFAULT_PREFERENCES, 
  USER_ROLES,
  ERROR_MESSAGES 
} from '../constants/index.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentSession = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the authentication service
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isInitialized) return;

    await databaseService.init();
    await this.loadSession();
    this.isInitialized = true;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.password - Plain text password
   * @param {string} [userData.email] - Optional email
   * @param {string} [userData.firstName] - Optional first name
   * @param {string} [userData.lastName] - Optional last name
   * @param {'personal'|'executive'|'admin'} [userData.role='personal'] - User role
   * @returns {Promise<Object>} - Created user object (without password)
   */
  async register(userData) {
    const { username, password, email, firstName, lastName, role = USER_ROLES.PERSONAL } = userData;

    // Validate required fields
    if (!username || !password) {
      throw new Error(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
    }

    // Check if username already exists
    const existingUsers = await databaseService.queryByIndex(STORES.USERS, 'username', username);
    if (existingUsers.length > 0) {
      throw new Error('Username already exists');
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmailUsers = await databaseService.queryByIndex(STORES.USERS, 'email', email);
      if (existingEmailUsers.length > 0) {
        throw new Error('Email already exists');
      }
    }

    // Hash the password
    const { hash: passwordHash, salt: passwordSalt } = hashPassword(password);

    // Create user object
    const user = {
      id: generateId(),
      username,
      passwordHash,
      passwordSalt,
      email: email || null,
      firstName: firstName || null,
      lastName: lastName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      preferences: { ...DEFAULT_PREFERENCES },
      role,
      permissions: this.getDefaultPermissions(role),
      security: {
        sessionTimeout: 60, // 60 minutes
        requireReauth: false,
        twoFactorEnabled: false
      },
      state: {
        isFirstLogin: true,
        onboardingCompleted: false,
        lastBackupDate: null,
        dataVersion: '1.0'
      }
    };

    // Save user to database
    await databaseService.add(STORES.USERS, user);

    // Create default categories for the user
    await this.createDefaultCategories(user.id);

    // Return user without sensitive data
    return this.sanitizeUser(user);
  }

  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} - Login result with user and session
   */
  async login(username, password) {
    // Find user by username
    const users = await databaseService.queryByIndex(STORES.USERS, 'username', username);
    if (users.length === 0) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.INVALID_CREDENTIALS);
    }

    const user = users[0];

    // Verify password
    if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.INVALID_CREDENTIALS);
    }

    // Update last login time
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();
    await databaseService.update(STORES.USERS, user);

    // Create session
    const session = this.createSession(user);
    
    // Store session
    this.currentUser = user;
    this.currentSession = session;
    this.saveSession(session);

    return {
      user: this.sanitizeUser(user),
      session: {
        token: session.sessionToken,
        expiresAt: session.expiresAt
      }
    };
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    this.currentUser = null;
    this.currentSession = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} - Current user or null if not authenticated
   */
  getCurrentUser() {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.currentUser !== null && this.currentSession !== null && isSessionValid(this.currentSession);
  }

  /**
   * Refresh session
   * @returns {Promise<Object>} - New session data
   */
  async refreshSession() {
    if (!this.currentUser) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const session = this.createSession(this.currentUser);
    this.currentSession = session;
    this.saveSession(session);

    return {
      token: session.sessionToken,
      expiresAt: session.expiresAt
    };
  }

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} - Updated user object
   */
  async updateProfile(updates) {
    if (!this.currentUser) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    // Validate updates
    const allowedFields = ['firstName', 'lastName', 'email', 'preferences'];
    const filteredUpdates = {};
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    // Check email uniqueness if email is being updated
    if (filteredUpdates.email && filteredUpdates.email !== this.currentUser.email) {
      const existingEmailUsers = await databaseService.queryByIndex(STORES.USERS, 'email', filteredUpdates.email);
      if (existingEmailUsers.length > 0) {
        throw new Error('Email already exists');
      }
    }

    // Update user
    const updatedUser = {
      ...this.currentUser,
      ...filteredUpdates,
      updatedAt: new Date()
    };

    await databaseService.update(STORES.USERS, updatedUser);
    this.currentUser = updatedUser;

    // Update cached preferences
    if (filteredUpdates.preferences) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(filteredUpdates.preferences));
    }

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    // Verify current password
    if (!verifyPassword(currentPassword, this.currentUser.passwordHash, this.currentUser.passwordSalt)) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const { hash: passwordHash, salt: passwordSalt } = hashPassword(newPassword);

    // Update user
    const updatedUser = {
      ...this.currentUser,
      passwordHash,
      passwordSalt,
      updatedAt: new Date()
    };

    await databaseService.update(STORES.USERS, updatedUser);
    this.currentUser = updatedUser;
  }

  /**
   * Delete user account
   * @param {string} password - Password confirmation
   * @returns {Promise<void>}
   */
  async deleteAccount(password) {
    if (!this.currentUser) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    // Verify password
    if (!verifyPassword(password, this.currentUser.passwordHash, this.currentUser.passwordSalt)) {
      throw new Error('Password is incorrect');
    }

    const userId = this.currentUser.id;

    // Delete all user data
    await this.deleteAllUserData(userId);

    // Logout
    await this.logout();
  }

  /**
   * Create session object
   * @param {Object} user - User object
   * @returns {Object} - Session object
   */
  createSession(user) {
    const sessionTimeout = user.security?.sessionTimeout || 60; // minutes
    const expiresAt = new Date(Date.now() + sessionTimeout * 60 * 1000);

    return {
      userId: user.id,
      sessionToken: generateSessionToken(),
      expiresAt,
      lastActivity: new Date()
    };
  }

  /**
   * Save session to localStorage
   * @param {Object} session - Session object
   */
  saveSession(session) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    
    // Also save user preferences for quick access
    if (this.currentUser?.preferences) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.currentUser.preferences));
    }
  }

  /**
   * Load session from localStorage
   * @returns {Promise<void>}
   */
  async loadSession() {
    const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionData) return;

    try {
      const session = JSON.parse(sessionData);
      
      if (!isSessionValid(session)) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return;
      }

      // Load user data
      const user = await databaseService.get(STORES.USERS, session.userId);
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return;
      }

      this.currentUser = user;
      this.currentSession = session;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }

  /**
   * Remove sensitive data from user object
   * @param {Object} user - User object
   * @returns {Object} - Sanitized user object
   */
  sanitizeUser(user) {
    const { passwordHash, passwordSalt, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Get default permissions for a role
   * @param {string} role - User role
   * @returns {Array<string>} - Array of permissions
   */
  getDefaultPermissions(role) {
    const permissions = {
      [USER_ROLES.PERSONAL]: [
        'transactions:read',
        'transactions:write',
        'categories:read',
        'categories:write',
        'budgets:read',
        'budgets:write',
        'goals:read',
        'goals:write',
        'reports:read',
        'export:basic'
      ],
      [USER_ROLES.EXECUTIVE]: [
        'transactions:read',
        'transactions:write',
        'categories:read',
        'categories:write',
        'budgets:read',
        'budgets:write',
        'goals:read',
        'goals:write',
        'reports:read',
        'reports:advanced',
        'analytics:read',
        'simulation:read',
        'export:advanced',
        'management:read'
      ],
      [USER_ROLES.ADMIN]: [
        'all:read',
        'all:write',
        'all:delete',
        'system:admin'
      ]
    };

    return permissions[role] || permissions[USER_ROLES.PERSONAL];
  }

  /**
   * Create default categories for a new user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async createDefaultCategories(userId) {
    const { DEFAULT_CATEGORIES } = await import('../constants/index.js');
    const categories = [];

    // Create income categories
    DEFAULT_CATEGORIES.INCOME.forEach((cat, index) => {
      categories.push({
        id: generateId(),
        userId,
        name: cat.name,
        description: `Default ${cat.name.toLowerCase()} category`,
        icon: cat.icon,
        color: cat.color,
        parentId: null,
        path: `/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        level: 0,
        sortOrder: index,
        type: 'income',
        isSystem: true,
        isActive: true,
        budgetSettings: {
          allowBudgeting: false,
          defaultBudgetAmount: null,
          budgetType: 'fixed',
          alertThreshold: 80,
          rolloverUnused: false
        },
        analytics: {
          averageMonthlySpending: 0,
          spendingTrend: 'stable',
          seasonalPattern: null,
          lastAnalysisDate: null
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        usage: {
          transactionCount: 0,
          totalAmount: 0,
          lastUsedDate: null,
          monthlyUsage: {}
        }
      });
    });

    // Create expense categories
    DEFAULT_CATEGORIES.EXPENSE.forEach((cat, index) => {
      categories.push({
        id: generateId(),
        userId,
        name: cat.name,
        description: `Default ${cat.name.toLowerCase()} category`,
        icon: cat.icon,
        color: cat.color,
        parentId: null,
        path: `/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        level: 0,
        sortOrder: index,
        type: 'expense',
        isSystem: true,
        isActive: true,
        budgetSettings: {
          allowBudgeting: true,
          defaultBudgetAmount: null,
          budgetType: 'fixed',
          alertThreshold: 80,
          rolloverUnused: false
        },
        analytics: {
          averageMonthlySpending: 0,
          spendingTrend: 'stable',
          seasonalPattern: null,
          lastAnalysisDate: null
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        usage: {
          transactionCount: 0,
          totalAmount: 0,
          lastUsedDate: null,
          monthlyUsage: {}
        }
      });
    });

    // Save all categories
    for (const category of categories) {
      await databaseService.add(STORES.CATEGORIES, category);
    }
  }

  /**
   * Delete all user data
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteAllUserData(userId) {
    const stores = [
      STORES.TRANSACTIONS,
      STORES.CATEGORIES,
      STORES.BUDGETS,
      STORES.GOALS,
      STORES.RECURRING_TRANSACTIONS,
      STORES.FINANCIAL_HEALTH_SCORES
    ];

    for (const storeName of stores) {
      const userRecords = await databaseService.queryByIndex(storeName, 'userId', userId);
      for (const record of userRecords) {
        await databaseService.delete(storeName, record.id);
      }
    }

    // Delete user record
    await databaseService.delete(STORES.USERS, userId);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

