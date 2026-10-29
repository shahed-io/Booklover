import { createFileRoute } from "@tanstack/react-router";
import AdminProducts from "@/pages/admin/AdminProducts";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({ meta: [{ title: 'Book Catalog Administration | Booklover' }, { name: 'description', content: 'Manage Booklover books, authors, editions, prices and inventory.' }, { property: 'og:title', content: 'Book Catalog Administration | Booklover' }, { property: 'og:description', content: 'Manage the Booklover book catalog and inventory.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminProducts,
});
