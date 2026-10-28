export interface Product {
  id: number | string;
  slug?: string | undefined;

  name: string;
  category: string;
  price: number;
  originalPrice?: number | undefined;

  discount?: number | undefined;

  rating: number;
  reviews: number;
  image: string;
  badge?: string | undefined;

  isNew?: boolean | undefined;

  isBestseller?: boolean | undefined;

  customFields?: any[] | undefined;

  stockQuantity?: number | null | undefined;

  status?: string | undefined;

}

// Central helper — a product is out of stock if admin set status='out_of_stock'
// OR if stock_quantity is explicitly 0 (null = untracked stock, treated as available).
export const isProductOutOfStock = (p: {
  status?: string | null | undefined;

  stockQuantity?: number | null | undefined;

}): boolean => {
  if (p.status === 'out_of_stock') return true;
  if (typeof p.stockQuantity === 'number' && p.stockQuantity <= 0) return true;
  return false;
};
