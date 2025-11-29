import { BackgroundPaths } from "@/components/ui/background-paths";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, Zap, BarChart3, Shield } from "lucide-react";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useTheme } from "@/context/ThemeContext";

export function HomePage() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleStartAnalyzing = () => {
        navigate("/analysis");
    };

    const features = [
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Real-Time Analysis",
            description: "Get instant support and resistance levels for NSE stocks with live market data"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Smart Signals",
            description: "AI-powered breakout predictions with confidence scores and volume analysis"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Advanced Charts",
            description: "Interactive price charts with technical indicators and pivot points"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "ML-Powered",
            description: "Machine learning algorithms using DBSCAN clustering for accurate level detection"
        }
    ];

    return (
        <>
            {theme === 'dark' ? <ShaderBackground /> : <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />}
            <Navbar />
            <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <BackgroundPaths
                    title="StockScope AI"
                    subtitle="Smart Analysis • Real-Time Signals • AI-Powered"
                    buttonText="Start Analyzing"
                    onButtonClick={handleStartAnalyzing}
                />
                
                {/* Features Section */}
                <div className="absolute bottom-0 left-0 right-0 pb-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                                        theme === 'dark'
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/50'
                                            : 'bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                                        theme === 'dark'
                                            ? 'bg-gradient-to-br from-gray-700 to-gray-600'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                    }`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className={`font-semibold text-lg mb-2 ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
