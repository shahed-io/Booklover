import { createFileRoute } from "@tanstack/react-router";
import AdminPopupBanner from "@/pages/admin/AdminPopupBanner";

export const Route = createFileRoute("/admin/popup-banner")({
  component: AdminPopupBanner,
});
