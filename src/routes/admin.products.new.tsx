import { createFileRoute } from "@tanstack/react-router";
import AdminProducts from "@/pages/admin/AdminProducts";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: 'Add a Book | Booklover Admin' }, { name: 'description', content: 'Add a book to the Booklover catalog.' }, { property: 'og:title', content: 'Add a Book | Booklover Admin' }, { property: 'og:description', content: 'Create a Booklover book catalog entry.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminProducts,
});
