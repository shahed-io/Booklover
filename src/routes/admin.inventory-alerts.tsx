import { createFileRoute } from "@tanstack/react-router";
import AdminInventoryAlerts from "@/pages/admin/AdminInventoryAlerts";

export const Route = createFileRoute("/admin/inventory-alerts")({
  head: () => ({ meta: [{ title: 'Book Stock Alerts | Booklover Admin' }, { name: 'description', content: 'Monitor book and binding inventory at Booklover.' }, { property: 'og:title', content: 'Book Stock Alerts | Booklover Admin' }, { property: 'og:description', content: 'Booklover book stock and replenishment alerts.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminInventoryAlerts,
});
