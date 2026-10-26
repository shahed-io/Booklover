# Cash on Delivery and Simple Checkout

## Goal
Make Cash on Delivery orders save reliably, replace the current checkout with the selected modern elevated two-column layout, and let admins customize the COD content.

## Implementation
- Repair the missing order-encryption key that currently blocks every order insert.
- Preserve guest checkout and signed-in checkout; COD will not require a transaction ID or payment screenshot.
- Rework `/checkout` to the selected modern elevated design:
  - customer details on the left;
  - order items, quantity controls, totals, payment choices, and order button on the right;
  - clean stacked layout on phones;
  - existing coupons, custom fields, notes, terms, payment methods, and error handling remain functional.
- Extend Checkout Settings with a dedicated Cash on Delivery section for:
  - COD title;
  - COD description;
  - confirmation bullets/instructions;
  - order button text;
  - optional COD notice text.
- Use the project’s existing theme tokens and selected prototype structure without introducing unrelated page redesigns.

## Verification
- Run the real guest COD writer and confirm the order plus items are stored with guest ownership.
- Run the signed-in COD flow and confirm the stored order belongs to the signed-in customer.
- Confirm caller-supplied ownership cannot override the authenticated customer.
- Verify admin COD text changes appear on checkout.
- Check desktop and mobile layouts, required fields, quantity changes, totals, and successful order confirmation.

## Technical details
- Keep `site_settings.checkout_config` as the source for checkout/COD copy; no new table is needed.
- Create the missing encryption key securely and never expose it to the browser or logs.
- Keep database encryption and existing access policies intact.
