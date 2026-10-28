import { createFileRoute } from "@tanstack/react-router";
import AdminCategories from "@/pages/admin/AdminCategories";

export const Route = createFileRoute("/admin/categories/new")({
  component: AdminCategories,
});
