import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
export type Book = Tables<'products'>;
export const collectionNames = ['All Books','Autobiography','Best Sellers','Biography & Memoir','Business, Finance & Economics','Children’s & Middle Grade','Crime Fiction','Dark Romance','English Novel Series & Collections','Family Drama','Fantasy','Fiction','Folklore & Mythology','Historical Fiction','History & War','Horror','Literature','More Books','Mystery & Thriller','Philosophy & Religion','Poetry','Romance Books','Science Fiction','Self-Help & Psychology','Timeless Classics','Young Adult (YA)'];
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const money = (n: number) => `Tk ${Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} BDT`;
// Only the light fields lists need; the product page loads the full record separately.
const LIST_COLS='id,name,slug,price,original_price,image_url,variants,status,stock_quantity,total_sales,created_at,short_description,tags,category_id,sort_order';
export function useProductDetail(slug?:string){return useQuery({queryKey:['booklover-product',slug],enabled:!!slug,staleTime:5*60_000,queryFn:async()=>{const {data,error}=await supabase.from('products').select('*').or(`slug.eq.${slug},id.eq.${/^[0-9a-f-]{36}$/i.test(slug||'')?slug:'00000000-0000-0000-0000-000000000000'}`).maybeSingle();if(error)throw error;return data as Book|null;}});}
export function useCatalog() {
  return useQuery({queryKey:['booklover-catalog'],staleTime:10*60_000,gcTime:60*60_000,queryFn:async()=>{
    // The backend returns at most 1000 rows per request: count first, then fetch every page in parallel.
    const all = async <T,>(table:string,cols:string,filter:(q:any)=>any,order:string[]) => {
      const head=await filter((supabase.from(table as never) as any).select('id',{count:'exact',head:true}).limit(1)).catch?.(()=>null) ?? await filter((supabase.from(table as never) as any).select(cols,{count:'exact',head:true}));
      const total=head?.count ?? 0;
      const pages=Math.max(1,Math.ceil(total/1000));
      const res=await Promise.all(Array.from({length:pages},(_,i)=>{let q=filter((supabase.from(table as never) as any).select(cols));for(const o of order)q=q.order(o);return q.range(i*1000,i*1000+999);}));
      const err=res.find((r:any)=>r.error);if(err) return {data:null,error:(err as any).error};
      return {data:res.flatMap((r:any)=>r.data||[]) as T[],error:null};
    };
    const [books,categories,links] = await Promise.all([
      all<Book>('products',LIST_COLS,q=>q.in('status',['active','out_of_stock']),['sort_order','id']),
      supabase.from('categories').select('*').eq('is_active',true).order('sort_order'),
      all<{product_id:string;category_id:string}>('product_categories','product_id,category_id',q=>q,['product_id','category_id']),
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
