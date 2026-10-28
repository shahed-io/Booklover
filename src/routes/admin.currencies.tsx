import { createFileRoute } from "@tanstack/react-router";
import AdminCurrencies from "@/pages/admin/AdminCurrencies";

export const Route = createFileRoute("/admin/currencies")({
  component: AdminCurrencies,
});
