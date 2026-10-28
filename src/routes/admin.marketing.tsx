import { createFileRoute } from "@tanstack/react-router";
import AdminMarketing from "@/pages/admin/AdminMarketing";

export const Route = createFileRoute("/admin/marketing")({
  component: AdminMarketing,
});
