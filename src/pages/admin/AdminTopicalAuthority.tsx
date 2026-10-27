import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Network, Loader2, Play, X, CheckCircle2, AlertCircle, ExternalLink,
  Sofa, Home, ShieldCheck, Layers, Plus,
} from 'lucide-react';
import { toast } from 'sonner';

// ===== Topical Authority Clusters =====
// Furniture niches × pillar + supporting articles
// Each cluster = 1 pillar (broad) + ~20 supporting (specific) — internal-link goldmine
type Topic = { title: string; intent: string; pillar?: boolean };
type Cluster = { id: string; niche: string; icon: any; color: string; topics: Topic[] };

const CLUSTERS: Cluster[] = [];

const TOTAL = CLUSTERS.reduce((a, c) => a + c.topics.length, 0);

type QueueItem = {
  id: string;
  title: string;
  intent: string;
  niche: string;
  status: 'queued' | 'running' | 'success' | 'skipped' | 'error';
  message?: string;
  blog_slug?: string;
};

const AdminTopicalAuthority = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [autoPublish, setAutoPublish] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState(false);
  const [existingTitles, setExistingTitles] = useState<Set<string>>(new Set());
  const cancelRef = useRef(false);

  useEffect(() => {
    supabase.from('blog_categories').select('id, name').order('name').then(({ data }) => setCategories(data || []));
    supabase.from('blog_posts').select('title').then(({ data }) => {
      setExistingTitles(new Set((data || []).map((b: any) => b.title.toLowerCase().trim())));
    });
  }, []);

  const addCluster = (cluster: Cluster) => {
    const items: QueueItem[] = cluster.topics.map((t, i) => ({
      id: `${cluster.id}-${Date.now()}-${i}`,
      title: t.title,
      intent: t.intent,
      niche: cluster.niche,
      status: 'queued',
    }));
    setQueue((prev) => [...prev, ...items]);
    toast.success(`${cluster.niche}: ${items.length} topics added`);
  };

  const addAll = () => {
    const items: QueueItem[] = CLUSTERS.flatMap((c) =>
      c.topics.map((t, i) => ({
        id: `${c.id}-${Date.now()}-${i}-${Math.random()}`,
        title: t.title,
        intent: t.intent,
        niche: c.niche,
        status: 'queued' as const,
      }))
    );
    setQueue(items);
    toast.success(`All ${items.length} cluster topics queued`);
  };

  const addOne = (cluster: Cluster, topic: Topic) => {
    setQueue((prev) => [...prev, {
      id: `${cluster.id}-${Date.now()}-${Math.random()}`,
      title: topic.title, intent: topic.intent, niche: cluster.niche, status: 'queued',
    }]);
  };

  const clearQueue = () => setQueue([]);
  const removeItem = (id: string) => setQueue((prev) => prev.filter((q) => q.id !== id));

  const generate = async (item: QueueItem): Promise<Partial<QueueItem>> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/generate-topic-blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topic: item.title,
          intent: item.intent,
          category_id: selectedCategory || null,
          auto_publish: autoPublish,
          niche: item.niche,
        }),
      });
      const j = await res.json();
      if (j.error) return { status: 'error', message: j.error };
      if (j.status === 'skipped') return { status: 'skipped', message: j.message, blog_slug: j.existing?.slug };
      return { status: 'success', blog_slug: j.slug, message: `${j.word_count}w • ${j.faq_count} FAQs` };
    } catch (err: any) {
      return { status: 'error', message: err.message };
    }
  };

  const runQueue = async () => {
    const targets = queue.filter((q) => q.status === 'queued' || q.status === 'error');
    if (targets.length === 0) { toast.info('Queue is empty'); return; }
    const mins = Math.ceil(targets.length * 15 / 60);
    if (!confirm(`Generate ${targets.length} articles? Estimated time: ~${mins} minute${mins === 1 ? '' : 's'}.\n\nThis builds topical authority across your niches and significantly improves Google rankings.`)) return;
    cancelRef.current = false;
    setRunning(true);
    for (const item of targets) {
      if (cancelRef.current) break;
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'running' } : q)));
      const result = await generate(item);
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, ...result } : q)));
      await new Promise((r) => setTimeout(r, 1800));
    }
    setRunning(false);
    toast.success('Cluster generation complete');
  };

  const cancel = () => { cancelRef.current = true; toast.info('Cancelling after current item...'); };

  const stats = {
    queued: queue.filter((q) => q.status === 'queued').length,
    running: queue.filter((q) => q.status === 'running').length,
    success: queue.filter((q) => q.status === 'success').length,
    error: queue.filter((q) => q.status === 'error').length,
    skipped: queue.filter((q) => q.status === 'skipped').length,
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Network className="text-primary" /> Topical Authority Builder
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Google ranks sites that demonstrate <strong>topical authority</strong> — depth across a niche, not just one article. This builder publishes <strong>{TOTAL}+ interconnected articles</strong> spanning <strong>Software, Digital License, Streaming, VPN & AI Tools</strong> — each cluster has a pillar post plus ~20 supporting articles, all internally linked.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-border bg-card p-4 grid md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1">Blog Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
            <option value="">— Uncategorized —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={autoPublish} onChange={(e) => setAutoPublish(e.target.checked)} className="w-4 h-4" />
            Auto-publish (skip draft)
          </label>
        </div>
        <div className="flex items-end gap-2">
          <button onClick={addAll} disabled={running} className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            <Layers size={14} /> Queue All {TOTAL}
          </button>
        </div>
      </div>

      {/* Clusters */}
      <div className="grid md:grid-cols-2 gap-4">
        {CLUSTERS.map((cluster) => {
          const Icon = cluster.icon;
          return (
            <div key={cluster.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className={`bg-gradient-to-r ${cluster.color} text-white p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <Icon size={22} />
                  <div>
                    <h3 className="font-bold">{cluster.niche}</h3>
                    <p className="text-xs opacity-90">{cluster.topics.length} articles • 1 pillar + {cluster.topics.length - 1} supporting</p>
                  </div>
                </div>
                <button onClick={() => addCluster(cluster)} disabled={running} className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/30 text-xs font-semibold flex items-center gap-1 disabled:opacity-50">
                  <Plus size={12} /> Queue
                </button>
              </div>
              <div className="p-3 max-h-72 overflow-y-auto space-y-1">
                {cluster.topics.map((t, i) => {
                  const exists = existingTitles.has(t.title.toLowerCase().trim());
                  return (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-md text-xs ${t.pillar ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}>
                      {t.pillar && <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold shrink-0">PILLAR</span>}
                      <span className="flex-1">{t.title}</span>
                      {exists ? (
                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      ) : (
                        <button onClick={() => addOne(cluster, t)} disabled={running} className="text-primary hover:underline shrink-0 text-[11px]">+ Add</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Queue */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">Queue ({queue.length})</span>
            {stats.success > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-600">{stats.success} done</span>}
            {stats.error > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-600">{stats.error} errors</span>}
            {stats.skipped > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-600">{stats.skipped} skipped</span>}
            {stats.queued > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{stats.queued} queued</span>}
          </div>
          <div className="flex gap-2">
            {running ? (
              <button onClick={cancel} className="px-3 py-1.5 rounded-md border border-border text-sm flex items-center gap-1"><X size={14} /> Cancel</button>
            ) : (
              <>
                <button onClick={clearQueue} disabled={queue.length === 0} className="px-3 py-1.5 rounded-md border border-border text-sm disabled:opacity-50">Clear</button>
                <button onClick={runQueue} disabled={queue.length === 0} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1 disabled:opacity-50">
                  <Play size={14} /> Run Queue
                </button>
              </>
            )}
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
          {queue.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">Queue is empty. Add a cluster above to begin building topical authority.</div>
          )}
          {queue.map((q) => (
            <div key={q.id} className="p-3 flex items-start gap-3 text-sm">
              <div className="shrink-0 pt-0.5">
                {q.status === 'queued' && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                {q.status === 'running' && <Loader2 className="animate-spin text-primary" size={16} />}
                {q.status === 'success' && <CheckCircle2 className="text-green-500" size={16} />}
                {q.status === 'skipped' && <AlertCircle className="text-yellow-500" size={16} />}
                {q.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{q.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-muted">{q.niche}</span>
                  <span>{q.intent}</span>
                  {q.message && <span className="truncate">• {q.message}</span>}
                  {q.blog_slug && (
                    <a href={`/blog/${q.blog_slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
              {q.status === 'queued' && !running && (
                <button onClick={() => removeItem(q.id)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTopicalAuthority;
