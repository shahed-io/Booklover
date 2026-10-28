import { createFileRoute } from "@tanstack/react-router";
import PublicNotices from "@/pages/PublicNotices";

export const Route = createFileRoute("/notices/$slug")({
  component: PublicNotices,
});
