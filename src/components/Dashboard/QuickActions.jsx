// Quick Actions Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Minus, 
  Target, 
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  DollarSign,
  Receipt,
  CreditCard,
  Wallet,
  Home,
  Car,
  Utensils,
  Plane,
  ShoppingBag,
  Gamepad2,
  Heart,
  GraduationCap,
  Briefcase,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { formatCurrency } from '@/utils/index';

const QuickActions = () => {
  const { user, getCurrency } = useAuthStore();
  const { addTransaction } = useTransactionStore();
  const currency = getCurrency();

  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  // Form states
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    description: '',
    category: 'salary',
    date: new Date()
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'food',
    date: new Date()
  });

  const [budgetForm, setBudgetForm] = useState({
    category: 'food',
    amount: '',
    period: 'monthly'
  });

  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date(),
    category: 'savings',
    description: ''
  });

  // Categories
  const incomeCategories = [
    { value: 'salary', label: 'Salary', icon: Briefcase },
    { value: 'freelance', label: 'Freelance', icon: Zap },
    { value: 'business', label: 'Business', icon: Briefcase },
    { value: 'investment', label: 'Investment', icon: TrendingUp },
    { value: 'bonus', label: 'Bonus', icon: DollarSign },
    { value: 'other', label: 'Other', icon: Wallet }
  ];

  const expenseCategories = [
    { value: 'food', label: 'Food & Dining', icon: Utensils },
    { value: 'transportation', label: 'Transportation', icon: Car },
    { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { value: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
    { value: 'utilities', label: 'Utilities', icon: Home },
    { value: 'healthcare', label: 'Healthcare', icon: Heart },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'travel', label: 'Travel', icon: Plane }
  ];

  const budgetCategories = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' }
  ];

  const goalCategories = [
    { value: 'savings', label: 'Emergency Fund', icon: PiggyBank },
    { value: 'house', label: 'Buy House', icon: Home },
    { value: 'car', label: 'Buy Car', icon: Car },
    { value: 'vacation', label: 'Vacation', icon: Plane },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'investment', label: 'Investment', icon: TrendingUp }
  ];

  const handleAddIncome = async () => {
    try {
      const transaction = {
        id: Date.now().toString(),
        type: 'income',
        amount: parseFloat(incomeForm.amount),
        description: incomeForm.description,
        category: incomeForm.category,
        date: incomeForm.date,
        userId: user.id,
        status: 'completed'
      };

      await addTransaction(transaction);
      
      // Reset form
      setIncomeForm({
        amount: '',
        description: '',
        category: 'salary',
        date: new Date()
      });
      
      setIsAddIncomeOpen(false);
      console.log('Income added successfully');
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  const handleAddExpense = async () => {
    try {
      const transaction = {
        id: Date.now().toString(),
        type: 'expense',
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category,
        date: expenseForm.date,
        userId: user.id,
        status: 'completed'
      };

      await addTransaction(transaction);
      
      // Reset form
      setExpenseForm({
        amount: '',
        description: '',
        category: 'food',
        date: new Date()
      });
      
      setIsAddExpenseOpen(false);
      console.log('Expense added successfully');
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleSetBudget = () => {
    try {
      const budget = {
        id: Date.now().toString(),
        category: budgetForm.category,
        amount: parseFloat(budgetForm.amount),
        period: budgetForm.period,
        userId: user.id,
        spent: 0,
        remaining: parseFloat(budgetForm.amount),
        createdAt: new Date()
      };

      // In real app, would save to budget store
      console.log('Budget created:', budget);
      
      // Reset form
      setBudgetForm({
        category: 'food',
        amount: '',
        period: 'monthly'
      });
      
      setIsSetBudgetOpen(false);
      console.log('Budget set successfully');
    } catch (error) {
      console.error('Failed to set budget:', error);
    }
  };

  const handleCreateGoal = () => {
    try {
      const goal = {
        id: Date.now().toString(),
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        targetDate: goalForm.targetDate,
        category: goalForm.category,
        description: goalForm.description,
        userId: user.id,
        status: 'active',
        createdAt: new Date()
      };

      // In real app, would save to goals store
      console.log('Goal created:', goal);
      
      // Reset form
      setGoalForm({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: new Date(),
        category: 'savings',
        description: ''
      });
      
      setIsCreateGoalOpen(false);
      console.log('Goal created successfully');
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const quickActionButtons = [
    {
      title: 'Add Income',
      description: 'Record new income',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => setIsAddIncomeOpen(true)
    },
    {
      title: 'Add Expense',
      description: 'Record new expense',
      icon: TrendingDown,
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => setIsAddExpenseOpen(true)
    },
    {
      title: 'Set Budget',
      description: 'Create spending limit',
      icon: PiggyBank,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setIsSetBudgetOpen(true)
    },
    {
      title: 'Create Goal',
      description: 'Set financial target',
      icon: Target,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => setIsCreateGoalOpen(true)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common financial tasks at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActionButtons.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={action.onClick}
                      className={`h-auto p-6 flex flex-col items-center space-y-3 w-full ${action.color} text-white`}
                    >
                      <Icon className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">{action.title}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Income Dialog */}
      <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Add Income</span>
            </DialogTitle>
            <DialogDescription>
              Record a new income transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount</Label>
              <Input
                id="income-amount"
                type="number"
                placeholder="Enter amount"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                placeholder="e.g., Monthly salary"
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={incomeForm.category} onValueChange={(value) => setIncomeForm({ ...incomeForm, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {incomeCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incomeForm.date ? incomeForm.date.toLocaleDateString('id-ID') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={incomeForm.date}
                    onSelect={(date) => setIncomeForm({ ...incomeForm, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddIncome} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Button variant="outline" onClick={() => setIsAddIncomeOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Add Expense</span>
            </DialogTitle>
            <DialogDescription>
              Record a new expense transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="Enter amount"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                placeholder="e.g., Lunch at restaurant"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expenseForm.date ? expenseForm.date.toLocaleDateString('id-ID') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expenseForm.date}
                    onSelect={(date) => setExpenseForm({ ...expenseForm, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddExpense} className="flex-1">
                <Minus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Budget Dialog */}
      <Dialog open={isSetBudgetOpen} onOpenChange={setIsSetBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-blue-600" />
              <span>Set Budget</span>
            </DialogTitle>
            <DialogDescription>
              Create a spending limit for a category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={budgetForm.category} onValueChange={(value) => setBudgetForm({ ...budgetForm, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-amount">Budget Amount</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="Enter budget amount"
                value={budgetForm.amount}
                onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={budgetForm.period} onValueChange={(value) => setBudgetForm({ ...budgetForm, period: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSetBudget} className="flex-1">
                <PiggyBank className="h-4 w-4 mr-2" />
                Set Budget
              </Button>
              <Button variant="outline" onClick={() => setIsSetBudgetOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Goal Dialog */}
      <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Create Goal</span>
            </DialogTitle>
            <DialogDescription>
              Set a financial target to work towards
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                placeholder="e.g., Emergency Fund"
                value={goalForm.name}
                onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={goalForm.category} onValueChange={(value) => setGoalForm({ ...goalForm, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goalCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="Target amount"
                  value={goalForm.targetAmount}
                  onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <Input
                  id="current-amount"
                  type="number"
                  placeholder="Current amount"
                  value={goalForm.currentAmount}
                  onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {goalForm.targetDate ? goalForm.targetDate.toLocaleDateString('id-ID') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={goalForm.targetDate}
                    onSelect={(date) => setGoalForm({ ...goalForm, targetDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (Optional)</Label>
              <Textarea
                id="goal-description"
                placeholder="Describe your goal..."
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateGoal} className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setIsCreateGoalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickActions;

