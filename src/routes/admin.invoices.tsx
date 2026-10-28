import { createFileRoute } from "@tanstack/react-router";
import AdminInvoiceGenerator from "@/pages/admin/AdminInvoiceGenerator";

export const Route = createFileRoute("/admin/invoices")({
  component: AdminInvoiceGenerator,
});
