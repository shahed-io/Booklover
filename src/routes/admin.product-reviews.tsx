import { createFileRoute } from "@tanstack/react-router";
import AdminProductReviews from "@/pages/admin/AdminProductReviews";

export const Route = createFileRoute("/admin/product-reviews")({
  component: AdminProductReviews,
});
