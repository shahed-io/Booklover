import { createFileRoute } from "@tanstack/react-router";
import AdminUddoktapayPGW from "@/pages/admin/AdminUddoktapayPGW";

export const Route = createFileRoute("/admin/uddoktapay-pgw")({
  component: AdminUddoktapayPGW,
});
