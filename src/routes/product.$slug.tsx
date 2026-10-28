import { createFileRoute } from "@tanstack/react-router";
import BookloverProduct from "@/components/booklover/ProductPage";

export const Route = createFileRoute("/product/$slug")({
  component: BookloverProduct,
});
