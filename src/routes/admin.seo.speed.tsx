import { createFileRoute } from "@tanstack/react-router";
import AdminSpeedOptimization from "@/pages/admin/seo/AdminSpeedOptimization";

export const Route = createFileRoute("/admin/seo/speed")({
  component: AdminSpeedOptimization,
});
