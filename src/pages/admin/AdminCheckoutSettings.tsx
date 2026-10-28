import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Save, ShoppingCart, ToggleLeft, ToggleRight, RotateCcw, CreditCard, Type, Loader2, ExternalLink,
  Plus, Trash2, ListPlus, ArrowUp, ArrowDown, X,
} from 'lucide-react';
import {
  CHECKOUT_CONFIG_KEY,
  CHECKOUT_CONFIG_DEFAULT,
  ALL_PAYMENT_METHODS,
  parseCheckoutConfig,
  newCustomField,
  type CheckoutCustomField,
  type CheckoutFieldType,
  type CheckoutConfig,
  type CheckoutPaymentId,
} from '@/hooks/useCheckoutConfig';

const inputCls =
  'w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors';

const TOGGLES: { key: keyof CheckoutConfig; label: string; hint: string }[] = [
  { key: 'showEmailField', label: 'Email field', hint: 'Show the email input in the customer info form' },
  { key: 'requireEmail', label: 'Email required', hint: 'Customer cannot place an order without an email' },
  { key: 'showLoginButton', label: 'Login button', hint: 'Show the "লগইন করুন" shortcut in the header' },
  { key: 'showOrderNotes', label: 'Order notes', hint: 'Let customers add a note to the order' },
  { key: 'showPaymentScreenshot', label: 'Payment screenshot upload', hint: 'Optional proof upload for manual payments' },
  { key: 'showCouponBox', label: 'Coupon box', hint: 'Allow applying coupon codes at checkout' },
  { key: 'showOrderSummary', label: 'Order summary panel', hint: 'Cart items and price breakdown' },
  { key: 'showTrustBadges', label: 'Trust badges', hint: 'Delivery / secure payment badges' },
  { key: 'showSecureNote', label: 'Secure checkout note', hint: 'Small line under the confirm button' },
  { key: 'showTerms', label: 'Terms & conditions box', hint: 'Show the terms checkbox' },
  { key: 'requireTerms', label: 'Terms required', hint: 'Order button stays disabled until accepted' },
];

