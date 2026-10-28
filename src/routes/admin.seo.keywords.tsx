import { createFileRoute } from "@tanstack/react-router";
import AdminKeywords from "@/pages/admin/seo/AdminKeywords";

export const Route = createFileRoute("/admin/seo/keywords")({
  component: AdminKeywords,
});
