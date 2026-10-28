import { createFileRoute } from "@tanstack/react-router";
import AdminTickets from "@/pages/admin/AdminTickets";

export const Route = createFileRoute("/admin/tickets")({
  component: AdminTickets,
});
