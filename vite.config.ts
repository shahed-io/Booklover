// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

const SUPABASE_URL = process.env["VITE_SUPABASE_URL"] || "https://tzkmjdcpgkbztxlchdpu.supabase.co";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // The MCP server stays on the backend; this plugin keeps emitting its function entry.
    plugins: [mcpPlugin()],
    server: {
      proxy: {
        "/sitemap.xml": {
          target: `${SUPABASE_URL}/functions/v1/sitemap`,
          changeOrigin: true,
          rewrite: () => "",
        },
      },
    },
  },
});
