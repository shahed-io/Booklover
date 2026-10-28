import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/components/booklover/CustomerPages";

export const Route = createFileRoute("/delivery-info")({
  component: InformationPage,
});
