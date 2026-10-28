import { createFileRoute } from "@tanstack/react-router";
import { proxyToBackend } from "@/lib/public-proxy";

export const Route = createFileRoute("/storage/v1/object/public/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => proxyToBackend(request, `/storage/v1/object/public/${params._splat ?? ""}`),
    },
  },
});
