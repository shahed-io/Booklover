import { createFileRoute } from "@tanstack/react-router";
import AdminPageSeo from "@/pages/admin/seo/AdminPageSeo";

export const Route = createFileRoute("/admin/seo/pages")({
  component: AdminPageSeo,
});
