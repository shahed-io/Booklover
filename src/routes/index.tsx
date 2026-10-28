import { createFileRoute } from "@tanstack/react-router";
import Index from "@/components/booklover/Home";
import heroImg from "@/assets/banner-1.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Booklover — Online Bookshop in Bangladesh" },
      { name: "description", content: "Buy original books online at Booklover with fair prices and fast delivery all over Bangladesh." },
      { property: "og:title", content: "Booklover — Online Bookshop in Bangladesh" },
      { property: "og:description", content: "Buy original books online at Booklover with fair prices and fast delivery all over Bangladesh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: heroImg, fetchPriority: "high" }],
  }),
  component: Index,
});
