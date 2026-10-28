import { createFileRoute } from "@tanstack/react-router";
import AdminAiReviewGenerator from "@/pages/admin/AdminAiReviewGenerator";

export const Route = createFileRoute("/admin/ai-review-generator")({
  component: AdminAiReviewGenerator,
});
