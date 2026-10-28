import { useSeedFromCache } from './catalog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const BOOKLOVER_HOME_KEY = 'booklover_home';

export type HomeBanner = { title: string; subtitle: string; image: string };
export type MenuGroup = { label: string; collections: string[] };
export type HomeSettings = {
  eyebrow: string;
  banners: HomeBanner[];
  collectionsTitle: string;
  featuredCollections: string[];
  bestsellerTitle: string;
  bestsellerCount: number;
  spotlightTitle: string;
  spotlightCollection: string;
  spotlightImage: string;
  menuGroups: MenuGroup[];
  seoTitle: string;
  seoDescription: string;
  announcement: string;
  theme: 'dark' | 'white';
  collectionRows: { title: string; collection: string }[];
};

export const HOME_DEFAULTS: HomeSettings = {
  eyebrow: 'BOOKLOVER',
  banners: [
    { title: 'Happiness\nis a good\nbook.', subtitle: 'Find your next favourite\nat Booklover.', image: '' },
    { title: 'A world\nbetween\nthe pages.', subtitle: 'Explore our book collections.', image: '' },
    { title: 'Your next\nchapter\nstarts here.', subtitle: 'Discover books at Booklover.', image: '' },
  ],
  collectionsTitle: 'Explore Our Book Collections',
  featuredCollections: ['All Books', 'Crime Fiction', 'Biography & Memoir', 'Romance Books', 'Self-Help & Psychology', 'Fantasy', 'Timeless Classics', 'Young Adult (YA)'],
  bestsellerTitle: 'Bestselling Books',
  bestsellerCount: 25,
  spotlightTitle: 'Timeless Classics',
  spotlightCollection: 'timeless-classics',
  spotlightImage: '',
  menuGroups: [
    { label: 'Fiction', collections: ['Fiction', 'Romance Books', 'Mystery & Thriller', 'Fantasy', 'Crime Fiction', 'Science Fiction', 'Horror', 'Historical Fiction', 'Dark Romance', 'Young Adult (YA)'] },
    { label: 'Non-Fiction', collections: ['Autobiography', 'Biography & Memoir', 'Business, Finance & Economics', 'History & War', 'Philosophy & Religion', 'Self-Help & Psychology'] },
  ],
  theme: 'white',
  announcement: '🎁 FREE Bookmark with Every Book | 🚚 Cash on Delivery Across Bangladesh!',
  collectionRows: [
    { title: 'Timeless Classics', collection: 'timeless-classics' },
    { title: 'History & War', collection: 'history-war' },
    { title: 'Philosophy & Religion', collection: 'philosophy-religion' },
    { title: 'Crime Fiction', collection: 'crime-fiction' },
  ],
  seoTitle: 'Booklover | Online Bookshop Bangladesh',
  seoDescription: 'Browse books, explore collections and find your next favourite read at Booklover Bangladesh.',
};

export function mergeHome(raw: unknown): HomeSettings {
  if (!raw || typeof raw !== 'object') return HOME_DEFAULTS;
  const r = raw as Partial<HomeSettings>;
  return { ...HOME_DEFAULTS, ...r, banners: r.banners?.length ? r.banners : HOME_DEFAULTS.banners };
}

export function useHomeSettings() {
  useSeedFromCache(['site_settings', BOOKLOVER_HOME_KEY], () => { try { const v = localStorage.getItem('blc:home-settings'); return v ? mergeHome(JSON.parse(v)) : undefined; } catch { return undefined; } });
  return useQuery({
    queryKey: ['site_settings', BOOKLOVER_HOME_KEY],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', BOOKLOVER_HOME_KEY).maybeSingle();
      try { const v = data?.value ? JSON.parse(data.value) : null; try { localStorage.setItem('blc:home-settings', JSON.stringify(v)); } catch { /* full */ } return mergeHome(v); } catch { return HOME_DEFAULTS; }
    },
  });
}
