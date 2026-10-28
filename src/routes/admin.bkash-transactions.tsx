import { createFileRoute } from "@tanstack/react-router";
import AdminBkashTransactions from "@/pages/admin/AdminBkashTransactions";

export const Route = createFileRoute("/admin/bkash-transactions")({
  component: AdminBkashTransactions,
});
