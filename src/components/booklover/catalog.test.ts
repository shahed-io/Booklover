import {describe,it,expect} from 'vitest';
import {variantsOf,money,slugify} from './catalog';
describe('book catalog data',()=>{
 it('uses the admin supplied cover prices',()=>{expect(variantsOf([{name:'Book Cover Type',options:[{label:'Paperback',price:'280'},{label:'Hardcover',price:'390'}]}])).toEqual([{name:'Book Cover Type',options:[{label:'Paperback',price:280},{label:'Hardcover',price:390}]}]);});
 it('does not create cover options when none are configured',()=>{expect(variantsOf(null)).toEqual([]);});
 it('preserves string options without inventing prices',()=>{expect(variantsOf([{name:'Cover',options:['Paperback']}])).toEqual([{name:'Cover',options:[{label:'Paperback'}]}]);});
 it('formats catalog currency in BDT',()=>{expect(money(280)).toBe('Tk 280.00 BDT');});
 it('creates collection paths without punctuation',()=>{expect(slugify('Biography & Memoir')).toBe('biography-memoir');});
});
