import { createFileRoute } from "@tanstack/react-router";
import AdminCopyProtection from "@/pages/admin/AdminCopyProtection";

export const Route = createFileRoute("/admin/copy-protection")({
  component: AdminCopyProtection,
});
