import { createFileRoute } from "@tanstack/react-router";
import AdminWallet from "@/pages/admin/AdminWallet";

export const Route = createFileRoute("/admin/wallet")({
  component: AdminWallet,
});
