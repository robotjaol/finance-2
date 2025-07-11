// Reports & Insights Tab Component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const ReportsTab = () => {
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedChart, setSelectedChart] = useState('spending');

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', income: 5000000, expenses: 3500000, savings: 1500000 },
    { month: 'Feb', income: 5200000, expenses: 3800000, savings: 1400000 },
    { month: 'Mar', income: 4800000, expenses: 3200000, savings: 1600000 },
    { month: 'Apr', income: 5500000, expenses: 4000000, savings: 1500000 },
    { month: 'May', income: 5300000, expenses: 3600000, savings: 1700000 },
    { month: 'Jun', income: 5800000, expenses: 4200000, savings: 1600000 },
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 1200000, color: '#8884d8' },
    { name: 'Transportation', value: 800000, color: '#82ca9d' },
    { name: 'Entertainment', value: 600000, color: '#ffc658' },
    { name: 'Shopping', value: 900000, color: '#ff7300' },
    { name: 'Utilities', value: 500000, color: '#00ff00' },
    { name: 'Healthcare', value: 400000, color: '#ff0000' },
  ];

  const weeklySpendingData = [
    { week: 'Week 1', amount: 850000 },
    { week: 'Week 2', amount: 920000 },
    { week: 'Week 3', amount: 780000 },
    { week: 'Week 4', amount: 1100000 },
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Savings Goal Achievement',
      description: 'You\'ve saved 15% more than last month',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'warning',
      title: 'High Entertainment Spending',
      description: 'Entertainment expenses increased by 25% this month',
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      type: 'info',
      title: 'Budget Performance',
      description: 'You\'re on track with 3 out of 5 budgets',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      type: 'negative',
      title: 'Overspending Alert',
      description: 'Food & Dining budget exceeded by Rp 200,000',
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ];

  const financialHealth = {
    score: 78,
    factors: [
      { name: 'Savings Rate', score: 85, status: 'good' },
      { name: 'Debt-to-Income', score: 70, status: 'fair' },
      { name: 'Emergency Fund', score: 60, status: 'needs_improvement' },
      { name: 'Budget Adherence', score: 90, status: 'excellent' },
      { name: 'Investment Diversity', score: 75, status: 'good' }
    ]
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-yellow-500';
      case 'needs_improvement': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthBadgeVariant = (status) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'needs_improvement': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Reports & Insights</h2>
          <p className="text-muted-foreground">Analyze your financial performance and trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Financial Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Financial Health Score</span>
            </CardTitle>
            <CardDescription>
              Overall assessment of your financial well-being
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground/20"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${financialHealth.score}, 100`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{financialHealth.score}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {financialHealth.factors.map((factor, index) => (
                  <div key={factor.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <Badge variant={getHealthBadgeVariant(factor.status)}>
                        {factor.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{factor.score}/100</span>
                      <span className={getHealthColor(factor.status)}>
                        {factor.status === 'excellent' ? 'Excellent' :
                         factor.status === 'good' ? 'Good' :
                         factor.status === 'fair' ? 'Fair' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Analytics</CardTitle>
                <CardDescription>Visual representation of your financial data</CardDescription>
              </div>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spending">Monthly Spending Trend</SelectItem>
                  <SelectItem value="category">Category Breakdown</SelectItem>
                  <SelectItem value="income">Income vs Expenses</SelectItem>
                  <SelectItem value="weekly">Weekly Spending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {selectedChart === 'spending' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value, currency), '']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'category' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(value, currency), '']} />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'income' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value, currency), '']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="income" fill="#82ca9d" name="Income" />
                    <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'weekly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklySpendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value, currency), 'Spending']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>
              Personalized insights based on your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg border"
                  >
                    <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Quick Statistics</span>
            </CardTitle>
            <CardDescription>
              Key metrics for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(15000000, currency)}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">Total Income</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(11000000, currency)}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">Total Expenses</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Daily Spending</span>
                  <span className="font-semibold">{formatCurrency(355000, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Largest Expense</span>
                  <span className="font-semibold">{formatCurrency(500000, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Most Frequent Category</span>
                  <span className="font-semibold">Food & Dining</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Savings Rate</span>
                  <span className="font-semibold text-green-600">26.7%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Goal Progress</span>
                  <span className="text-sm text-muted-foreground">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsTab;

