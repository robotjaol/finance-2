// Simulation Tab Component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target,
  PiggyBank,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Briefcase,
  Play,
  RotateCcw,
  Download,
  Share
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/index';

const SimulationTab = () => {
  const { getCurrency } = useAuthStore();
  const currency = getCurrency();

  const [activeSimulation, setActiveSimulation] = useState('investment');
  const [simulationData, setSimulationData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Investment Simulation State
  const [investmentParams, setInvestmentParams] = useState({
    initialAmount: 10000000, // 10 million IDR
    monthlyContribution: 1000000, // 1 million IDR
    annualReturn: 8, // 8%
    timeHorizon: 10, // 10 years
    inflationRate: 3, // 3%
    riskLevel: 'moderate'
  });

  // Retirement Simulation State
  const [retirementParams, setRetirementParams] = useState({
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 50000000, // 50 million IDR
    monthlyContribution: 2000000, // 2 million IDR
    expectedReturn: 7, // 7%
    retirementExpenses: 15000000, // 15 million IDR per month
    inflationRate: 3
  });

  // Loan Simulation State
  const [loanParams, setLoanParams] = useState({
    loanAmount: 500000000, // 500 million IDR
    interestRate: 6, // 6%
    loanTerm: 20, // 20 years
    downPayment: 100000000, // 100 million IDR
    extraPayment: 0
  });

  // Goal Simulation State
  const [goalParams, setGoalParams] = useState({
    goalAmount: 100000000, // 100 million IDR
    timeFrame: 5, // 5 years
    currentSavings: 10000000, // 10 million IDR
    monthlyContribution: 1500000, // 1.5 million IDR
    expectedReturn: 6
  });

  const riskLevels = {
    conservative: { return: 5, volatility: 0.05 },
    moderate: { return: 8, volatility: 0.12 },
    aggressive: { return: 12, volatility: 0.20 }
  };

  const goalTypes = [
    { value: 'house', label: 'Buy a House', icon: Home, defaultAmount: 500000000 },
    { value: 'car', label: 'Buy a Car', icon: Car, defaultAmount: 300000000 },
    { value: 'education', label: 'Education Fund', icon: GraduationCap, defaultAmount: 200000000 },
    { value: 'vacation', label: 'Dream Vacation', icon: Plane, defaultAmount: 50000000 },
    { value: 'emergency', label: 'Emergency Fund', icon: Heart, defaultAmount: 100000000 },
    { value: 'business', label: 'Start Business', icon: Briefcase, defaultAmount: 1000000000 }
  ];

  // Investment Simulation Logic
  const runInvestmentSimulation = () => {
    const { initialAmount, monthlyContribution, annualReturn, timeHorizon, inflationRate, riskLevel } = investmentParams;
    const risk = riskLevels[riskLevel];
    const monthlyReturn = (annualReturn / 100) / 12;
    const monthlyInflation = (inflationRate / 100) / 12;
    
    const data = [];
    let balance = initialAmount;
    let totalContributions = initialAmount;
    
    for (let month = 0; month <= timeHorizon * 12; month++) {
      if (month > 0) {
        // Add monthly contribution
        balance += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Apply return with volatility
        const volatility = risk.volatility * (Math.random() - 0.5) * 2;
        const actualReturn = monthlyReturn + volatility;
        balance *= (1 + actualReturn);
      }
      
      const realValue = balance / Math.pow(1 + monthlyInflation, month);
      
      data.push({
        month,
        year: Math.floor(month / 12),
        balance: Math.round(balance),
        realValue: Math.round(realValue),
        totalContributions: Math.round(totalContributions),
        gains: Math.round(balance - totalContributions)
      });
    }
    
    return data;
  };

  // Retirement Simulation Logic
  const runRetirementSimulation = () => {
    const { currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, retirementExpenses, inflationRate } = retirementParams;
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyReturn = (expectedReturn / 100) / 12;
    const monthlyInflation = (inflationRate / 100) / 12;
    
    const data = [];
    let balance = currentSavings;
    let age = currentAge;
    
    // Accumulation phase
    for (let month = 0; month <= yearsToRetirement * 12; month++) {
      if (month > 0) {
        balance += monthlyContribution;
        balance *= (1 + monthlyReturn);
      }
      
      age = currentAge + (month / 12);
      
      data.push({
        month,
        age: Math.round(age * 10) / 10,
        balance: Math.round(balance),
        phase: 'accumulation'
      });
    }
    
    // Withdrawal phase (simulate 30 years of retirement)
    const adjustedExpenses = retirementExpenses * Math.pow(1 + monthlyInflation, yearsToRetirement * 12);
    
    for (let month = 1; month <= 30 * 12; month++) {
      balance -= adjustedExpenses * Math.pow(1 + monthlyInflation, month);
      balance *= (1 + monthlyReturn * 0.6); // More conservative returns in retirement
      
      age = retirementAge + (month / 12);
      
      data.push({
        month: yearsToRetirement * 12 + month,
        age: Math.round(age * 10) / 10,
        balance: Math.round(Math.max(0, balance)),
        phase: 'withdrawal'
      });
      
      if (balance <= 0) break;
    }
    
    return data;
  };

  // Loan Simulation Logic
  const runLoanSimulation = () => {
    const { loanAmount, interestRate, loanTerm, downPayment, extraPayment } = loanParams;
    const principal = loanAmount - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly payment
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const data = [];
    let remainingBalance = principal;
    let totalInterest = 0;
    
    for (let month = 1; month <= totalPayments && remainingBalance > 0; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment + extraPayment, remainingBalance);
      
      remainingBalance -= principalPayment;
      totalInterest += interestPayment;
      
      data.push({
        month,
        year: Math.ceil(month / 12),
        remainingBalance: Math.round(Math.max(0, remainingBalance)),
        monthlyPayment: Math.round(monthlyPayment + extraPayment),
        interestPayment: Math.round(interestPayment),
        principalPayment: Math.round(principalPayment),
        totalInterest: Math.round(totalInterest)
      });
      
      if (remainingBalance <= 0) break;
    }
    
    return data;
  };

  // Goal Simulation Logic
  const runGoalSimulation = () => {
    const { goalAmount, timeFrame, currentSavings, monthlyContribution, expectedReturn } = goalParams;
    const monthlyReturn = (expectedReturn / 100) / 12;
    const totalMonths = timeFrame * 12;
    
    const data = [];
    let balance = currentSavings;
    
    for (let month = 0; month <= totalMonths; month++) {
      if (month > 0) {
        balance += monthlyContribution;
        balance *= (1 + monthlyReturn);
      }
      
      const progress = (balance / goalAmount) * 100;
      
      data.push({
        month,
        year: Math.round((month / 12) * 10) / 10,
        balance: Math.round(balance),
        progress: Math.min(100, Math.round(progress * 10) / 10),
        goalAmount,
        shortfall: Math.max(0, goalAmount - balance)
      });
    }
    
    return data;
  };

  const runSimulation = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      let data;
      switch (activeSimulation) {
        case 'investment':
          data = runInvestmentSimulation();
          break;
        case 'retirement':
          data = runRetirementSimulation();
          break;
        case 'loan':
          data = runLoanSimulation();
          break;
        case 'goal':
          data = runGoalSimulation();
          break;
        default:
          data = [];
      }
      
      setSimulationData(data);
      setIsRunning(false);
    }, 1000);
  };

  const resetSimulation = () => {
    setSimulationData([]);
  };

  useEffect(() => {
    runSimulation();
  }, [activeSimulation]);

  return (
    <div className="space-y-6">
      {/* Simulation Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Financial Simulations</span>
            </CardTitle>
            <CardDescription>
              Model different financial scenarios and plan for your future
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSimulation} onValueChange={setActiveSimulation}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="investment">Investment</TabsTrigger>
                <TabsTrigger value="retirement">Retirement</TabsTrigger>
                <TabsTrigger value="loan">Loan</TabsTrigger>
                <TabsTrigger value="goal">Goal</TabsTrigger>
              </TabsList>

              {/* Investment Simulation */}
              <TabsContent value="investment" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Investment Parameters</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Initial Investment</Label>
                        <Input
                          type="number"
                          value={investmentParams.initialAmount}
                          onChange={(e) => setInvestmentParams({
                            ...investmentParams,
                            initialAmount: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Contribution</Label>
                        <Input
                          type="number"
                          value={investmentParams.monthlyContribution}
                          onChange={(e) => setInvestmentParams({
                            ...investmentParams,
                            monthlyContribution: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Annual Return (%)</Label>
                        <Slider
                          value={[investmentParams.annualReturn]}
                          onValueChange={([value]) => setInvestmentParams({
                            ...investmentParams,
                            annualReturn: value
                          })}
                          max={20}
                          min={1}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {investmentParams.annualReturn}%
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Time Horizon (Years)</Label>
                        <Slider
                          value={[investmentParams.timeHorizon]}
                          onValueChange={([value]) => setInvestmentParams({
                            ...investmentParams,
                            timeHorizon: value
                          })}
                          max={40}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {investmentParams.timeHorizon} years
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Risk Level</Label>
                        <Select 
                          value={investmentParams.riskLevel} 
                          onValueChange={(value) => setInvestmentParams({
                            ...investmentParams,
                            riskLevel: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative (5% return)</SelectItem>
                            <SelectItem value="moderate">Moderate (8% return)</SelectItem>
                            <SelectItem value="aggressive">Aggressive (12% return)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {simulationData.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Final Balance</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {formatCurrency(simulationData[simulationData.length - 1]?.balance || 0, currency)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Gains</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(simulationData[simulationData.length - 1]?.gains || 0, currency)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={simulationData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                              <Tooltip 
                                formatter={(value, name) => [formatCurrency(value, currency), name]}
                                labelFormatter={(label) => `Year ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="balance" 
                                stackId="1"
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.6}
                                name="Portfolio Value"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="totalContributions" 
                                stackId="2"
                                stroke="#82ca9d" 
                                fill="#82ca9d" 
                                fillOpacity={0.6}
                                name="Total Contributions"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Retirement Simulation */}
              <TabsContent value="retirement" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Retirement Parameters</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Age</Label>
                          <Input
                            type="number"
                            value={retirementParams.currentAge}
                            onChange={(e) => setRetirementParams({
                              ...retirementParams,
                              currentAge: parseInt(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Retirement Age</Label>
                          <Input
                            type="number"
                            value={retirementParams.retirementAge}
                            onChange={(e) => setRetirementParams({
                              ...retirementParams,
                              retirementAge: parseInt(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Current Savings</Label>
                        <Input
                          type="number"
                          value={retirementParams.currentSavings}
                          onChange={(e) => setRetirementParams({
                            ...retirementParams,
                            currentSavings: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Contribution</Label>
                        <Input
                          type="number"
                          value={retirementParams.monthlyContribution}
                          onChange={(e) => setRetirementParams({
                            ...retirementParams,
                            monthlyContribution: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Return (%)</Label>
                        <Slider
                          value={[retirementParams.expectedReturn]}
                          onValueChange={([value]) => setRetirementParams({
                            ...retirementParams,
                            expectedReturn: value
                          })}
                          max={15}
                          min={3}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {retirementParams.expectedReturn}%
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Retirement Expenses</Label>
                        <Input
                          type="number"
                          value={retirementParams.retirementExpenses}
                          onChange={(e) => setRetirementParams({
                            ...retirementParams,
                            retirementExpenses: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {simulationData.length > 0 && (
                      <>
                        <div className="grid grid-cols-1 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Balance at Retirement</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {formatCurrency(
                                    simulationData.find(d => d.phase === 'withdrawal')?.balance || 0, 
                                    currency
                                  )}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={simulationData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="age" />
                              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                              <Tooltip 
                                formatter={(value) => [formatCurrency(value, currency), 'Balance']}
                                labelFormatter={(label) => `Age ${label}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="balance" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Loan Simulation */}
              <TabsContent value="loan" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Loan Parameters</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Loan Amount</Label>
                        <Input
                          type="number"
                          value={loanParams.loanAmount}
                          onChange={(e) => setLoanParams({
                            ...loanParams,
                            loanAmount: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Down Payment</Label>
                        <Input
                          type="number"
                          value={loanParams.downPayment}
                          onChange={(e) => setLoanParams({
                            ...loanParams,
                            downPayment: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Interest Rate (%)</Label>
                        <Slider
                          value={[loanParams.interestRate]}
                          onValueChange={([value]) => setLoanParams({
                            ...loanParams,
                            interestRate: value
                          })}
                          max={15}
                          min={1}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {loanParams.interestRate}%
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Loan Term (Years)</Label>
                        <Slider
                          value={[loanParams.loanTerm]}
                          onValueChange={([value]) => setLoanParams({
                            ...loanParams,
                            loanTerm: value
                          })}
                          max={30}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {loanParams.loanTerm} years
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Extra Monthly Payment</Label>
                        <Input
                          type="number"
                          value={loanParams.extraPayment}
                          onChange={(e) => setLoanParams({
                            ...loanParams,
                            extraPayment: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {simulationData.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(simulationData[0]?.monthlyPayment || 0, currency)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Interest</p>
                                <p className="text-2xl font-bold text-red-600">
                                  {formatCurrency(simulationData[simulationData.length - 1]?.totalInterest || 0, currency)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={simulationData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                              <Tooltip 
                                formatter={(value) => [formatCurrency(value, currency)]}
                                labelFormatter={(label) => `Year ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="remainingBalance" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.6}
                                name="Remaining Balance"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Goal Simulation */}
              <TabsContent value="goal" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Goal Parameters</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Goal Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {goalTypes.slice(0, 4).map((goal) => {
                            const Icon = goal.icon;
                            return (
                              <Button
                                key={goal.value}
                                variant="outline"
                                className="h-auto p-3 flex flex-col items-center space-y-1"
                                onClick={() => setGoalParams({
                                  ...goalParams,
                                  goalAmount: goal.defaultAmount
                                })}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs">{goal.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Goal Amount</Label>
                        <Input
                          type="number"
                          value={goalParams.goalAmount}
                          onChange={(e) => setGoalParams({
                            ...goalParams,
                            goalAmount: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time Frame (Years)</Label>
                        <Slider
                          value={[goalParams.timeFrame]}
                          onValueChange={([value]) => setGoalParams({
                            ...goalParams,
                            timeFrame: value
                          })}
                          max={20}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {goalParams.timeFrame} years
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Current Savings</Label>
                        <Input
                          type="number"
                          value={goalParams.currentSavings}
                          onChange={(e) => setGoalParams({
                            ...goalParams,
                            currentSavings: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Contribution</Label>
                        <Input
                          type="number"
                          value={goalParams.monthlyContribution}
                          onChange={(e) => setGoalParams({
                            ...goalParams,
                            monthlyContribution: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Return (%)</Label>
                        <Slider
                          value={[goalParams.expectedReturn]}
                          onValueChange={([value]) => setGoalParams({
                            ...goalParams,
                            expectedReturn: value
                          })}
                          max={12}
                          min={2}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">
                          {goalParams.expectedReturn}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {simulationData.length > 0 && (
                      <>
                        <div className="grid grid-cols-1 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Goal Progress</p>
                                <p className="text-3xl font-bold text-green-600">
                                  {simulationData[simulationData.length - 1]?.progress || 0}%
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  {simulationData[simulationData.length - 1]?.progress >= 100 
                                    ? 'Goal Achieved!' 
                                    : `Shortfall: ${formatCurrency(simulationData[simulationData.length - 1]?.shortfall || 0, currency)}`
                                  }
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={simulationData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                              <Tooltip 
                                formatter={(value, name) => [formatCurrency(value, currency), name]}
                                labelFormatter={(label) => `Year ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="balance" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.6}
                                name="Savings Balance"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="goalAmount" 
                                stroke="#ff7300" 
                                fill="none" 
                                strokeDasharray="5 5"
                                name="Goal Amount"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button onClick={runSimulation} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Simulation'}
              </Button>
              <Button variant="outline" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SimulationTab;

