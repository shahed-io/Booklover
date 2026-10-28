import paymentMethodsImg from "@/assets/payment-methods.webp";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, ArrowUpRight, Send, BookOpen } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useFooterSettings } from '@/hooks/useFooterSettings';
import { useFooterMenu } from '@/hooks/useFooterMenu';

const Footer = () => {
  const { settings } = useFooterSettings();
  const { sections } = useFooterMenu();

  const phone = settings.phone || '01755708708';
  const digits = phone.replace(/\D/g, '');
  const contacts = [
    { icon: <Phone size={15} />, href: `tel:${digits}`, label: phone },
    { icon: <MessageCircle size={15} />, href: `https://wa.me/88${digits}`, label: 'Order on WhatsApp' },
    { icon: <Mail size={15} />, href: `mailto:${settings.email}`, label: settings.email },
    { icon: <MapPin size={15} />, href: '#', label: settings.address || 'Home delivery all over Bangladesh' },
  ].filter(c => c.label && !c.href.endsWith('mailto:'));

  const socials = [
    { icon: <Facebook size={16} />, href: settings.facebook_url, label: 'Facebook' },
    { icon: <MessageCircle size={16} />, href: settings.whatsapp_url, label: 'WhatsApp' },
    { icon: <Instagram size={16} />, href: settings.instagram_url, label: 'Instagram' },
    { icon: <Send size={16} />, href: settings.telegram_url, label: 'Telegram' },
  ].filter(s => s.href);

  const site = (settings.website_url || '').replace(/^https?:\/\//, '');

  return (
    <footer className="bl-fn">
      <div className="bl-fn-spines" aria-hidden="true" />

      <div className="bl-fn-quote container-fluid">
        <BookOpen size={22} className="bl-fn-quote-icon" />
        <h3>বই হোক আপনার নিত্যসঙ্গী।</h3>
        <p>পছন্দের গল্প, নতুন ভাবনা—সবই বুকলাভারে।</p>
        <div className="bl-fn-cta">
          <a href="/shop" className="bl-fn-btn bl-fn-btn-main">Browse Books <ArrowUpRight size={15} /></a>
          <a href={`https://wa.me/88${digits}`} target="_blank" rel="noopener noreferrer" className="bl-fn-btn bl-fn-btn-ghost">
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
      </div>

      <div className="bl-fn-main container-fluid">
        <div className="bl-fn-brand">
          <a href="/" className="inline-flex"><BrandLogo size="md" className="whitespace-nowrap" /></a>
          <p className="bl-fn-about">
            {settings.tagline || 'Booklover — your trusted online bookshop in Bangladesh. Original books, fair prices and fast delivery to your door.'}
          </p>
          <ul className="bl-fn-contacts">
            {contacts.map((c, i) => (
              <li key={i}><a href={c.href}><span className="bl-fn-ic">{c.icon}</span><span className="truncate">{c.label}</span></a></li>
            ))}
          </ul>
          {socials.length > 0 && (
            <div className="bl-fn-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit Booklover on ${s.label}`} title={s.label}>{s.icon}</a>
              ))}
            </div>
          )}
        </div>

        {sections.map(col => (
          <nav key={col.id} className="bl-fn-col" aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map(link => (
                <li key={link.id}>
                  <a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="bl-fn-bottom">
        <div className="container-fluid bl-fn-bottom-in">
          <p>© {new Date().getFullYear()} <strong>{settings.store_name}</strong> · All Rights Reserved</p>
          <div className="bl-fn-pay">
            <span>We accept</span>
            <img src={paymentMethodsImg} alt="Visa, Mastercard, American Express, DBBL Nexus, Cellfin, Rocket, bKash, Tap, Meghna Pay, Nagad, M Cash, Upay, OK Wallet" className="bl-fn-payimg" loading="lazy" width={960} height={51} />
          </div>
          {site && <a href={settings.website_url} target="_blank" rel="noopener noreferrer" className="bl-fn-site">{site}</a>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
