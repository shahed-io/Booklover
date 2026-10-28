import { createFileRoute } from "@tanstack/react-router";
import AdminAttributes from "@/pages/admin/AdminAttributes";

export const Route = createFileRoute("/admin/attributes")({
  component: AdminAttributes,
});
