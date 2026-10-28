import { createFileRoute } from "@tanstack/react-router";
import AccountGate from "@/components/booklover/AccountGate";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "My Account | Booklover" },
    { name: "description", content: "Sign in to Booklover to see your orders, wishlist and profile." },
    { property: "og:title", content: "My Account | Booklover" },
    { property: "og:description", content: "Sign in to Booklover to see your orders, wishlist and profile." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AccountGate,
});
