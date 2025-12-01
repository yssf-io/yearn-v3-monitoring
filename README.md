# Yearn V3 Vault Monitoring Dashboard

A modern, single-page dashboard to monitor Yearn V3 vaults across multiple chains (Base, Ethereum, Arbitrum, Polygon). Built with Next.js 14, TypeScript, and shadcn/ui.

## Features

- **Multi-Chain Support**: Monitor vaults on Base, Ethereum, Arbitrum, and Polygon.
- **Real-Time Metrics**: View key vault stats like Total Assets, Price Per Share, Idle Funds, and Profit Unlock times.
- **Strategy Tracking**: List all active strategies with detailed performance metrics (Debt, Utilization, Last Report).
- **Robust Data Fetching**: Handles missing contract methods gracefully (e.g., for vaults with limited public ABIs).
- **Optimized RPC Usage**: Uses `multicall` batching to prevent rate limits and ensure fast data loading.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Blockchain**: [viem](https://viem.sh/) for type-safe and efficient Ethereum interactions.
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yearn-v3-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select a chain from the dropdown (e.g., "Base").
2. Paste a valid Yearn V3 Vault address (e.g., `0xb13CF163d916917d9cD6E836905cA5f12a1dEF4B`).
3. Click the search button to load vault data.

## Troubleshooting

- **Rate Limits (429)**: The app uses `multicall` to batch requests. If you still encounter rate limits, try switching the RPC URL in `src/lib/chains.ts`.
- **Missing Data**: Some vaults may not expose all metrics (like `totalIdle`). The app will estimate these values where possible.
