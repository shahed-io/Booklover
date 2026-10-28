import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/components/booklover/CustomerPages";

export const Route = createFileRoute("/refund-policy")({
  component: InformationPage,
});
