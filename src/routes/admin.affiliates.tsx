import { createFileRoute } from "@tanstack/react-router";
import AdminAffiliates from "@/pages/admin/AdminAffiliates";

export const Route = createFileRoute("/admin/affiliates")({
  component: AdminAffiliates,
});
