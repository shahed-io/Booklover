import { createFileRoute } from "@tanstack/react-router";
import AdminNotices from "@/pages/admin/AdminNotices";

export const Route = createFileRoute("/admin/notices")({
  component: AdminNotices,
});
