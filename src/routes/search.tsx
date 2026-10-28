import { createFileRoute } from "@tanstack/react-router";
import CatalogPage from "@/components/booklover/CatalogPage";

export const Route = createFileRoute("/search")({
  component: CatalogPage,
});
