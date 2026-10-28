import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";

import appCss from "../styles.css?url";
import bookloverCss from "../components/booklover/booklover.css?url";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScraperShield } from "@/components/ScraperShield";
import { useLocation } from "@/lib/router-compat";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useMaintenanceMode, isPathUnderMaintenance } from "@/hooks/useMaintenanceMode";
import { CartProvider, useCart } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { useAdminOrderNotification } from "@/hooks/useAdminOrderNotification";
import { prefetchOnIdle } from "@/hooks/usePrefetchRoute";
import { ViewTransitions } from "@/components/ViewTransitions";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useCustomAudiences } from "@/hooks/useCustomAudiences";
import { useMarketingPixelsPageView } from "@/hooks/useMarketingPixelsPageView";
import { CartDrawer as BookloverCartDrawer } from "@/components/booklover/Layout";
import PostLoginRedirect from "@/components/store/PostLoginRedirect";
import NotFound from "@/pages/NotFound";

const RedirectEnforcer = lazy(() => import("@/components/seo/RedirectEnforcer"));
const FacebookPixel = lazy(() => import("@/components/store/FacebookPixel"));
const GoogleTracking = lazy(() => import("@/components/store/GoogleTracking"));
const MarketingPixels = lazy(() => import("@/components/store/MarketingPixels"));
const MobileBottomNav = lazy(() => import("@/components/store/MobileBottomNav"));
const MaintenanceScreen = lazy(() => import("@/components/store/MaintenanceScreen"));

const SITE_TITLE = "Booklover | Online Bookshop Bangladesh";
const SITE_DESCRIPTION =
  "Browse books, explore collections and find your next favourite read at Booklover Bangladesh.";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Assistant:wght@400;600;700&display=swap";

const THEME_BOOTSTRAP = `try{if(localStorage.getItem('bl-theme')!=='white')document.documentElement.classList.add('bl-pre-dark')}catch(e){document.documentElement.classList.add('bl-pre-dark')}`;

const CRITICAL_CSS = `
html { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
body {
  background: #ffffff; margin: 0;
  -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
  -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent;
}
input, textarea, select, [contenteditable="true"],
.allow-select, .allow-copy, .prose, .prose *,
.product-description, .product-description *,
.blog-content, .blog-content *,
[data-allow-select="true"], [data-allow-select="true"] * {
  -webkit-user-select: text; -ms-user-select: text; user-select: text; -webkit-touch-callout: default;
}
img, video { -webkit-user-drag: none; -khtml-user-drag: none; user-drag: none; }
@media print { body { display: none !important; }
  body::after { content: '© Booklover — Printing protected.'; display: block !important; }
}
html.bl-pre-dark body { background: #35312f; }
`;

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "Booklover", url: "https://booklover.com.bd", logo: "https://booklover.com.bd/logo.png" },
    {
      "@type": "WebSite",
      name: "Booklover",
      url: "https://booklover.com.bd",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://booklover.com.bd/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
      { name: "theme-color", content: "#35312f" },
      { name: "google", content: "notranslate" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "keywords", content: "Booklover, books Bangladesh, online bookshop" },
      { name: "author", content: "Booklover" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large" },
      { name: "geo.region", content: "BD" },
      { name: "geo.placename", content: "Dhaka, Bangladesh" },
      { name: "language", content: "bn" },
      { name: "revisit-after", content: "3 days" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Booklover" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: "https://booklover.com.bd" },
      { property: "og:locale", content: "bn_BD" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Booklover" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "copyright", content: "© Booklover — Proprietary design. Automated scraping & UI cloning prohibited." },
      { name: "rights", content: "All visual designs, layouts and component styles are proprietary and protected." },
      { name: "ai-content-declaration", content: "no-clone, no-design-copy, content-may-be-cited-with-attribution" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: bookloverCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "alternate", type: "application/rss+xml", title: "Booklover – Blog Feed", href: "/rss.xml" },
      { rel: "sitemap", type: "application/xml", title: "Sitemap", href: "/sitemap.xml" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "preload", as: "image", href: "/logo-loader.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://tzkmjdcpgkbztxlchdpu.supabase.co", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://tzkmjdcpgkbztxlchdpu.supabase.co" },
      { rel: "preconnect", href: "https://connect.facebook.net" },
      { rel: "dns-prefetch", href: "https://connect.facebook.net" },
      { rel: "stylesheet", href: FONTS_HREF },
      { rel: "alternate", type: "text/markdown", title: "LLM-friendly index", href: "/llms.txt" },
      { rel: "alternate", type: "text/markdown", title: "LLM-friendly full content", href: "/llms-full.txt" },
    ],
    styles: [{ children: CRITICAL_CSS }],
    scripts: [
      { children: THEME_BOOTSTRAP },
      { type: "application/ld+json", children: STRUCTURED_DATA },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" translate="no" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // ported from main.tsx — toggle html.is-scrolling during scroll on desktop
  // so heavy blur effects can be neutralised (see styles.css).
  useEffect(() => {
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768;
    if (isTouch) return;
    let scrollTimer: number | undefined;
    let ticking = false;
    const root = document.documentElement;
    const onScroll = () => {
      if (!ticking) {
        root.classList.add("is-scrolling");
        ticking = true;
      }
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
        ticking = false;
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HelmetProvider>
      <ScraperShield>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <CurrencyProvider>
                <CartProvider>
                  <WishlistProvider>
                    <AppShell />
                  </WishlistProvider>
                </CartProvider>
              </CurrencyProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ScraperShield>
    </HelmetProvider>
  );
}

// Admin notification listener (only active when user is admin)
function AdminNotificationListener() {
  const { isAdmin } = useAuth();
  useAdminOrderNotification(isAdmin);
  return null;
}

function AppShell() {
  const location = useLocation();
  const [deferReady, setDeferReady] = useState(false);
  useTheme();
  const { subtotal } = useCart();
  const { isAdmin } = useAuth();
  const { settings: maintenance, loading: maintenanceLoading } = useMaintenanceMode();
  useCustomAudiences({ cartValue: subtotal });
  useMarketingPixelsPageView();

  useEffect(() => {
    const id = requestAnimationFrame(() => setDeferReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    prefetchOnIdle(["/shop", "/product/", "/checkout", "/blog", "/dashboard", "/contact", "/about", "/faqs"], 1500);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) document.body.classList.add("admin-page");
    else document.body.classList.remove("admin-page");
  }, [location.pathname]);

  const isAdminArea = location.pathname.startsWith("/admin");
  if (!maintenanceLoading && !isAdminArea && !isAdmin && isPathUnderMaintenance(maintenance, location.pathname)) {
    return (
      <Suspense fallback={null}>
        <MaintenanceScreen settings={maintenance} />
      </Suspense>
    );
  }

  return (
    <>
      {deferReady && (
        <Suspense fallback={null}>
          <AdminNotificationListener />
          <FacebookPixel />
          <GoogleTracking />
          <MarketingPixels />
          {!isAdminArea && <BookloverCartDrawer />}
          <RedirectEnforcer />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <PostLoginRedirect />
      </Suspense>
      <ScrollToTop />
      <ViewTransitions />
      <Outlet />
      {deferReady && isAdminArea && (
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      )}
    </>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold mb-2">This page didn't load</h1>
        <p className="text-muted-foreground mb-6">
          পেজটি লোড করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।
        </p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link to="/" className="px-4 py-2 rounded-md border border-border">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
