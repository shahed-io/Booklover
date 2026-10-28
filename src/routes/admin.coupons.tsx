import { createFileRoute } from "@tanstack/react-router";
import AdminCoupons from "@/pages/admin/AdminCoupons";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});
