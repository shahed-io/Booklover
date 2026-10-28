import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShoppingBag, TrendingUp, Zap, Shield, Clock, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useHeroBanner, type SlideData } from '@/hooks/useHeroBanner';

type Slide = {
  tag: string; tagIcon: string; title: string; titleAccent: string; subtitle: string; desc: string;
  price: string; original: string; off: string; badge: string;
  accentFrom: string; accentTo: string;
  emoji: string; logoImg?: string; bgImage?: string; features: string[]; productSlug?: string;
};

const FALLBACK_BANNERS: string[] = [];

/**
 * Image-only default banner. No copy is baked in — the admin panel
 * (/admin/hero-banner) can add tag, headline, price, features and CTA later,
 * and every text block below only renders when it actually has content.
 */
const emptySlide = (bgImage: string): Slide => ({
  tag: '', tagIcon: '', title: '', titleAccent: '', subtitle: '', desc: '',
  price: '', original: '', off: '', badge: '',
  accentFrom: 'hsl(28,88%,52%)', accentTo: 'hsl(222,60%,26%)',
  emoji: '', bgImage, features: [], productSlug: '',
});

const STATIC_SLIDES: Slide[] = FALLBACK_BANNERS.map(emptySlide);

// Admin-uploaded bgImage always wins, otherwise rotate the bundled banners.
const pickBannerBg = (s: Slide, idx: number): string => {
  if (s.bgImage && s.bgImage.trim()) return s.bgImage;
  return '';
};

const dbSlideToSlide = (s: SlideData): Slide => ({
  tag: s.tag || '', tagIcon: s.tagIcon || '', title: s.title || '', titleAccent: s.titleAccent || '',
  subtitle: s.subtitle || '', desc: s.desc || '', price: s.price || '',
  original: s.original || '', off: s.off ? (s.off.startsWith('-') ? s.off : `-${s.off}`) : '', badge: s.badge || '',
  accentFrom: s.accentFrom || 'hsl(28,88%,52%)', accentTo: s.accentTo || 'hsl(222,60%,26%)',
  emoji: s.emoji || '', logoImg: (s.logoImg || undefined)!,
  bgImage: s.bgImage || undefined,
  features: s.features || [], productSlug: s.productSlug || '',
});

const DEFAULT_TRUST = [
  { text: 'Fast Home Delivery', icon: <Zap size={12} /> },
  { text: 'Premium Quality', icon: <Shield size={12} /> },
  { text: '24/7 Support', icon: <Clock size={12} /> },
  { text: '4.9★ Rating', icon: <Star size={12} /> },
];

