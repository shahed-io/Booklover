import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/free-tools/$toolId")({
  beforeLoad: () => {
    throw redirect({ to: "/shop", replace: true });
  },
});
