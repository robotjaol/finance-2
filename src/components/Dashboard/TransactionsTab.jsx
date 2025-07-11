// Transactions Tab Component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '@/constants/index';

const TransactionsTab = () => {
  const { 
    transactions, 
    loadTransactions, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction,
    setFilters,
    clearFilters,
    isLoading 
  } = useTransactionStore();
  
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state for new/edit transaction
  const [formData, setFormData] = useState({
    amount: '',
    type: TRANSACTION_TYPES.EXPENSE,
    date: new Date(),
    description: '',
    categoryId: '',
    paymentMethod: '',
    merchant: '',
    tags: '',
    status: TRANSACTION_STATUS.CLEARED
  });

  // Mock categories for demo
  const categories = [
    { id: '1', name: 'Food & Dining', type: 'expense' },
    { id: '2', name: 'Transportation', type: 'expense' },
    { id: '3', name: 'Shopping', type: 'expense' },
    { id: '4', name: 'Entertainment', type: 'expense' },
    { id: '5', name: 'Salary', type: 'income' },
    { id: '6', name: 'Freelance', type: 'income' },
    { id: '7', name: 'Investment', type: 'income' }
  ];

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'E-Wallet'];

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount) * 100, // Convert to cents
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
      } else {
        await createTransaction(transactionData);
        setIsAddDialogOpen(false);
      }

      // Reset form
      setFormData({
        amount: '',
        type: TRANSACTION_TYPES.EXPENSE,
        date: new Date(),
        description: '',
        categoryId: '',
        paymentMethod: '',
        merchant: '',
        tags: '',
        status: TRANSACTION_STATUS.CLEARED
      });
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: (transaction.amount / 100).toString(),
      type: transaction.type,
      date: new Date(transaction.date),
      description: transaction.description,
      categoryId: transaction.categoryId,
      paymentMethod: transaction.paymentMethod || '',
      merchant: transaction.merchant || '',
      tags: transaction.tags.join(', '),
      status: transaction.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (transactionId) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transactionId);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilters({ search: value });
  };

  const handleFilterChange = (type, value) => {
    if (type === 'type') {
      setFilterType(value);
      setFilters({ type: value === 'all' ? null : value });
    } else if (type === 'status') {
      setFilterStatus(value);
      setFilters({ status: value === 'all' ? null : value });
    }
  };

  const filteredCategories = categories.filter(cat => 
    formData.type === 'all' || cat.type === formData.type
  );

  const stats = {
    totalIncome: transactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.length
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalIncome, currency)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpenses, currency)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${
                  stats.totalIncome - stats.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(stats.totalIncome - stats.totalExpenses, currency)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Manage your income and expenses</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new transaction
                    </DialogDescription>
                  </DialogHeader>
                  <TransactionForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={filteredCategories}
                    paymentMethods={paymentMethods}
                    onSubmit={handleSubmit}
                    isEditing={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reconciled">Reconciled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction) => {
                      const category = categories.find(c => c.id === transaction.categoryId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.description}
                            {transaction.merchant && (
                              <div className="text-sm text-muted-foreground">
                                at {transaction.merchant}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category?.name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount, currency)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === 'cleared' ? 'default' :
                              transaction.status === 'pending' ? 'secondary' : 'outline'
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(transaction.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No transactions found. Add your first transaction to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            formData={formData}
            setFormData={setFormData}
            categories={filteredCategories}
            paymentMethods={paymentMethods}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Transaction Form Component
const TransactionForm = ({ formData, setFormData, categories, paymentMethods, onSubmit, isEditing }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Transaction description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? formData.date.toLocaleDateString('id-ID') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData({ ...formData, date });
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleared">Cleared</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reconciled">Reconciled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="merchant">Merchant (Optional)</Label>
        <Input
          id="merchant"
          placeholder="Store or merchant name"
          value={formData.merchant}
          onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input
          id="tags"
          placeholder="Comma-separated tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </form>
  );
};

export default TransactionsTab;

