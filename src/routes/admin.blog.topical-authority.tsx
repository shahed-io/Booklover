import { createFileRoute } from "@tanstack/react-router";
import AdminTopicalAuthority from "@/pages/admin/AdminTopicalAuthority";

export const Route = createFileRoute("/admin/blog/topical-authority")({
  component: AdminTopicalAuthority,
});
