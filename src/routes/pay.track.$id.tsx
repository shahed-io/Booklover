import { createFileRoute } from "@tanstack/react-router";
import PaymentLinkTrack from "@/pages/PaymentLinkTrack";

export const Route = createFileRoute("/pay/track/$id")({
  component: PaymentLinkTrack,
});
