import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/check-key")({
  beforeLoad: () => {
    throw redirect({ to: "/shop", replace: true });
  },
});
