import { createFileRoute } from "@tanstack/react-router";
import AdminOrders from "@/pages/admin/AdminOrders";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: 'Orders and Delivery | Booklover Admin' }, { name: 'description', content: 'Manage Booklover orders, payments and courier tracking.' }, { property: 'og:title', content: 'Orders and Delivery | Booklover Admin' }, { property: 'og:description', content: 'Manage Booklover orders and deliveries.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminOrders,
});
