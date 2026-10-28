import { createFileRoute } from "@tanstack/react-router";
import AdminFlashSale from "@/pages/admin/AdminFlashSale";

export const Route = createFileRoute("/admin/flash-sale")({
  component: AdminFlashSale,
});
