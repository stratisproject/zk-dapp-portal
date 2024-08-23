import { stratis, auroria } from "@wagmi/core/chains";

import Hyperchains from "@/hyperchains/config.json";
import { PUBLIC_L1_CHAINS, type Config } from "@/scripts/hyperchains/common";

import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";

const portalRuntimeConfig = usePortalRuntimeConfig();

export const l1Networks = {
  stratis,
  auroria,
} as const;
export type L1Network = Chain;

export type ZkSyncNetwork = {
  id: number;
  key: string;
  name: string;
  rpcUrl: string;
  hidden?: boolean; // If set to true, the network will not be shown in the network selector
  deprecated?: boolean;
  l1Network?: L1Network;
  blockExplorerUrl?: string;
  blockExplorerApi?: string;
  displaySettings?: {
    showPartnerLinks?: boolean;
  };
  getTokens?: () => Token[] | Promise<Token[]>; // If blockExplorerApi is specified, tokens will be fetched from there. Otherwise, this function will be used.
};

// See the official documentation on running a local zkSync node: https://era.zksync.io/docs/tools/testing/
// Also see the guide in the README.md file in the root of the repository.

// In-memory node default config. Docs: https://era.zksync.io/docs/tools/testing/era-test-node.html
export const inMemoryNode: ZkSyncNetwork = {
  id: 260,
  key: "in-memory-node",
  name: "In-memory node",
  rpcUrl: "http://localhost:8011",
};

// Dockerized local setup default config. Docs: https://era.zksync.io/docs/tools/testing/dockerized-testing.html
export const dockerizedNode: ZkSyncNetwork = {
  id: 270,
  key: "dockerized-node",
  name: "Dockerized local node",
  rpcUrl: "http://localhost:3050",
  l1Network: {
    id: 9,
    name: "Ethereum Local Node",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["http://localhost:8545"] },
      public: { http: ["http://localhost:8545"] },
    },
  },
};

const publicChains: ZkSyncNetwork[] = [
  {
    id: 106106,
    key: "stratis",
    name: "zkSync Stratis",
    rpcUrl: "https://zksync.rpc.stratisplatform.com",
    blockExplorerUrl: "https://explorer.zksync.stratisplatform.com",
    blockExplorerApi: "https://explorer-api.zksync.stratisplatform.com",
    displaySettings: {
      showPartnerLinks: false,
    },
    l1Network: l1Networks.stratis,
  },
  {
    id: 206206,
    key: "auroria",
    name: "zkSync Auroria Testnet",
    rpcUrl: "https://auroria.zksync.rpc.stratisplatform.com",
    blockExplorerUrl: "https://auroria.explorer.zksync.stratisplatform.com",
    blockExplorerApi: "https://auroria.explorer-api.zksync.stratisplatform.com",
    displaySettings: {
      showPartnerLinks: false,
    },
    l1Network: l1Networks.auroria,
  },
];

const getHyperchains = (): ZkSyncNetwork[] => {
  const hyperchains = Hyperchains as Config;
  return hyperchains.map((e) => {
    const network: ZkSyncNetwork = {
      ...e.network,
      getTokens: () => e.tokens,
    };
    if (e.network.publicL1NetworkId) {
      network.l1Network = PUBLIC_L1_CHAINS.find((chain) => chain.id === e.network.publicL1NetworkId);
      if (!network.l1Network) {
        throw new Error(
          `L1 network with ID ${e.network.publicL1NetworkId} from ${network.name} config wasn't found in the list of public L1 networks.`
        );
      }
    }
    return network;
  });
};

const nodeType = portalRuntimeConfig.nodeType;
const determineChainList = (): ZkSyncNetwork[] => {
  switch (nodeType) {
    case "memory":
      return [inMemoryNode];
    case "dockerized":
      return [dockerizedNode];
    case "hyperchain":
      return getHyperchains();
    default:
      return [...publicChains];
  }
};
export const isCustomNode = !!nodeType;
export const chainList: ZkSyncNetwork[] = determineChainList();
export const defaultNetwork = chainList[0];
