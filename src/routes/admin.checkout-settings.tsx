import { createFileRoute } from "@tanstack/react-router";
import AdminCheckoutSettings from "@/pages/admin/AdminCheckoutSettings";

export const Route = createFileRoute("/admin/checkout-settings")({
  component: AdminCheckoutSettings,
});
