import { createFileRoute } from "@tanstack/react-router";
import AdminProductImportExport from "@/pages/admin/AdminProductImportExport";

export const Route = createFileRoute("/admin/import-export")({
  component: AdminProductImportExport,
});
