import { createFileRoute } from "@tanstack/react-router";
import PaymentLink from "@/pages/PaymentLink";

export const Route = createFileRoute("/pay/$slug")({
  component: PaymentLink,
});
