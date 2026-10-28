// src/lib/mcp/index.ts
import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import listMyOrders from "./tools/list-my-orders";
import searchProducts from "./tools/search-products";
import listMyWalletTransactions from "./tools/list-my-wallet-transactions";

// The OAuth issuer MUST be the direct Supabase host, built from the project ref
// (Vite inlines VITE_SUPABASE_PROJECT_ID at build time, so this stays import-safe).
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "booklover-mcp",
  title: "Booklover",
  version: "0.1.0",
  instructions:
    "Tools for the signed-in Booklover customer. Look up your profile, orders, personal licenses, wallet transactions, and search the public product catalog. All tools act as the authenticated user; Row-Level Security in the database keeps other users' data private.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  // @ts-expect-error mcp-js ToolDefinition sets outputSchema: undefined, which its own AnyToolDefinition rejects under exactOptionalPropertyTypes (upstream typing)
  tools: [getMyProfile, listMyOrders, searchProducts, listMyWalletTransactions],
});
