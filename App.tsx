import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ticker, Position, UserSettings, TradeSide } from './src/types';
import { DisclaimerScreen } from './src/screens/DisclaimerScreen';
import { MarketsScreen } from './src/screens/MarketsScreen';
import { TradeScreen } from './src/screens/TradeScreen';
import { OmniAiScreen } from './src/screens/OmniAiScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { Header } from './src/components/Header';
import { TabBar, ScreenTab } from './src/components/TabBar';
import { ChartAnalysisResult } from './src/services/geminiVisionService';

export default function App() {
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [hasAgreedDisclaimer, setHasAgreedDisclaimer] = useState(false);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('MARKETS');

  // Master Settings
  const [settings, setSettings] = useState<UserSettings>({
    virtualBalance: 50000,
    binanceApiKey: '',
    binanceApiSecret: '',
    isBinanceTestnet: true,
    customGeminiApiKey: '',
    defaultLeverage: 10,
  });

  // Tickers Master List (PSX, NSE, US Stocks, Forex, Binance Crypto, Commodities)
  const [tickers, setTickers] = useState<Ticker[]>([
    // PSX (Pakistan Stock Exchange)
    {
      symbol: 'KSE100.PSX',
      name: 'KSE-100 Index',
      category: 'STOCKS',
      subCategory: 'PSX',
      price: 82345.6,
      change24h: 1.45,
      high24h: 82600.0,
      low24h: 81100.0,
      volume: '145.2M',
      sparkline: [81200, 81400, 81650, 81900, 82100, 82250, 82345],
      currencySymbol: 'pts',
    },
    {
      symbol: 'OGDC.PSX',
      name: 'Oil & Gas Development',
      category: 'STOCKS',
      subCategory: 'PSX',
      price: 148.75,
      change24h: 2.3,
      high24h: 151.2,
      low24h: 145.0,
      volume: '12.8M',
      sparkline: [144, 145.5, 146, 147.2, 148, 148.75],
      currencySymbol: '₨',
    },
    {
      symbol: 'SYS.PSX',
      name: 'Systems Limited',
      category: 'STOCKS',
      subCategory: 'PSX',
      price: 442.3,
      change24h: 3.15,
      high24h: 448.0,
      low24h: 428.0,
      volume: '1.9M',
      sparkline: [428, 432, 435, 439, 442.3],
      currencySymbol: '₨',
    },

    // Indian Stock Exchanges (NSE)
    {
      symbol: 'NIFTY50.NSE',
      name: 'NIFTY 50 Index',
      category: 'STOCKS',
      subCategory: 'NSE',
      price: 25215.3,
      change24h: 0.82,
      high24h: 25300.0,
      low24h: 25050.0,
      volume: '₹34.5K Cr',
      sparkline: [25060, 25120, 25150, 25190, 25215],
      currencySymbol: '₹',
    },
    {
      symbol: 'RELIANCE.NSE',
      name: 'Reliance Industries',
      category: 'STOCKS',
      subCategory: 'NSE',
      price: 3012.45,
      change24h: 1.35,
      high24h: 3040.0,
      low24h: 2975.0,
      volume: '₹1.8K Cr',
      sparkline: [2980, 2995, 3005, 3012],
      currencySymbol: '₹',
    },

    // US Equities
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      category: 'STOCKS',
      subCategory: 'US',
      price: 132.8,
      change24h: 4.25,
      high24h: 134.5,
      low24h: 127.2,
      volume: '112.5M',
      sparkline: [126, 128, 129.5, 131, 132.8],
      currencySymbol: '$',
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      category: 'STOCKS',
      subCategory: 'US',
      price: 228.45,
      change24h: 1.65,
      high24h: 230.1,
      low24h: 224.8,
      volume: '48.2M',
      sparkline: [224, 225.5, 227, 228.45],
      currencySymbol: '$',
    },

    // Forex
    {
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      category: 'FOREX',
      subCategory: 'Majors',
      price: 1.08425,
      change24h: -0.22,
      high24h: 1.0875,
      low24h: 1.0821,
      volume: '145.2K Lots',
      sparkline: [1.087, 1.086, 1.085, 1.08425],
      currencySymbol: '$',
      pipSpread: 0.6,
    },
    {
      symbol: 'GBP/USD',
      name: 'British Pound / USD',
      category: 'FOREX',
      subCategory: 'Majors',
      price: 1.3085,
      change24h: 0.38,
      high24h: 1.312,
      low24h: 1.3032,
      volume: '98.4K Lots',
      sparkline: [1.304, 1.306, 1.3075, 1.3085],
      currencySymbol: '$',
      pipSpread: 0.8,
    },

    // Crypto & Binance Spot
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      category: 'CRYPTO',
      subCategory: 'Binance Spot',
      price: 64850.0,
      change24h: 3.42,
      high24h: 65400.0,
      low24h: 62500.0,
      volume: '$28.4B',
      sparkline: [62500, 63100, 63800, 64200, 64850],
      currencySymbol: '$',
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      category: 'CRYPTO',
      subCategory: 'Binance Spot',
      price: 2642.5,
      change24h: 2.85,
      high24h: 2685.0,
      low24h: 2550.0,
      volume: '$14.2B',
      sparkline: [2550, 2580, 2610, 2642.5],
      currencySymbol: '$',
    },
    {
      symbol: 'SOLUSDT',
      name: 'Solana',
      category: 'CRYPTO',
      subCategory: 'Binance Spot',
      price: 154.2,
      change24h: 5.12,
      high24h: 156.0,
      low24h: 145.5,
      volume: '$4.8B',
      sparkline: [146, 148, 151, 154.2],
      currencySymbol: '$',
    },

    // Commodities
    {
      symbol: 'XAU/USD',
      name: 'Gold Spot',
      category: 'COMMODITIES',
      subCategory: 'Metals',
      price: 2658.4,
      change24h: 0.95,
      high24h: 2664.0,
      low24h: 2640.0,
      volume: '112.4K Lots',
      sparkline: [2642, 2648, 2652, 2658.4],
      currencySymbol: '$',
    },
    {
      symbol: 'OIL_WTI',
      name: 'Crude Oil (WTI)',
      category: 'COMMODITIES',
      subCategory: 'Energy',
      price: 71.85,
      change24h: -1.2,
      high24h: 73.2,
      low24h: 71.4,
      volume: '88.5K Lots',
      sparkline: [73.0, 72.5, 72.1, 71.85],
      currencySymbol: '$',
    },
  ]);

  const [activeTicker, setActiveTicker] = useState<Ticker>(tickers[0]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [prefilledTrade, setPrefilledTrade] = useState<{
    side?: TradeSide;
    tp?: string;
    sl?: string;
  } | undefined>();

  // Check persistent disclaimer state on startup
  useEffect(() => {
    async function loadStorage() {
      try {
        const accepted = await AsyncStorage.getItem('@omni_disclaimer_accepted');
        if (accepted === 'true') {
          setHasAgreedDisclaimer(true);
        }
      } catch (e) {
        // Fallback
      } finally {
        setIsLoadingStorage(false);
      }
    }
    loadStorage();
  }, []);

  // Real-time market tick stream simulation (every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev =>
        prev.map(t => {
          const delta = (Math.random() - 0.49) * 0.003 * t.price;
          const newPrice = Math.max(0.0001, t.price + delta);
          const flicker = delta > 0 ? 'UP' : 'DOWN';
          const newSparkline = [...t.sparkline.slice(1), newPrice];

          return {
            ...t,
            price: newPrice,
            priceFlicker: flicker,
            sparkline: newSparkline,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectTickerToTrade = (ticker: Ticker) => {
    setActiveTicker(ticker);
    setCurrentTab('TRADE');
  };

  const handleApplyTradeLevels = (analysis: ChartAnalysisResult) => {
    const matchedTicker =
      tickers.find(
        t =>
          analysis.assetName.toLowerCase().includes(t.symbol.toLowerCase()) ||
          t.symbol.toLowerCase().includes(analysis.assetName.toLowerCase())
      ) || activeTicker;

    setActiveTicker(matchedTicker);
    setPrefilledTrade({
      side: analysis.bias === 'BEARISH' ? 'SELL' : 'BUY',
      tp: analysis.takeProfit1,
      sl: analysis.stopLoss,
    });
    setCurrentTab('TRADE');
  };

  const handlePlaceOrder = (order: {
    symbol: string;
    assetName: string;
    side: TradeSide;
    orderType: any;
    quantity: number;
    leverage: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    const notional = activeTicker.price * order.quantity;
    const margin = notional / order.leverage;

    if (settings.virtualBalance < margin) {
      alert('Insufficient virtual balance for this margin.');
      return;
    }

    setSettings(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance - margin,
    }));

    const newPos: Position = {
      id: Date.now().toString(),
      symbol: order.symbol,
      assetName: order.assetName,
      side: order.side,
      entryPrice: activeTicker.price,
      quantity: order.quantity,
      leverage: order.leverage,
      margin,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      isOpen: true,
      openTimestamp: Date.now(),
      executionMode: 'SIMULATED',
    };

    setPositions(prev => [newPos, ...prev]);
    alert(`Order Filled: ${order.side} ${order.quantity} ${order.symbol} at $${activeTicker.price.toFixed(2)}`);
    setCurrentTab('PORTFOLIO');
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    const curTicker = tickers.find(t => t.symbol === pos.symbol);
    const curPrice = curTicker ? curTicker.price : pos.entryPrice;
    const diff = pos.side === 'BUY' ? curPrice - pos.entryPrice : pos.entryPrice - curPrice;
    const pnl = diff * pos.quantity;

    setSettings(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance + pos.margin + pnl,
    }));

    setPositions(prev => prev.filter(p => p.id !== id));
  };

  if (isLoadingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00F59B" />
      </View>
    );
  }

  // 1. Mandatory Disclaimer Screen
  if (!hasAgreedDisclaimer) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <DisclaimerScreen onAgree={() => setHasAgreedDisclaimer(true)} />
      </SafeAreaProvider>
    );
  }

  // 2. Main Dashboard & Trading Interface
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Header balance={settings.virtualBalance} />

        <View style={styles.screenWrapper}>
          {currentTab === 'MARKETS' && (
            <MarketsScreen
              tickers={tickers}
              onSelectTicker={handleSelectTickerToTrade}
              onOpenBinanceConfig={() => setCurrentTab('PORTFOLIO')}
              isBinanceConnected={!!settings.binanceApiKey}
            />
          )}

          {currentTab === 'TRADE' && (
            <TradeScreen
              ticker={activeTicker}
              onPlaceOrder={handlePlaceOrder}
              prefilledLevels={prefilledTrade}
            />
          )}

          {currentTab === 'OMNI_AI' && (
            <OmniAiScreen
              apiKey={settings.customGeminiApiKey}
              onApplyTradeLevels={handleApplyTradeLevels}
            />
          )}

          {currentTab === 'PORTFOLIO' && (
            <PortfolioScreen
              balance={settings.virtualBalance}
              positions={positions}
              tickers={tickers}
              onClosePosition={handleClosePosition}
              settings={settings}
              onUpdateSettings={setSettings}
              onReviewDisclaimer={() => setHasAgreedDisclaimer(false)}
            />
          )}
        </View>

        <TabBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          openPositionsCount={positions.filter(p => p.isOpen).length}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#080A0F',
  },
  screenWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#080A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
