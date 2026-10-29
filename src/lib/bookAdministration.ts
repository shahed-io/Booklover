import { z } from 'zod';

export const bookFields = [
  ['author', 'Author / লেখক', 'Author'],
  ['publisher', 'Publisher / প্রকাশক', 'Publisher'],
  ['isbn', 'ISBN', 'ISBN'],
  ['language', 'Language / ভাষা', 'Language'],
  ['pages', 'Pages / পৃষ্ঠা', 'Pages'],
  ['edition', 'Edition / সংস্করণ', 'Edition'],
  ['year', 'Publication year / প্রকাশের বছর', 'Publication Year'],
  ['binding', 'Binding / বাঁধাই', 'Binding'],
] as const;
export type BookMetadata = Record<typeof bookFields[number][0], string>;
export type BookAttribute = { key: string; value: string };
export const emptyBookMetadata: BookMetadata = { author: '', publisher: '', isbn: '', language: '', pages: '', edition: '', year: '', binding: '' };
export function readBookMetadata(attributes: BookAttribute[]) {
  const metadata = { ...emptyBookMetadata };
  const custom: BookAttribute[] = [];
  for (const attribute of attributes) {
    const field = bookFields.find(([key, , label]) => [key, label.toLowerCase()].includes(attribute.key.trim().toLowerCase()));
    if (field) metadata[field[0]] = attribute.value;
    else custom.push(attribute);
  }
  return { metadata, custom };
}
export function writeBookMetadata(metadata: BookMetadata, custom: BookAttribute[]) {
  return [...bookFields.flatMap(([key, , label]) => metadata[key].trim() ? [{ key: label, value: metadata[key].trim() }] : []), ...custom.filter(a => a.key.trim())];
}
const optionalInteger = z.string().refine(v => v === '' || /^\d+$/.test(v), 'Use a non-negative whole number');
export const bookInventorySchema = z.object({
  stock: optionalInteger,
  threshold: optionalInteger,
  pages: optionalInteger.refine(v => !v || Number(v) > 0, 'Page count must be positive'),
  year: z.string().refine(v => !v || /^\d{4}$/.test(v), 'Publication year must have four digits'),
});
export function lowStock(quantity: number | null | undefined, threshold = 5) {
  return quantity != null && quantity <= threshold;
}
export const shipmentSchema = z.object({
  courier_name: z.string().trim().max(120),
  tracking_number: z.string().trim().max(160),
  tracking_url: z.string().trim().refine(v => !v || /^https:\/\/[^\s]+$/.test(v), 'Tracking link must use HTTPS'),
  shipment_status: z.enum(['not_shipped', 'packed', 'shipped', 'delivered', 'returned']),
}).refine(v => !['shipped', 'delivered'].includes(v.shipment_status) || !!(v.courier_name && v.tracking_number), 'Courier and tracking number are required before dispatch');
export const shipmentLabels: Record<string, string> = { not_shipped: 'এখনো পাঠানো হয়নি', packed: 'প্যাক করা হয়েছে', shipped: 'কুরিয়ারে পাঠানো হয়েছে', delivered: 'ডেলিভারি হয়েছে', returned: 'ফেরত এসেছে' };