import React, { useState, useRef, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { TrendingUp, TrendingDown, Search, Zap, Send, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { BeamsBackground } from '../components/ui/beams-background';
import { useTheme } from '../context/ThemeContext';
import { FundamentalsCard } from '../components/FundamentalsCard';
import { API_ENDPOINTS } from '../config/api';

export function AnalysisPage() {
  const { theme } = useTheme();
  const [symbol, setSymbol] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('30m');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [fundamentals, setFundamentals] = useState<any>(null);
  const [fundamentalsLoading, setFundamentalsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const timeframes = ['1m', '30m', '1d', '1w', '1M'];

  const popularStocks = [
    'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
    'TATAMOTORS', 'SBIN', 'WIPRO', 'BHARTIARTL', 'HINDUNILVR'
  ];

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !result) {
      console.log('Cannot send message:', { hasInput: !!chatInput.trim(), hasResult: !!result });
      return;
    }

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      console.log('Sending chat message:', messageToSend);
      console.log('Stock data:', result);

      const response = await axios.post(API_ENDPOINTS.chat(), {
        message: messageToSend,
        stock_data: result
      });

      console.log('AI Response:', response.data);
      const aiMessage = { role: 'assistant', content: response.data.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      console.error('Error details:', err.response?.data);
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.response?.data?.detail || err.message}. Please make sure the backend is running.`
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const analyzeStock = async () => {
    const cleanSymbol = symbol.trim().toUpperCase();

    if (!cleanSymbol) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch technical analysis
      const response = await axios.get(
        API_ENDPOINTS.analyze(cleanSymbol, timeframe)
      );

      if (response.data) {
        setResult(response.data);
        generateChartData(response.data);
        setChatMessages([{
          role: 'assistant',
          content: `I've analyzed ${cleanSymbol}. The current price is ₹${response.data.current_price?.toFixed(2)}. Ask me anything about this stock!`
        }]);

        // Fetch fundamentals data
        fetchFundamentals(cleanSymbol);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze stock');
      setResult(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFundamentals = async (stockSymbol: string) => {
    setFundamentalsLoading(true);
    try {
      const response = await axios.get(
        API_ENDPOINTS.fundamentals(stockSymbol)
      );
      setFundamentals(response.data);
    } catch (err: any) {
      console.error('Failed to fetch fundamentals:', err);
      setFundamentals(null);
    } finally {
      setFundamentalsLoading(false);
    }
  };

  const generateChartData = (analysisData: any) => {
    if (!analysisData?.current_price) return;

    const { current_price, symbol } = analysisData;
    const dataPoints = [];
    const numPoints = 60;

    // Create a seed from symbol for consistent random values
    const seed = symbol.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

    // Seeded random function for consistency
    let seedValue = seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    let price = current_price * 0.98;

    for (let i = 0; i < numPoints; i++) {
      const volatility = current_price * 0.004;
      const trend = (current_price - price) / numPoints;
      const randomChange = (seededRandom() - 0.5) * volatility;
      price = price + trend + randomChange;
      dataPoints.push({ time: i, price: parseFloat(price.toFixed(2)) });
    }

    dataPoints[numPoints - 1].price = current_price;
    setChartData(dataPoints);
  };

  const chartOptions: any = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
      colors: ['#3b82f6']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#1e40af'],
        opacityFrom: 0.5,
        opacityTo: 0.05,
      }
    },
    xaxis: {
      categories: chartData.map(d => d.time),
      labels: {
        show: true,
        style: {
          colors: '#6b7280',
          fontSize: '10px',
          fontWeight: 500
        },
        formatter: (value: any) => {
          const index = parseInt(value);
          return index % 10 === 0 ? index : '';
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        stroke: {
          color: '#3b82f6',
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: '#6b7280',
          fontSize: '10px',
          fontWeight: 500
        },
        formatter: (value: number) => `₹${value?.toFixed(0)}`
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.03)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 10
      }
    },
    theme: { mode: 'dark' },
    tooltip: {
      theme: 'dark',
      x: { show: true, format: 'Point' },
      y: {
        formatter: (value: number) => `₹${value?.toFixed(2)}`,
        title: { formatter: () => 'Price: ' }
      },
      marker: { show: true },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      }
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 3
      }
    },
    annotations: {
      yaxis: [
        ...(Array.isArray(result?.support) ? result.support.map((level: number, i: number) => ({
          y: level,
          borderColor: '#10b981',
          strokeDashArray: 4,
          borderWidth: 2,
          opacity: 0.8,
          label: {
            text: `S${i + 1}: ₹${level?.toFixed(2)}`,
            style: {
              color: '#fff',
              background: '#10b981',
              fontSize: '11px',
              fontWeight: 600,
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4
              }
            },
            borderRadius: 4
          }
        })) : []),
        ...(Array.isArray(result?.resistance) ? result.resistance.map((level: number, i: number) => ({
          y: level,
          borderColor: '#ef4444',
          strokeDashArray: 4,
          borderWidth: 2,
          opacity: 0.8,
          label: {
            text: `R${i + 1}: ₹${level?.toFixed(2)}`,
            style: {
              color: '#fff',
              background: '#ef4444',
              fontSize: '11px',
              fontWeight: 600,
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4
              }
            },
            borderRadius: 4
          }
        })) : []),
      ]
    }
  };

  return (
    <>
      {theme === 'dark' && <BeamsBackground intensity="subtle" />}
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : ''}`}>
        <Navbar />
        <div className="pt-20">
          <div className="flex h-[calc(100vh-5rem)] fixed top-20 left-0 right-0">
            {/* AI Chat Sidebar - Left */}
            <div className={`w-96 border-r flex flex-col overflow-hidden ${theme === 'dark'
                ? 'border-white/10 bg-neutral-900/80 backdrop-blur-md'
                : 'border-gray-200 bg-white/90 backdrop-blur-md shadow-sm'
              }`}>
              {/* Chat Header */}
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme === 'dark'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Assistant</h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Powered by Gemini</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20'
                        : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                      }`}>
                      <Sparkles className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      AI Stock Analysis
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      Analyze a stock to start chatting
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === 'dark'
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          }`}>
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 select-text ${msg.role === 'user'
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : theme === 'dark'
                            ? 'bg-white/5 text-gray-200'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                        <p className="text-sm leading-relaxed select-text cursor-text">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`rounded-2xl px-3.5 py-2.5 ${theme === 'dark'
                        ? 'bg-white/5'
                        : 'bg-white border border-gray-200'
                      }`}>
                      <div className="flex gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className={`p-3 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                {!result && (
                  <div className={`text-xs text-center mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Analyze a stock to start chatting
                  </div>
                )}
                <div className={`flex items-center gap-2 rounded-xl p-2 transition-all ${theme === 'dark'
                    ? 'bg-white/5'
                    : 'bg-white border border-gray-200'
                  } ${!result ? 'opacity-50' : ''}`}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (result && chatInput.trim()) {
                          sendChatMessage();
                        }
                      }
                    }}
                    placeholder={result ? "Ask about the stock..." : "Analyze a stock first..."}
                    className={`flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none ${theme === 'dark'
                        ? 'text-white placeholder-gray-500'
                        : 'text-gray-900 placeholder-gray-400'
                      }`}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!result || chatLoading || !chatInput.trim()}
                    className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Section - Right */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="max-w-7xl mx-auto p-8">
                {/* Search Section */}
                <div className={`backdrop-blur-md border rounded-2xl p-6 mb-6 ${theme === 'dark'
                    ? 'bg-neutral-900/80 border-white/10'
                    : 'bg-white/90 border-gray-200'
                  }`}>
                  <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Stock Analysis</h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
                        placeholder="Stock Symbol (e.g., RELIANCE)"
                        className={`w-full border rounded-lg pl-10 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors ${theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-gray-100 border-gray-200 text-gray-900'
                          }`}
                      />
                    </div>

                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className={`border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors ${theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-gray-100 border-gray-200 text-gray-900'
                        }`}
                    >
                      {timeframes.map(tf => (
                        <option
                          key={tf}
                          value={tf}
                          className={theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-gray-900'}
                        >
                          {tf}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={analyzeStock}
                      disabled={loading}
                      className={`border font-medium rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${theme === 'dark'
                          ? 'bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/40'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>

                  {/* Popular Stocks */}
                  <div className="flex flex-wrap gap-2">
                    {popularStocks.map(stock => (
                      <button
                        key={stock}
                        onClick={() => setSymbol(stock)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${theme === 'dark'
                            ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700'
                          }`}
                      >
                        {stock}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {!result && !error && !loading && (
                  <div className={`backdrop-blur-md border rounded-2xl p-8 mb-6 ${theme === 'dark'
                      ? 'bg-neutral-900/80 border-white/10'
                      : 'bg-white/90 border-gray-200'
                    }`}>
                    <div className="text-center max-w-2xl mx-auto">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Get Started with Stock Analysis</h3>
                      <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enter the <span className={theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-semibold'}>exact stock symbol</span> (e.g., RELIANCE, TCS, INFY) in the search box above, select your preferred timeframe, and click the <span className={theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-semibold'}>Analyze</span> button to view detailed technical analysis.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Zap className="w-4 h-4" />
                        <span>Real-time support & resistance levels • AI-powered insights</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 mb-6">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {/* Results */}
                {result && (
                  <>
                    {/* Top Row: Price + Support & Resistance in 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      {/* Price Card */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${theme === 'dark'
                          ? 'bg-neutral-900/80 border-white/10'
                          : 'bg-white/90 border-gray-200'
                        }`}>
                        <div className="flex flex-col h-full justify-center">
                          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            ₹{result.current_price?.toFixed(2)}
                          </h2>
                          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.symbol}</p>
                          <div className={`text-xl font-bold ${(result.price_change_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {(result.price_change_percent || 0) >= 0 ? '▲' : '▼'}
                            {Math.abs(result.price_change_percent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* Support Levels */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${theme === 'dark'
                          ? 'bg-neutral-900/80 border-white/10'
                          : 'bg-white/90 border-gray-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingDown className="w-5 h-5 text-green-400" />
                          <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Levels</h3>
                        </div>
                        <div className="space-y-2">
                          {Array.isArray(result.support) && result.support.map((level: number, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>S{idx + 1}</span>
                              <span className="text-green-400 font-semibold text-sm">₹{level?.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resistance Levels */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${theme === 'dark'
                          ? 'bg-neutral-900/80 border-white/10'
                          : 'bg-white/90 border-gray-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-red-400" />
                          <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Resistance Levels</h3>
                        </div>
                        <div className="space-y-2">
                          {Array.isArray(result.resistance) && result.resistance.map((level: number, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>R{idx + 1}</span>
                              <span className="text-red-400 font-semibold text-sm">₹{level?.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fundamentals Card with Integrated Chart */}
                    <FundamentalsCard
                      data={fundamentals}
                      loading={fundamentalsLoading}
                      chartData={chartData}
                      chartOptions={chartOptions}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
