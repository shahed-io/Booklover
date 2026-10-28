import { useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Layout from './Layout';
import { useHomeData, slugify, money, variantsOf, type Book } from './catalog';
import { useHomeSettings, HOME_DEFAULTS } from './homeSettings';
import reading from '@/assets/booklover-reading.webp';
const HERO_LQIP = 'url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAARACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0eo5v9RJn+6f5U8msXxJrX9jWayfZzN5hK8NjHHXpWT2Lim3ZHmuo+XbX3mXMcoUECReQSpJ5A69Kh1CxuLExC5gm8ok+RKzcspwRn3FaunCTXrp44JXMmC4kZVPlgdBk5PpV7W3lmhtLS8DXNwH3v5Y28AYNZLY2asejt0rm/Fv+qt/q38qKK0lsZ0/iRyfw7/5CN9/1zP8A6EKb41/1sP1/oKKKll9T/9k=)';

/** Product card matching the owner's original store: cover, centred title, prices, red Sale badge. */
function HomeCard({ book }: { book: Book }) {
  const sale = !!book.original_price && book.original_price > book.price;
  const from = variantsOf(book.variants).length ? 'From ' : '';
  return (
    <Link to={`/products/${book.slug}`} className="bl-hcard">
      <div className="bl-hcard-img">
        {book.image_url ? <img src={book.image_url} alt={book.name} loading="lazy" /> : <BookOpen size={56} />}
        {sale && <span className="bl-badge">Sale</span>}
      </div>
      <h3>{book.name}</h3>
      <p className="bl-hcard-price">
        {sale && <s>{money(book.original_price!)}</s>}
        <span>{from}{money(book.price)}</span>
      </p>
    </Link>
  );
}

function Row({ title, books, to, loading }: { title: string; books: Book[]; to: string; loading?: boolean | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(1);
  if (!books.length && !loading) return null;
  const step = () => { const el = ref.current; const card = el?.firstElementChild as HTMLElement | null; return card ? card.offsetWidth + 40 : 300; };
  const onScroll = () => { const el = ref.current; if (el) setPos(Math.min(books.length, Math.round(el.scrollLeft / step()) + 1)); };
  const go = (d: number) => ref.current?.scrollBy({ left: d * step(), behavior: 'smooth' });
  return (
    <section className="bl-hsection">
      <div className="bl-hwrap"><h2>{title}</h2></div>
      <div className="bl-hrow" ref={ref} onScroll={onScroll}>{books.length ? books.map(b => <HomeCard key={b.id} book={b} />) : Array.from({ length: 5 }, (_, i) => <div key={i} className="bl-skel" />)}</div>
      {books.length > 1 && <div className="bl-rownav">
        <button aria-label="Previous books" disabled={pos <= 1} onClick={() => go(-1)}><ChevronLeft size={16} /></button>
        <span>{pos}/{books.length}</span>
        <button aria-label="Next books" disabled={pos >= books.length} onClick={() => go(1)}><ChevronRight size={16} /></button>
      </div>}
      <div className="bl-hcenter"><Link to={to} className="bl-pill">View all</Link></div>
    </section>
  );
}

export default function Home() {
  const { data: hs } = useHomeSettings();
  const cfg = hs || HOME_DEFAULTS;
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = cfg.banners.length;
  useEffect(() => { if (paused || n < 2) return; const t = setInterval(() => setSlide(s => (s + 1) % n), 6000); return () => clearInterval(t); }, [paused, n]);
  const lines = (t: string) => t.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>);
  const active = cfg.banners[slide % n];

  const { data } = useHomeData(cfg.collectionRows, cfg.bestsellerCount);
  const catOf = (name: string, slug = '') => data?.categories.find(c => c.name === name) || data?.categories.find(c => c.slug === slug);
  const bestsellers = data?.bestsellers || [];

  return (
    <Layout>
      <Helmet><title>{cfg.seoTitle}</title><meta name="description" content={cfg.seoDescription} /><link rel="canonical" href="https://booklover.com.bd/" /></Helmet>

      <section className="bl-hero" style={{ backgroundImage: HERO_LQIP, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <img src={active!.image || reading} alt="Reading at Booklover" width={1920} height={1024} fetchPriority="high" loading="eager" decoding="sync" />
        <div className="bl-hero-copy">
          <span className="bl-eyebrow">{cfg.eyebrow}</span>
          <h1>{lines(active!.title)}</h1>
          <div className="bl-hero-rule" />
          <p>{lines(active!.subtitle)}</p>
        </div>
      </section>
      <div className="bl-slidebar">
        <button aria-label="Previous slide" onClick={() => setSlide((slide + n - 1) % n)}><ChevronLeft size={16} /></button>
        {cfg.banners.map((_, i) => <button key={i} aria-label={`Slide ${i + 1}`} className={`bl-dot${i === slide % n ? ' on' : ''}`} onClick={() => setSlide(i)} />)}
        <button aria-label="Next slide" onClick={() => setSlide((slide + 1) % n)}><ChevronRight size={16} /></button>
        <span className="bl-slidebar-sep" />
        <button aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
      </div>

      {cfg.announcement && <div className="bl-announce">{cfg.announcement}</div>}

      <section className="bl-hsection">
        <div className="bl-hwrap"><h2>{cfg.collectionsTitle}</h2></div>
        <div className="bl-hwrap bl-cgrid">
          {cfg.featuredCollections.slice(0, 4).map(name => {
            const c = catOf(name);
            const cover = name === 'All Books' ? bestsellers[0]?.image_url : c?.image_url;
            return (
              <Link key={name} className="bl-ccard" to={`/collections/${name === 'All Books' ? 'all-products' : c?.slug || slugify(name)}`}>
                <div className="bl-ccard-img">{cover ? <img src={cover} alt={name} loading="lazy" /> : <div className="bl-skel" />}</div>
                <h3>{name} <ArrowRight size={16} /></h3>
              </Link>
            );
          })}
        </div>
        <div className="bl-hcenter"><Link to="/collections" className="bl-pill">View all</Link></div>
      </section>

      <Row title={cfg.bestsellerTitle} books={bestsellers} loading={!data} to="/collections/best-sellers" />
      {cfg.collectionRows.map(r => {
        const c = catOf(r.title, r.collection);
        return <Row key={r.title} title={r.title} books={data?.rows[r.title] || []} loading={!data} to={`/collections/${c?.slug || r.collection}`} />;
      })}
    </Layout>
  );
}
