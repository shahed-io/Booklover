import { createFileRoute } from "@tanstack/react-router";
import AdminLiveChat from "@/pages/admin/AdminLiveChat";

export const Route = createFileRoute("/admin/live-chat")({
  component: AdminLiveChat,
});
