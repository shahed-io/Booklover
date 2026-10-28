import { createFileRoute } from "@tanstack/react-router";
import AdminGoogleAds from "@/pages/admin/AdminGoogleAds";

export const Route = createFileRoute("/admin/google-ads")({
  component: AdminGoogleAds,
});
