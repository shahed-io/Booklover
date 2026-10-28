import { createFileRoute } from "@tanstack/react-router";
import AdminPaymentLinks from "@/pages/admin/AdminPaymentLinks";

export const Route = createFileRoute("/admin/payment-links")({
  component: AdminPaymentLinks,
});
