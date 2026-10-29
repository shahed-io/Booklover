import { createFileRoute } from "@tanstack/react-router";
import BookloverProduct from "@/components/booklover/ProductPage";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug.replace(/-/g, ' ')} | Booklover Books` }, { name: 'description', content: 'Explore this Booklover book, available editions, cover options and prices.' }, { property: 'og:title', content: `${params.slug.replace(/-/g, ' ')} | Booklover Books` }, { property: 'og:description', content: 'Book details, editions and prices at Booklover Bangladesh.' }, { property: 'og:type', content: 'product' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: BookloverProduct,
});
