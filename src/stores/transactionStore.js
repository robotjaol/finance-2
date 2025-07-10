// Transaction Store using Zustand

import { create } from 'zustand';
import { transactionService } from '../services/transactions.js';

export const useTransactionStore = create((set, get) => ({
  // State
  transactions: [],
  currentTransaction: null,
  summary: null,
  isLoading: false,
  error: null,
  filters: {
    type: null,
    categoryId: null,
    startDate: null,
    endDate: null,
    status: null,
    tags: [],
    search: ''
  },
  pagination: {
    total: 0,
    offset: 0,
    limit: 50,
    hasMore: false
  },
  sortBy: 'date',
  sortOrder: 'desc',

  // Actions
  initialize: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await transactionService.init();
      await get().loadTransactions();
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },

  loadTransactions: async (options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, pagination, sortBy, sortOrder } = get();
      
      const queryOptions = {
        ...filters,
        ...options,
        sortBy,
        sortOrder,
        limit: pagination.limit,
        offset: options.offset || pagination.offset
      };

      const result = await transactionService.getTransactions(queryOptions);
      
      set({ 
        transactions: result.transactions,
        pagination: {
          total: result.total,
          offset: result.offset,
          limit: result.limit,
          hasMore: result.hasMore
        },
        isLoading: false,
        error: null
      });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  loadMoreTransactions: async () => {
    const { pagination, isLoading } = get();
    
    if (isLoading || !pagination.hasMore) return;
    
    set({ isLoading: true });
    
    try {
      const { filters, sortBy, sortOrder } = get();
      
      const queryOptions = {
        ...filters,
        sortBy,
        sortOrder,
        limit: pagination.limit,
        offset: pagination.offset + pagination.limit
      };

      const result = await transactionService.getTransactions(queryOptions);
      
      set(state => ({ 
        transactions: [...state.transactions, ...result.transactions],
        pagination: {
          total: result.total,
          offset: result.offset,
          limit: result.limit,
          hasMore: result.hasMore
        },
        isLoading: false,
        error: null
      }));
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  createTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });
    
    try {
      const transaction = await transactionService.createTransaction(transactionData);
      
      // Add to the beginning of the list if it matches current filters
      set(state => ({
        transactions: [transaction, ...state.transactions],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        },
        isLoading: false,
        error: null
      }));
      
      // Refresh summary
      await get().loadSummary();
      
      return transaction;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  updateTransaction: async (transactionId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedTransaction = await transactionService.updateTransaction(transactionId, updates);
      
      // Update in the list
      set(state => ({
        transactions: state.transactions.map(t => 
          t.id === transactionId ? updatedTransaction : t
        ),
        currentTransaction: state.currentTransaction?.id === transactionId ? 
          updatedTransaction : state.currentTransaction,
        isLoading: false,
        error: null
      }));
      
      // Refresh summary
      await get().loadSummary();
      
      return updatedTransaction;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTransaction: async (transactionId) => {
    set({ isLoading: true, error: null });
    
    try {
      await transactionService.deleteTransaction(transactionId);
      
      // Remove from the list
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== transactionId),
        currentTransaction: state.currentTransaction?.id === transactionId ? 
          null : state.currentTransaction,
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1)
        },
        isLoading: false,
        error: null
      }));
      
      // Refresh summary
      await get().loadSummary();
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  getTransaction: async (transactionId) => {
    set({ isLoading: true, error: null });
    
    try {
      const transaction = await transactionService.getTransaction(transactionId);
      
      set({ 
        currentTransaction: transaction,
        isLoading: false,
        error: null
      });
      
      return transaction;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  loadSummary: async (options = {}) => {
    try {
      const { filters } = get();
      const summaryOptions = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...options
      };
      
      const summary = await transactionService.getTransactionSummary(summaryOptions);
      
      set({ 
        summary,
        error: null
      });
      
      return summary;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  searchTransactions: async (query, options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const transactions = await transactionService.searchTransactions(query, options);
      
      set({ 
        transactions,
        pagination: {
          total: transactions.length,
          offset: 0,
          limit: transactions.length,
          hasMore: false
        },
        isLoading: false,
        error: null
      });
      
      return transactions;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  getRecentTransactions: async (limit = 10) => {
    try {
      const transactions = await transactionService.getRecentTransactions(limit);
      return transactions;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  exportTransactions: async (options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters } = get();
      const exportOptions = {
        ...filters,
        ...options
      };
      
      const exportData = await transactionService.exportTransactions(exportOptions);
      
      set({ 
        isLoading: false,
        error: null
      });
      
      return exportData;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Filter and Sort Actions
  setFilters: (newFilters) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...newFilters
      },
      pagination: {
        ...state.pagination,
        offset: 0
      }
    }));
    
    // Reload transactions with new filters
    get().loadTransactions();
  },

  clearFilters: () => {
    set({
      filters: {
        type: null,
        categoryId: null,
        startDate: null,
        endDate: null,
        status: null,
        tags: [],
        search: ''
      },
      pagination: {
        total: 0,
        offset: 0,
        limit: 50,
        hasMore: false
      }
    });
    
    // Reload transactions
    get().loadTransactions();
  },

  setSorting: (sortBy, sortOrder) => {
    set({ 
      sortBy, 
      sortOrder,
      pagination: {
        ...get().pagination,
        offset: 0
      }
    });
    
    // Reload transactions with new sorting
    get().loadTransactions();
  },

  setPageSize: (limit) => {
    set(state => ({
      pagination: {
        ...state.pagination,
        limit,
        offset: 0
      }
    }));
    
    // Reload transactions with new page size
    get().loadTransactions();
  },

  // Utility Actions
  clearError: () => {
    set({ error: null });
  },

  clearCurrentTransaction: () => {
    set({ currentTransaction: null });
  },

  // Getters
  getTransactions: () => get().transactions,
  getCurrentTransaction: () => get().currentTransaction,
  getSummary: () => get().summary,
  getFilters: () => get().filters,
  getPagination: () => get().pagination,
  isLoadingTransactions: () => get().isLoading,
  getTransactionError: () => get().error,

  // Computed values
  getTotalIncome: () => {
    const { summary } = get();
    return summary?.totalIncome || 0;
  },

  getTotalExpenses: () => {
    const { summary } = get();
    return summary?.totalExpenses || 0;
  },

  getNetCashFlow: () => {
    const { summary } = get();
    return summary?.netCashFlow || 0;
  },

  getTransactionCount: () => {
    const { summary } = get();
    return summary?.transactionCount || 0;
  },

  getFilteredTransactionCount: () => {
    const { pagination } = get();
    return pagination.total;
  },

  hasActiveFilters: () => {
    const { filters } = get();
    return !!(
      filters.type ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate ||
      filters.status ||
      filters.tags.length > 0 ||
      filters.search
    );
  }
}));

