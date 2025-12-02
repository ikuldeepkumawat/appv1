import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@react-router/dev";
import tsconfigPaths from "vite-tsconfig-paths";

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the Vite server.
// The CLI will eventually stop passing in HOST,
// so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;

let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  server: {
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules"],
    },
  },
  plugins: [
    // Cloudflare Workers के लिए dev proxy plugin
    remixCloudflareDevProxy(),
    
    reactRouter({
      // Cloudflare Workers के लिए server build configuration
      serverBuildFile: "index.js",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    
    tsconfigPaths(),
  ],
  
  build: {
    assetsInlineLimit: 0,
    // Cloudflare Workers के लिए minification
    minify: "esbuild",
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  optimizeDeps: {
    include: [
      "@shopify/app-bridge-react",
      "@shopify/polaris",
    ],
  },
  
  // Cloudflare Workers environment के लिए
  ssr: {
    target: "webworker",
    noExternal: true,
  },
});