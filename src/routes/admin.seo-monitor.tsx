import { createFileRoute } from "@tanstack/react-router";
import AdminSEOMonitor from "@/pages/admin/AdminSEOMonitor";

export const Route = createFileRoute("/admin/seo-monitor")({
  component: AdminSEOMonitor,
});
