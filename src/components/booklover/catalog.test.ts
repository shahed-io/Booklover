import {describe,it,expect} from 'vitest';
import {variantsOf,money,slugify,whatsappOrderMessage} from './catalog';
describe('book catalog data',()=>{
 it('uses the admin supplied cover prices',()=>{expect(variantsOf([{name:'Book Cover Type',options:[{label:'Paperback',price:'280'},{label:'Hardcover',price:'390'}]}])).toEqual([{name:'Book Cover Type',options:[{label:'Paperback',price:280},{label:'Hardcover',price:390}]}]);});
 it('does not create cover options when none are configured',()=>{expect(variantsOf(null)).toEqual([]);});
 it('preserves string options without inventing prices',()=>{expect(variantsOf([{name:'Cover',options:['Paperback']}])).toEqual([{name:'Cover',options:[{label:'Paperback'}]}]);});
 it('formats catalog currency in BDT',()=>{expect(money(280)).toBe('Tk 280.00 BDT');});
 it('creates collection paths without punctuation',()=>{expect(slugify('Biography & Memoir')).toBe('biography-memoir');});
 it('builds a WhatsApp order message with the book, quantity, price and link',()=>{const msg=whatsappOrderMessage({name:'False Witness',url:'https://booklover.com.bd/products/false-witness',qty:2,price:money(360),labels:['Cover: Hardcover']});expect(msg).toContain('Book: False Witness');expect(msg).toContain('Quantity: 2');expect(msg).toContain('Tk 360.00 BDT');expect(msg).toContain('Link: https://booklover.com.bd/products/false-witness');expect(msg).toContain('• Cover: Hardcover');});
});
