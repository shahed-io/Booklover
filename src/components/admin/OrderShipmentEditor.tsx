import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { shipmentLabels, shipmentSchema } from '@/lib/bookAdministration';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

type Shipment = { id: string; courier_name?: string | null; tracking_number?: string | null; tracking_url?: string | null; shipment_status?: string; shipped_at?: string | null };
export default function OrderShipmentEditor({ order, onSaved }: { order: Shipment; onSaved: (updates: Record<string, unknown>) => void }) {
  const [form, setForm] = useState({ courier_name: order.courier_name || '', tracking_number: order.tracking_number || '', tracking_url: order.tracking_url || '', shipment_status: order.shipment_status || 'not_shipped' });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const parsed = shipmentSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || 'ডেলিভারির তথ্য যাচাই করুন'); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from('orders').update({ ...parsed.data, tracking_url: parsed.data.tracking_url || null }).eq('id', order.id).select('courier_name,tracking_number,tracking_url,shipment_status,shipped_at').single();
      if (error) throw error;
      onSaved(data);
      toast.success('ডেলিভারির তথ্য সংরক্ষণ হয়েছে');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'ডেলিভারির তথ্য সংরক্ষণ হয়নি'); }
    finally { setSaving(false); }
  };
  const input = 'mt-1 w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground';
  return <div className="space-y-3 border-t border-border pt-4">
    <h3 className="text-sm font-semibold text-foreground">কুরিয়ার ও ডেলিভারি</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="text-xs text-muted-foreground">কুরিয়ারের নাম<input aria-label="কুরিয়ারের নাম" className={input} value={form.courier_name} onChange={e => setForm({ ...form, courier_name: e.target.value })} /></label>
      <label className="text-xs text-muted-foreground">ট্র্যাকিং নম্বর<input aria-label="ট্র্যাকিং নম্বর" className={input} value={form.tracking_number} onChange={e => setForm({ ...form, tracking_number: e.target.value })} /></label>
      <label className="text-xs text-muted-foreground">ট্র্যাকিং লিংক<input aria-label="ট্র্যাকিং লিংক" className={input} value={form.tracking_url} onChange={e => setForm({ ...form, tracking_url: e.target.value })} placeholder="https://" /></label>
      <label className="text-xs text-muted-foreground">ডেলিভারির অবস্থা<select aria-label="ডেলিভারির অবস্থা" className={input} value={form.shipment_status} onChange={e => setForm({ ...form, shipment_status: e.target.value })}>{Object.entries(shipmentLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
    </div>
    {order.shipped_at && <p className="text-xs text-muted-foreground">পাঠানো হয়েছে: {new Date(order.shipped_at).toLocaleString('bn-BD')}</p>}
    <Button type="button" size="sm" disabled={saving} onClick={save}><Save /> {saving ? 'সংরক্ষণ হচ্ছে…' : 'ডেলিভারির তথ্য সংরক্ষণ'}</Button>
  </div>;
}