import { createFileRoute } from "@tanstack/react-router";
import AdminSearchConsole from "@/pages/admin/seo/AdminSearchConsole";

export const Route = createFileRoute("/admin/seo/search-console")({
  component: AdminSearchConsole,
});
