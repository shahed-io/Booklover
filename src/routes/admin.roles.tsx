import { createFileRoute } from "@tanstack/react-router";
import AdminRoles from "@/pages/admin/AdminRoles";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRoles,
});
