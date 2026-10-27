import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
export type Book = Tables<'products'>;
export const collectionNames = ['All Books','Autobiography','Best Sellers','Biography & Memoir','Business, Finance & Economics','Children’s & Middle Grade','Crime Fiction','Dark Romance','English Novel Series & Collections','Family Drama','Fantasy','Fiction','Folklore & Mythology','Historical Fiction','History & War','Horror','Literature','More Books','Mystery & Thriller','Philosophy & Religion','Poetry','Romance Books','Science Fiction','Self-Help & Psychology','Timeless Classics','Young Adult (YA)'];
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const money = (n: number) => `Tk ${Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} BDT`;
export function useCatalog() {
  return useQuery({queryKey:['booklover-catalog'],queryFn:async()=>{
    const [books,categories,links] = await Promise.all([
      supabase.from('products').select('*').in('status',['active','out_of_stock']).order('sort_order'),
      supabase.from('categories').select('*').eq('is_active',true).order('sort_order'),
      supabase.from('product_categories').select('product_id,category_id'),
    ]);
    if (books.error) throw books.error;
    if (categories.error) throw categories.error;
    if (links.error) throw links.error;
    return {books:books.data || [],categories:categories.data || [],links:links.data || []};
  }});
}
export type VariantGroup = {name:string;options:{label:string;price?:number}[]};
export function variantsOf(raw: Book['variants']): VariantGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap(v=>{
    if (!v || typeof v!=='object' || Array.isArray(v)) return [];
    const options = Array.isArray(v.options) ? v.options.flatMap(o=>{
      if(typeof o==='string') return [{label:o}];
      if(!o || typeof o!=='object' || Array.isArray(o) || typeof o.label!=='string') return [];
      const price=Number(o.price);
      return [{label:o.label,price:Number.isFinite(price)&&price>0?price:undefined}];
    }):[];
    return options.length?[{name:typeof v.name==='string'?v.name:'Book Cover Type',options}]:[];
  });
}
