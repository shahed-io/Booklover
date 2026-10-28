import { createFileRoute } from "@tanstack/react-router";
import { Footer as BookloverFooter } from "@/components/booklover/Layout";
import { Header as BookloverHeader } from "@/components/booklover/Layout";
import { ThemeShell as BookloverThemeShell } from "@/components/booklover/Layout";
import Checkout from "@/pages/Checkout";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <BookloverThemeShell className="booklover-checkout"><BookloverHeader /><Checkout /><BookloverFooter /></BookloverThemeShell>
  ),
});
