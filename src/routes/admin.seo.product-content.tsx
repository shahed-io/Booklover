import { createFileRoute } from "@tanstack/react-router";
import AdminProductContent from "@/pages/admin/seo/AdminProductContent";

export const Route = createFileRoute("/admin/seo/product-content")({
  component: AdminProductContent,
});
