// Budgeting Tab Component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  PiggyBank,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const BudgetingTab = () => {
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [budgets, setBudgets] = useState([
    {
      id: '1',
      categoryId: '1',
      categoryName: 'Food & Dining',
      amount: 100000000, // 1,000,000 in cents
      spent: 75000000,
      period: 'monthly',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      status: 'active',
      alertThreshold: 80
    },
    {
      id: '2',
      categoryId: '2',
      categoryName: 'Transportation',
      amount: 50000000,
      spent: 30000000,
      period: 'monthly',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      status: 'active',
      alertThreshold: 80
    },
    {
      id: '3',
      categoryId: '3',
      categoryName: 'Entertainment',
      amount: 30000000,
      spent: 35000000,
      period: 'monthly',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      status: 'active',
      alertThreshold: 80
    },
    {
      id: '4',
      categoryId: '4',
      categoryName: 'Shopping',
      amount: 40000000,
      spent: 20000000,
      period: 'monthly',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      status: 'active',
      alertThreshold: 80
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly',
    alertThreshold: 80
  });

  const categories = [
    { id: '1', name: 'Food & Dining' },
    { id: '2', name: 'Transportation' },
    { id: '3', name: 'Entertainment' },
    { id: '4', name: 'Shopping' },
    { id: '5', name: 'Utilities' },
    { id: '6', name: 'Healthcare' },
    { id: '7', name: 'Education' },
    { id: '8', name: 'Travel' }
  ];

  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= budget.alertThreshold) return 'warning';
    return 'good';
  };

  const getBudgetColor = (status) => {
    switch (status) {
      case 'over': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getBudgetIcon = (status) => {
    switch (status) {
      case 'over': return AlertTriangle;
      case 'warning': return TrendingUp;
      default: return CheckCircle;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const budgetData = {
      id: editingBudget?.id || Date.now().toString(),
      categoryId: formData.categoryId,
      categoryName: categories.find(c => c.id === formData.categoryId)?.name || '',
      amount: parseFloat(formData.amount) * 100,
      spent: editingBudget?.spent || 0,
      period: formData.period,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      status: 'active',
      alertThreshold: formData.alertThreshold
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? budgetData : b));
      setIsEditDialogOpen(false);
      setEditingBudget(null);
    } else {
      setBudgets([...budgets, budgetData]);
      setIsAddDialogOpen(false);
    }

    setFormData({
      categoryId: '',
      amount: '',
      period: 'monthly',
      alertThreshold: 80
    });
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: (budget.amount / 100).toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (budgetId) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== budgetId));
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const budgetStats = {
    onTrack: budgets.filter(b => getBudgetStatus(b) === 'good').length,
    warning: budgets.filter(b => getBudgetStatus(b) === 'warning').length,
    overBudget: budgets.filter(b => getBudgetStatus(b) === 'over').length
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalBudget, currency)}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalSpent, currency)}
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
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalRemaining, currency)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Progress</p>
                <p className="text-2xl font-bold">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Status Summary</CardTitle>
            <CardDescription>Overview of your budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{budgetStats.onTrack}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">On Track</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{budgetStats.warning}</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Warning</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{budgetStats.overBudget}</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Over Budget</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Budget Management</CardTitle>
                <CardDescription>Create and manage your budgets</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                      Set up a budget for a specific category
                    </DialogDescription>
                  </DialogHeader>
                  <BudgetForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    onSubmit={handleSubmit}
                    isEditing={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.map((budget, index) => {
                const status = getBudgetStatus(budget);
                const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
                const Icon = getBudgetIcon(status);
                
                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${getBudgetColor(status)}`} />
                        <div>
                          <h3 className="font-semibold">{budget.categoryName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          status === 'over' ? 'destructive' :
                          status === 'warning' ? 'secondary' : 'default'
                        }>
                          {status === 'over' ? 'Over Budget' :
                           status === 'warning' ? 'Warning' : 'On Track'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(budget.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: {formatCurrency(budget.spent, currency)}</span>
                        <span>Budget: {formatCurrency(budget.amount, currency)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span>
                          {budget.spent > budget.amount ? 
                            `Over by ${formatCurrency(budget.spent - budget.amount, currency)}` :
                            `${formatCurrency(budget.amount - budget.spent, currency)} remaining`
                          }
                        </span>
                      </div>
                    </div>

                    {status === 'over' && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          You've exceeded your budget by {formatCurrency(budget.spent - budget.amount, currency)}
                        </p>
                      </div>
                    )}

                    {status === 'warning' && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          <TrendingUp className="h-4 w-4 inline mr-1" />
                          You've reached {percentage.toFixed(1)}% of your budget limit
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {budgets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No budgets created yet</p>
                  <p className="text-sm">Start by creating your first budget</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget settings
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Budget Form Component
const BudgetForm = ({ formData, setFormData, categories, onSubmit, isEditing }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          disabled={isEditing}
        >
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
        <Label htmlFor="amount">Budget Amount</Label>
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
        <Label htmlFor="period">Period</Label>
        <Select 
          value={formData.period} 
          onValueChange={(value) => setFormData({ ...formData, period: value })}
        >
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

      <div className="space-y-2">
        <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
        <Input
          id="alertThreshold"
          type="number"
          min="1"
          max="100"
          value={formData.alertThreshold}
          onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
          required
        />
        <p className="text-xs text-muted-foreground">
          Get notified when spending reaches this percentage of your budget
        </p>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? 'Update Budget' : 'Create Budget'}
      </Button>
    </form>
  );
};

export default BudgetingTab;