const HeroBanner = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<'in' | 'out'>('in');
  const touchStartX = useRef<number | null>(null);
  const { data: bannerData } = useHeroBanner();

  const SLIDES: Slide[] = bannerData?.slides && bannerData.slides.length > 0
    ? bannerData.slides.filter(s => s.enabled).map(dbSlideToSlide)
    : STATIC_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => advance(1), 5500);
    return () => clearInterval(timer);
  }, [active, SLIDES.length]);

  const advance = (delta: number) => {
    setDir('out');
    setTimeout(() => {
      setActive(p => (p + delta + SLIDES.length) % SLIDES.length);
      setDir('in');
    }, 260);
  };

  const slide = SLIDES[active] ?? SLIDES[0];
  const bgUrl = pickBannerBg(slide!, active);
  const href = slide!.productSlug ? `/product/${slide!.productSlug}` : '/shop';

  // Text layer is only mounted when the admin has actually written something.
  const hasHeadline = Boolean(slide!.title || slide!.titleAccent || slide!.subtitle);
  const hasPrice = Boolean(slide!.price || slide!.original || slide!.off);
  const hasTags = Boolean(slide!.tag || slide!.badge);
  const hasCopy = hasHeadline || hasPrice || hasTags || Boolean(slide!.desc) || (slide!.features?.length ?? 0) > 0;

  return (
    <section className="relative mt-[64px] lg:mt-[54px] px-2 sm:px-4 lg:px-6 pt-2 pb-3 md:pt-3 md:pb-5">
      {FALLBACK_BANNERS.map(src => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}

      <div
        className="relative mx-auto w-full max-w-[1800px] rounded-[20px] lg:rounded-[28px] overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Booklover banner"
        style={{ boxShadow: '0 18px 50px hsla(222,60%,20%,0.14)' }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0]!.clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0]!.clientX - touchStartX.current;
          if (Math.abs(dx) > 40) advance(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] max-h-[560px]">
          <img
            key={`bg-${active}`}
            src={bgUrl}
            alt="Booklover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={1920}
            height={840}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: dir === 'in' ? 1 : 0.55,
              transform: dir === 'in' ? 'scale(1)' : 'scale(1.02)',
              transition: 'opacity 0.35s ease, transform 0.5s ease',
            }}
          />

          {/* Soft readability wash only when there is copy to read */}
          {hasCopy && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,251,244,0.55) 0%, rgba(255,251,244,0.26) 32%, rgba(255,251,244,0) 58%)',
              }}
            />
          )}

          {hasCopy && (
            <div
              className="absolute inset-0 flex items-center"
              style={{
                opacity: dir === 'in' ? 1 : 0,
                transform: dir === 'in' ? 'translateX(0)' : 'translateX(-14px)',
                transition: 'opacity 0.32s ease, transform 0.32s ease',
              }}
            >
              <div className="w-full sm:w-[62%] lg:w-[52%] pl-4 sm:pl-6 md:pl-8 lg:pl-12 pr-3 sm:pr-4 space-y-2 sm:space-y-3 md:space-y-4">
                {hasTags && (
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {slide!.tag && (
                      <span
                        className="inline-flex items-center gap-1 text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.16em] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white"
                        style={{
                          background: `linear-gradient(135deg, ${slide!.accentFrom}, ${slide!.accentTo})`,
                          boxShadow: '0 4px 16px hsla(28,88%,52%,0.30)',
                        }}
                      >
                        {slide!.tagIcon && <span className="text-[10px] sm:text-[11px]">{slide!.tagIcon}</span>}
                        {slide!.tag}
                      </span>
                    )}
                    {slide!.badge && (
                      <span
                        className="hidden sm:inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-full"
                        style={{
                          background: 'hsla(28,88%,52%,0.12)',
                          border: '1px solid hsla(28,88%,52%,0.24)',
                          color: 'hsl(222,60%,26%)',
                        }}
                      >
                        {slide!.badge}
                      </span>
                    )}
                  </div>
                )}

                {hasHeadline && (
                  <div>
                    {(slide!.title || slide!.titleAccent) && (
                      <h2
                        className="font-sora font-black leading-[1.05] tracking-tight"
                        style={{ fontSize: 'clamp(1.35rem, 4.2vw, 3.2rem)', color: 'hsl(222,60%,20%)' }}
                      >
                        {slide!.title && <span className="block">{slide!.title}</span>}
                        {slide!.titleAccent && (
                          <span
                            className="block"
                            style={{
                              background: `linear-gradient(135deg, ${slide!.accentFrom}, ${slide!.accentTo})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {slide!.titleAccent}
                          </span>
                        )}
                      </h2>
                    )}
                    {slide!.subtitle && (
                      <p
                        className="text-[11px] sm:text-[13px] lg:text-[14px] font-semibold mt-1 sm:mt-2 line-clamp-2"
                        style={{ color: 'hsl(222,30%,38%)' }}
                      >
                        {slide!.subtitle}
                      </p>
                    )}
                  </div>
                )}

                {slide!.desc && (
                  <p className="hidden md:block text-[12.5px] leading-relaxed max-w-[420px]" style={{ color: 'hsl(222,20%,44%)' }}>
                    {slide!.desc}
                  </p>
                )}

                {slide!.features?.length > 0 && (
                  <div className="hidden lg:flex flex-wrap gap-1.5">
                    {slide!.features.filter(Boolean).map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid hsla(28,88%,52%,0.20)',
                          color: 'hsl(222,60%,26%)',
                          boxShadow: '0 2px 8px hsla(222,60%,26%,0.08)',
                        }}
                      >
                        <CheckCircle2 size={10} style={{ color: 'hsl(28,88%,50%)' }} />
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {hasPrice && (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {slide!.price && (
                      <span
                        className="font-sora font-black leading-none tracking-tight"
                        style={{ fontSize: 'clamp(1.1rem, 2.6vw, 2rem)', color: 'hsl(222,60%,20%)' }}
                      >
                        {slide!.price}
                      </span>
                    )}
                    {slide!.original && (
                      <span className="text-[10px] sm:text-xs line-through font-medium" style={{ color: 'hsl(222,15%,55%)' }}>
                        {slide!.original}
                      </span>
                    )}
                    {slide!.off && (
                      <span
                        className="text-[9px] sm:text-[10.5px] font-black text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${slide!.accentFrom}, ${slide!.accentTo})`,
                          boxShadow: '0 3px 10px hsla(28,88%,52%,0.30)',
                        }}
                      >
                        {slide!.off} OFF
                      </span>
                    )}
                  </div>
                )}

                {(slide!.title || slide!.productSlug) && (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={href}
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-[11px] sm:text-[12.5px] font-bold active:scale-95 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${slide!.accentFrom}, ${slide!.accentTo})`,
                        boxShadow: '0 8px 22px hsla(28,88%,52%,0.32)',
                      }}
                    >
                      <ShoppingBag size={12} strokeWidth={2.5} />
                      Buy Now
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </a>
                    <a
                      href="/shop"
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12.5px] font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1.5px solid hsla(28,88%,52%,0.24)',
                        color: 'hsl(222,60%,26%)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <TrendingUp size={12} /> View All
                    </a>
                  </div>
                )}

                {hasHeadline && (
                  <div className="hidden lg:flex flex-wrap gap-3 pt-1">
                    {DEFAULT_TRUST.map((t) => (
                      <span key={t.text} className="flex items-center gap-1.5 text-[10.5px] font-semibold" style={{ color: 'hsl(222,20%,42%)' }}>
                        <span style={{ color: 'hsl(28,88%,50%)' }}>{t.icon}</span>
                        {t.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Whole banner is tappable while there is no CTA button */}
          {!hasCopy && (
            <a href={href} aria-label="Shop Booklover" className="absolute inset-0" />
          )}

          {SLIDES.length > 1 && (
            <>
              <button
                onClick={() => advance(-1)}
                aria-label="Previous banner"
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 z-10"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid hsla(28,88%,52%,0.22)',
                  boxShadow: '0 4px 14px hsla(222,60%,20%,0.12)',
                  color: 'hsl(222,60%,26%)',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => advance(1)}
                aria-label="Next banner"
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 z-10"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid hsla(28,88%,52%,0.22)',
                  boxShadow: '0 4px 14px hsla(222,60%,20%,0.12)',
                  color: 'hsl(222,60%,26%)',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {SLIDES.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show banner ${i + 1}`}
              onClick={() => {
                setDir('out');
                setTimeout(() => { setActive(i); setDir('in'); }, 260);
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? '24px' : '7px',
                height: '7px',
                background: i === active
                  ? 'linear-gradient(135deg, hsl(28,88%,52%), hsl(222,60%,26%))'
                  : 'hsla(28,20%,80%,1)',
                boxShadow: i === active ? '0 0 8px hsla(28,88%,52%,0.50)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
