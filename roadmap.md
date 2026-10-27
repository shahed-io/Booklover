# Roadmap

## Booklover storefront
- [x] Record inspected reference pages, product details, and unverified areas in .lovable/booklover-reference-audit.md.
- [x] Prepare two white-theme Booklover homepage previews with the supplied original logo.
- [x] Apply the user's first choice: compact white header with the supplied original logo.
- [x] Implement reference-style homepage, menus, collections, search/filter/sort, product detail, reviews, wishlist, cart, account views, and shared footer without editing the admin UI.
- [x] Verify desktop/mobile homepage, menu navigation, search/filter controls, empty cart drawer/page, account/reset views, missing-product state, and admin styling boundary; 35 tests passed.
- [ ] Complete populated-catalog and real checkout verification — backend has zero products and zero auth users; requires the user's actual book catalog and account.
- [ ] Complete business/policy content — requires Booklover's approved contact, shipping, refund and policy details; reference pages were not publicly verified.
- [ ] Confirm remaining reference-only account/checkout behavior — reference authentication and checkout internals were not accessible during inspection; requires screenshots or access supplied by the user.

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

