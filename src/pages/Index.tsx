import { useEffect, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/store/Navbar';
import HeroBanner from '@/components/store/HeroBanner';
import TopProducts from '@/components/store/TopProducts';
import { TickerBanner, FloatingButtons } from '@/components/store/Extras';
import SEOHead from '@/components/seo/SEOHead';
import { organizationSchema, websiteSchema, localBusinessSchema, siteNavigationSchema, speakableSchema } from '@/components/seo/schemas';
import AuthModal from '@/components/store/AuthModal';

// Below-fold sections — lazy loaded after hero renders
const FlashSale    = lazy(() => import('@/components/store/FlashSale'));
const WhyChooseUs  = lazy(() => import('@/components/store/WhyChooseUs'));

const Footer       = lazy(() => import('@/components/store/Footer'));
const PopupBanner  = lazy(() => import('@/components/store/PopupBanner'));

// Lightweight skeleton placeholders
const SectionSkeleton = () => (
  <div className="py-16 container-fluid">
    <div className="h-8 w-48 rounded-xl bg-muted/40 animate-pulse mb-8 mx-auto" />
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-48 rounded-2xl bg-muted/30 animate-pulse" />
      ))}
    </div>
  </div>
);

const Index = () => {
  const [searchParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  // Below-fold sections mount only after the browser is idle (or the user
  // scrolls / interacts) — keeps the mobile main thread free during first paint.
  const [belowFoldReady, setBelowFoldReady] = useState(false);

  useEffect(() => {
    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setBelowFoldReady(true);
      window.removeEventListener('scroll', activate);
      window.removeEventListener('touchstart', activate);
    };
    window.addEventListener('scroll', activate, { passive: true });
    window.addEventListener('touchstart', activate, { passive: true });
    const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, o?: any) => number);
    const id = ric ? ric(activate, { timeout: 1800 }) : window.setTimeout(activate, 900);
    return () => {
      window.removeEventListener('scroll', activate);
      window.removeEventListener('touchstart', activate);
      if (!ric) clearTimeout(id as number);
    };
  }, []);

  // Auto-open signup modal when ?ref= is in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      const timer = setTimeout(() => setAuthOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Relaxo Bean Bag – Premium Home & Lifestyle Furniture BD"
        description="Shop premium bean bags, bean bag sofas, lounge chairs, ottomans and cushions in Bangladesh with free Dhaka delivery from Relaxo Bean Bag."
        ogType="website"
        canonical="https://relaxobeanbag.com/"
        schema={[
          organizationSchema(),
          websiteSchema(),
          localBusinessSchema(),
          speakableSchema(['h1', '.lead', '.hero-title']),
          siteNavigationSchema([
            { name: 'Home', url: '/' },
            { name: 'Shop', url: '/shop' },
            { name: 'Bean Bag', url: '/shop?category=bean-bag' },
            { name: 'Bean Bag Sofa', url: '/shop?category=bean-bag-sofa' },
            { name: 'Lounge Chair', url: '/shop?category=lounge-chair' },
            { name: 'Cushion', url: '/shop?category=cushion' },
            { name: 'Help Center', url: '/help' },
            { name: 'Blog', url: '/blog' },
            { name: 'Contact', url: '/contact-us' },
          ]),
        ]}
      />
      {/* Critical above-fold content — eager */}
      <Navbar />
      <main>
        <h1 className="sr-only">
          Relaxo Bean Bag (RelaxoBeanBag / Relaxo Bean Bag BD / রিলাক্সো বিন ব্যাগ) — Bangladesh's trusted premium home & lifestyle furniture brand
        </h1>
        <HeroBanner />
        <TickerBanner />
        <TopProducts />

        {/* Below-fold — lazy loaded after first paint / idle */}
        {belowFoldReady && (
          <>
            <div className="cv-block">
              <Suspense fallback={<SectionSkeleton />}>
                <FlashSale />
              </Suspense>
            </div>
            <div className="cv-block">
              <Suspense fallback={<SectionSkeleton />}>
                <WhyChooseUs />
              </Suspense>
            </div>
          </>
        )}
      </main>
      {belowFoldReady && (
        <div className="cv-block">
          <Suspense fallback={<div className="py-8" />}>
            <Footer />
          </Suspense>
        </div>
      )}

      <FloatingButtons />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      {belowFoldReady && (
        <>
          <Suspense fallback={null}>
            <PopupBanner />
          </Suspense>
        </>
      )}

    </div>
  );
};

export default Index;
