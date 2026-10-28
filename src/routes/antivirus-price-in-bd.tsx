import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/antivirus-price-in-bd")({
  beforeLoad: () => {
    throw redirect({ to: "/shop", replace: true });
  },
});
