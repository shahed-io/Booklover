import { createFileRoute } from "@tanstack/react-router";
import AdminFooterSettings from "@/pages/admin/AdminFooterSettings";

export const Route = createFileRoute("/admin/footer-settings")({
  component: AdminFooterSettings,
});
