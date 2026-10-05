# OmniTrader Mobile (Expo & React Native)

An institutional multi-market terminal & AI trading assistant built specifically for **Expo Go** on iOS & Android.

## Features
- **Startup Disclaimer Screen:** Dark mode with neon green & blue accents, mandatory risk disclaimer, persistent local storage acceptance (`AsyncStorage`).
- **Live Markets:** PSX (KSE-100), Indian NSE/BSE (Nifty 50), US Equities (NVDA, AAPL), Forex (EUR/USD, GBP/USD), Binance Spot Crypto (BTC, ETH, SOL), and Commodities (Gold, Oil).
- **Omni AI Chart Vision:** Gallery screenshot picker (`expo-image-picker`) with Gemini 1.5/2.5 Flash Vision for automated support/resistance, TP/SL, and order flow bias.
- **Trade Execution & Portfolio:** Simulated contracts with leverage, margin calculation, and Binance API connection modal.

## Quick Start (How to run in Expo Go)

1. Navigate to the `expo-omnitrader` folder:
   ```bash
   cd expo-omnitrader
   ```

2. Install dependencies:
   ```bash
   npx expo install expo-status-bar expo-image-picker expo-linear-gradient expo-haptics @react-native-async-storage/async-storage react-native-svg @expo/vector-icons react-native-safe-area-context
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code using:
   - **Android:** Expo Go app
   - **iOS:** Camera app (opens Expo Go)
