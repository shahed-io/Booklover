import { createFileRoute } from "@tanstack/react-router";
import AdminSitemap from "@/pages/admin/seo/AdminSitemap";

export const Route = createFileRoute("/admin/seo/sitemap")({
  component: AdminSitemap,
});
