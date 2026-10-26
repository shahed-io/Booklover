import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const CHECKOUT_CONFIG_KEY = 'checkout_config';

export type CheckoutPaymentId =
  | 'cod' | 'bkash_online' | 'bkash' | 'nagad' | 'rocket' | 'upay'
  | 'bkash_merchant' | 'bank_transfer' | 'wallet' | 'uddoktapay';

export type CheckoutFieldType = 'text' | 'textarea' | 'select' | 'number';

export interface CheckoutCustomField {
  id: string;
  label: string;
  type: CheckoutFieldType;
  placeholder: string;
  /** Options for `select` type */
  options: string[];
  required: boolean;
  enabled: boolean;
}

export interface CheckoutConfig {
  /* Customer fields */
  showEmailField: boolean;
  requireEmail: boolean;
  showLoginButton: boolean;
  /* Sections */
  showOrderNotes: boolean;
  showPaymentScreenshot: boolean;
  showCouponBox: boolean;
  showTrustBadges: boolean;
  showOrderSummary: boolean;
  showSecureNote: boolean;
  /* Terms */
  showTerms: boolean;
  requireTerms: boolean;
  /* Payment methods */
  enabledPaymentMethods: CheckoutPaymentId[];
  defaultPaymentMethod: CheckoutPaymentId;
  /* Copy */
  customerSectionTitle: string;
  paymentSectionTitle: string;
  notesPlaceholder: string;
  codTitle: string;
  codNote: string;
  codBullets: string[];
  codButtonText: string;
  codNotice: string;
  topNotice: string;
  /** Extra admin-defined fields shown in the customer info section */
  customFields: CheckoutCustomField[];
}

export const ALL_PAYMENT_METHODS: { id: CheckoutPaymentId; label: string }[] = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'uddoktapay', label: 'UddoktaPay' },
  { id: 'bkash', label: 'bKash (Manual)' },
  { id: 'bkash_merchant', label: 'bKash Merchant' },
  { id: 'nagad', label: 'Nagad' },
  { id: 'rocket', label: 'Rocket' },
  { id: 'upay', label: 'Upay' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'wallet', label: 'Wallet Balance' },
];

export const CHECKOUT_CONFIG_DEFAULT: CheckoutConfig = {
  showEmailField: true,
  requireEmail: false,
  showLoginButton: true,
  showOrderNotes: true,
  showPaymentScreenshot: true,
  showCouponBox: true,
  showTrustBadges: true,
  showOrderSummary: true,
  showSecureNote: true,
  showTerms: true,
  requireTerms: true,
  enabledPaymentMethods: ['cod', 'bkash', 'nagad', 'rocket', 'upay', 'bkash_merchant', 'bank_transfer', 'wallet', 'uddoktapay'],
  defaultPaymentMethod: 'cod',
  customerSectionTitle: 'আপনার তথ্য',
  paymentSectionTitle: 'পেমেন্ট পদ্ধতি',
  notesPlaceholder: 'কোনো বিশেষ নির্দেশনা বা মন্তব্য...',
  codTitle: 'ক্যাশ অন ডেলিভারি',
  codNote: 'পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা পরিশোধ করুন। এখন কোনো অগ্রিম পেমেন্ট বা Transaction ID দরকার নেই।',
  codBullets: [
    'অর্ডার কনফার্ম করতে আমরা ফোনে যোগাযোগ করব',
    'সারা বাংলাদেশে হোম ডেলিভারি',
  ],
  codButtonText: 'অর্ডার করুন',
  codNotice: '',
  topNotice: '',
  customFields: [
    {
      id: 'full_address',
      label: 'সম্পূর্ণ ঠিকানা',
      type: 'textarea',
      placeholder: 'বাসা/রোড, এলাকা, থানা, জেলা',
      options: [],
      required: true,
      enabled: true,
    },
  ],
};

export const newCustomField = (): CheckoutCustomField => ({
  id: `field_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  label: '',
  type: 'text',
  placeholder: '',
  options: [],
  required: false,
  enabled: true,
});

export function parseCheckoutConfig(raw: unknown): CheckoutConfig {
  if (!raw) return CHECKOUT_CONFIG_DEFAULT;
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!obj || typeof obj !== 'object') return CHECKOUT_CONFIG_DEFAULT;
    const merged = { ...CHECKOUT_CONFIG_DEFAULT, ...(obj as Partial<CheckoutConfig>) };
    if (!Array.isArray(merged.enabledPaymentMethods) || merged.enabledPaymentMethods.length === 0) {
      merged.enabledPaymentMethods = CHECKOUT_CONFIG_DEFAULT.enabledPaymentMethods;
    }
    merged.codBullets = Array.isArray(merged.codBullets)
      ? merged.codBullets.map(String).map(v => v.trim()).filter(Boolean).slice(0, 6)
      : CHECKOUT_CONFIG_DEFAULT.codBullets;
    merged.customFields = Array.isArray(merged.customFields)
      ? merged.customFields
          .filter((f): f is CheckoutCustomField => !!f && typeof f === 'object' && typeof (f as any).label === 'string')
          .map((f, i) => ({
            id: String(f.id || `field_${i}`),
            label: String(f.label || ''),
            type: (['text', 'textarea', 'select', 'number'].includes(f.type) ? f.type : 'text') as CheckoutFieldType,
            placeholder: String(f.placeholder || ''),
            options: Array.isArray(f.options) ? f.options.map(String).filter(Boolean) : [],
            required: Boolean(f.required),
            enabled: f.enabled !== false,
          }))
      : [];
    return merged;
  } catch {
    return CHECKOUT_CONFIG_DEFAULT;
  }
}

/** Reads admin-controlled checkout options from site_settings. */
export function useCheckoutConfig() {
  const [config, setConfig] = useState<CheckoutConfig>(CHECKOUT_CONFIG_DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', CHECKOUT_CONFIG_KEY)
        .maybeSingle();
      if (!alive) return;
      setConfig(parseCheckoutConfig(data?.value));
      setLoading(false);
    })();

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('checkout-config');
      bc.onmessage = (e) => setConfig(parseCheckoutConfig(e.data));
    } catch { /* unsupported */ }

    return () => { alive = false; bc?.close(); };
  }, []);

  return { config, loading };
}
