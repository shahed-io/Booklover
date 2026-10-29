import { describe, expect, it } from 'vitest';
import { bookInventorySchema, emptyBookMetadata, lowStock, readBookMetadata, shipmentSchema, writeBookMetadata } from './bookAdministration';

describe('book administration', () => {
  it('round-trips all requested book fields without dropping custom information', () => {
    const metadata = { author: 'Diana Gabaldon', publisher: 'Penguin', isbn: '9780440423201', language: 'English', pages: '850', edition: 'First', year: '1991', binding: 'Paperback' };
    expect(readBookMetadata(writeBookMetadata(metadata, [{ key: 'Translator', value: 'Someone' }]))).toEqual({ metadata, custom: [{ key: 'Translator', value: 'Someone' }] });
    expect(readBookMetadata([]).metadata).toEqual(emptyBookMetadata);
  });
  it('preserves untracked stock and identifies zero and low quantities', () => {
    expect(lowStock(null, 5)).toBe(false);
    expect(lowStock(0, 5)).toBe(true);
    expect(lowStock(5, 5)).toBe(true);
    expect(lowStock(6, 5)).toBe(false);
  });
  it('rejects negative or fractional inventory counts', () => {
    expect(bookInventorySchema.safeParse({ stock: '-1', threshold: '5', pages: '', year: '' }).success).toBe(false);
    expect(bookInventorySchema.safeParse({ stock: '1.5', threshold: '5', pages: '', year: '' }).success).toBe(false);
    expect(bookInventorySchema.safeParse({ stock: '0', threshold: '5', pages: '100', year: '2026' }).success).toBe(true);
  });
  it('requires courier and tracking number for shipped books', () => {
    expect(shipmentSchema.safeParse({ courier_name: '', tracking_number: '', tracking_url: '', shipment_status: 'shipped' }).success).toBe(false);
    expect(shipmentSchema.safeParse({ courier_name: 'Courier', tracking_number: 'BL123', tracking_url: '', shipment_status: 'shipped' }).success).toBe(true);
  });
  it('rejects unsafe tracking links', () => {
    expect(shipmentSchema.safeParse({ courier_name: '', tracking_number: '', tracking_url: 'javascript:alert(1)', shipment_status: 'packed' }).success).toBe(false);
  });
});