import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/booklover/CustomerPages";

export const Route = createFileRoute("/wishlist")({
  component: CartPage,
});
