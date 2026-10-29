import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export type BookVariantGroup = { name: string; options: { label: string; price: string; stock?: string | number | null | undefined }[] };
export default function BookVariantsEditor({ value, onChange }: { value: BookVariantGroup[]; onChange: (value: BookVariantGroup[]) => void }) {
  const input = 'w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground';
  const update = (gi: number, oi: number, key: 'label' | 'price' | 'stock', text: string) => onChange(value.map((g, i) => i === gi ? { ...g, options: g.options.map((o, j) => j === oi ? { ...o, [key]: text } : o) } : g));
  return <div className="space-y-3 border-t border-border pt-4">
    <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">বইয়ের ধরন, দাম ও স্টক</h3><Button size="sm" variant="outline" type="button" onClick={() => onChange([...value, { name: 'Book Cover Type', options: [{ label: 'Paperback', price: '', stock: '' }, { label: 'Hardcover', price: '', stock: '' }] }])}><Plus /> ধরন যোগ করুন</Button></div>
    {value.map((g, gi) => <div key={gi} className="space-y-2">
      <div className="flex gap-2"><input aria-label={`Variant group ${gi + 1}`} className={input} placeholder="Book Cover Type" value={g.name} onChange={e => onChange(value.map((v, i) => i === gi ? { ...v, name: e.target.value } : v))} /><Button type="button" size="icon" variant="ghost" aria-label="Remove variant group" onClick={() => onChange(value.filter((_, i) => i !== gi))}><X /></Button></div>
      {g.options.map((o, oi) => <div key={oi} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_36px] gap-2">
        <input className={input} aria-label={`Binding ${gi + 1}-${oi + 1}`} placeholder="Paperback" value={o.label} onChange={e => update(gi, oi, 'label', e.target.value)} />
        <input className={input} aria-label={`Binding price ${gi + 1}-${oi + 1}`} type="number" min="0" step="0.01" placeholder="দাম ৳" value={o.price} onChange={e => update(gi, oi, 'price', e.target.value)} />
        <input className={input} aria-label={`Binding stock ${gi + 1}-${oi + 1}`} type="number" min="0" step="1" placeholder="স্টক" value={o.stock ?? ''} onChange={e => update(gi, oi, 'stock', e.target.value)} />
        <Button type="button" size="icon" variant="ghost" aria-label="Remove binding" onClick={() => onChange(value.map((v, i) => i === gi ? { ...v, options: v.options.filter((_, j) => j !== oi) } : v))}><X /></Button>
      </div>)}
      <Button type="button" size="sm" variant="ghost" onClick={() => onChange(value.map((v, i) => i === gi ? { ...v, options: [...v.options, { label: '', price: '', stock: '' }] } : v))}><Plus /> আরেকটি ধরন</Button>
    </div>)}
  </div>;
}