// Management Panel Tab Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Settings, 
  Database, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const ManagementTab = () => {
  const { user, getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [activeTab, setActiveTab] = useState('users');

  // Mock data for management
  const users = [
    {
      id: '1',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'executive',
      status: 'active',
      lastLogin: new Date(2025, 0, 1, 10, 30),
      createdAt: new Date(2024, 11, 15),
      transactionCount: 45,
      totalBalance: 15000000000
    },
    {
      id: '2',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'personal',
      status: 'active',
      lastLogin: new Date(2024, 11, 30, 15, 45),
      createdAt: new Date(2024, 10, 20),
      transactionCount: 128,
      totalBalance: 8500000000
    },
    {
      id: '3',
      username: 'janesmith',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'executive',
      status: 'inactive',
      lastLogin: new Date(2024, 11, 25, 9, 15),
      createdAt: new Date(2024, 9, 10),
      transactionCount: 89,
      totalBalance: 22000000000
    }
  ];

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalTransactions: users.reduce((sum, u) => sum + u.transactionCount, 0),
    totalValue: users.reduce((sum, u) => sum + u.totalBalance, 0),
    systemHealth: 98.5,
    uptime: '99.9%',
    lastBackup: new Date(2025, 0, 1, 2, 0),
    storageUsed: '2.3 GB',
    storageLimit: '10 GB'
  };

  const auditLogs = [
    {
      id: '1',
      action: 'User Login',
      user: 'testuser',
      timestamp: new Date(2025, 0, 1, 10, 30),
      details: 'Successful login from 192.168.1.100',
      severity: 'info'
    },
    {
      id: '2',
      action: 'Transaction Created',
      user: 'johndoe',
      timestamp: new Date(2025, 0, 1, 9, 15),
      details: 'Created expense transaction: Rp 150,000',
      severity: 'info'
    },
    {
      id: '3',
      action: 'Budget Exceeded',
      user: 'janesmith',
      timestamp: new Date(2025, 0, 1, 8, 45),
      details: 'Food & Dining budget exceeded by 15%',
      severity: 'warning'
    },
    {
      id: '4',
      action: 'Failed Login Attempt',
      user: 'unknown',
      timestamp: new Date(2025, 0, 1, 7, 20),
      details: 'Failed login attempt for username: admin',
      severity: 'error'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return AlertTriangle;
      case 'warning': return Clock;
      case 'info': return CheckCircle;
      default: return Activity;
    }
  };

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    // Implementation would go here
  };

  const handleSystemAction = (action) => {
    console.log(`Performing system action: ${action}`);
    // Implementation would go here
  };

  // Only show management panel for executive users
  if (user?.role !== 'executive') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Access Restricted</h3>
          <p className="text-muted-foreground">
            Management panel is only available for Executive accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                <p className="text-xs text-green-600">
                  {systemStats.activeUsers} active
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{systemStats.totalTransactions}</p>
                <p className="text-xs text-blue-600">
                  Across all users
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(systemStats.totalValue, currency)}
                </p>
                <p className="text-xs text-purple-600">
                  Platform total
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.systemHealth}%</p>
                <p className="text-xs text-green-600">
                  Uptime: {systemStats.uptime}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Management Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Management Panel</CardTitle>
            <CardDescription>
              Manage users, system settings, and monitor platform activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">@{user.username}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'executive' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin.toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>{user.transactionCount}</TableCell>
                          <TableCell>
                            {formatCurrency(user.totalBalance, currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUserAction(user.id, 'view')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUserAction(user.id, 'edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                              >
                                {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="system" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Storage</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Used: {systemStats.storageUsed}</span>
                          <span>Limit: {systemStats.storageLimit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => handleSystemAction('cleanup')}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clean Up Storage
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>System Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select defaultValue="IDR">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Input type="number" defaultValue="30" />
                      </div>
                      <Button className="w-full" onClick={() => handleSystemAction('save-settings')}>
                        Save Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Audit Logs</h3>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>

                <div className="space-y-4">
                  {auditLogs.map((log, index) => {
                    const Icon = getSeverityIcon(log.severity);
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${getSeverityColor(log.severity)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{log.action}</h4>
                              <span className="text-sm text-muted-foreground">
                                {log.timestamp.toLocaleString('id-ID')}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{log.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              User: {log.user}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Download className="h-5 w-5" />
                        <span>Backup Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Backup:</span>
                          <span className="text-sm font-medium">
                            {systemStats.lastBackup.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge variant="default">Completed</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Next Scheduled:</span>
                          <span className="text-sm font-medium">
                            {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleSystemAction('backup-now')}>
                        <Download className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Restore</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Backup File</Label>
                        <Input type="file" accept=".backup" />
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Restoring will overwrite current data. Please ensure you have a recent backup.
                        </p>
                      </div>
                      <Button variant="destructive" className="w-full" onClick={() => handleSystemAction('restore')}>
                        <Upload className="h-4 w-4 mr-2" />
                        Restore from Backup
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManagementTab;

