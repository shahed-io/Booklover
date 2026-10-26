// Brand name normalization (edge-function copy)
//   • English contexts  → "Relaxo Bean Bag"
//   • Bengali contexts  → "রিলাক্সো বিন ব্যাগ"

const EN_NAME = "Relaxo Bean Bag";
const BN_NAME = "রিলাক্সো বিন ব্যাগ";

const BN_RE = /[\u0980-\u09FF]/;

function isBengaliContext(full: string, matchIndex: number, matchLen: number): boolean {
  const before = full.slice(Math.max(0, matchIndex - 40), matchIndex);
  const after = full.slice(matchIndex + matchLen, matchIndex + matchLen + 40);
  return BN_RE.test(before) || BN_RE.test(after);
}

export function normalizeBrandNameText(value: string): string {
  let out = value || "";

  out = out
    .replace(/RelaxoBeanBag/gi, EN_NAME)
    .replace(/\bRelaxo\s+Bean\s+Bags?\b/gi, EN_NAME);

  out = out.replace(
    /Relaxo Bean Bag(?:\s*-\s*|\s*)?(এর|কে|তে|এ|ের|য়|ে)?/g,
    (match, suffix, offset, full) => {
      if (isBengaliContext(full, offset, match.length)) {
        return BN_NAME + (suffix || "");
      }
      return EN_NAME;
    },
  );

  out = out
    .replace(/Relaxo Bean Bag\s*বাংলাদেশ/g, `${BN_NAME} বাংলাদেশ`)
    .replace(/Relaxo Bean Bag\s*Bangladesh/gi, `${EN_NAME} Bangladesh`)
    .replace(/Relaxo Bean Bag\s*BD/gi, `${EN_NAME} BD`);

  return out
    .replace(/\s+([।.,!?…])/g, "$1")
    .replace(/ {2,}/g, " ");
}

export function normalizeBrandNameDeep<T>(value: T): T {
  if (typeof value === "string") return normalizeBrandNameText(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeBrandNameDeep(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeBrandNameDeep(item)]),
    ) as T;
  }
  return value;
}
