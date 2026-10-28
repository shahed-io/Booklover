import { createFileRoute } from "@tanstack/react-router";
import AdminBkashPGW from "@/pages/admin/AdminBkashPGW";

export const Route = createFileRoute("/admin/bkash-pgw")({
  component: AdminBkashPGW,
});
