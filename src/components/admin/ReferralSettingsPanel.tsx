import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, RotateCcw, Loader2, Gift } from 'lucide-react';
import {
  ReferralConfig, ReferralTier, REFERRAL_CONFIG_DEFAULT,
  fetchReferralConfig, saveReferralConfig,
} from '@/hooks/useReferralConfig';

const inputCls =
  'w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors';

const Section = ({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-5 space-y-4">
    <div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

const ReferralSettingsPanel = () => {
  const [cfg, setCfg] = useState<ReferralConfig>(REFERRAL_CONFIG_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReferralConfig().then(c => { setCfg(c); setLoading(false); });
  }, []);

  const set = <K extends keyof ReferralConfig>(key: K, value: ReferralConfig[K]) =>
    setCfg(prev => ({ ...prev, [key]: value }));

  const setTier = (i: number, patch: Partial<ReferralTier>) =>
    setCfg(prev => ({ ...prev, tiers: prev.tiers.map((t, idx) => idx === i ? { ...t, ...patch } : t) }));

  const addTier = () =>
    setCfg(prev => ({
      ...prev,
      tiers: [...prev.tiers, {
        name: `tier_${prev.tiers.length + 1}`,
        label: 'নতুন টিয়ার',
        emoji: '🎁',
        min: (prev.tiers[prev.tiers.length - 1]?.min || 0) + 10,
        reward: 50,
        color: 'hsl(258,78%,65%)',
      }],
    }));

  const removeTier = (i: number) =>
    setCfg(prev => ({ ...prev, tiers: prev.tiers.filter((_, idx) => idx !== i) }));

  const setStep = (i: number, text: string) =>
    setCfg(prev => ({ ...prev, how_it_works: prev.how_it_works.map((s, idx) => idx === i ? text : s) }));

  const handleSave = async () => {
    if (!cfg.tiers.length) { toast.error('অন্তত একটি টিয়ার রাখতে হবে'); return; }
    setSaving(true);
    try {
      const clean: ReferralConfig = {
        ...cfg,
        google_signup_reward: Number(cfg.google_signup_reward) || 0,
        referred_discount_percent: Number(cfg.referred_discount_percent) || 0,
        redeem_ratio: Math.max(1, Number(cfg.redeem_ratio) || 1),
        how_it_works: cfg.how_it_works.filter(s => s.trim()),
        tiers: [...cfg.tiers]
          .map(t => ({ ...t, min: Number(t.min) || 0, reward: Number(t.reward) || 0 }))
          .sort((a, b) => a.min - b.min),
      };
      await saveReferralConfig(clean);
      setCfg(clean);
      toast.success('রেফারেল সেটিংস সেভ হয়েছে — সাইটে সাথে সাথে প্রযোজ্য');
    } catch {
      toast.error('সেভ ব্যর্থ হয়েছে');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse bg-muted/20 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Save bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 glass-card rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gift size={16} className="text-primary" />
          এই সেটিংস দিয়ে পুরো রেফারেল সিস্টেম নিয়ন্ত্রণ হয় (ফ্রন্টএন্ড + সার্ভার)
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCfg(REFERRAL_CONFIG_DEFAULT)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-card text-muted-foreground hover:text-foreground transition-all">
            <RotateCcw size={13} /> ডিফল্ট
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-60">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} সেভ করুন
          </button>
        </div>
      </div>

      <Section title="প্রোগ্রাম স্ট্যাটাস ও রিওয়ার্ড" desc="সাইনআপ রিওয়ার্ড, ডিসকাউন্ট ও ক্রেডিট ব্যবহারের নিয়ম">
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-foreground">রেফারেল প্রোগ্রাম চালু</p>
            <p className="text-xs text-muted-foreground">বন্ধ করলে নতুন রেফারেল প্রসেস হবে না</p>
          </div>
          <input type="checkbox" checked={cfg.enabled} onChange={e => set('enabled', e.target.checked)}
            className="w-5 h-5 accent-[hsl(var(--primary))]" />
        </label>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">রেফারকারীর রিওয়ার্ড (৳)</label>
            <input type="number" min={0} value={cfg.google_signup_reward}
              onChange={e => set('google_signup_reward', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">রেফার প্রাপকের ডিসকাউন্ট (%)</label>
            <input type="number" min={0} max={100} value={cfg.referred_discount_percent}
              onChange={e => set('referred_discount_percent', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">ক্রেডিট রিডিম অনুপাত (×)</label>
            <input type="number" min={1} step={0.5} value={cfg.redeem_ratio}
              onChange={e => set('redeem_ratio', Number(e.target.value))} className={inputCls} />
            <p className="text-[10px] text-muted-foreground mt-1">
              ৳১ ক্রেডিট ব্যবহারে অর্ডার সাবটোটাল কমপক্ষে {cfg.redeem_ratio || 1}× হতে হবে
            </p>
          </div>
        </div>
      </Section>

      <Section title="টিয়ার সিস্টেম" desc="যত বেশি সফল রেফার, তত বড় টিয়ার ও রিওয়ার্ড">
        <div className="space-y-3">
          {cfg.tiers.map((t, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end p-3 rounded-xl bg-muted/20">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">ইমোজি</label>
                <input value={t.emoji} onChange={e => setTier(i, { emoji: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">নাম (লেবেল)</label>
                <input value={t.label} onChange={e => setTier(i, { label: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">কী (ইংরেজি)</label>
                <input value={t.name} onChange={e => setTier(i, { name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">শুরু (রেফার সংখ্যা)</label>
                <input type="number" min={0} value={t.min} onChange={e => setTier(i, { min: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">রিওয়ার্ড (৳)</label>
                <input type="number" min={0} value={t.reward} onChange={e => setTier(i, { reward: Number(e.target.value) })} className={inputCls} />
              </div>
              <div className="flex items-center gap-2">
                <input type="color"
                  value={/^#/.test(t.color) ? t.color : '#7c5cff'}
                  onChange={e => setTier(i, { color: e.target.value })}
                  className="h-9 w-12 rounded-lg bg-transparent border border-border cursor-pointer" />
                <button onClick={() => removeTier(i)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors" title="মুছুন">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addTier}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-card text-primary hover:bg-primary/10 transition-all">
          <Plus size={13} /> নতুন টিয়ার
        </button>
      </Section>

      <Section title="টেক্সট ও কপি" desc="ইউজার ড্যাশবোর্ডে দেখানো লেখা">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">প্রোগ্রাম টাইটেল</label>
            <input value={cfg.program_title} onChange={e => set('program_title', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">সাবটাইটেল</label>
            <input value={cfg.program_subtitle} onChange={e => set('program_subtitle', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">শেয়ার মেসেজ</label>
          <textarea rows={2} value={cfg.share_message} onChange={e => set('share_message', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">শর্তাবলি / নোট</label>
          <textarea rows={2} value={cfg.terms} onChange={e => set('terms', e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground block">কীভাবে কাজ করে (ধাপ)</label>
          {cfg.how_it_works.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black bg-primary text-primary-foreground flex-shrink-0">{i + 1}</span>
              <input value={s} onChange={e => setStep(i, e.target.value)} className={inputCls} />
              <button onClick={() => setCfg(prev => ({ ...prev, how_it_works: prev.how_it_works.filter((_, idx) => idx !== i) }))}
                className="p-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={13} /></button>
            </div>
          ))}
          <button onClick={() => setCfg(prev => ({ ...prev, how_it_works: [...prev.how_it_works, ''] }))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-card text-primary hover:bg-primary/10 transition-all">
            <Plus size={13} /> ধাপ যোগ করুন
          </button>
        </div>
      </Section>
    </div>
  );
};

export default ReferralSettingsPanel;
