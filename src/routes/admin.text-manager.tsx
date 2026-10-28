import { createFileRoute } from "@tanstack/react-router";
import AdminTextManager from "@/pages/admin/AdminTextManager";

export const Route = createFileRoute("/admin/text-manager")({
  component: AdminTextManager,
});
