import { fallback, http } from "@wagmi/core";
import { type Chain } from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi";

import { chainList, type ZkSyncNetwork } from "@/data/networks";

const portalRuntimeConfig = usePortalRuntimeConfig();

const metadata = {
  name: "zkSync Portal",
  description: "zkSync Portal - view balances, transfer and bridge tokens",
  url: "https://portal.zksync.xertra.com",
  icons: ["https://portal.zksync.xertra.com/icon.png"],
};

if (!portalRuntimeConfig.walletConnectProjectId) {
  throw new Error("WALLET_CONNECT_PROJECT_ID is not set. Please set it in .env file");
}

const zkXertra = {
  id: 106106,
  name: "zkXertra",
  network: "zkxertra",
  nativeCurrency: {
    decimals: 18,
    name: "STRAX",
    symbol: "STRAX",
  },
  rpcUrls: {
    default: {
      http: ["https://zksync.rpc.xertra.com"],
      webSocket: ["wss://zksync.rpc.xertra.com/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "zkXertra Explorer",
      url: "https://zkxertra.explorer.xertra.com",
    },
  },
};

const zkAuroria = {
  id: 206206,
  name: "zkAuroria",
  network: "zkauroria",
  nativeCurrency: {
    decimals: 18,
    name: "STRAX",
    symbol: "STRAX",
  },
  rpcUrls: {
    default: {
      http: ["https://auroria.zksync.rpc.xertra.com"],
      webSocket: ["wss://auroria.zksync.rpc.xertra.com/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "zkAuroria Explorer",
      url: "https://zkauroria.explorer.xertra.com",
    },
  },
};

const useExistingEraChain = (network: ZkSyncNetwork) => {
  const existingNetworks = [zkXertra, zkAuroria];
  return existingNetworks.find((existingNetwork) => existingNetwork.id === network.id);
};
const formatZkSyncChain = (network: ZkSyncNetwork) => {
  return {
    id: network.id,
    name: network.name,
    network: network.key,
    nativeCurrency: { name: "STRAX", symbol: "STRAX", decimals: 18 },
    rpcUrls: {
      default: { http: [network.rpcUrl] },
      public: { http: [network.rpcUrl] },
    },
    blockExplorers: network.blockExplorerUrl
      ? {
          default: {
            name: "Explorer",
            url: network.blockExplorerUrl,
          },
        }
      : undefined,
  };
};

const getAllChains = () => {
  const chains: Chain[] = [];
  const addUniqueChain = (chain: Chain) => {
    if (!chains.some((existingChain) => existingChain.id === chain.id)) {
      chains.push(chain);
    }
  };
  for (const network of chainList) {
    addUniqueChain(useExistingEraChain(network) ?? formatZkSyncChain(network));
    if (network.l1Network) {
      addUniqueChain(network.l1Network);
    }
  }

  return chains;
};

const chains = getAllChains();
export const wagmiConfig = defaultWagmiConfig({
  chains: getAllChains() as any,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, fallback(chain.rpcUrls.default.http.map((e) => http(e)))])
  ),
  projectId: portalRuntimeConfig.walletConnectProjectId,
  metadata,
  enableCoinbase: false,
});
