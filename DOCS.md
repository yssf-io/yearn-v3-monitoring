# Documentation

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application logic and state management
│   ├── layout.tsx        # Root layout with font and metadata configuration
│   └── globals.css       # Global styles and Tailwind directives
├── components/
│   ├── vault-input.tsx   # Form for chain selection and address input
│   ├── vault-overview.tsx# Grid display of key vault metrics
│   ├── strategy-list.tsx # Container for strategy cards
│   ├── strategy-card.tsx # Individual strategy performance card
│   └── ui/               # Reusable shadcn/ui components
└── lib/
    ├── abis.ts           # Contract ABIs (Vault, Strategy, ERC20)
    ├── chains.ts         # Chain configuration and RPC URLs
    ├── viem-client.ts    # viem client setup with multicall support
    ├── format.ts         # Utilities for formatting numbers, dates, and addresses
    └── types.ts          # Shared TypeScript interfaces
```

## Key Components

### `VaultInput`
- Handles user input for chain and vault address.
- Validates input before submission.
- **Layout**: Compact design with the chain selector positioned between the input and submit button.

### `VaultOverview`
- Displays high-level metrics: Total Assets, PPS, Idle, Debt, Deposit Limit, and Profit Unlock.
- **Graceful Degradation**: Handles missing data (e.g., `totalIdle`) by calculating fallbacks or showing defaults.

### `StrategyList` & `StrategyCard`
- Iterates through the vault's default queue to fetch active strategies.
- Displays current debt, max debt, utilization (calculated as `current / max`), and time since last report.

## Data Fetching Strategy

The application uses **viem** for blockchain interaction, prioritizing performance and reliability.

1. **Multicall Batching**:
   - All reads are batched using `multicall: true` in the viem client.
   - This significantly reduces the number of HTTP requests, preventing 429 Rate Limit errors on public RPCs.

2. **Parallel Execution**:
   - `Promise.all` is used to fetch independent data concurrently (e.g., vault metrics, asset details, and strategy list).

3. **Resilience**:
   - `Promise.allSettled` is used for optional or unstable contract methods (like `totalIdle` or `isShutdown`).
   - If a method fails (common with different Yearn V3 implementations), the app falls back to calculated values or safe defaults.

## Design Decisions

- **Client-Side Fetching**: Data is fetched client-side (`use client`) to allow for immediate user interaction and dynamic updates without server-side complexity.
- **TailwindCSS**: Used for rapid, responsive styling.
- **shadcn/ui**: Provides accessible, high-quality component primitives (Select, Card, Input) that are easily customizable.
