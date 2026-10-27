import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Shield, ExternalLink, ArrowUpRight, Zap, Package, Info, FileText, Send, Download, Heart, Star, Gift, Tag, Globe, ShoppingBag, Sparkles, BookOpen, HelpCircle, type LucideIcon } from 'lucide-react';
import BrandLogo from './BrandLogo';

import { useFooterSettings } from '@/hooks/useFooterSettings';
import { useFooterMenu } from '@/hooks/useFooterMenu';

// Icon registry — admins can pick by name
const ICON_MAP: Record<string, LucideIcon> = {
  Package, Info, FileText, Shield, Globe, ShoppingBag, BookOpen, HelpCircle,
  Sparkles, Gift, Tag, Star, Heart, Download, Mail, Phone, MessageCircle,
};

// ── Header-matched palette (Navy Gloss) ──
const NAVY_DEEP = 'hsl(222,66%,12%)';
const NAVY_MID = 'hsl(222,62%,16%)';
const NAVY_TOP = 'hsl(222,58%,22%)';
const NAVY_TEXT = 'hsl(222,45%,18%)';
const NAVY_SOFT = 'hsl(222,25%,42%)';
const AMBER = 'hsl(38,95%,58%)';
const AMBER_DEEP = 'hsl(32,90%,50%)';

const NAVY_PANEL = `linear-gradient(180deg, ${NAVY_TOP} 0%, ${NAVY_MID} 55%, ${NAVY_DEEP} 100%)`;
const GLASS_PANEL = 'linear-gradient(180deg, hsla(0,0%,100%,0.90) 0%, hsla(0,0%,100%,0.72) 45%, hsla(35,40%,97%,0.78) 100%)';
const GLASS_BORDER = '1px solid hsla(222,40%,30%,0.10)';
const GLASS_SHADOW = '0 18px 40px -26px hsla(222,60%,15%,0.45), inset 0 1px 0 hsla(0,0%,100%,0.92)';

// Two-color highlight on tagline keywords
const HIGHLIGHT_GREEN = [
  'বিশ্বস্ত', 'সাশ্রয়ী মূল্যে', 'সেরা দামে', 'ফ্রি ডেলিভারি',
  '', '', 'গ্রাহকদের',
];
const HIGHLIGHT_ORANGE = [
  '', 'হাই-কোয়ালিটি ফেব্রিক', 'অরিজিনাল', '',
];
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]!));
const highlightTagline = (text: string) => {
  type Hit = { start: number; end: number; word: string; cls: string };
  const hits: Hit[] = [];
  const scan = (list: string[], cls: string) => {
    for (const kw of list) {
      let from = 0;
      while (from <= text.length - kw.length) {
        const idx = text.indexOf(kw, from);
        if (idx === -1) break;
        hits.push({ start: idx, end: idx + kw.length, word: kw, cls });
        from = idx + kw.length;
      }
    }
  };
  scan(HIGHLIGHT_GREEN, 'fth-g');
  scan(HIGHLIGHT_ORANGE, 'fth-o');
  hits.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  const taken: Hit[] = [];
  for (const h of hits) {
    if (taken.some(t => !(h.end <= t.start || h.start >= t.end))) continue;
    taken.push(h);
  }
  taken.sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const h of taken) {
    out += escapeHtml(text.slice(cursor, h.start));
    out += `<mark class="${h.cls}">${escapeHtml(h.word)}</mark>`;
    cursor = h.end;
  }
  out += escapeHtml(text.slice(cursor));
  return out;
};

