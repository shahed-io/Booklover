/**
 * useAdminPrefetch — Eager-loads all admin sub-page chunks during browser idle time.
 *
 * When an admin lands on /admin, this hook fires off all admin route imports in the
 * background so subsequent menu clicks resolve INSTANTLY (no network/parse delay).
 *
 * Strategy:
 *  - Wave 1 (immediate): Top-used pages (Orders, Products, Customers, Payments)
 *  - Wave 2 (idle, ~500ms): Catalog + Marketing
 *  - Wave 3 (idle, ~1500ms): SEO, System, Integrations
 */
import { useEffect } from 'react';

const _started = new Set<string>();

const safeImport = (key: string, fn: () => Promise<unknown>) => {
  if (_started.has(key)) return;
  _started.add(key);
  fn().catch(() => _started.delete(key));
};

const idle = (cb: () => void, delay = 0) => {
  if (typeof window === 'undefined') return;
  const run = () => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(cb, { timeout: 2500 });
    } else {
      setTimeout(cb, 50);
    }
  };
  if (delay > 0) setTimeout(run, delay);
  else run();
};

export function useAdminPrefetch() {
  useEffect(() => {
    // ── Wave 1: HOT pages (load immediately during idle) ─────────────────────
    idle(() => {
      safeImport('orders', () => import('@/pages/admin/AdminOrders'));
      safeImport('products', () => import('@/pages/admin/AdminProducts'));
      safeImport('customers', () => import('@/pages/admin/AdminCustomers'));
      safeImport('payments', () => import('@/pages/admin/AdminPayments'));
      safeImport('quick-sale', () => import('@/pages/admin/AdminQuickSale'));
      safeImport('invoices', () => import('@/pages/admin/AdminInvoiceGenerator'));
      safeImport('tickets', () => import('@/pages/admin/AdminTickets'));
    }, 200);

    // ── Wave 2: Catalog + Customer + Marketing ───────────────────────────────
    idle(() => {
      safeImport('categories', () => import('@/pages/admin/AdminCategories'));
      safeImport('attributes', () => import('@/pages/admin/AdminAttributes'));
      safeImport('inventory-alerts', () => import('@/pages/admin/AdminInventoryAlerts'));
      safeImport('product-reviews', () => import('@/pages/admin/AdminProductReviews'));
      safeImport('import-export', () => import('@/pages/admin/AdminProductImportExport'));
      safeImport('wallet', () => import('@/pages/admin/AdminWallet'));
      safeImport('live-chat', () => import('@/pages/admin/AdminLiveChat'));
      safeImport('newsletter', () => import('@/pages/admin/AdminNewsletterSubscribers'));
      safeImport('coupons', () => import('@/pages/admin/AdminCoupons'));
      safeImport('referrals', () => import('@/pages/admin/AdminReferrals'));
      safeImport('affiliates', () => import('@/pages/admin/AdminAffiliates'));
      safeImport('marketing', () => import('@/pages/admin/AdminMarketing'));
    }, 800);

    // ── Wave 3: Storefront + Reports + AI + Settings ─────────────────────────
    idle(() => {
      safeImport('hero-banner', () => import('@/pages/admin/AdminHeroBanner'));
      safeImport('flash-sale', () => import('@/pages/admin/AdminFlashSale'));
      safeImport('testimonials', () => import('@/pages/admin/AdminTestimonials'));
      safeImport('announcement-bar', () => import('@/pages/admin/AdminAnnouncementBar'));
      safeImport('popup-banner', () => import('@/pages/admin/AdminPopupBanner'));
      safeImport('pages', () => import('@/pages/admin/AdminPages'));
      safeImport('footer-settings', () => import('@/pages/admin/AdminFooterSettings'));
      safeImport('themes', () => import('@/pages/admin/AdminThemes'));
      safeImport('blog', () => import('@/pages/admin/AdminBlog'));
      safeImport('help', () => import('@/pages/admin/AdminHelp'));
      safeImport('media-library', () => import('@/pages/admin/AdminMediaLibrary'));
      safeImport('reports', () => import('@/pages/admin/AdminReports'));
      safeImport('ai-config', () => import('@/pages/admin/AdminAiConfig'));
    }, 1800);

    // ── Wave 4: Integrations + System + Pixels + SEO sub-pages ───────────────
    idle(() => {
      safeImport('telegram-bot', () => import('@/pages/admin/AdminTelegramBot'));
      safeImport('staff', () => import('@/pages/admin/AdminStaffManagement'));
      safeImport('roles', () => import('@/pages/admin/AdminRoles'));
      safeImport('backup', () => import('@/pages/admin/AdminBackup'));
      safeImport('settings', () => import('@/pages/admin/AdminSettings'));
      safeImport('facebook-pixel', () => import('@/pages/admin/AdminFacebookPixel'));
      safeImport('custom-audiences', () => import('@/pages/admin/AdminCustomAudiences'));
      safeImport('google-ads', () => import('@/pages/admin/AdminGoogleAds'));
      safeImport('marketing-pixels', () => import('@/pages/admin/AdminMarketingPixels'));
      safeImport('seo', () => import('@/pages/admin/AdminSEO'));
      safeImport('site-verification', () => import('@/pages/admin/AdminSiteVerification'));
    }, 3000);

    // ── Wave 5: SEO sub-pages (lowest priority) ──────────────────────────────
    idle(() => {
      safeImport('seo-meta', () => import('@/pages/admin/seo/AdminMetaTags'));
      safeImport('seo-sitemap', () => import('@/pages/admin/seo/AdminSitemap'));
      safeImport('seo-robots', () => import('@/pages/admin/seo/AdminRobots'));
      safeImport('seo-schema', () => import('@/pages/admin/seo/AdminSchema'));
      safeImport('seo-keywords', () => import('@/pages/admin/seo/AdminKeywords'));
      safeImport('seo-pages', () => import('@/pages/admin/seo/AdminPageSeo'));
      safeImport('seo-products', () => import('@/pages/admin/seo/AdminProductSeo'));
      safeImport('seo-faq', () => import('@/pages/admin/seo/AdminFaqManager'));
      safeImport('seo-reviews', () => import('@/pages/admin/seo/AdminReviews'));
      safeImport('seo-analytics', () => import('@/pages/admin/seo/AdminGoogleAnalytics'));
      safeImport('seo-search-console', () => import('@/pages/admin/seo/AdminSearchConsole'));
      safeImport('seo-speed', () => import('@/pages/admin/seo/AdminSpeedOptimization'));
      safeImport('seo-images', () => import('@/pages/admin/seo/AdminImageSeo'));
      safeImport('seo-slugs', () => import('@/pages/admin/seo/AdminSlugEditor'));
      safeImport('seo-redirects', () => import('@/pages/admin/seo/AdminRedirects'));
      safeImport('seo-broken', () => import('@/pages/admin/seo/AdminBrokenLinks'));
      safeImport('seo-content', () => import('@/pages/admin/seo/AdminContentSeo'));
    }, 4500);
  }, []);
}

