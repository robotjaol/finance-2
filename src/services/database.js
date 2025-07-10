// IndexedDB Database Service for robotjaol Finance

import { DATABASE_NAME, DATABASE_VERSION, STORES } from '../constants/index.js';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the IndexedDB database
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.isInitialized && this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isInitialized = true;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.createObjectStores(db);
      };
    });
  }

  /**
   * Create object stores and indexes
   * @param {IDBDatabase} db
   */
  createObjectStores(db) {
    // Users store
    if (!db.objectStoreNames.contains(STORES.USERS)) {
      const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      usersStore.createIndex('username', 'username', { unique: true });
      usersStore.createIndex('email', 'email', { unique: true, sparse: true });
      usersStore.createIndex('createdAt', 'createdAt');
      usersStore.createIndex('lastLoginAt', 'lastLoginAt');
    }

    // Transactions store
    if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
      const transactionsStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
      transactionsStore.createIndex('userId', 'userId');
      transactionsStore.createIndex('date', 'date');
      transactionsStore.createIndex('categoryId', 'categoryId');
      transactionsStore.createIndex('type', 'type');
      transactionsStore.createIndex('amount', 'amount');
      transactionsStore.createIndex('userId_date', ['userId', 'date']);
      transactionsStore.createIndex('userId_categoryId', ['userId', 'categoryId']);
      transactionsStore.createIndex('userId_type_date', ['userId', 'type', 'date']);
      transactionsStore.createIndex('isRecurring', 'isRecurring');
      transactionsStore.createIndex('status', 'status');
    }

    // Categories store
    if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
      const categoriesStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
      categoriesStore.createIndex('userId', 'userId');
      categoriesStore.createIndex('parentId', 'parentId');
      categoriesStore.createIndex('path', 'path');
      categoriesStore.createIndex('level', 'level');
      categoriesStore.createIndex('userId_parentId', ['userId', 'parentId']);
      categoriesStore.createIndex('userId_type', ['userId', 'type']);
      categoriesStore.createIndex('isSystem', 'isSystem');
      categoriesStore.createIndex('isActive', 'isActive');
    }

    // Budgets store
    if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
      const budgetsStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
      budgetsStore.createIndex('userId', 'userId');
      budgetsStore.createIndex('categoryId', 'categoryId');
      budgetsStore.createIndex('userId_categoryId', ['userId', 'categoryId']);
      budgetsStore.createIndex('period_startDate', 'period.startDate');
      budgetsStore.createIndex('period_endDate', 'period.endDate');
      budgetsStore.createIndex('status', 'status');
      budgetsStore.createIndex('isTemplate', 'isTemplate');
    }

    // Goals store
    if (!db.objectStoreNames.contains(STORES.GOALS)) {
      const goalsStore = db.createObjectStore(STORES.GOALS, { keyPath: 'id' });
      goalsStore.createIndex('userId', 'userId');
      goalsStore.createIndex('targetDate', 'targetDate');
      goalsStore.createIndex('priority', 'priority');
      goalsStore.createIndex('category', 'category');
      goalsStore.createIndex('status', 'status');
      goalsStore.createIndex('userId_status', ['userId', 'status']);
      goalsStore.createIndex('userId_category', ['userId', 'category']);
    }

    // Recurring Transactions store
    if (!db.objectStoreNames.contains(STORES.RECURRING_TRANSACTIONS)) {
      const recurringStore = db.createObjectStore(STORES.RECURRING_TRANSACTIONS, { keyPath: 'id' });
      recurringStore.createIndex('userId', 'userId');
      recurringStore.createIndex('schedule_nextDueDate', 'schedule.nextDueDate');
      recurringStore.createIndex('status', 'status');
      recurringStore.createIndex('automation_autoGenerate', 'automation.autoGenerate');
      recurringStore.createIndex('userId_status', ['userId', 'status']);
    }

    // Financial Health Scores store
    if (!db.objectStoreNames.contains(STORES.FINANCIAL_HEALTH_SCORES)) {
      const healthStore = db.createObjectStore(STORES.FINANCIAL_HEALTH_SCORES, { keyPath: 'id' });
      healthStore.createIndex('userId', 'userId');
      healthStore.createIndex('calculation_calculatedAt', 'calculation.calculatedAt');
      healthStore.createIndex('overallScore', 'overallScore');
      healthStore.createIndex('userId_calculatedAt', ['userId', 'calculation.calculatedAt']);
    }
  }

  /**
   * Get a transaction for a specific store
   * @param {string} storeName
   * @param {string} mode - 'readonly' or 'readwrite'
   * @returns {IDBTransaction}
   */
  getTransaction(storeName, mode = 'readonly') {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.transaction([storeName], mode);
  }

  /**
   * Get an object store
   * @param {string} storeName
   * @param {string} mode - 'readonly' or 'readwrite'
   * @returns {IDBObjectStore}
   */
  getStore(storeName, mode = 'readonly') {
    const transaction = this.getTransaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  /**
   * Add a record to a store
   * @param {string} storeName
   * @param {Object} data
   * @returns {Promise<string>} - Returns the key of the added record
   */
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to add record to ${storeName}`));
    });
  }

  /**
   * Update a record in a store
   * @param {string} storeName
   * @param {Object} data
   * @returns {Promise<string>} - Returns the key of the updated record
   */
  async update(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to update record in ${storeName}`));
    });
  }

  /**
   * Get a record by key
   * @param {string} storeName
   * @param {string} key
   * @returns {Promise<Object|null>}
   */
  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get record from ${storeName}`));
    });
  }

  /**
   * Delete a record by key
   * @param {string} storeName
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete record from ${storeName}`));
    });
  }

  /**
   * Get all records from a store
   * @param {string} storeName
   * @returns {Promise<Array>}
   */
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get all records from ${storeName}`));
    });
  }

  /**
   * Query records using an index
   * @param {string} storeName
   * @param {string} indexName
   * @param {any} query
   * @returns {Promise<Array>}
   */
  async queryByIndex(storeName, indexName, query) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const index = store.index(indexName);
      const request = index.getAll(query);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to query ${storeName} by ${indexName}`));
    });
  }

  /**
   * Query records with a range
   * @param {string} storeName
   * @param {string} indexName
   * @param {IDBKeyRange} range
   * @returns {Promise<Array>}
   */
  async queryByRange(storeName, indexName, range) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const index = store.index(indexName);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to query ${storeName} by range`));
    });
  }

  /**
   * Count records in a store
   * @param {string} storeName
   * @param {any} [query] - Optional query
   * @returns {Promise<number>}
   */
  async count(storeName, query = undefined) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const request = query ? store.count(query) : store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to count records in ${storeName}`));
    });
  }

  /**
   * Clear all records from a store
   * @param {string} storeName
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    });
  }

  /**
   * Execute a transaction with multiple operations
   * @param {Array<string>} storeNames
   * @param {Function} operations - Function that receives stores and performs operations
   * @param {string} mode - 'readonly' or 'readwrite'
   * @returns {Promise<any>}
   */
  async executeTransaction(storeNames, operations, mode = 'readwrite') {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeNames, mode);
      const stores = {};
      
      storeNames.forEach(storeName => {
        stores[storeName] = transaction.objectStore(storeName);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error('Transaction failed'));
      transaction.onabort = () => reject(new Error('Transaction aborted'));

      try {
        const result = operations(stores);
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Delete the entire database
   * @returns {Promise<void>}
   */
  async deleteDatabase() {
    this.close();
    
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DATABASE_NAME);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(new Error('Failed to delete database'));
      deleteRequest.onblocked = () => reject(new Error('Database deletion blocked'));
    });
  }
}

// Create and export a singleton instance
export const databaseService = new DatabaseService();

