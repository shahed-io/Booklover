import { createFileRoute } from "@tanstack/react-router";
import AdminGoogleIndexing from "@/pages/admin/AdminGoogleIndexing";

export const Route = createFileRoute("/admin/google-indexing")({
  component: AdminGoogleIndexing,
});
