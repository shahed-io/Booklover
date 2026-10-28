import { createFileRoute } from "@tanstack/react-router";
import HelpCenter from "@/pages/HelpCenter";

export const Route = createFileRoute("/link/$slug")({
  component: HelpCenter,
});
