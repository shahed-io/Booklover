import { createFileRoute } from "@tanstack/react-router";
import AdminAiConfig from "@/pages/admin/AdminAiConfig";

export const Route = createFileRoute("/admin/ai-config")({
  component: AdminAiConfig,
});
