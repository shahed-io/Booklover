import { createFileRoute } from "@tanstack/react-router";
import AdminMaintenance from "@/pages/admin/AdminMaintenance";

export const Route = createFileRoute("/admin/maintenance")({
  component: AdminMaintenance,
});
