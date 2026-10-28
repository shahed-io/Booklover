import { createFileRoute } from "@tanstack/react-router";
import AdminProductSeo from "@/pages/admin/seo/AdminProductSeo";

export const Route = createFileRoute("/admin/seo/products")({
  component: AdminProductSeo,
});
