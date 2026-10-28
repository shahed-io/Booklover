import { createFileRoute } from "@tanstack/react-router";
import AdminBlogTopics from "@/pages/admin/AdminBlogTopics";

export const Route = createFileRoute("/admin/blog/ai-topics")({
  component: AdminBlogTopics,
});
