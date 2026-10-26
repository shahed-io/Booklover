import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const REFERRAL_CONFIG_KEY = 'referral_config';

export interface ReferralTier {
  name: string;
  label: string;
  emoji: string;
  min: number;
  reward: number;
  color: string;
}

export interface ReferralConfig {
  enabled: boolean;
  google_signup_reward: number;
  referred_discount_percent: number;
  redeem_ratio: number;
  program_title: string;
  program_subtitle: string;
  share_message: string;
  how_it_works: string[];
  terms: string;
  tiers: ReferralTier[];
}

export const REFERRAL_CONFIG_DEFAULT: ReferralConfig = {
  enabled: true,
  google_signup_reward: 20,
  referred_discount_percent: 5,
  redeem_ratio: 2,
  program_title: 'রেফারেল প্রোগ্রাম',
  program_subtitle: 'বন্ধুকে আমন্ত্রণ জানিয়ে ক্রেডিট জিতুন',
  share_message: 'Relaxo Bean Bag থেকে কিনুন — আমার রেফারেল কোড ব্যবহার করে ছাড় পান!',
  how_it_works: [
    'আপনার রেফারেল কোড বা লিংক বন্ধুকে শেয়ার করুন',
    'বন্ধু সাইনআপ করলে সে স্থায়ী ছাড় পাবে',
    'আপনি রেফারেল ক্রেডিট পাবেন, যা অর্ডারে ব্যবহার করা যাবে',
  ],
  terms: 'একই IP থেকে সাইনআপ করলে রেফারেল বোনাস প্রযোজ্য নয়। ক্রেডিট ব্যবহারের জন্য নির্ধারিত অনুপাত মানতে হবে।',
  tiers: [
    { name: 'bronze',   label: 'ব্রোঞ্জ',    emoji: '🥉', min: 0,  reward: 50,  color: 'hsl(30,60%,55%)' },
    { name: 'silver',   label: 'সিলভার',     emoji: '🥈', min: 5,  reward: 75,  color: 'hsl(220,15%,70%)' },
    { name: 'gold',     label: 'গোল্ড',      emoji: '🥇', min: 15, reward: 100, color: 'hsl(45,90%,52%)' },
    { name: 'platinum', label: 'প্লাটিনাম', emoji: '💎', min: 30, reward: 150, color: 'hsl(185,90%,52%)' },
    { name: 'diamond',  label: 'ডায়মন্ড',   emoji: '💠', min: 50, reward: 200, color: 'hsl(271,91%,65%)' },
  ],
};

export const normalizeReferralConfig = (raw: any): ReferralConfig => {
  const cfg = { ...REFERRAL_CONFIG_DEFAULT, ...(raw || {}) } as ReferralConfig;
  cfg.tiers = Array.isArray(raw?.tiers) && raw.tiers.length
    ? raw.tiers
        .map((t: any, i: number) => ({
          name: String(t?.name || `tier_${i + 1}`),
          label: String(t?.label || t?.name || `Tier ${i + 1}`),
          emoji: String(t?.emoji || '🎁'),
          min: Number(t?.min) || 0,
          reward: Number(t?.reward) || 0,
          color: String(t?.color || 'hsl(var(--primary))'),
        }))
        .sort((a: ReferralTier, b: ReferralTier) => a.min - b.min)
    : REFERRAL_CONFIG_DEFAULT.tiers;
  cfg.how_it_works = Array.isArray(raw?.how_it_works) && raw.how_it_works.length
    ? raw.how_it_works.map((s: any) => String(s))
    : REFERRAL_CONFIG_DEFAULT.how_it_works;
  cfg.enabled = raw?.enabled !== false;
  cfg.google_signup_reward = Number(raw?.google_signup_reward ?? REFERRAL_CONFIG_DEFAULT.google_signup_reward);
  cfg.referred_discount_percent = Number(raw?.referred_discount_percent ?? REFERRAL_CONFIG_DEFAULT.referred_discount_percent);
  cfg.redeem_ratio = Math.max(1, Number(raw?.redeem_ratio ?? REFERRAL_CONFIG_DEFAULT.redeem_ratio));
  return cfg;
};

export const getReferralTier = (cfg: ReferralConfig, count: number): ReferralTier => {
  const sorted = [...cfg.tiers].sort((a, b) => a.min - b.min);
  let current = sorted[0] || REFERRAL_CONFIG_DEFAULT.tiers[0];
  for (const t of sorted) if (count >= t.min) current = t;
  return current;
};

export const getNextReferralTier = (cfg: ReferralConfig, count: number): ReferralTier | null => {
  const sorted = [...cfg.tiers].sort((a, b) => a.min - b.min);
  return sorted.find(t => t.min > count) || null;
};

export const fetchReferralConfig = async (): Promise<ReferralConfig> => {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', REFERRAL_CONFIG_KEY)
    .maybeSingle();
  if (!data?.value) return REFERRAL_CONFIG_DEFAULT;
  try {
    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    return normalizeReferralConfig(parsed);
  } catch {
    return REFERRAL_CONFIG_DEFAULT;
  }
};

export const saveReferralConfig = async (cfg: ReferralConfig) => {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: REFERRAL_CONFIG_KEY, value: JSON.stringify(cfg), category: 'store' }, { onConflict: 'key' });
  if (error) throw error;
  try { new BroadcastChannel('referral_config').postMessage('updated'); } catch { /* noop */ }
};

export const useReferralConfig = () => {
  const [config, setConfig] = useState<ReferralConfig>(REFERRAL_CONFIG_DEFAULT);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const cfg = await fetchReferralConfig();
    setConfig(cfg);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel('referral_config');
      ch.onmessage = () => reload();
    } catch { /* noop */ }
    return () => { try { ch?.close(); } catch { /* noop */ } };
  }, [reload]);

  return { config, loading, reload };
};