const AdminCheckoutSettings = () => {
  const [config, setConfig] = useState<CheckoutConfig>(CHECKOUT_CONFIG_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', CHECKOUT_CONFIG_KEY)
        .maybeSingle();
      setConfig(parseCheckoutConfig(data?.value));
      setLoading(false);
    })();
  }, []);

  const set = <K extends keyof CheckoutConfig>(key: K, value: CheckoutConfig[K]) =>
    setConfig(p => ({ ...p, [key]: value }));

  const togglePm = (id: CheckoutPaymentId) => {
    setConfig(p => {
      const on = p.enabledPaymentMethods.includes(id);
      const next = on
        ? p.enabledPaymentMethods.filter(m => m !== id)
        : [...p.enabledPaymentMethods, id];
      if (next.length === 0) {
        toast.error('At least one payment method must stay enabled');
        return p;
      }
      const defaultPaymentMethod = next.includes(p.defaultPaymentMethod) ? p.defaultPaymentMethod : next[0];
      return { ...p, enabledPaymentMethods: next, defaultPaymentMethod };
    });
  };

  /* ── Custom fields helpers ─────────────────────────── */
  const updateField = (id: string, patch: Partial<CheckoutCustomField>) =>
    setConfig(p => ({ ...p, customFields: p.customFields.map(f => (f.id === id ? { ...f, ...patch } : f)) }));

  const removeField = (id: string) =>
    setConfig(p => ({ ...p, customFields: p.customFields.filter(f => f.id !== id) }));

  const addField = () =>
    setConfig(p => ({ ...p, customFields: [...p.customFields, newCustomField()] }));

  const moveField = (index: number, dir: -1 | 1) =>
    setConfig(p => {
      const next = [...p.customFields];
      const target = index + dir;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...p, customFields: next };
    });

  const save = async () => {
    setSaving(true);
    const invalid = config.customFields.find(f => !f.label.trim());
    if (invalid) { setSaving(false); toast.error('Every custom field needs a label'); return; }
    const emptySelect = config.customFields.find(f => f.type === 'select' && f.options.length === 0);
    if (emptySelect) { setSaving(false); toast.error(`"${emptySelect.label}" needs at least one option`); return; }

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: CHECKOUT_CONFIG_KEY, value: JSON.stringify(config), category: 'checkout' }, { onConflict: 'key' });
    setSaving(false);
    if (error) { toast.error('Save failed: ' + error.message); return; }
    try { new BroadcastChannel('checkout-config').postMessage(config); } catch { /* noop */ }
    toast.success('Checkout settings saved');
  };

  const Switch = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 ${on ? 'text-primary' : 'text-muted-foreground'}`}
      aria-pressed={on}
    >
      {on ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading checkout settings…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary" /> Checkout Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control which options appear on the storefront checkout page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/checkout"
            target="_blank"
            rel="noreferrer"
            className="glass-card px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <ExternalLink size={15} /> Preview
          </a>
          <button
            onClick={() => { setConfig(CHECKOUT_CONFIG_DEFAULT); toast.info('Reset to defaults — click Save to apply'); }}
            className="glass-card px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Changes
          </button>
        </div>
      </div>

      {/* Visible options */}
      <div className="glass-card rounded-2xl border border-border p-5">
        <h2 className="font-bold text-foreground mb-4">Checkout Page Options</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOGGLES.map(t => (
            <div key={t.key} className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
              <Switch on={Boolean(config[t.key])} onClick={() => set(t.key, !config[t.key] as never)} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="glass-card rounded-2xl border border-border p-5">
        <h2 className="font-bold text-foreground mb-1 flex items-center gap-2">
          <CreditCard size={17} className="text-primary" /> Payment Methods
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Turn methods on or off, and pick which one is pre-selected.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ALL_PAYMENT_METHODS.map(pm => {
            const on = config.enabledPaymentMethods.includes(pm.id);
            return (
              <div key={pm.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                <Switch on={on} onClick={() => togglePm(pm.id)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{pm.label}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{pm.id}</p>
                </div>
                <button
                  type="button"
                  disabled={!on}
                  onClick={() => set('defaultPaymentMethod', pm.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors disabled:opacity-40 ${
                    config.defaultPaymentMethod === pm.id
                      ? 'border-primary/50 bg-primary/15 text-primary font-bold'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {config.defaultPaymentMethod === pm.id ? 'Default' : 'Set default'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom fields */}
      <div className="glass-card rounded-2xl border border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <ListPlus size={17} className="text-primary" /> Extra Checkout Fields
          </h2>
          <button
            onClick={addField}
            className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Add your own inputs (delivery location, area, landmark, etc.) to the customer info section.
          Answers are saved with the order notes so you can see them in Orders.
        </p>

        {config.customFields.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-6 text-center">
            No extra fields. Click “Add Field” to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {config.customFields.map((f, i) => (
              <div key={f.id} className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Switch on={f.enabled} onClick={() => updateField(f.id, { enabled: !f.enabled })} />
                  <p className="text-sm font-semibold text-foreground flex-1 truncate">
                    {f.label || 'Untitled field'}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground font-mono">({f.type})</span>
                  </p>
                  <button onClick={() => moveField(i, -1)} disabled={i === 0}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30" title="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => moveField(i, 1)} disabled={i === config.customFields.length - 1}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30" title="Move down">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => removeField(f.id)}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10" title="Remove field">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Label</label>
                    <input value={f.label} onChange={e => updateField(f.id, { label: e.target.value })}
                      className={inputCls} maxLength={80} placeholder="যেমন: ডেলিভারি লোকেশন" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Type</label>
                    <select value={f.type}
                      onChange={e => updateField(f.id, { type: e.target.value as CheckoutFieldType })}
                      className={inputCls}>
                      <option value="text">Short text</option>
                      <option value="textarea">Long text</option>
                      <option value="select">Dropdown (options)</option>
                      <option value="number">Number</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Placeholder</label>
                    <input value={f.placeholder} onChange={e => updateField(f.id, { placeholder: e.target.value })}
                      className={inputCls} maxLength={120} />
                  </div>
                </div>

                {f.type === 'select' && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Options</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {f.options.map((opt, oi) => (
                        <span key={oi} className="flex items-center gap-1.5 text-xs bg-primary/10 border border-primary/25 text-foreground rounded-full pl-3 pr-1.5 py-1">
                          {opt}
                          <button
                            onClick={() => updateField(f.id, { options: f.options.filter((_, x) => x !== oi) })}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      className={inputCls}
                      placeholder="Type an option and press Enter (e.g. ঢাকার ভিতরে)"
                      onKeyDown={e => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        const v = e.currentTarget.value.trim();
                        if (!v) return;
                        updateField(f.id, { options: [...f.options, v] });
                        e.currentTarget.value = '';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Switch on={f.required} onClick={() => updateField(f.id, { required: !f.required })} />
                  <p className="text-xs text-muted-foreground">Required — customer must fill this before ordering</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Texts */}
      <div className="glass-card rounded-2xl border border-border p-5 space-y-4">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Type size={17} className="text-primary" /> Checkout Texts
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Customer info section title</label>
            <input value={config.customerSectionTitle} onChange={e => set('customerSectionTitle', e.target.value)} className={inputCls} maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Payment section title</label>
            <input value={config.paymentSectionTitle} onChange={e => set('paymentSectionTitle', e.target.value)} className={inputCls} maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Order notes placeholder</label>
            <input value={config.notesPlaceholder} onChange={e => set('notesPlaceholder', e.target.value)} className={inputCls} maxLength={160} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Top notice bar (empty = hidden)</label>
            <input value={config.topNotice} onChange={e => set('topNotice', e.target.value)} className={inputCls} maxLength={200} placeholder="যেমন: আজকের অর্ডারে ফ্রি ডেলিভারি" />
          </div>
        </div>
      </div>

      {/* Cash on Delivery */}
      <div className="glass-card rounded-2xl border border-border p-5 space-y-4">
        <div>
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <CreditCard size={17} className="text-primary" /> Cash on Delivery
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Customize every COD message shown to customers.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Payment method title</label>
            <input value={config.codTitle} onChange={e => set('codTitle', e.target.value)} className={inputCls} maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Order button text</label>
            <input value={config.codButtonText} onChange={e => set('codButtonText', e.target.value)} className={inputCls} maxLength={80} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5 block">COD description</label>
            <textarea value={config.codNote} onChange={e => set('codNote', e.target.value)} rows={3} maxLength={400} className={`${inputCls} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5 block">COD notice (empty = hidden)</label>
            <input value={config.codNotice} onChange={e => set('codNotice', e.target.value)} className={inputCls} maxLength={200} placeholder="Shown above the COD details" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5 block">Confirmation points (one per line)</label>
            <textarea
              value={config.codBullets.join('\n')}
              onChange={e => set('codBullets', e.target.value.split('\n').slice(0, 6))}
              rows={4}
              maxLength={500}
              className={`${inputCls} resize-none`}
              placeholder={'We will call to confirm the order\nNationwide home delivery'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCheckoutSettings;
