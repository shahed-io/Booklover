import { createFileRoute } from "@tanstack/react-router";
import AdminCustomerReviews from "@/pages/admin/AdminReviews";

export const Route = createFileRoute("/admin/customer-reviews")({
  component: AdminCustomerReviews,
});
