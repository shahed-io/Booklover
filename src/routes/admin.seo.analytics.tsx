import { createFileRoute } from "@tanstack/react-router";
import AdminGoogleAnalytics from "@/pages/admin/seo/AdminGoogleAnalytics";

export const Route = createFileRoute("/admin/seo/analytics")({
  component: AdminGoogleAnalytics,
});
