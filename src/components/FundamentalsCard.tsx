import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Badge } from './ui/badge';
import { DonutChart, DonutChartSegment } from './ui/donut-chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from './ui/bar-chart';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Building2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface FundamentalsData {
  current_price: number;
  week_52_high: number;
  week_52_low: number;
  pe_ratio: number;
  forward_pe: number;
  price_to_book: number;
  price_to_sales: number;
  dividend_yield: number;
  dividend_rate: number;
  roe: number;
  roa: number;
  profit_margin: number;
  operating_margin: number;
  revenue: number;
  revenue_growth: number;
  earnings_growth: number;
  market_cap: number;
  debt_to_equity: number;
  current_ratio: number;
  sector: string;
  industry: string;
  company_name: string;
  beta: number;
  eps: number;
  book_value: number;
  institutional_holders: number;
  insider_holders: number;
  peers?: string[];
}

interface FundamentalsCardProps {
  data: FundamentalsData | null;
  loading: boolean;
  chartData?: any[];
  chartOptions?: any;
}

export function FundamentalsCard({ data, loading, chartData, chartOptions }: FundamentalsCardProps) {
  const { theme } = useTheme();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  if (loading) {
    return (
      <div className={`backdrop-blur-md border rounded-2xl p-6 ${
        theme === 'dark'
          ? 'bg-neutral-900/80 border-white/10'
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)}Cr`;
    if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)}L`;
    return `₹${num.toFixed(2)}`;
  };

  // 52 Week Range calculation
  const weekRangePercent = data.week_52_high > 0 
    ? ((data.current_price - data.week_52_low) / (data.week_52_high - data.week_52_low)) * 100 
    : 0;

  // Shareholding Donut Chart Data
  const shareholdingData: DonutChartSegment[] = [
    { 
      value: data.institutional_holders || 35, 
      color: 'hsl(214.7 95% 40%)', 
      label: 'Institutional' 
    },
    { 
      value: data.insider_holders || 15, 
      color: 'hsl(142.1 76.2% 36.3%)', 
      label: 'Promoters' 
    },
    { 
      value: 100 - (data.institutional_holders || 35) - (data.insider_holders || 15), 
      color: 'hsl(47.9 95.8% 53.1%)', 
      label: 'Public' 
    },
  ];

  const totalShareholding = shareholdingData.reduce((sum, d) => sum + d.value, 0);
  const activeSegment = shareholdingData.find(seg => seg.label === hoveredSegment);
  const displayValue = activeSegment?.value ?? totalShareholding;
  const displayLabel = activeSegment?.label ?? 'Total';
  const displayPercentage = activeSegment ? (activeSegment.value / totalShareholding) * 100 : 100;

  // Financial Metrics Bar Chart
  const financialMetrics = [
    { name: 'ROE', value: data.roe || 0, color: 'hsl(142.1 76.2% 36.3%)' },
    { name: 'ROA', value: data.roa || 0, color: 'hsl(214.7 95% 40%)' },
    { name: 'Profit Margin', value: data.profit_margin || 0, color: 'hsl(47.9 95.8% 53.1%)' },
    { name: 'Operating Margin', value: data.operating_margin || 0, color: 'hsl(262.1 83.3% 57.8%)' },
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: 'Percentage',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className={`backdrop-blur-md border rounded-2xl p-5 ${
      theme === 'dark'
        ? 'bg-neutral-900/80 border-white/10'
        : 'bg-white/90 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-purple-600 to-pink-600'
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}>
          <PieChart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Analysis Overview
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {data?.company_name || 'Fundamentals & Chart'}
          </p>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Fundamentals */}
        <div className="space-y-4">
          {/* Company Info - Compact */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-3 h-3 text-blue-500" />
              <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Company
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sector</span>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {data.sector}
                </p>
              </div>
              <div>
                <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Market Cap</span>
                <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(data.market_cap)}
                </p>
              </div>
            </div>
          </div>

          {/* 52 Week Range - Compact */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-green-500" />
              <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                52W Range
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  ₹{data.week_52_low.toFixed(0)}
                </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  ₹{data.week_52_high.toFixed(0)}
                </span>
              </div>
              <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                  style={{ width: '100%' }}
                />
                <div 
                  className="absolute h-3 w-3 bg-white border-2 border-blue-500 rounded-full -top-0.5 transform -translate-x-1/2 shadow-lg"
                  style={{ left: `${weekRangePercent}%` }}
                />
              </div>
              <div className="text-center">
                <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  ₹{data.current_price.toFixed(2)} ({weekRangePercent.toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Valuation Ratios - Compact Grid */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-3 h-3 text-yellow-500" />
              <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Valuation
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>P/E</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.pe_ratio ? data.pe_ratio.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>P/B</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.price_to_book ? data.price_to_book.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Div%</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.dividend_yield ? data.dividend_yield.toFixed(1) : '0'}%
                </p>
              </div>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>EPS</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ₹{data.eps ? data.eps.toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Profitability Metrics Bar Chart */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <h3 className={`font-semibold text-xs mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Profitability Metrics
            </h3>
            <ChartContainer config={chartConfig} className="h-32">
              <BarChart data={financialMetrics} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 9 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--chart-1))"
                >
                  {financialMetrics.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Peers - Compact */}
          {data.peers && data.peers.length > 0 && (
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold text-xs mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Peers
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.peers.slice(0, 3).map((peer) => (
                  <Badge 
                    key={peer} 
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 ${
                      theme === 'dark' 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {peer}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Charts */}
        <div className="space-y-4">
          {/* Price Chart - Smaller */}
          {chartData && chartData.length > 0 && chartOptions && (
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold text-xs mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Price Chart
              </h3>
              <Chart
                options={chartOptions}
                series={[{ name: 'Price', data: chartData.map(d => d?.price ?? 0) }]}
                type="area"
                height={200}
              />
            </div>
          )}

          {/* Shareholding Pattern Donut Chart */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3 h-3 text-purple-500" />
              <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Shareholding Pattern
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <DonutChart
                data={shareholdingData}
                size={140}
                strokeWidth={20}
                animationDuration={1}
                highlightOnHover={true}
                onSegmentHover={(segment) => setHoveredSegment(segment?.label || null)}
                centerContent={
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={displayLabel}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <p className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {displayLabel}
                      </p>
                      <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {displayPercentage.toFixed(1)}%
                      </p>
                    </motion.div>
                  </AnimatePresence>
                }
              />
              <div className="flex flex-col space-y-1 w-full mt-3">
                {shareholdingData.map((segment, index) => (
                  <motion.div
                    key={segment.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    className={`flex items-center justify-between p-1.5 rounded transition-all duration-200 cursor-pointer ${
                      hoveredSegment === segment.label 
                        ? theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredSegment(segment.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {segment.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {segment.value.toFixed(1)}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue & Growth */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <h3 className={`font-semibold text-xs mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Revenue & Growth
            </h3>
            <div className="space-y-2">
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(data.revenue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rev Growth</p>
                  <div className="flex items-center gap-1">
                    {data.revenue_growth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <p className={`text-xs font-bold ${
                      data.revenue_growth >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {data.revenue_growth ? data.revenue_growth.toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>
                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Earn Growth</p>
                  <div className="flex items-center gap-1">
                    {data.earnings_growth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <p className={`text-xs font-bold ${
                      data.earnings_growth >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {data.earnings_growth ? data.earnings_growth.toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
