import { createFileRoute } from "@tanstack/react-router";
import AdminBrokenLinks from "@/pages/admin/seo/AdminBrokenLinks";

export const Route = createFileRoute("/admin/seo/broken-links")({
  component: AdminBrokenLinks,
});
