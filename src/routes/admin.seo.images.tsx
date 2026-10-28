import { createFileRoute } from "@tanstack/react-router";
import AdminImageSeo from "@/pages/admin/seo/AdminImageSeo";

export const Route = createFileRoute("/admin/seo/images")({
  component: AdminImageSeo,
});
