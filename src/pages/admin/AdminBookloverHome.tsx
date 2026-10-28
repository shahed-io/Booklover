import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BOOKLOVER_HOME_KEY, HOME_DEFAULTS, mergeHome, type HomeSettings } from '@/components/booklover/homeSettings';

const list = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

export default function AdminBookloverHome() {
  const qc = useQueryClient();
  const [s, setS] = useState<HomeSettings>(HOME_DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', BOOKLOVER_HOME_KEY).maybeSingle().then(({ data }) => {
      try { if (data?.value) setS(mergeHome(JSON.parse(data.value))); } catch { /* keep defaults */ }
    });
  }, []);

  const set = <K extends keyof HomeSettings>(k: K, v: HomeSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: BOOKLOVER_HOME_KEY, value: JSON.stringify(s), category: 'store' }, { onConflict: 'key' });
    setSaving(false);
    if (error) return toast.error('সেভ করতে সমস্যা হয়েছে');
    qc.invalidateQueries({ queryKey: ['site_settings', BOOKLOVER_HOME_KEY] });
    toast.success('হোমপেজ সেটিংস সেভ হয়েছে');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booklover হোমপেজ ও মেনু</h1>
        <Button onClick={save} disabled={saving}>{saving ? 'সেভ হচ্ছে…' : 'সেভ করুন'}</Button>
      </div>

      <Card><CardHeader><CardTitle>ব্যানার স্লাইড</CardTitle></CardHeader><CardContent className="space-y-4">
        <div><Label>ছোট শিরোনাম</Label><Input value={s.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></div>
        {s.banners.map((b, i) => (
          <div key={i} className="border rounded-md p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="font-medium">স্লাইড {i + 1}</span>
              <Button variant="ghost" size="icon" aria-label="Remove slide" disabled={s.banners.length < 2} onClick={() => set('banners', s.banners.filter((_, j) => j !== i))}><Trash2 /></Button></div>
            <Label>শিরোনাম (নতুন লাইনে ভাঙবে)</Label>
            <Textarea rows={3} value={b.title} onChange={(e) => set('banners', s.banners.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
            <Label>সাব-টেক্সট</Label>
            <Textarea rows={2} value={b.subtitle} onChange={(e) => set('banners', s.banners.map((x, j) => j === i ? { ...x, subtitle: e.target.value } : x))} />
            <Label>ছবির লিংক (খালি রাখলে ডিফল্ট ছবি)</Label>
            <Input value={b.image} onChange={(e) => set('banners', s.banners.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} />
          </div>
        ))}
        <Button variant="outline" onClick={() => set('banners', [...s.banners, { title: '', subtitle: '', image: '' }])}><Plus /> স্লাইড যোগ করুন</Button>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>ওয়েবসাইট থিম</CardTitle></CardHeader><CardContent className="space-y-3">
        <Label>ভিজিটররা প্রথমে কোন থিম দেখবে (তারা উপরের ☀/☾ বাটন দিয়ে বদলাতে পারবে)</Label>
        <select className="border rounded-md p-2 w-full bg-background" value={s.theme} onChange={(e) => set('theme', e.target.value as 'dark' | 'white')}><option value="dark">ডার্ক থিম (bookhavenbd.shop এর মতো)</option><option value="white">হোয়াইট প্রিমিয়াম গ্লসি থিম</option></select>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>হোমপেজ সেকশন</CardTitle></CardHeader><CardContent className="space-y-3">
        <Label>কালেকশন সেকশনের শিরোনাম</Label><Input value={s.collectionsTitle} onChange={(e) => set('collectionsTitle', e.target.value)} />
        <Label>দেখানো কালেকশন (প্রতি লাইনে একটি নাম, ক্রম অনুযায়ী)</Label>
        <Textarea rows={8} value={s.featuredCollections.join('\n')} onChange={(e) => set('featuredCollections', list(e.target.value))} />
        <Label>বেস্টসেলার সেকশনের শিরোনাম</Label><Input value={s.bestsellerTitle} onChange={(e) => set('bestsellerTitle', e.target.value)} />
        <Label>কয়টি বই দেখাবে</Label><Input type="number" min={4} max={48} value={s.bestsellerCount} onChange={(e) => set('bestsellerCount', Math.max(4, Math.min(48, Number(e.target.value) || 16)))} />
        <Label>শেষ সেকশনের শিরোনাম</Label><Input value={s.spotlightTitle} onChange={(e) => set('spotlightTitle', e.target.value)} />
        <Label>শেষ সেকশনের কালেকশন লিংক (যেমন timeless-classics)</Label><Input value={s.spotlightCollection} onChange={(e) => set('spotlightCollection', e.target.value)} />
        <Label>শেষ সেকশনের ছবির লিংক</Label><Input value={s.spotlightImage} onChange={(e) => set('spotlightImage', e.target.value)} />
      </CardContent></Card>

      <Card><CardHeader><CardTitle>উপরের মেনু</CardTitle></CardHeader><CardContent className="space-y-4">
        {s.menuGroups.map((g, i) => (
          <div key={i} className="border rounded-md p-3 space-y-2">
            <div className="flex gap-2"><Input value={g.label} onChange={(e) => set('menuGroups', s.menuGroups.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
              <Button variant="ghost" size="icon" aria-label="Remove menu" onClick={() => set('menuGroups', s.menuGroups.filter((_, j) => j !== i))}><Trash2 /></Button></div>
            <Label>কালেকশন (প্রতি লাইনে একটি)</Label>
            <Textarea rows={5} value={g.collections.join('\n')} onChange={(e) => set('menuGroups', s.menuGroups.map((x, j) => j === i ? { ...x, collections: list(e.target.value) } : x))} />
          </div>
        ))}
        <Button variant="outline" onClick={() => set('menuGroups', [...s.menuGroups, { label: 'New menu', collections: [] }])}><Plus /> মেনু যোগ করুন</Button>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>সার্চ ইঞ্জিন (SEO)</CardTitle></CardHeader><CardContent className="space-y-3">
        <Label>পেজ টাইটেল</Label><Input value={s.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
        <Label>বিবরণ</Label><Textarea rows={2} value={s.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
      </CardContent></Card>
    </div>
  );
}
