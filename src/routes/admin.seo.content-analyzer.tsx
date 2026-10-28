import { createFileRoute } from "@tanstack/react-router";
import AdminContentSeo from "@/pages/admin/seo/AdminContentSeo";

export const Route = createFileRoute("/admin/seo/content-analyzer")({
  component: AdminContentSeo,
});
