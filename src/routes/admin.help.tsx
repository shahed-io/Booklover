import { createFileRoute } from "@tanstack/react-router";
import AdminHelp from "@/pages/admin/AdminHelp";

export const Route = createFileRoute("/admin/help")({
  component: AdminHelp,
});
