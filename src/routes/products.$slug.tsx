import { createFileRoute } from "@tanstack/react-router";
import BookloverProduct from "@/components/booklover/ProductPage";

export const Route = createFileRoute("/products/$slug")({
  component: BookloverProduct,
});
