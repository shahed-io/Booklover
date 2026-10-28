import { createFileRoute } from "@tanstack/react-router";
import AdminAiFaqGenerator from "@/pages/admin/AdminAiFaqGenerator";

export const Route = createFileRoute("/admin/ai-faq-generator")({
  component: AdminAiFaqGenerator,
});
