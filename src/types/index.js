// Type definitions for robotjaol Finance application
// Using JSDoc comments for type safety in JavaScript

/**
 * @typedef {Object} User
 * @property {string} id - UUID v4 primary key
 * @property {string} username - Unique username
 * @property {string} passwordHash - SHA-256 hash with salt
 * @property {string} passwordSalt - Cryptographically secure random salt
 * @property {string} [email] - Optional email address
 * @property {string} [firstName] - Optional first name
 * @property {string} [lastName] - Optional last name
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 * @property {Date} [lastLoginAt] - Last successful login timestamp
 * @property {UserPreferences} preferences - User preferences and configuration
 * @property {'personal'|'executive'|'admin'} role - User role
 * @property {string[]} permissions - Granular permission array
 * @property {UserSecurity} security - Security settings
 * @property {UserState} state - Application state
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} currency - ISO 4217 currency code
 * @property {string} locale - BCP 47 language tag
 * @property {'light'|'dark'} theme - UI theme preference
 * @property {string} dateFormat - Date display format
 * @property {string} numberFormat - Number display format
 * @property {string} timezone - IANA timezone identifier
 * @property {string} defaultDashboardTab - Default tab on login
 * @property {Object} dashboardLayout - Customizable dashboard layout
 * @property {NotificationPreferences} notifications - Notification preferences
 * @property {PrivacySettings} privacy - Privacy settings
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {number} amount - Transaction amount (stored as cents)
 * @property {string} currency - ISO 4217 currency code
 * @property {'income'|'expense'} type - Transaction type
 * @property {Date} date - Transaction date
 * @property {string} description - Transaction description
 * @property {string} categoryId - Foreign key to Category.id
 * @property {string} [subcategoryId] - Optional subcategory reference
 * @property {string[]} tags - User-defined tags array
 * @property {string} [paymentMethod] - Payment method
 * @property {string} [location] - Transaction location
 * @property {string} [merchant] - Merchant or payee name
 * @property {string} [reference] - External reference number
 * @property {TransactionAttachment[]} attachments - File attachments
 * @property {boolean} isRecurring - Recurring transaction flag
 * @property {string} [recurringId] - Reference to RecurringTransaction.id
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 * @property {'pending'|'cleared'|'reconciled'} status - Transaction status
 * @property {boolean} isDeleted - Soft delete flag
 * @property {TransactionInsights} insights - Analytics and insights
 * @property {BudgetImpact} budgetImpact - Budgeting integration
 */

/**
 * @typedef {Object} Category
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {string} name - Category name
 * @property {string} [description] - Optional category description
 * @property {string} [icon] - Icon identifier
 * @property {string} color - Hex color code
 * @property {string} [parentId] - Parent category ID
 * @property {string} path - Materialized path
 * @property {number} level - Hierarchy level
 * @property {number} sortOrder - Display sort order
 * @property {'income'|'expense'|'both'} type - Applicable transaction types
 * @property {boolean} isSystem - System-defined category flag
 * @property {boolean} isActive - Active status flag
 * @property {BudgetSettings} budgetSettings - Budgeting integration
 * @property {CategoryAnalytics} analytics - Analytics and insights
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 * @property {CategoryUsage} usage - Usage statistics
 */

/**
 * @typedef {Object} Budget
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {string} categoryId - Foreign key to Category.id
 * @property {string} name - Budget name
 * @property {string} [description] - Optional budget description
 * @property {number} amount - Budget amount (stored as cents)
 * @property {string} currency - ISO 4217 currency code
 * @property {BudgetPeriod} period - Time period configuration
 * @property {'fixed'|'percentage'|'variable'} budgetType - Budget calculation method
 * @property {BudgetCalculationBase} [calculationBase] - Calculation base
 * @property {BudgetTracking} tracking - Tracking and progress
 * @property {BudgetAlerts} alerts - Alert configuration
 * @property {BudgetHistory[]} history - Historical data
 * @property {'active'|'paused'|'completed'|'cancelled'} status - Budget status
 * @property {boolean} isTemplate - Template budget flag
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 * @property {Date} lastCalculatedAt - Last tracking calculation timestamp
 */

/**
 * @typedef {Object} Goal
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {string} name - Goal name
 * @property {string} [description] - Optional goal description
 * @property {number} targetAmount - Target amount (stored as cents)
 * @property {string} currency - ISO 4217 currency code
 * @property {Date} [targetDate] - Target completion date
 * @property {'low'|'medium'|'high'|'critical'} priority - Goal priority
 * @property {'emergency'|'vacation'|'purchase'|'investment'|'debt'|'other'} category - Goal category
 * @property {GoalProgress} progress - Progress tracking
 * @property {GoalStrategy} strategy - Contribution strategy
 * @property {GoalMilestone[]} milestones - Milestones and rewards
 * @property {GoalInsights} insights - Analytics and insights
 * @property {'active'|'paused'|'completed'|'cancelled'} status - Goal status
 * @property {boolean} isArchived - Archived status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 * @property {Date} [completedAt] - Completion timestamp
 * @property {GoalContribution[]} contributions - Historical contributions
 */

/**
 * @typedef {Object} RecurringTransaction
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {TransactionTemplate} template - Template transaction data
 * @property {RecurrencePattern} recurrence - Recurrence configuration
 * @property {RecurrenceSchedule} schedule - Schedule and limits
 * @property {AutomationSettings} automation - Automation settings
 * @property {VariationSettings} variation - Variation and flexibility
 * @property {'active'|'paused'|'completed'|'cancelled'} status - Status
 * @property {GeneratedTransaction[]} generatedTransactions - Generated transactions tracking
 * @property {RecurrenceStatistics} statistics - Statistics
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 */

/**
 * @typedef {Object} FinancialHealthScore
 * @property {string} id - UUID v4 primary key
 * @property {string} userId - Foreign key to User.id
 * @property {number} overallScore - Overall financial health score (0-100)
 * @property {'A'|'B'|'C'|'D'|'F'} scoreGrade - Letter grade representation
 * @property {number} [previousScore] - Previous period score
 * @property {number} scoreChange - Score change from previous period
 * @property {HealthScoreComponents} components - Component scores
 * @property {ScoreCalculation} calculation - Calculation metadata
 * @property {HealthInsights} insights - Insights and recommendations
 * @property {HealthHistory[]} history - Historical tracking
 * @property {HealthBenchmarks} benchmarks - Benchmarking data
 */

// Export types for use in other modules
export const Types = {
  User: 'User',
  Transaction: 'Transaction',
  Category: 'Category',
  Budget: 'Budget',
  Goal: 'Goal',
  RecurringTransaction: 'RecurringTransaction',
  FinancialHealthScore: 'FinancialHealthScore'
};

