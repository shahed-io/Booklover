import { createFileRoute } from "@tanstack/react-router";
import AdminQuickSale from "@/pages/admin/AdminQuickSale";

export const Route = createFileRoute("/admin/quick-sale")({
  component: AdminQuickSale,
});
