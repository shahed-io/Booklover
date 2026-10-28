import { createFileRoute } from "@tanstack/react-router";
import AdminRobots from "@/pages/admin/seo/AdminRobots";

export const Route = createFileRoute("/admin/seo/robots")({
  component: AdminRobots,
});
