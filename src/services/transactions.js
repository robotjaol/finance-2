// Transaction Service for robotjaol Finance

import { databaseService } from './database.js';
import { authService } from './auth.js';
import { generateId, formatCurrency, getMonthBounds, getYearBounds } from '../utils/index.js';
import { 
  STORES, 
  TRANSACTION_TYPES, 
  TRANSACTION_STATUS,
  ERROR_MESSAGES 
} from '../constants/index.js';

class TransactionService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the transaction service
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isInitialized) return;

    await databaseService.init();
    this.isInitialized = true;
  }

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} - Created transaction
   */
  async createTransaction(transactionData) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();
    const {
      amount,
      currency,
      type,
      date,
      description,
      categoryId,
      subcategoryId,
      tags = [],
      paymentMethod,
      location,
      merchant,
      reference,
      attachments = [],
      isRecurring = false,
      recurringId,
      status = TRANSACTION_STATUS.CLEARED
    } = transactionData;

    // Validate required fields
    if (!amount || !type || !date || !description || !categoryId) {
      throw new Error(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
    }

    // Validate transaction type
    if (!Object.values(TRANSACTION_TYPES).includes(type)) {
      throw new Error('Invalid transaction type');
    }

    // Validate amount
    if (amount <= 0) {
      throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT);
    }

    // Verify category belongs to user
    const category = await databaseService.get(STORES.CATEGORIES, categoryId);
    if (!category || category.userId !== currentUser.id) {
      throw new Error('Invalid category');
    }

    // Create transaction object
    const transaction = {
      id: generateId(),
      userId: currentUser.id,
      amount: Math.round(amount), // Store as cents
      currency: currency || currentUser.preferences.currency,
      type,
      date: new Date(date),
      description: description.trim(),
      categoryId,
      subcategoryId: subcategoryId || null,
      tags: Array.isArray(tags) ? tags : [],
      paymentMethod: paymentMethod || null,
      location: location || null,
      merchant: merchant || null,
      reference: reference || null,
      attachments: attachments || [],
      isRecurring,
      recurringId: recurringId || null,
      recurringInstanceId: isRecurring ? generateId() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.id,
      updatedBy: null,
      status,
      isDeleted: false,
      deletedAt: null,
      insights: {
        isUnusual: false,
        confidenceScore: null,
        suggestedCategory: null,
        seasonalPattern: null
      },
      budgetImpact: {
        budgetId: null,
        budgetPeriod: null,
        remainingBudget: null
      }
    };

    // Save transaction
    await databaseService.add(STORES.TRANSACTIONS, transaction);

    // Update category usage statistics
    await this.updateCategoryUsage(categoryId, transaction);

    // Update budget impact if applicable
    await this.updateBudgetImpact(transaction);

    return transaction;
  }

  /**
   * Update an existing transaction
   * @param {string} transactionId - Transaction ID
   * @param {Object} updates - Transaction updates
   * @returns {Promise<Object>} - Updated transaction
   */
  async updateTransaction(transactionId, updates) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();

    // Get existing transaction
    const existingTransaction = await databaseService.get(STORES.TRANSACTIONS, transactionId);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Verify ownership
    if (existingTransaction.userId !== currentUser.id) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.ACCESS_DENIED);
    }

    // Validate updates
    const allowedFields = [
      'amount', 'currency', 'type', 'date', 'description', 'categoryId',
      'subcategoryId', 'tags', 'paymentMethod', 'location', 'merchant',
      'reference', 'attachments', 'status'
    ];

    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    // Validate category if being updated
    if (filteredUpdates.categoryId) {
      const category = await databaseService.get(STORES.CATEGORIES, filteredUpdates.categoryId);
      if (!category || category.userId !== currentUser.id) {
        throw new Error('Invalid category');
      }
    }

    // Validate amount if being updated
    if (filteredUpdates.amount !== undefined && filteredUpdates.amount <= 0) {
      throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT);
    }

    // Update transaction
    const updatedTransaction = {
      ...existingTransaction,
      ...filteredUpdates,
      updatedAt: new Date(),
      updatedBy: currentUser.id
    };

    // Convert amount to cents if provided
    if (filteredUpdates.amount !== undefined) {
      updatedTransaction.amount = Math.round(filteredUpdates.amount);
    }

    // Convert date if provided
    if (filteredUpdates.date) {
      updatedTransaction.date = new Date(filteredUpdates.date);
    }

    await databaseService.update(STORES.TRANSACTIONS, updatedTransaction);

    // Update category usage statistics if category changed
    if (filteredUpdates.categoryId && filteredUpdates.categoryId !== existingTransaction.categoryId) {
      await this.updateCategoryUsage(existingTransaction.categoryId, existingTransaction, true); // Remove from old
      await this.updateCategoryUsage(filteredUpdates.categoryId, updatedTransaction); // Add to new
    } else if (filteredUpdates.amount !== undefined) {
      await this.updateCategoryUsage(updatedTransaction.categoryId, updatedTransaction);
    }

    // Update budget impact
    await this.updateBudgetImpact(updatedTransaction);

    return updatedTransaction;
  }

  /**
   * Delete a transaction (soft delete)
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<void>}
   */
  async deleteTransaction(transactionId) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();

    // Get existing transaction
    const transaction = await databaseService.get(STORES.TRANSACTIONS, transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Verify ownership
    if (transaction.userId !== currentUser.id) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.ACCESS_DENIED);
    }

    // Soft delete
    const deletedTransaction = {
      ...transaction,
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
      updatedBy: currentUser.id
    };

    await databaseService.update(STORES.TRANSACTIONS, deletedTransaction);

    // Update category usage statistics
    await this.updateCategoryUsage(transaction.categoryId, transaction, true);
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object|null>} - Transaction or null
   */
  async getTransaction(transactionId) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();
    const transaction = await databaseService.get(STORES.TRANSACTIONS, transactionId);

    if (!transaction || transaction.userId !== currentUser.id || transaction.isDeleted) {
      return null;
    }

    return transaction;
  }

  /**
   * Get transactions with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Transactions with metadata
   */
  async getTransactions(options = {}) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();
    const {
      type,
      categoryId,
      startDate,
      endDate,
      status,
      tags,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
      limit,
      offset = 0
    } = options;

    // Get all user transactions
    let transactions = await databaseService.queryByIndex(STORES.TRANSACTIONS, 'userId', currentUser.id);

    // Filter out deleted transactions
    transactions = transactions.filter(t => !t.isDeleted);

    // Apply filters
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    if (categoryId) {
      transactions = transactions.filter(t => t.categoryId === categoryId);
    }

    if (startDate) {
      const start = new Date(startDate);
      transactions = transactions.filter(t => new Date(t.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      transactions = transactions.filter(t => new Date(t.date) <= end);
    }

    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    if (tags && tags.length > 0) {
      transactions = transactions.filter(t => 
        tags.some(tag => t.tags.includes(tag))
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.merchant?.toLowerCase().includes(searchLower) ||
        t.reference?.toLowerCase().includes(searchLower)
      );
    }

    // Sort transactions
    transactions.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = transactions.length;
    if (limit) {
      transactions = transactions.slice(offset, offset + limit);
    }

    return {
      transactions,
      total,
      offset,
      limit: limit || total,
      hasMore: limit ? (offset + limit) < total : false
    };
  }

  /**
   * Get transaction summary for a period
   * @param {Object} options - Summary options
   * @returns {Promise<Object>} - Transaction summary
   */
  async getTransactionSummary(options = {}) {
    if (!authService.isAuthenticated()) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION.SESSION_EXPIRED);
    }

    const currentUser = authService.getCurrentUser();
    const { startDate, endDate, groupBy = 'month' } = options;

    // Get transactions for the period
    const { transactions } = await this.getTransactions({ startDate, endDate });

    // Calculate summary
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      transactionCount: transactions.length,
      averageTransaction: 0,
      categoryBreakdown: {},
      periodBreakdown: {}
    };

    transactions.forEach(transaction => {
      const amount = transaction.amount;

      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        summary.totalIncome += amount;
      } else {
        summary.totalExpenses += amount;
      }

      // Category breakdown
      if (!summary.categoryBreakdown[transaction.categoryId]) {
        summary.categoryBreakdown[transaction.categoryId] = {
          income: 0,
          expenses: 0,
          count: 0
        };
      }

      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        summary.categoryBreakdown[transaction.categoryId].income += amount;
      } else {
        summary.categoryBreakdown[transaction.categoryId].expenses += amount;
      }
      summary.categoryBreakdown[transaction.categoryId].count++;

      // Period breakdown
      const date = new Date(transaction.date);
      let periodKey;

      if (groupBy === 'day') {
        periodKey = date.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'year') {
        periodKey = String(date.getFullYear());
      }

      if (!summary.periodBreakdown[periodKey]) {
        summary.periodBreakdown[periodKey] = {
          income: 0,
          expenses: 0,
          count: 0
        };
      }

      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        summary.periodBreakdown[periodKey].income += amount;
      } else {
        summary.periodBreakdown[periodKey].expenses += amount;
      }
      summary.periodBreakdown[periodKey].count++;
    });

    summary.netCashFlow = summary.totalIncome - summary.totalExpenses;
    summary.averageTransaction = transactions.length > 0 ? 
      (summary.totalIncome + summary.totalExpenses) / transactions.length : 0;

    return summary;
  }

  /**
   * Get recent transactions
   * @param {number} [limit=10] - Number of transactions to return
   * @returns {Promise<Array>} - Recent transactions
   */
  async getRecentTransactions(limit = 10) {
    const { transactions } = await this.getTransactions({
      sortBy: 'date',
      sortOrder: 'desc',
      limit
    });

    return transactions;
  }

  /**
   * Search transactions
   * @param {string} query - Search query
   * @param {Object} [options={}] - Additional search options
   * @returns {Promise<Array>} - Matching transactions
   */
  async searchTransactions(query, options = {}) {
    const { transactions } = await this.getTransactions({
      search: query,
      ...options
    });

    return transactions;
  }

  /**
   * Update category usage statistics
   * @param {string} categoryId - Category ID
   * @param {Object} transaction - Transaction object
   * @param {boolean} [remove=false] - Whether to remove from statistics
   * @returns {Promise<void>}
   */
  async updateCategoryUsage(categoryId, transaction, remove = false) {
    const category = await databaseService.get(STORES.CATEGORIES, categoryId);
    if (!category) return;

    const amount = transaction.amount;
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (remove) {
      // Remove from statistics
      category.usage.transactionCount = Math.max(0, category.usage.transactionCount - 1);
      category.usage.totalAmount = Math.max(0, category.usage.totalAmount - amount);

      if (category.usage.monthlyUsage[monthKey]) {
        category.usage.monthlyUsage[monthKey].count = Math.max(0, category.usage.monthlyUsage[monthKey].count - 1);
        category.usage.monthlyUsage[monthKey].amount = Math.max(0, category.usage.monthlyUsage[monthKey].amount - amount);
      }
    } else {
      // Add to statistics
      category.usage.transactionCount++;
      category.usage.totalAmount += amount;
      category.usage.lastUsedDate = date;

      if (!category.usage.monthlyUsage[monthKey]) {
        category.usage.monthlyUsage[monthKey] = { count: 0, amount: 0 };
      }
      category.usage.monthlyUsage[monthKey].count++;
      category.usage.monthlyUsage[monthKey].amount += amount;
    }

    category.updatedAt = new Date();
    await databaseService.update(STORES.CATEGORIES, category);
  }

  /**
   * Update budget impact for a transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<void>}
   */
  async updateBudgetImpact(transaction) {
    if (transaction.type !== TRANSACTION_TYPES.EXPENSE) return;

    // Find active budgets for this category
    const budgets = await databaseService.queryByIndex(STORES.BUDGETS, 'categoryId', transaction.categoryId);
    const activeBudgets = budgets.filter(b => 
      b.userId === transaction.userId && 
      b.status === 'active' &&
      new Date(b.period.startDate) <= new Date(transaction.date) &&
      new Date(b.period.endDate) >= new Date(transaction.date)
    );

    for (const budget of activeBudgets) {
      // Recalculate budget tracking
      const { startDate, endDate } = budget.period;
      const periodTransactions = await this.getTransactions({
        categoryId: budget.categoryId,
        startDate,
        endDate,
        type: TRANSACTION_TYPES.EXPENSE
      });

      const currentSpent = periodTransactions.transactions.reduce((sum, t) => sum + t.amount, 0);
      const remainingAmount = budget.amount - currentSpent;
      const percentageUsed = budget.amount > 0 ? (currentSpent / budget.amount) * 100 : 0;

      budget.tracking = {
        currentSpent,
        remainingAmount,
        percentageUsed,
        projectedSpending: null, // TODO: Implement projection logic
        onTrack: percentageUsed <= 100
      };

      budget.lastCalculatedAt = new Date();
      await databaseService.update(STORES.BUDGETS, budget);

      // Update transaction budget impact
      transaction.budgetImpact = {
        budgetId: budget.id,
        budgetPeriod: `${startDate.toISOString()}_${endDate.toISOString()}`,
        remainingBudget: remainingAmount
      };
    }
  }

  /**
   * Export transactions to JSON
   * @param {Object} [options={}] - Export options
   * @returns {Promise<Object>} - Export data
   */
  async exportTransactions(options = {}) {
    const { transactions } = await this.getTransactions(options);
    
    return {
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions: transactions.map(t => ({
        ...t,
        formattedAmount: formatCurrency(t.amount, t.currency),
        formattedDate: new Date(t.date).toLocaleDateString()
      }))
    };
  }
}

// Create and export a singleton instance
export const transactionService = new TransactionService();

