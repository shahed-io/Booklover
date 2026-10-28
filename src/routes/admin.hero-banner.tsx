import { createFileRoute } from "@tanstack/react-router";
import AdminHeroBanner from "@/pages/admin/AdminHeroBanner";

export const Route = createFileRoute("/admin/hero-banner")({
  component: AdminHeroBanner,
});
