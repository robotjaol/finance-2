// Settings Tab Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Database,
  Key,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const SettingsTab = () => {
  const { user, updateProfile, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    
    // Preferences
    currency: 'IDR',
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    theme: 'system',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
    monthlyReports: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    
    // Privacy
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChangePassword = () => {
    console.log('Change password functionality');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Delete account functionality');
    }
  };

  const handleExportData = () => {
    console.log('Export user data');
  };

  const handleImportData = () => {
    console.log('Import user data');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={settings.firstName}
                        onChange={(e) => handleSettingChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={settings.lastName}
                        onChange={(e) => handleSettingChange('lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleSettingChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => handleSettingChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={settings.bio}
                      onChange={(e) => handleSettingChange('bio', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Account Type */}
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user?.role === 'executive' ? 'default' : 'secondary'}>
                        {user?.role === 'executive' ? 'Executive' : 'Personal'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Contact support to change your account type
                      </span>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile}>
                    Save Profile Changes
                  </Button>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                          <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                          <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                          <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button>Save Preferences</Button>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Budget Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when approaching budget limits
                        </p>
                      </div>
                      <Switch
                        checked={settings.budgetAlerts}
                        onCheckedChange={(checked) => handleSettingChange('budgetAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Goal Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Reminders about your financial goals
                        </p>
                      </div>
                      <Switch
                        checked={settings.goalReminders}
                        onCheckedChange={(checked) => handleSettingChange('goalReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly financial summary reports
                        </p>
                      </div>
                      <Switch
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Monthly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Monthly financial summary reports
                        </p>
                      </div>
                      <Switch
                        checked={settings.monthlyReports}
                        onCheckedChange={(checked) => handleSettingChange('monthlyReports', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Push Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>

                  <Button>Save Notification Settings</Button>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-6">
                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Password</h3>
                    <div className="space-y-4">
                      <Button variant="outline" onClick={handleChangePassword}>
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Last changed: Never
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Session Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Session Management</h3>
                    
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Select 
                        value={settings.sessionTimeout.toString()} 
                        onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch
                        checked={settings.loginAlerts}
                        onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                      />
                    </div>
                  </div>

                  <Button>Save Security Settings</Button>
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile Visibility</h3>
                    
                    <div className="space-y-2">
                      <Label>Who can see your profile</Label>
                      <Select 
                        value={settings.profileVisibility} 
                        onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Sharing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Sharing</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Share Data for Improvements</Label>
                        <p className="text-sm text-muted-foreground">
                          Help us improve our services by sharing anonymous usage data
                        </p>
                      </div>
                      <Switch
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow analytics tracking for better user experience
                        </p>
                      </div>
                      <Switch
                        checked={settings.analyticsTracking}
                        onCheckedChange={(checked) => handleSettingChange('analyticsTracking', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Data Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Management</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button variant="outline" onClick={handleImportData}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Danger Zone */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                    
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-300">Delete Account</h4>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button>Save Privacy Settings</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsTab;

