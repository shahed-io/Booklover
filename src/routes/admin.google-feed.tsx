import { createFileRoute } from "@tanstack/react-router";
import AdminGoogleFeed from "@/pages/admin/AdminGoogleFeed";

export const Route = createFileRoute("/admin/google-feed")({
  component: AdminGoogleFeed,
});
