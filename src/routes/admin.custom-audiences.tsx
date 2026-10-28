import { createFileRoute } from "@tanstack/react-router";
import AdminCustomAudiences from "@/pages/admin/AdminCustomAudiences";

export const Route = createFileRoute("/admin/custom-audiences")({
  component: AdminCustomAudiences,
});
