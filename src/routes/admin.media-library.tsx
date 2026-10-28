import { createFileRoute } from "@tanstack/react-router";
import AdminMediaLibrary from "@/pages/admin/AdminMediaLibrary";

export const Route = createFileRoute("/admin/media-library")({
  component: AdminMediaLibrary,
});
