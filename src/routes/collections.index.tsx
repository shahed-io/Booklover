import { createFileRoute } from "@tanstack/react-router";
import CatalogPage from "@/components/booklover/CatalogPage";

export const Route = createFileRoute("/collections/")({
  component: CatalogPage,
});
