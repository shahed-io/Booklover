import { createFileRoute } from "@tanstack/react-router";
import AdminFacebookPixel from "@/pages/admin/AdminFacebookPixel";

export const Route = createFileRoute("/admin/facebook-pixel")({
  component: AdminFacebookPixel,
});
