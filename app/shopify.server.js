import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { CloudflareKVSessionStorage } from "@shopify/shopify-app-session-storage-kv";

// यह function app/entry.server.tsx में use होगा
export function createShopify(env) {
  const sessionStorage = new CloudflareKVSessionStorage({
    kv: env.SESSION_STORAGE,
  });

  return shopifyApp({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecret: env.SHOPIFY_API_SECRET,
    apiVersion: ApiVersion.October24,
    scopes: env.SCOPES?.split(","),
    appUrl: env.SHOPIFY_APP_URL,
    sessionStorage,
    distribution: AppDistribution.AppStore,
    future: {
      unstable_newEmbeddedAuthStrategy: true,
    },
  });
}

export default createShopify;