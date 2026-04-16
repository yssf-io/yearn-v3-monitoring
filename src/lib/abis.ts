export const VaultABI = [
  { inputs: [], name: "name", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "asset", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalAssets", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalIdle", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalDebt", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "pricePerShare", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "deposit_limit", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "minimum_total_idle", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "profitMaxUnlockTime", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "fullProfitUnlockDate", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "isShutdown", outputs: [{ type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "get_default_queue", outputs: [{ type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "api_version", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "accountant", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "role_manager", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "factory", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "use_default_queue", outputs: [{ type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "auto_allocate", outputs: [{ type: "bool" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "address" }],
    name: "strategies",
    outputs: [
      { name: "activation", type: "uint256" },
      { name: "last_report", type: "uint256" },
      { name: "current_debt", type: "uint256" },
      { name: "max_debt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const StrategyABI = [
  { inputs: [], name: "name", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalAssets", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "apiVersion", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ERC20ABI = [
  { inputs: [], name: "symbol", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ type: "uint8" }], stateMutability: "view", type: "function" },
] as const;
