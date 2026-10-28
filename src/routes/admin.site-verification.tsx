import { createFileRoute } from "@tanstack/react-router";
import AdminSiteVerification from "@/pages/admin/AdminSiteVerification";

export const Route = createFileRoute("/admin/site-verification")({
  component: AdminSiteVerification,
});
