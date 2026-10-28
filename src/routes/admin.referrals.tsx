import { createFileRoute } from "@tanstack/react-router";
import AdminReferrals from "@/pages/admin/AdminReferrals";

export const Route = createFileRoute("/admin/referrals")({
  component: AdminReferrals,
});
