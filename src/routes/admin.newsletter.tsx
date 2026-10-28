import { createFileRoute } from "@tanstack/react-router";
import AdminNewsletterSubscribers from "@/pages/admin/AdminNewsletterSubscribers";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletterSubscribers,
});
