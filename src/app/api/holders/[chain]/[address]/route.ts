import { NextRequest } from "next/server";
import { isAddress, zeroAddress } from "viem";

import { VaultABI } from "@/lib/abis";
import { getRpcUrls, isChainKey, type ChainKey } from "@/lib/chains";
import { getClient } from "@/lib/viem-client";

export const runtime = "nodejs";
export const revalidate = 300;

const ALCHEMY_PAGE_SIZE = "0x3e8"; // 1000
const MAX_PAGES = 50; // cap at 50k transfers to bound latency

async function fetchTransferRecipients(
  rpcUrl: string,
  contract: string
): Promise<string[]> {
  const recipients = new Set<string>();
  let pageKey: string | undefined;
  let pages = 0;

  while (pages < MAX_PAGES) {
    const body = {
      jsonrpc: "2.0",
      id: pages,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          contractAddresses: [contract],
          category: ["erc20"],
          withMetadata: false,
          excludeZeroValue: false,
          maxCount: ALCHEMY_PAGE_SIZE,
          order: "asc",
          ...(pageKey ? { pageKey } : {}),
        },
      ],
    };
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Alchemy HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(`Alchemy: ${json.error.message}`);

    for (const t of json.result?.transfers ?? []) {
      if (t?.to && t.to.toLowerCase() !== zeroAddress) {
        recipients.add(t.to.toLowerCase());
      }
    }

    pageKey = json.result?.pageKey;
    pages++;
    if (!pageKey) break;
  }

  return [...recipients];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chain: string; address: string }> }
) {
  const { chain, address } = await params;
  if (!isChainKey(chain)) {
    return Response.json({ error: "Unsupported chain" }, { status: 400 });
  }
  if (!isAddress(address)) {
    return Response.json({ error: "Invalid address" }, { status: 400 });
  }

  const alchemyUrl = getRpcUrls(chain).find((u) => u.includes("alchemy"));
  if (!alchemyUrl) {
    return Response.json({
      count: null,
      reason:
        "Holder enumeration requires an Alchemy RPC. Set NEXT_PUBLIC_RPC_" +
        chain.toUpperCase() +
        " to an Alchemy URL.",
    });
  }

  try {
    const candidates = await fetchTransferRecipients(alchemyUrl, address);
    if (candidates.length === 0) {
      return Response.json(
        { count: 0, checked: 0 },
        { headers: cacheHeaders() }
      );
    }

    const client = getClient(chain as ChainKey);
    const balances = await client.multicall({
      contracts: candidates.map(
        (a) =>
          ({
            address: address as `0x${string}`,
            abi: VaultABI,
            functionName: "balanceOf",
            args: [a as `0x${string}`],
          }) as const
      ),
      allowFailure: true,
    });

    let count = 0;
    for (const r of balances) {
      if (r.status === "success" && (r.result as bigint) > 0n) count++;
    }

    return Response.json(
      { count, checked: candidates.length },
      { headers: cacheHeaders() }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 502 });
  }
}

function cacheHeaders() {
  return {
    "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
  };
}
