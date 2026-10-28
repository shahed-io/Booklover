import { createFileRoute } from "@tanstack/react-router";
import AdminSchema from "@/pages/admin/seo/AdminSchema";

export const Route = createFileRoute("/admin/seo/schema")({
  component: AdminSchema,
});
