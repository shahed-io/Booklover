# Roadmap

## Booklover storefront
- [ ] Inventory the reference site's public pages and controls, including product details.
- [ ] Show Booklover prototypes using the supplied logo and current white theme; await design selection before implementation.
- [ ] Recreate approved reference storefront pages and interactions without changing the admin-panel design.
- [ ] Verify shopping flows and page layouts; identify reference areas that cannot be inspected.

## Remix setup
- [x] Verify copied Drizzle migrations were cleared and the new migration journal is empty and valid.
- [ ] Replace the 37 requested secret values — secure replacement form was declined; waiting for user submission.
- [ ] Replace remaining legacy email calls with managed feature-specific sending — waiting for the user to configure an owned sender domain.

## Done
- [x] Make cart "Pay Selected / Checkout Now" button visually clickable (`.btn-glow` CSS + button markup in CartDrawer.tsx).
- [x] Support agent memory: update `ai-support-chat` system prompt to physical furniture business; deployed.
- [x] Repair the missing order-encryption key blocking COD and other orders.
- [x] Build the selected modern elevated checkout layout.
- [x] Add dedicated admin controls for COD title, description, bullets, button, and notice.
- [x] Verify guest COD saves plus desktop/mobile checkout.

## Blocked
- [ ] Verify signed-in COD ownership — no matching signed-in test account is available in the preview session.

