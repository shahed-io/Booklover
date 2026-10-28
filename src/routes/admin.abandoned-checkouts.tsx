import { createFileRoute } from "@tanstack/react-router";
import AdminAbandonedCheckouts from "@/pages/admin/AdminAbandonedCheckouts";

export const Route = createFileRoute("/admin/abandoned-checkouts")({
  component: AdminAbandonedCheckouts,
});