const Footer = () => {
  const { settings } = useFooterSettings();
  const { sections } = useFooterMenu();
  const paymentMethods = settings.payment_methods.split(',').map(s => s.trim()).filter(Boolean);

  const contacts = [
    { icon: <Phone size={14} />, href: `tel:${settings.phone.replace(/\D/g, '')}`, label: settings.phone },
    { icon: <Mail size={14} />, href: `mailto:${settings.email}`, label: settings.email },
    { icon: <MapPin size={14} />, href: '#', label: settings.address },
  ];

  const socials = [
    { icon: <Facebook size={16} />, href: settings.facebook_url, label: 'Facebook' },
    { icon: <MessageCircle size={16} />, href: settings.whatsapp_url, label: 'WhatsApp' },
    { icon: <Instagram size={16} />, href: settings.instagram_url, label: 'Instagram' },
    { icon: <Send size={16} />, href: settings.telegram_url, label: 'Telegram' },
  ];

  return (
  <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(35,40%,98%) 0%, hsl(220,30%,97%) 100%)' }}>

    <style>{`
      @keyframes footerSheen { 0% { transform: translateX(-120%);} 100% { transform: translateX(220%);} }
      .footer-sheen::after {
        content:''; position:absolute; inset:0; pointer-events:none;
        background: linear-gradient(110deg, transparent 38%, hsla(0,0%,100%,0.14) 50%, transparent 62%);
        animation: footerSheen 7s ease-in-out infinite;
      }
    `}</style>

    {/* ── Top: Navy gloss CTA band (mirrors header utility strip) ── */}
    <div className="relative footer-sheen overflow-hidden"
      style={{
        background: NAVY_PANEL,
        boxShadow: '0 12px 30px -18px hsla(222,60%,12%,0.6), inset 0 1px 0 hsla(0,0%,100%,0.12)',
      }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
      <div className="container-fluid py-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(180deg, ${AMBER}, ${AMBER_DEEP})`,
                boxShadow: '0 8px 20px -8px hsla(35,92%,45%,0.75), inset 0 1px 0 hsla(0,0%,100%,0.45)',
                color: NAVY_DEEP,
              }}>
              <Zap size={18} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-sora font-black text-lg sm:text-xl tracking-tight" style={{ color: 'hsl(0,0%,100%)' }}>
                Need help choosing a product?
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'hsla(0,0%,100%,0.62)' }}>
                Our experts are available 24/7 to assist you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href={`https://wa.me/${settings.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                color: 'hsl(0,0%,100%)',
                background: 'hsla(0,0%,100%,0.10)',
                border: '1px solid hsla(0,0%,100%,0.20)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.18)',
              }}>
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href="/shop"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(180deg, ${AMBER}, ${AMBER_DEEP})`,
                color: NAVY_DEEP,
                boxShadow: '0 10px 24px -10px hsla(35,92%,45%,0.8), inset 0 1px 0 hsla(0,0%,100%,0.45)',
              }}>
              Shop Now <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* ── Main footer ── */}
    <div className="relative z-10 container-fluid pt-10 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Brand card */}
        <div className="lg:col-span-4 rounded-2xl p-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5"
          style={{
            background: GLASS_PANEL,
            backdropFilter: 'blur(26px) saturate(190%)',
            WebkitBackdropFilter: 'blur(26px) saturate(190%)',
            border: GLASS_BORDER,
            boxShadow: GLASS_SHADOW,
          }}>
          <a href="/" className="flex items-center">
            <BrandLogo size="md" className="whitespace-nowrap" />
          </a>
          <p className="text-[13px] leading-relaxed footer-tagline-highlight" style={{ color: NAVY_SOFT }}
            dangerouslySetInnerHTML={{ __html: highlightTagline(settings.tagline) }}
          />

          <div className="flex flex-col gap-2 w-full items-center lg:items-start">
            {contacts.map((c, i) => (
              <a key={i} href={c.href}
                className="flex items-center gap-3 w-full max-w-[320px] px-3 py-2 rounded-xl transition-all"
                style={{
                  color: NAVY_SOFT,
                  background: 'linear-gradient(180deg, hsla(222,45%,30%,0.04), hsla(0,0%,100%,0.55))',
                  border: '1px solid hsla(222,40%,30%,0.09)',
                  boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.85)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'hsla(35,92%,55%,0.45)';
                  el.style.color = NAVY_TEXT;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'hsla(222,40%,30%,0.09)';
                  el.style.color = NAVY_SOFT;
                }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(180deg, ${NAVY_TOP}, ${NAVY_MID})`,
                    color: AMBER,
                    boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.22), 0 4px 12px -8px hsla(222,60%,15%,0.8)',
                  }}>
                  {c.icon}
                </span>
                <span className="font-fira text-[12px] truncate">{c.label}</span>
              </a>
            ))}
          </div>

          <div className="flex gap-2.5 justify-center lg:justify-start">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={`Visit Booklover on ${s.label}`}
                title={s.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${NAVY_TOP}, ${NAVY_DEEP})`,
                  color: 'hsla(0,0%,100%,0.85)',
                  boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.22), 0 8px 18px -12px hsla(222,60%,15%,0.9)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = `linear-gradient(180deg, ${AMBER}, ${AMBER_DEEP})`;
                  el.style.color = NAVY_DEEP;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = `linear-gradient(180deg, ${NAVY_TOP}, ${NAVY_DEEP})`;
                  el.style.color = 'hsla(0,0%,100%,0.85)';
                }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns — dynamic from admin */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {sections.map((col) => {
            const IconComp = ICON_MAP[col.icon] ?? Info;
            return (
              <div key={col.id} className="rounded-2xl p-5 space-y-4"
                style={{
                  background: GLASS_PANEL,
                  backdropFilter: 'blur(26px) saturate(190%)',
                  WebkitBackdropFilter: 'blur(26px) saturate(190%)',
                  border: GLASS_BORDER,
                  boxShadow: GLASS_SHADOW,
                }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(180deg, ${NAVY_TOP}, ${NAVY_MID})`,
                      color: AMBER,
                      boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.24), 0 6px 16px -10px hsla(222,60%,15%,0.9)',
                    }}>
                    <IconComp size={14} />
                  </div>
                  <h4 className="font-sora font-bold text-[11px] uppercase tracking-[0.18em]" style={{ color: NAVY_TEXT }}>
                    {col.title}
                  </h4>
                </div>
                <div className="h-px rounded-full"
                  style={{ background: `linear-gradient(90deg, hsla(35,92%,55%,0.65), hsla(222,40%,30%,0.10) 60%, transparent)` }} />
                <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-0.5">
                  {col.links.map((link) => (
                    <li key={link.id}>
                      <a href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-all"
                        style={{ color: NAVY_SOFT, background: 'transparent', border: '1px solid transparent' }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = NAVY_TEXT;
                          el.style.background = 'linear-gradient(180deg, hsla(35,92%,62%,0.16), hsla(35,92%,62%,0.06))';
                          el.style.borderColor = 'hsla(35,92%,55%,0.28)';
                          el.style.boxShadow = 'inset 0 1px 0 hsla(0,0%,100%,0.85)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = NAVY_SOFT;
                          el.style.background = 'transparent';
                          el.style.borderColor = 'transparent';
                          el.style.boxShadow = 'none';
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all group-hover:scale-125"
                          style={{ background: AMBER_DEEP }} />
                        <span className="truncate">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* ── Bottom: Navy gloss bar (payments + status + copyright) ── */}
    <div className="relative footer-sheen overflow-hidden"
      style={{
        background: NAVY_PANEL,
        boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.10)',
      }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />

      <div className="container-fluid py-5 relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Payments */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] font-fira font-bold tracking-widest mr-1" style={{ color: 'hsla(0,0%,100%,0.45)' }}>PAYMENTS</span>
            {paymentMethods.map(pm => (
              <span key={pm}
                className="px-3 py-1.5 rounded-lg text-[10.5px] font-bold font-fira cursor-default transition-all hover:-translate-y-0.5"
                style={{
                  background: 'hsla(0,0%,100%,0.08)',
                  border: '1px solid hsla(0,0%,100%,0.16)',
                  color: 'hsla(0,0%,100%,0.88)',
                  boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.14)',
                }}>
                {pm}
              </span>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'hsla(150,70%,45%,0.14)', border: '1px solid hsla(150,70%,50%,0.30)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(150,80%,55%)', boxShadow: '0 0 8px hsla(150,80%,55%,0.7)' }} />
            <span className="text-[11px] font-fira font-medium" style={{ color: 'hsl(150,60%,80%)' }}>{settings.status_text}</span>
          </div>
        </div>

        <div className="h-px" style={{ background: 'hsla(0,0%,100%,0.10)' }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
<p className="text-[12px] font-fira font-semibold text-center sm:text-left flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(180deg, hsla(222,64%,20%,0.92), hsla(222,66%,12%,0.92))',
              border: '1px solid hsla(0,0%,100%,0.18)',
              boxShadow: '0 6px 18px -8px hsla(222,70%,6%,0.7), inset 0 1px 0 hsla(0,0%,100%,0.20)',
            }}>
            <span style={{ color: 'hsl(38,95%,62%)', fontWeight: 700 }}>© {new Date().getFullYear()}</span>
            <span style={{ color: 'hsla(0,0%,100%,0.30)' }}>·</span>
            <strong style={{ fontWeight: 700 }}>
              <span style={{ color: 'hsl(0,0%,100%)' }}>{settings.store_name.split(' ')[0]}</span>
              {settings.store_name.split(' ').length > 1 && (
                <span style={{ color: 'hsl(38,95%,62%)' }}> {settings.store_name.split(' ').slice(1).join(' ')}</span>
              )}
            </strong>
            <span style={{ color: 'hsla(0,0%,100%,0.30)' }}>·</span>
            <span style={{ color: 'hsl(0,0%,100%)', fontWeight: 600 }}>All Rights Reserved</span>
            <span style={{ color: 'hsla(0,0%,100%,0.30)' }}>·</span>
            

          </p>

          <a href={settings.website_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            style={{
              background: 'hsla(0,0%,100%,0.08)',
              border: '1px solid hsla(0,0%,100%,0.16)',
              boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.14)',
            }}>
            <span className="text-[11px] font-fira tracking-wide font-semibold" style={{ color: AMBER }}>
              {settings.website_url.replace('https://','').replace('http://','')}
            </span>
            <ExternalLink size={10} style={{ color: AMBER }} />
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
