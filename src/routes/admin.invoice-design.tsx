import { createFileRoute } from "@tanstack/react-router";
import AdminInvoiceDesign from "@/pages/admin/AdminInvoiceDesign";

export const Route = createFileRoute("/admin/invoice-design")({
  component: AdminInvoiceDesign,
});
