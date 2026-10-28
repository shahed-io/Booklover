import { createFileRoute } from "@tanstack/react-router";
import AdminOutreach from "@/pages/admin/seo/AdminOutreach";

export const Route = createFileRoute("/admin/seo/outreach")({
  component: AdminOutreach,
});
