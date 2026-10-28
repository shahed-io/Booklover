import { createFileRoute } from "@tanstack/react-router";
import AdminAnnouncementBar from "@/pages/admin/AdminAnnouncementBar";

export const Route = createFileRoute("/admin/announcement-bar")({
  component: AdminAnnouncementBar,
});