/**
 * Map menu paths to their dynamic-import factories so we can fire a HOVER prefetch
 * the moment a user mouse-enters / touches a sidebar link.
 */
const HOVER_LOADERS: Record<string, () => Promise<unknown>> = {
  '/admin':                       () => import('@/pages/admin/AdminDashboard'),
  '/admin/orders':                () => import('@/pages/admin/AdminOrders'),
  '/admin/quick-sale':            () => import('@/pages/admin/AdminQuickSale'),
  '/admin/invoices':              () => import('@/pages/admin/AdminInvoiceGenerator'),
  '/admin/payments':              () => import('@/pages/admin/AdminPayments'),
  '/admin/products':              () => import('@/pages/admin/AdminProducts'),
  '/admin/categories':            () => import('@/pages/admin/AdminCategories'),
  '/admin/attributes':            () => import('@/pages/admin/AdminAttributes'),
  '/admin/inventory-alerts':      () => import('@/pages/admin/AdminInventoryAlerts'),
  '/admin/import-export':         () => import('@/pages/admin/AdminProductImportExport'),
  '/admin/product-reviews':       () => import('@/pages/admin/AdminProductReviews'),
  '/admin/customers':             () => import('@/pages/admin/AdminCustomers'),
  '/admin/wallet':                () => import('@/pages/admin/AdminWallet'),
  '/admin/tickets':               () => import('@/pages/admin/AdminTickets'),
  '/admin/live-chat':             () => import('@/pages/admin/AdminLiveChat'),
  '/admin/newsletter':            () => import('@/pages/admin/AdminNewsletterSubscribers'),
  '/admin/hero-banner':           () => import('@/pages/admin/AdminHeroBanner'),
  '/admin/flash-sale':            () => import('@/pages/admin/AdminFlashSale'),
  '/admin/testimonials':          () => import('@/pages/admin/AdminTestimonials'),
  '/admin/announcement-bar':      () => import('@/pages/admin/AdminAnnouncementBar'),
  '/admin/popup-banner':          () => import('@/pages/admin/AdminPopupBanner'),
  '/admin/pages':                 () => import('@/pages/admin/AdminPages'),
  '/admin/footer-settings':       () => import('@/pages/admin/AdminFooterSettings'),
  '/admin/themes':                () => import('@/pages/admin/AdminThemes'),
  '/admin/coupons':               () => import('@/pages/admin/AdminCoupons'),
  '/admin/referrals':             () => import('@/pages/admin/AdminReferrals'),
  '/admin/affiliates':            () => import('@/pages/admin/AdminAffiliates'),
  '/admin/marketing':             () => import('@/pages/admin/AdminMarketing'),
  '/admin/facebook-pixel':        () => import('@/pages/admin/AdminFacebookPixel'),
  '/admin/custom-audiences':      () => import('@/pages/admin/AdminCustomAudiences'),
  '/admin/google-ads':            () => import('@/pages/admin/AdminGoogleAds'),
  '/admin/marketing-pixels':      () => import('@/pages/admin/AdminMarketingPixels'),
  '/admin/blog':                  () => import('@/pages/admin/AdminBlog'),
  '/admin/help':                  () => import('@/pages/admin/AdminHelp'),
  '/admin/media-library':         () => import('@/pages/admin/AdminMediaLibrary'),
  '/admin/seo':                   () => import('@/pages/admin/AdminSEO'),
  '/admin/site-verification':     () => import('@/pages/admin/AdminSiteVerification'),
  '/admin/reports':               () => import('@/pages/admin/AdminReports'),
  '/admin/telegram-bot':          () => import('@/pages/admin/AdminTelegramBot'),
  '/admin/ai-config':             () => import('@/pages/admin/AdminAiConfig'),
  '/admin/staff':                 () => import('@/pages/admin/AdminStaffManagement'),
  '/admin/roles':                 () => import('@/pages/admin/AdminRoles'),
  '/admin/backup':                () => import('@/pages/admin/AdminBackup'),
  '/admin/settings':              () => import('@/pages/admin/AdminSettings'),
};

export function prefetchAdminRoute(path: string): void {
  const loader = HOVER_LOADERS[path];
  if (!loader || _started.has(path)) return;
  _started.add(path);
  loader().catch(() => _started.delete(path));
}
