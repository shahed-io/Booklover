import { createFileRoute } from "@tanstack/react-router";
import AdminMetaTags from "@/pages/admin/seo/AdminMetaTags";

export const Route = createFileRoute("/admin/seo/meta-tags")({
  component: AdminMetaTags,
});
