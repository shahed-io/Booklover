import { createFileRoute } from "@tanstack/react-router";
import Index from "@/components/booklover/Home";

export const Route = createFileRoute("/")({
  component: Index,
});
