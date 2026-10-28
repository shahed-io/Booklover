import { createFileRoute } from "@tanstack/react-router";
import AdminSecurity2FA from "@/pages/admin/AdminSecurity2FA";

export const Route = createFileRoute("/admin/security")({
  component: AdminSecurity2FA,
});
