// Overview Tab Component

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';
import QuickActions from '@/components/Dashboard/QuickActions';

const OverviewTab = () => {
  const { user, getCurrency } = useAuthStore();
  const {
    summary,
    loadSummary,
    getRecentTransactions,
    isLoading
  } = useTransactionStore();
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const currency = getCurrency();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadSummary();
        const recent = await getRecentTransactions(5);
        setRecentTransactions(recent);
      } catch (error) {
        console.error('Failed to load overview data:', error);
      }
    };

    loadData();
  }, []);

  const stats = [
    {
      title: 'Total Income',
      value: summary?.totalIncome || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Expenses',
      value: summary?.totalExpenses || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      change: '+8.2%',
      changeType: 'negative'
    },
    {
      title: 'Net Cash Flow',
      value: summary?.netCashFlow || 0,
      icon: DollarSign,
      color: summary?.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary?.netCashFlow >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20',
      change: '+4.3%',
      changeType: summary?.netCashFlow >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Transactions',
      value: summary?.transactionCount || 0,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+15',
      changeType: 'neutral',
      isCount: true
    }
  ];

  const budgetProgress = [
    { category: 'Food & Dining', spent: 750000, budget: 1000000, color: 'bg-orange-500' },
    { category: 'Transportation', spent: 300000, budget: 500000, color: 'bg-blue-500' },
    { category: 'Entertainment', spent: 200000, budget: 300000, color: 'bg-purple-500' },
    { category: 'Shopping', spent: 450000, budget: 400000, color: 'bg-red-500' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.firstName || user?.username}!
                </h2>
                <p className="text-blue-100">
                  Here's your financial overview for this month
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Today</p>
                <p className="text-xl font-semibold">
                  {new Date().toLocaleDateString("id-ID", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">
                        {stat.isCount 
                          ? stat.value.toLocaleString()
                          : formatCurrency(stat.value, currency)
                        }
                      </p>
                      <div className="flex items-center mt-1">
                        {stat.changeType === 'positive' && (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        )}
                        {stat.changeType === 'negative' && (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'negative' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions - Moved below Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <QuickActions />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </Badge>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent transactions.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track your spending against your budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetProgress.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{budget.category}</span>
                    <span>{formatCurrency(budget.spent, currency)} / {formatCurrency(budget.budget, currency)}</span>
                  </div>
                  <Progress value={(budget.spent / budget.budget) * 100} className={`${budget.color}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OverviewTab;



