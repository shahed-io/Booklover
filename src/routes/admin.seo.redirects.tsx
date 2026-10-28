import { createFileRoute } from "@tanstack/react-router";
import AdminRedirects from "@/pages/admin/seo/AdminRedirects";

export const Route = createFileRoute("/admin/seo/redirects")({
  component: AdminRedirects,
});
