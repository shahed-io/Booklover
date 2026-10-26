// Brand name normalization
//   • English contexts  → "Relaxo Bean Bag"
//   • Bengali contexts  → "রিলাক্সো বিন ব্যাগ"

const EN_NAME = 'Relaxo Bean Bag';
const BN_NAME = 'রিলাক্সো বিন ব্যাগ';

// Bengali Unicode range
const BN_RE = /[\u0980-\u09FF]/;

const isBengaliContext = (full: string, matchIndex: number, matchLen: number): boolean => {
  const before = full.slice(Math.max(0, matchIndex - 40), matchIndex);
  const after = full.slice(matchIndex + matchLen, matchIndex + matchLen + 40);
  return BN_RE.test(before) || BN_RE.test(after);
};

export const normalizeBrandNameText = (value: string): string => {
  let out = value || '';

  // 1. Common English variants → canonical English name
  out = out
    .replace(/RelaxoBeanBag/gi, EN_NAME)
    .replace(/\bRelaxo\s+Bean\s+Bags?\b/gi, EN_NAME)
    .replace(/\bRelaxo\s{2,}Bean\s{2,}Bag\b/gi, EN_NAME);

  // 2. In Bengali contexts use the Bengali form (keeps case markers like "-এর")
  out = out.replace(
    /Relaxo Bean Bag(\s*-\s*|\s+)?(এর|কে|তে|এ|ের|য়|ে)?/g,
    (match, separator, suffix, offset, full) => {
      if (isBengaliContext(full, offset, match.length)) {
        return BN_NAME + (suffix ? '' : separator || '') + (suffix || '');
      }
      return EN_NAME + (separator && !suffix ? separator : '') + (suffix || '');
    }
  );

  // 3. Country suffixes
  out = out
    .replace(/Relaxo Bean Bag\s*বাংলাদেশ/g, `${BN_NAME} বাংলাদেশ`)
    .replace(/Relaxo Bean Bag\s*Bangladesh/gi, `${EN_NAME} Bangladesh`)
    .replace(/Relaxo Bean Bag\s*BD/gi, `${EN_NAME} BD`);

  // 4. Ensure the Bengali brand name is followed by a space before other Bengali words
  out = out.replace(
    /রিলাক্সো\s*বিন\s*ব্যাগ(?!\s|[\-এরকেতেএেরয়ে])([\u0980-\u09FF])/g,
    `${BN_NAME} $1`
  );

  // 5. Generic: ensure a space between Latin letters/digits and Bengali script
  out = out
    .replace(/([A-Za-z0-9])([\u0985-\u09B9\u09BE-\u09CC\u09D7\u09DC-\u09DF])/g, '$1 $2')
    .replace(/([\u0985-\u09B9\u09BE-\u09CC\u09D7\u09DC-\u09DF])([A-Za-z0-9])/g, '$1 $2');

  // 6. Cleanup
  return out
    .replace(/\s+([।.,!?…])/g, '$1')
    .replace(/ {2,}/g, ' ');
};

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
