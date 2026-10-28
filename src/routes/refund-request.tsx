import { createFileRoute } from "@tanstack/react-router";
import RefundRequest from "@/pages/RefundRequest";

export const Route = createFileRoute("/refund-request")({
  component: RefundRequest,
});
