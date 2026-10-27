export const normalizeBrandNameText = (value: string): string => (value || '').replace(/ {2,}/g, ' ');

export const normalizeBrandNameDeep = <T,>(value: T): T => {
  if (typeof value === 'string') return normalizeBrandNameText(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeBrandNameDeep(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeBrandNameDeep(item)])
    ) as T;
  }
  return value;
};

export const normalizeBrandNameFaqs = <T extends { q: string; a: string }>(faqs: T[]): T[] =>
  faqs.map((faq) => ({
    ...faq,
    q: normalizeBrandNameText(faq.q),
    a: normalizeBrandNameText(faq.a),
  }));
