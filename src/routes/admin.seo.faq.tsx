import { createFileRoute } from "@tanstack/react-router";
import AdminFaqManager from "@/pages/admin/seo/AdminFaqManager";

export const Route = createFileRoute("/admin/seo/faq")({
  component: AdminFaqManager,
});
