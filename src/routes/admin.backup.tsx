import { createFileRoute } from "@tanstack/react-router";
import AdminBackup from "@/pages/admin/AdminBackup";

export const Route = createFileRoute("/admin/backup")({
  component: AdminBackup,
});
