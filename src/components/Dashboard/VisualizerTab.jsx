// Visualizer Tab Component

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Eye, 
  RotateCcw, 
  Download, 
  Settings,
  Palette,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Layers,
  Package as BoxIcon,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

// 3D Components
const AnimatedBar = ({ position, height, color, label, value }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.y = height + (hovered ? 0.1 : 0);
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.8, height, 0.8]}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? '#60a5fa' : color} />
      </Box>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, height + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const AnimatedSphere = ({ position, size, color, label, value }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.scale.setScalar(size + (hovered ? 0.1 : 0));
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? '#fbbf24' : color} />
      </Sphere>
      <Text
        position={[0, -size - 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const FinancialGalaxy = ({ data, type }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  if (type === 'expenses') {
    return (
      <group ref={groupRef}>
        {data.map((item, index) => {
          const angle = (index / data.length) * Math.PI * 2;
          const radius = 3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const size = (item.value / Math.max(...data.map(d => d.value))) * 1.5 + 0.3;
          
          return (
            <AnimatedSphere
              key={item.name}
              position={[x, 0, z]}
              size={size}
              color={item.color}
              label={item.name}
              value={item.displayValue}
            />
          );
        })}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {data.map((item, index) => {
        const x = (index - data.length / 2) * 1.5;
        const height = (item.value / Math.max(...data.map(d => d.value))) * 3 + 0.5;
        
        return (
          <AnimatedBar
            key={item.name}
            position={[x, 0, 0]}
            height={height}
            color={item.color}
            label={item.name}
            value={item.displayValue}
          />
        );
      })}
    </group>
  );
};

const VisualizerTab = () => {
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [visualizationType, setVisualizationType] = useState('3d-expenses');
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [showLabels, setShowLabels] = useState(true);
  const [colorScheme, setColorScheme] = useState('default');
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewMode, setViewMode] = useState('orbit');

  // Mock financial data
  const expenseData = [
    { name: 'Food', value: 3500000, color: '#ff6b6b', displayValue: 'Rp 3.5M' },
    { name: 'Transport', value: 2000000, color: '#4ecdc4', displayValue: 'Rp 2M' },
    { name: 'Entertainment', value: 1500000, color: '#45b7d1', displayValue: 'Rp 1.5M' },
    { name: 'Shopping', value: 2500000, color: '#96ceb4', displayValue: 'Rp 2.5M' },
    { name: 'Utilities', value: 1200000, color: '#feca57', displayValue: 'Rp 1.2M' },
    { name: 'Healthcare', value: 800000, color: '#ff9ff3', displayValue: 'Rp 800K' }
  ];

  const incomeData = [
    { name: 'Salary', value: 15000000, color: '#2ecc71', displayValue: 'Rp 15M' },
    { name: 'Freelance', value: 3000000, color: '#3498db', displayValue: 'Rp 3M' },
    { name: 'Investment', value: 2000000, color: '#9b59b6', displayValue: 'Rp 2M' },
    { name: 'Business', value: 5000000, color: '#e74c3c', displayValue: 'Rp 5M' }
  ];

  const portfolioData = [
    { name: 'Stocks', value: 45, color: '#e74c3c' },
    { name: 'Bonds', value: 25, color: '#3498db' },
    { name: 'Real Estate', value: 20, color: '#2ecc71' },
    { name: 'Cash', value: 10, color: '#f39c12' }
  ];

  const trendData = [
    { month: 'Jan', income: 20000000, expenses: 12000000, savings: 8000000 },
    { month: 'Feb', income: 22000000, expenses: 13000000, savings: 9000000 },
    { month: 'Mar', income: 21000000, expenses: 11500000, savings: 9500000 },
    { month: 'Apr', income: 25000000, expenses: 14000000, savings: 11000000 },
    { month: 'May', income: 23000000, expenses: 12500000, savings: 10500000 },
    { month: 'Jun', income: 26000000, expenses: 15000000, savings: 11000000 }
  ];

  const radarData = [
    { subject: 'Savings Rate', A: 85, fullMark: 100 },
    { subject: 'Investment Diversity', A: 70, fullMark: 100 },
    { subject: 'Emergency Fund', A: 90, fullMark: 100 },
    { subject: 'Debt Management', A: 75, fullMark: 100 },
    { subject: 'Budget Adherence', A: 80, fullMark: 100 },
    { subject: 'Financial Goals', A: 65, fullMark: 100 }
  ];

  const colorSchemes = {
    default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
    ocean: ['#006994', '#0085c3', '#00a8cc', '#7fb069', '#b4d6cd', '#f7f9f9'],
    sunset: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#b19cd9', '#c9c9ff'],
    forest: ['#2d5016', '#3e6b1f', '#4f7942', '#7ba05b', '#a8c686', '#d4e6b7']
  };

  const getVisualizationData = () => {
    switch (visualizationType) {
      case '3d-expenses':
      case 'pie-expenses':
        return expenseData;
      case '3d-income':
      case 'bar-income':
        return incomeData;
      case 'portfolio':
        return portfolioData;
      case 'trends':
        return trendData;
      case 'radar':
        return radarData;
      default:
        return expenseData;
    }
  };

  const renderVisualization = () => {
    const data = getVisualizationData();

    switch (visualizationType) {
      case '3d-expenses':
      case '3d-income':
        return (
          <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <pointLight position={[-10, -10, -10]} color="#4ecdc4" intensity={0.3} />
              <FinancialGalaxy 
                data={data} 
                type={visualizationType.includes('expenses') ? 'expenses' : 'income'} 
              />
              <OrbitControls 
                enablePan={viewMode === 'free'} 
                enableZoom={true} 
                enableRotate={viewMode !== 'locked'}
                autoRotate={isAnimating}
                autoRotateSpeed={animationSpeed[0]}
              />
            </Canvas>
          </div>
        );

      case 'pie-expenses':
      case 'portfolio':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={showLabels ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar-income':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Bar dataKey="value" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'trends':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.6} />
                <Area type="monotone" dataKey="savings" stackId="3" stroke="#3498db" fill="#3498db" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'radar':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Financial Health" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return <div className="h-96 flex items-center justify-center text-muted-foreground">Select a visualization type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visualization Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BoxIcon className="h-5 w-5" />
              <span>Financial Visualizer</span>
            </CardTitle>
            <CardDescription>
              Interactive 3D and advanced visualizations of your financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visualization Type Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant={visualizationType === '3d-expenses' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('3d-expenses')}
              >
                <BoxIcon className="h-6 w-6" />
                <span className="text-sm">3D Expenses</span>
              </Button>
              <Button
                variant={visualizationType === '3d-income' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('3d-income')}
              >
                <Layers className="h-6 w-6" />
                <span className="text-sm">3D Income</span>
              </Button>
              <Button
                variant={visualizationType === 'pie-expenses' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('pie-expenses')}
              >
                <PieChartIcon className="h-6 w-6" />
                <span className="text-sm">Expense Pie</span>
              </Button>
              <Button
                variant={visualizationType === 'bar-income' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('bar-income')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Income Bars</span>
              </Button>
              <Button
                variant={visualizationType === 'portfolio' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('portfolio')}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Portfolio</span>
              </Button>
              <Button
                variant={visualizationType === 'trends' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('trends')}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Trends</span>
              </Button>
              <Button
                variant={visualizationType === 'radar' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setVisualizationType('radar')}
              >
                <Zap className="h-6 w-6" />
                <span className="text-sm">Health Radar</span>
              </Button>
            </div>

            {/* Visualization Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Animation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Enable Animation</Label>
                    <Switch
                      checked={isAnimating}
                      onCheckedChange={setIsAnimating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Speed</Label>
                    <Slider
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {animationSpeed[0]}x
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Display</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Labels</Label>
                    <Switch
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color Scheme</Label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="ocean">Ocean</SelectItem>
                        <SelectItem value="sunset">Sunset</SelectItem>
                        <SelectItem value="forest">Forest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Camera</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>View Mode</Label>
                    <Select value={viewMode} onValueChange={setViewMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orbit">Orbit</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {visualizationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </CardTitle>
                <CardDescription>
                  Interactive visualization of your financial data
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderVisualization()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Visualization Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>
              Key insights from your financial visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Highest Category</h4>
                <p className="text-2xl font-bold">Food & Dining</p>
                <p className="text-sm text-muted-foreground">
                  Rp 3.5M (35% of expenses)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Growth Trend</h4>
                <p className="text-2xl font-bold">+12.5%</p>
                <p className="text-sm text-muted-foreground">
                  Compared to last month
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Optimization</h4>
                <p className="text-2xl font-bold">Rp 1.2M</p>
                <p className="text-sm text-muted-foreground">
                  Potential savings identified
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VisualizerTab;

