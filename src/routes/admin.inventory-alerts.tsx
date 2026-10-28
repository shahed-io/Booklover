import { createFileRoute } from "@tanstack/react-router";
import AdminInventoryAlerts from "@/pages/admin/AdminInventoryAlerts";

export const Route = createFileRoute("/admin/inventory-alerts")({
  component: AdminInventoryAlerts,
});
