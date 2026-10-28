import { createFileRoute } from "@tanstack/react-router";
import AdminOrders from "@/pages/admin/AdminOrders";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});
