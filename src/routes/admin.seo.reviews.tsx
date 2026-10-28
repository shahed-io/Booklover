import { createFileRoute } from "@tanstack/react-router";
import AdminReviews from "@/pages/admin/seo/AdminReviews";

export const Route = createFileRoute("/admin/seo/reviews")({
  component: AdminReviews,
});
