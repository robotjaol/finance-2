// Export & Documents Tab Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Calendar as CalendarIcon,
  Filter,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Mail,
  Share,
  Archive,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const ExportTab = () => {
  const { user, getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [exportType, setExportType] = useState('transactions');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date()
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock export history
  const exportHistory = [
    {
      id: '1',
      name: 'Monthly_Transactions_Jan_2025.pdf',
      type: 'transactions',
      format: 'pdf',
      size: '2.3 MB',
      createdAt: new Date(2025, 0, 1, 14, 30),
      status: 'completed',
      downloadCount: 3
    },
    {
      id: '2',
      name: 'Budget_Report_Q4_2024.xlsx',
      type: 'budget',
      format: 'excel',
      size: '1.8 MB',
      createdAt: new Date(2024, 11, 31, 16, 45),
      status: 'completed',
      downloadCount: 1
    },
    {
      id: '3',
      name: 'Financial_Summary_2024.pdf',
      type: 'summary',
      format: 'pdf',
      size: '4.1 MB',
      createdAt: new Date(2024, 11, 30, 10, 15),
      status: 'completed',
      downloadCount: 5
    },
    {
      id: '4',
      name: 'Goals_Progress_Report.pdf',
      type: 'goals',
      format: 'pdf',
      size: '1.2 MB',
      createdAt: new Date(2024, 11, 29, 9, 20),
      status: 'processing',
      downloadCount: 0
    }
  ];

  const categories = [
    { id: '1', name: 'Food & Dining' },
    { id: '2', name: 'Transportation' },
    { id: '3', name: 'Entertainment' },
    { id: '4', name: 'Shopping' },
    { id: '5', name: 'Utilities' },
    { id: '6', name: 'Healthcare' }
  ];

  const exportTypes = [
    { value: 'transactions', label: 'Transactions', icon: FileText },
    { value: 'budget', label: 'Budget Report', icon: FileSpreadsheet },
    { value: 'goals', label: 'Goals Progress', icon: FileImage },
    { value: 'summary', label: 'Financial Summary', icon: FileText },
    { value: 'tax', label: 'Tax Report', icon: FileSpreadsheet },
    { value: 'analytics', label: 'Analytics Report', icon: FileImage }
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV File', icon: FileText },
    { value: 'json', label: 'JSON Data', icon: FileText }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          // Add to export history
          const newExport = {
            id: Date.now().toString(),
            name: `${exportType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`,
            type: exportType,
            format: exportFormat,
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            createdAt: new Date(),
            status: 'completed',
            downloadCount: 0
          };
          // In real app, would update state
          console.log('Export completed:', newExport);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 500);
  };

  const handleDownload = (exportId) => {
    console.log('Downloading export:', exportId);
    // In real app, would trigger download
  };

  const handleDelete = (exportId) => {
    if (confirm('Are you sure you want to delete this export?')) {
      console.log('Deleting export:', exportId);
      // In real app, would remove from list
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return FileText;
      case 'excel': return FileSpreadsheet;
      case 'csv': return FileText;
      case 'json': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
            <CardDescription>
              Generate and download reports in various formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Type */}
              <div className="space-y-4">
                <Label>Export Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {exportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={exportType === type.value ? 'default' : 'outline'}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setExportType(type.value)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Export Format */}
              <div className="space-y-4">
                <Label>Export Format</Label>
                <div className="grid grid-cols-2 gap-3">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <Button
                        key={format.value}
                        variant={exportFormat === format.value ? 'default' : 'outline'}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setExportFormat(format.value)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm">{format.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <Label>Date Range</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? dateRange.from.toLocaleDateString('id-ID') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? dateRange.to.toLocaleDateString('id-ID') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            {exportType === 'transactions' && (
              <div className="space-y-4">
                <Label>Categories (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                      />
                      <Label htmlFor={category.id} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating export...</span>
                  <span>{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            {/* Export Button */}
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Generating...' : 'Generate Export'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Export Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common export and document actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Printer className="h-6 w-6" />
                <span className="text-sm">Print Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Mail className="h-6 w-6" />
                <span className="text-sm">Email Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Share className="h-6 w-6" />
                <span className="text-sm">Share Link</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Archive className="h-6 w-6" />
                <span className="text-sm">Archive Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              Previously generated exports and documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportHistory.map((export_, index) => {
                const StatusIcon = getStatusIcon(export_.status);
                const FormatIcon = getFormatIcon(export_.format);
                
                return (
                  <motion.div
                    key={export_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FormatIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{export_.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{export_.size}</span>
                          <span>•</span>
                          <span>{export_.createdAt.toLocaleDateString('id-ID')}</span>
                          <span>•</span>
                          <span>{export_.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(export_.status)}`} />
                        <Badge variant={export_.status === 'completed' ? 'default' : 'secondary'}>
                          {export_.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {export_.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(export_.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(export_.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {exportHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exports generated yet</p>
                  <p className="text-sm">Create your first export to see it here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExportTab;

