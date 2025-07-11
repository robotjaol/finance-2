// Goals Tab Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Target, 
  Calendar as CalendarIcon,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const GoalsTab = () => {
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Emergency Fund',
      description: 'Build an emergency fund covering 6 months of expenses',
      targetAmount: 3000000000, // 30M in cents
      currentAmount: 1800000000, // 18M in cents
      targetDate: new Date(2025, 11, 31),
      category: 'emergency',
      priority: 'high',
      status: 'active',
      createdAt: new Date(2024, 0, 1),
      monthlyContribution: 200000000 // 2M in cents
    },
    {
      id: '2',
      title: 'New Car',
      description: 'Save for a new car down payment',
      targetAmount: 5000000000, // 50M in cents
      currentAmount: 1500000000, // 15M in cents
      targetDate: new Date(2025, 8, 15),
      category: 'transportation',
      priority: 'medium',
      status: 'active',
      createdAt: new Date(2024, 1, 1),
      monthlyContribution: 500000000 // 5M in cents
    },
    {
      id: '3',
      title: 'Vacation to Japan',
      description: 'Family vacation to Japan for 2 weeks',
      targetAmount: 2500000000, // 25M in cents
      currentAmount: 2500000000, // 25M in cents
      targetDate: new Date(2024, 11, 1),
      category: 'travel',
      priority: 'low',
      status: 'completed',
      createdAt: new Date(2024, 0, 1),
      monthlyContribution: 300000000 // 3M in cents
    },
    {
      id: '4',
      title: 'House Down Payment',
      description: 'Save for house down payment (20%)',
      targetAmount: 10000000000, // 100M in cents
      currentAmount: 2000000000, // 20M in cents
      targetDate: new Date(2026, 5, 30),
      category: 'housing',
      priority: 'high',
      status: 'active',
      createdAt: new Date(2024, 2, 1),
      monthlyContribution: 400000000 // 4M in cents
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: new Date(),
    category: 'savings',
    priority: 'medium',
    monthlyContribution: ''
  });

  const goalCategories = [
    { id: 'emergency', name: 'Emergency Fund', icon: Heart, color: 'bg-red-500' },
    { id: 'housing', name: 'Housing', icon: Home, color: 'bg-blue-500' },
    { id: 'transportation', name: 'Transportation', icon: Car, color: 'bg-green-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-orange-500' },
    { id: 'savings', name: 'General Savings', icon: DollarSign, color: 'bg-gray-500' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    paused: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  };

  const getGoalProgress = (goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getTimeRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  };

  const getCategoryIcon = (categoryId) => {
    const category = goalCategories.find(c => c.id === categoryId);
    return category ? category.icon : DollarSign;
  };

  const getCategoryColor = (categoryId) => {
    const category = goalCategories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-500';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount) * 100,
      currentAmount: editingGoal?.currentAmount || 0,
      targetDate: formData.targetDate,
      category: formData.category,
      priority: formData.priority,
      status: editingGoal?.status || 'active',
      createdAt: editingGoal?.createdAt || new Date(),
      monthlyContribution: parseFloat(formData.monthlyContribution || 0) * 100
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g));
      setIsEditDialogOpen(false);
      setEditingGoal(null);
    } else {
      setGoals([...goals, goalData]);
      setIsAddDialogOpen(false);
    }

    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: new Date(),
      category: 'savings',
      priority: 'medium',
      monthlyContribution: ''
    });
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: (goal.targetAmount / 100).toString(),
      targetDate: new Date(goal.targetDate),
      category: goal.category,
      priority: goal.priority,
      monthlyContribution: (goal.monthlyContribution / 100).toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const handleAddContribution = (goalId, amount) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + (amount * 100), goal.targetAmount) }
        : goal
    ));
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
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
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Goals</p>
                <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Target</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalTargetAmount, currency)}
                </p>
              </div>
              <Flag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>Track and manage your financial objectives</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                    <DialogDescription>
                      Set up a new financial goal to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <GoalForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={goalCategories}
                    onSubmit={handleSubmit}
                    isEditing={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal, index) => {
                const progress = getGoalProgress(goal);
                const timeRemaining = getTimeRemaining(goal.targetDate);
                const Icon = getCategoryIcon(goal.category);
                const isCompleted = goal.status === 'completed';
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 border rounded-lg space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${getCategoryColor(goal.category)} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <p className="text-muted-foreground text-sm">{goal.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={priorityColors[goal.priority]}>
                              {goal.priority} priority
                            </Badge>
                            <Badge className={statusColors[goal.status]}>
                              {goal.status}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {timeRemaining}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(goal)}
                          disabled={isCompleted}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(goal.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                        </span>
                        <span className="text-sm font-bold">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {formatCurrency(goal.targetAmount - goal.currentAmount, currency)} remaining
                        </span>
                        <span>
                          Target: {new Date(goal.targetDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="flex items-center space-x-4 pt-4 border-t">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Monthly contribution: {formatCurrency(goal.monthlyContribution, currency)}
                          </p>
                        </div>
                        <ContributionDialog 
                          goal={goal} 
                          onAddContribution={handleAddContribution}
                          currency={currency}
                        />
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center space-x-2 pt-4 border-t bg-green-50 dark:bg-green-900/20 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Goal completed! 🎉
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {goals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals created yet</p>
                  <p className="text-sm">Start by creating your first financial goal</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update your goal details
            </DialogDescription>
          </DialogHeader>
          <GoalForm
            formData={formData}
            setFormData={setFormData}
            categories={goalCategories}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Goal Form Component
const GoalForm = ({ formData, setFormData, categories, onSubmit, isEditing }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          placeholder="e.g., Emergency Fund"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your goal..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input
            id="targetAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
          <Input
            id="monthlyContribution"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.monthlyContribution}
            onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetDate">Target Date</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.targetDate ? formData.targetDate.toLocaleDateString('id-ID') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.targetDate}
              onSelect={(date) => {
                setFormData({ ...formData, targetDate: date });
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? 'Update Goal' : 'Create Goal'}
      </Button>
    </form>
  );
};

// Contribution Dialog Component
const ContributionDialog = ({ goal, onAddContribution, currency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onAddContribution(goal.id, parseFloat(amount));
      setAmount('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Contribution
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
          <DialogDescription>
            Add money to your "{goal.title}" goal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Current: {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
          </div>
          <Button type="submit" className="w-full">
            Add Contribution
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalsTab;

