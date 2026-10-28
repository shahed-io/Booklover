import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/components/booklover/CustomerPages";

export const Route = createFileRoute("/contact-us")({
  component: InformationPage,
});
