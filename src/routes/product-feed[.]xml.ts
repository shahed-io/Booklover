import { createFileRoute } from "@tanstack/react-router";
import { proxyToBackend } from "@/lib/public-proxy";

export const Route = createFileRoute("/product-feed.xml")({
  server: {
    handlers: {
      GET: ({ request }) => proxyToBackend(request, "/functions/v1/product-feed"),
    },
  },
});
