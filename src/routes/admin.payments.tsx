import { createFileRoute } from "@tanstack/react-router";
import AdminPayments from "@/pages/admin/AdminPayments";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});
