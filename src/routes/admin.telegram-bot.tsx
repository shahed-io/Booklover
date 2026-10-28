import { createFileRoute } from "@tanstack/react-router";
import AdminTelegramBot from "@/pages/admin/AdminTelegramBot";

export const Route = createFileRoute("/admin/telegram-bot")({
  component: AdminTelegramBot,
});
