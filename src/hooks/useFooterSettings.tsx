import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FooterSettings {
  status_text: string;
  payment_methods: string; // comma-separated: "BKash,Nagad,Rocket"
  phone: string;
  email: string;
  address: string;
  website_url: string;
  store_name: string;
  tagline: string;
  facebook_url: string;
  whatsapp_url: string;
  instagram_url: string;
  telegram_url: string;
}

const DEFAULTS: FooterSettings = {
  status_text: 'Premium Bean Bag & Lifestyle Furniture Store',
  payment_methods: 'BKash,Nagad,Rocket,Upay,BKash Merchant',
  phone: '',
  email: '',
  address: '',
  website_url: 'https://booklover.com.bd',
  store_name: 'Booklover',
  tagline: 'বাংলাদেশের প্রিমিয়াম বিন ব্যাগ ও হোম ফার্নিচার ব্র্যান্ড। আরামদায়ক ডিজাইন, টেকসই ম্যাটেরিয়াল, সারা দেশে হোম ডেলিভারি।',
  facebook_url: '',
  whatsapp_url: 'https://wa.me/88',
  instagram_url: '.bd/',
  telegram_url: '',
};

const SETTINGS_KEY = 'footer_settings';

export const useFooterSettings = () => {
  const { data: settings = DEFAULTS, isLoading } = useQuery<FooterSettings>({
    queryKey: ['footer-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', SETTINGS_KEY)
        .maybeSingle();
      if (data?.value) {
        try {
          return { ...DEFAULTS, ...JSON.parse(data.value) } as FooterSettings;
        } catch { /* fall through */ }
      }
      return DEFAULTS;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return { settings, isLoading };
};

export { DEFAULTS as FOOTER_DEFAULTS, SETTINGS_KEY as FOOTER_SETTINGS_KEY };
