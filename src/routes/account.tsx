import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/booklover/CustomerPages";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});
