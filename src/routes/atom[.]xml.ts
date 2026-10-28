import { createFileRoute } from "@tanstack/react-router";
import { proxyToBackend } from "@/lib/public-proxy";

export const Route = createFileRoute("/atom.xml")({
  server: {
    handlers: {
      GET: ({ request }) => proxyToBackend(request, "/functions/v1/rss-feed"),
    },
  },
});
