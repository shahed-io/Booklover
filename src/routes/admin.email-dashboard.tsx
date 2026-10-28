import { createFileRoute } from "@tanstack/react-router";
import AdminEmailDashboard from "@/pages/admin/AdminEmailDashboard";

export const Route = createFileRoute("/admin/email-dashboard")({
  component: AdminEmailDashboard,
});
