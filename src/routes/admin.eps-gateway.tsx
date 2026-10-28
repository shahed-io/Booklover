import { createFileRoute } from "@tanstack/react-router";
import AdminEpsGateway from "@/pages/admin/AdminEpsGateway";

export const Route = createFileRoute("/admin/eps-gateway")({
  component: AdminEpsGateway,
});
