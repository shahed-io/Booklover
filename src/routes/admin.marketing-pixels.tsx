import { createFileRoute } from "@tanstack/react-router";
import AdminMarketingPixels from "@/pages/admin/AdminMarketingPixels";

export const Route = createFileRoute("/admin/marketing-pixels")({
  component: AdminMarketingPixels,
});
