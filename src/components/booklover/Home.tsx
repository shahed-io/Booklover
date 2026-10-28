import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Layout from './Layout';
import { useCatalog, slugify, money, variantsOf, type Book } from './catalog';
import { useHomeSettings, HOME_DEFAULTS } from './homeSettings';
import reading from '@/assets/booklover-reading.jpg';
import collectionsImg from '@/assets/booklover-collections.jpg';

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

function Row({ title, books, to }: { title: string; books: Book[]; to: string }) {
  if (!books.length) return null;
  return (
    <section className="bl-hsection">
      <div className="bl-hwrap"><h2>{title}</h2></div>
      <div className="bl-hrow">{books.map(b => <HomeCard key={b.id} book={b} />)}</div>
      <div className="bl-hcenter"><Link to={to} className="bl-pill">View all</Link></div>
    </section>
  );
}

export default function Home() {
  const { data } = useCatalog();
  const { data: hs } = useHomeSettings();
  const cfg = hs || HOME_DEFAULTS;
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = cfg.banners.length;
  useEffect(() => { if (paused || n < 2) return; const t = setInterval(() => setSlide(s => (s + 1) % n), 6000); return () => clearInterval(t); }, [paused, n]);
  const lines = (t: string) => t.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>);
  const active = cfg.banners[slide % n];

  const byCategory = useMemo(() => {
    const m = new Map<string, Book[]>();
    if (!data) return m;
    const books = new Map(data.books.map(b => [b.id, b]));
    for (const l of data.links) { const b = books.get(l.product_id); if (b) { const arr = m.get(l.category_id) || []; arr.push(b); m.set(l.category_id, arr); } }
    return m;
  }, [data]);
  const catOf = (name: string, slug = '') => data?.categories.find(c => c.name === name) || data?.categories.find(c => c.slug === slug);
  const booksOf = (name: string, slug = '') => { const c = catOf(name, slug); return c ? (byCategory.get(c.id) || []) : []; };
  const bestsellers = data ? [...data.books].sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0)).slice(0, cfg.bestsellerCount) : [];

  return (
    <Layout>
      <Helmet><title>{cfg.seoTitle}</title><meta name="description" content={cfg.seoDescription} /><link rel="canonical" href="https://booklover.com.bd/" /></Helmet>

      <section className="bl-hero">
        <img src={active.image || (slide % 2 ? collectionsImg : reading)} alt="Reading at Booklover" width={1920} height={1024} fetchPriority="high" />
        <div className="bl-hero-copy">
          <span className="bl-eyebrow">{cfg.eyebrow}</span>
          <h1>{lines(active.title)}</h1>
          <div className="bl-hero-rule" />
          <p>{lines(active.subtitle)}</p>
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
            const cover = name === 'All Books' ? bestsellers[0]?.image_url : (c?.image_url || booksOf(name)[0]?.image_url);
            return (
              <Link key={name} className="bl-ccard" to={`/collections/${name === 'All Books' ? 'all-products' : c?.slug || slugify(name)}`}>
                <div className="bl-ccard-img"><img src={cover || collectionsImg} alt={name} loading="lazy" /></div>
                <h3>{name} <ArrowRight size={16} /></h3>
              </Link>
            );
          })}
        </div>
        <div className="bl-hcenter"><Link to="/collections" className="bl-pill">View all</Link></div>
      </section>

      <Row title={cfg.bestsellerTitle} books={bestsellers} to="/collections/best-sellers" />
      {cfg.collectionRows.map(r => {
        const c = catOf(r.title, r.collection);
        return <Row key={r.title} title={r.title} books={booksOf(r.title, r.collection).slice(0, 25)} to={`/collections/${c?.slug || r.collection}`} />;
      })}
    </Layout>
  );
}
