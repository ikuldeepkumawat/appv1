import type { Config } from "@react-router/dev/config";

export default {
  // Server bundle के लिए
  serverBuildFile: "index.js",
  
  // Cloudflare Workers के लिए
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  
  // Client build
  buildDirectory: "build",
  publicPath: "/",
  
  // Routes
  appDirectory: "app",
  
  // Future flags
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    unstable_singleFetch: true,
  },
} satisfies Config;