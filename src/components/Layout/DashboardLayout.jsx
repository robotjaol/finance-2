// Dashboard Layout Component

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  Target, 
  Settings, 
  FileText, 
  Calculator, 
  Eye,
  LogOut,
  User,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const { user, logout, getTheme } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState(getTheme());

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgeting', label: 'Budgeting', icon: PiggyBank },
    { id: 'reports', label: 'Reports & Insights', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'management', label: 'Management Panel', icon: Calculator },
    { id: 'export', label: 'Export & Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'simulation', label: 'Simulation', icon: Calculator },
    { id: 'visualizer', label: 'Visualizer', icon: Eye }
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  robotjaol | Finance
                </h1>
                <p className="text-xs text-muted-foreground">Personal & Executive Financial Management</p>
              </div>
            </motion.div>

            {/* User Menu */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.firstName || user?.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Badge variant={user?.role === 'executive' ? 'default' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-muted/50">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs hidden lg:block">{tab.label}</span>
                    <span className="text-xs lg:hidden">{tab.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                {children?.[tab.id] || <DefaultTabContent tab={tab} />}
              </TabsContent>
            ))}
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

// Default content for tabs that haven't been implemented yet
const DefaultTabContent = ({ tab }) => {
  const Icon = tab.icon;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{tab.label}</span>
        </CardTitle>
        <CardDescription>
          This section is under development and will be available soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center space-y-2">
            <Icon className="h-12 w-12 mx-auto opacity-50" />
            <p className="text-lg font-medium">Coming Soon</p>
            <p className="text-sm">
              The {tab.label} feature is currently being developed and will be available in the next update.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardLayout;

