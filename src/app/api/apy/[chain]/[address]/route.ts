import { NextRequest } from "next/server";
import { isAddress } from "viem";

import { chains, isChainKey } from "@/lib/chains";

export const runtime = "nodejs";
export const revalidate = 300;

const KONG_ENDPOINT = "https://kong.yearn.farm/api/gql";

const APY_QUERY = `
  query($chainId: Int!, $address: String!) {
    vault(chainId: $chainId, address: $address) {
      apy {
        net
        weeklyNet
        monthlyNet
        inceptionNet
        grossApr
      }
    }
  }
`;

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

  try {
    const res = await fetch(KONG_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: APY_QUERY,
        variables: { chainId: chains[chain].id, address },
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Kong HTTP ${res.status}`);

    const json = await res.json();
    if (json.errors?.length) {
      throw new Error(json.errors[0].message ?? "Kong returned errors");
    }

    const apy = json.data?.vault?.apy ?? null;
    return Response.json(
      { apy },
      {
        headers: {
          "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 502 });
  }
}
