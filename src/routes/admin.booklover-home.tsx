import { createFileRoute } from "@tanstack/react-router";
import AdminBookloverHome from "@/pages/admin/AdminBookloverHome";

export const Route = createFileRoute("/admin/booklover-home")({
  component: AdminBookloverHome,
});
