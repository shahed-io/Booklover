import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/get-cid")({
  beforeLoad: () => {
    throw redirect({ to: "/shop", replace: true });
  },
});
