import { createFileRoute } from "@tanstack/react-router";
import AdminSemrush from "@/pages/admin/AdminSemrush";

export const Route = createFileRoute("/admin/semrush")({
  component: AdminSemrush,
});
