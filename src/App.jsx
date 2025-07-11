import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTransactionStore } from '@/stores/transactionStore';
import LoginForm from '@/components/Auth/LoginForm';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import OverviewTab from '@/components/Dashboard/OverviewTab';
import TransactionsTab from '@/components/Dashboard/TransactionsTab';
import BudgetingTab from '@/components/Dashboard/BudgetingTab';
import ReportsTab from '@/components/Dashboard/ReportsTab';
import GoalsTab from '@/components/Dashboard/GoalsTab';
import ManagementTab from '@/components/Dashboard/ManagementTab';
import ExportTab from '@/components/Dashboard/ExportTab';
import SettingsTab from '@/components/Dashboard/SettingsTab';
import SimulationTab from '@/components/Dashboard/SimulationTab';
import VisualizerTab from '@/components/Dashboard/VisualizerTab';
import QuickActions from '@/components/Dashboard/QuickActions';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const { initialize: initializeTransactions } = useTransactionStore();

  useEffect(() => {
    const initApp = async () => {
      await initialize();
      if (isAuthenticated) {
        await initializeTransactions();
      }
    };
    
    initApp();
  }, [initialize, initializeTransactions, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div className="animate-pulse">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              robotjaol | Finance
            </h1>
            <p className="text-sm text-muted-foreground">Loading your financial dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <Toaster />
      </>
    );
  }

  const dashboardContent = {
    overview: (
      <div className="space-y-6">
        <QuickActions />
        <OverviewTab />
      </div>
    ),
    transactions: <TransactionsTab />,
    budgeting: <BudgetingTab />,
    reports: <ReportsTab />,
    goals: <GoalsTab />,
    management: <ManagementTab />,
    export: <ExportTab />,
    settings: <SettingsTab />,
    simulation: <SimulationTab />,
    visualizer: <VisualizerTab />
  };

  return (
    <>
      <DashboardLayout>
        {dashboardContent}
      </DashboardLayout>
      <Toaster />
    </>
  );
}

export default App;
