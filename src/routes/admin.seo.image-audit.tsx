import { createFileRoute } from "@tanstack/react-router";
import AdminImageAudit from "@/pages/admin/seo/AdminImageAudit";

export const Route = createFileRoute("/admin/seo/image-audit")({
  component: AdminImageAudit,
});
