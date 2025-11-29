# StockScopeAI 📈

A modern, AI-powered stock analysis platform for NSE (National Stock Exchange) stocks with real-time data, technical analysis, fundamental insights, and AI chat assistance.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css)

## 🌟 Features

### 🎯 Core Features
- **Real-time Stock Analysis**: Live NSE stock data with price movements, day high/low, and volume
- **Technical Analysis Dashboard**: 
  - Dynamic support and resistance levels with ML-based detection
  - Breakout probability indicators
  - Signal detection (Bullish Breakout, Bearish Breakdown, Neutral)
  - Confidence scores for trading decisions
- **Fundamental Analysis**:
  - Key financial ratios (P/E, ROE, ROCE, Debt-to-Equity)
  - Market cap, revenue, and profit metrics
  - Peer comparison within the sector
  - Growth indicators and financial health scores
- **AI Chat Assistant**: 
  - Powered by Google Gemini AI
  - Context-aware stock recommendations
  - Natural language queries about stocks
- **Interactive Charts**: 
  - Beautiful candlestick charts using ApexCharts
  - Dynamic price visualization
  - Support/Resistance level overlays

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for fluid transitions
- **Real-time Updates**: Live data refresh capabilities
- **Loading States**: Elegant skeleton loaders and spinners

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0**: Latest React with improved performance
- **TypeScript 5.9.3**: Type-safe development
- **React Router DOM 7.9.5**: Client-side routing

### Styling & UI
- **TailwindCSS 3.3.0**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion 12.23.24**: Animation library
- **Lucide React**: Beautiful icon library
- **Inter Font**: Modern, clean typography

### Data Visualization
- **ApexCharts 5.3.5**: Interactive charts
- **React ApexCharts**: React wrapper for ApexCharts
- **Recharts 3.3.0**: Composable charting library

### Development Tools
- **Create React App 5.0.1**: Build tooling
- **CRACO 7.1.0**: Custom CRA configuration
- **Axios 1.13.0**: HTTP client for API calls
- **PostCSS & Autoprefixer**: CSS processing

## 📦 Installation

### Prerequisites
- Node.js 16+ or higher
- npm or yarn package manager
- Backend API running (see [StockScopeAI-backend](https://github.com/Puneet902/StockScopeAI-backend))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Puneet902/StockScopeAI.git
cd StockScopeAI
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure API endpoint**

The frontend expects the backend API to be running at `http://localhost:8000`. 

If your backend is deployed elsewhere, update the API base URL in your API configuration file.

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

## 🚀 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Create production build
npm run eject      # Eject from CRA (one-way operation)
```

## 🎯 How It Works

### 1. **Stock Search & Analysis**
- Enter an NSE stock symbol (e.g., RELIANCE, TCS, INFY)
- Click "Analyze" to fetch real-time data
- View price, technical indicators, and signals

### 2. **Technical Analysis**
- **Support Levels**: ML-detected price support zones (green badges)
- **Resistance Levels**: ML-detected price resistance zones (red badges)
- **Pivot Point**: Central price reference
- **Signal Detection**: 
  - 🟢 Bullish Breakout: Price breaking above resistance
  - 🔴 Bearish Breakdown: Price breaking below support
  - ⚪ Neutral: Consolidation or sideways movement
- **Confidence Score**: AI-calculated probability of signal accuracy

### 3. **Fundamental Analysis**
Access comprehensive fundamental data:
- **Valuation Metrics**: P/E, P/B, Market Cap
- **Profitability**: ROE, ROCE, Profit Margins
- **Financial Health**: Debt-to-Equity, Current Ratio
- **Peer Comparison**: Compare with industry peers

### 4. **AI Chat**
- Ask questions about the analyzed stock
- Get AI-powered insights and recommendations
- Context-aware responses based on current market data

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # App icon
├── src/
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── StockAnalysis.tsx   # Main analysis component
│   │   ├── FundamentalAnalysis.tsx
│   │   ├── AIChat.tsx
│   │   └── ...
│   ├── lib/                    # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # Entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
└── README.md                   # This file
```

## 🎨 Key Components

### `StockAnalysis.tsx`
Main dashboard component featuring:
- Stock symbol input
- Real-time price display
- Signal badges with confidence scores
- Support/Resistance level indicators
- Interactive chart
- Technical metrics cards

### `FundamentalAnalysis.tsx`
Displays comprehensive fundamental data:
- Financial ratios grid
- Peer comparison table
- Growth indicators
- Health score visualization

### `AIChat.tsx`
AI-powered chat interface:
- Message history
- Real-time responses from Google Gemini
- Context-aware stock insights
- Clean, modern chat UI

## 🌐 API Integration

The frontend communicates with the backend API:

```typescript
// Example API calls
GET  /analyze?symbol=RELIANCE        // Technical analysis
GET  /fundamentals?symbol=RELIANCE   // Fundamental data
POST /chat                           // AI chat messages
```

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Configure environment variables (if needed)
5. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Deploy on Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to [Netlify](https://netlify.com)

```bash
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Deploy on GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/StockScopeAI",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Environment Variables

If your backend is not on `localhost:8000`, create a `.env` file:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

Then update your API calls to use `process.env.REACT_APP_API_URL`.

## 📱 Screenshots

### Dashboard
*Beautiful stock analysis dashboard with real-time data*

### Technical Analysis
*ML-based support/resistance levels with confidence scores*

### Fundamental Analysis
*Comprehensive financial metrics and peer comparison*

### AI Chat
*Intelligent stock recommendations powered by Google Gemini*

## 🔧 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // ... other colors
      }
    }
  }
}
```

### Add New Indicators
Create new components in `src/components/` and integrate with the backend API.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Related Repositories

- **Backend API**: [StockScopeAI-backend](https://github.com/Puneet902/StockScopeAI-backend)

## 👨‍💻 Author

**Puneet** - [GitHub Profile](https://github.com/Puneet902)

## 🙏 Acknowledgments

- NSE India for stock data
- Google Gemini for AI capabilities
- ApexCharts for beautiful visualizations
- Tailwind CSS and Radix UI for the design system
- React and TypeScript communities

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

**Built with ❤️ using React, TypeScript, and TailwindCSS**
