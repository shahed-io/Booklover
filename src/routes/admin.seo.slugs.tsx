import { createFileRoute } from "@tanstack/react-router";
import AdminSlugEditor from "@/pages/admin/seo/AdminSlugEditor";

export const Route = createFileRoute("/admin/seo/slugs")({
  component: AdminSlugEditor,
});
