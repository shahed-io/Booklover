import { describe, expect, it } from 'vitest';
import { DEFAULT_PAYMENT_CONFIGS } from '@/hooks/usePaymentSettings';
import { FOOTER_DEFAULTS } from '@/hooks/useFooterSettings';
import { DEFAULT_INVOICE_DESIGN } from '@/lib/invoiceSettings';
import { productSchema } from '@/components/seo/schemas';

describe('owner-configured commerce defaults', () => {
  it('never enables inherited payment recipients', () => {
    expect(DEFAULT_PAYMENT_CONFIGS.filter(p => p.isActive)).toEqual([]);
    expect(DEFAULT_PAYMENT_CONFIGS.map(p => p.number)).toEqual(['', '', '', '', '', '']);
    const bank = DEFAULT_PAYMENT_CONFIGS.find(p => p.id === 'bank_transfer');
    expect(bank?.accountName).toBe('');
    expect(bank?.routingNumber).toBe('');
  });
  it('has no unapproved contact destination', () => {
    expect([FOOTER_DEFAULTS.phone, FOOTER_DEFAULTS.email, FOOTER_DEFAULTS.address, FOOTER_DEFAULTS.facebook_url, FOOTER_DEFAULTS.whatsapp_url, FOOTER_DEFAULTS.instagram_url, FOOTER_DEFAULTS.telegram_url]).toEqual(['','','','','','','']);
    expect([DEFAULT_INVOICE_DESIGN.companyEmail, DEFAULT_INVOICE_DESIGN.companyPhone, DEFAULT_INVOICE_DESIGN.companyAddress]).toEqual(['','','']);
  });
  it('publishes only supplied ratings and prices', () => {
    const product = productSchema({name:'Catalog book', slug:'catalog-book', price:320});
    expect(product.offers.price).toBe(320);
    expect(product).not.toHaveProperty('aggregateRating');
    expect(product.offers).not.toHaveProperty('shippingDetails');
    expect(product.offers).not.toHaveProperty('hasMerchantReturnPolicy');
    expect(productSchema({name:'Reviewed book',slug:'reviewed-book',price:410,rating:4.2,reviewCount:6}).aggregateRating?.reviewCount).toBe(6);
  });
});
