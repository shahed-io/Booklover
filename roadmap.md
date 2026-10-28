# Roadmap

## Legacy-brand cleanup
- [x] Audit source, assets, configuration, public database functions/defaults, storage and schedules for inherited branding.
- [x] Remove old media/reference images/importer, clear inherited testimonials and claims, replace logo paths with approved Booklover logo, and blank payment/contact defaults without changing admin styling.
- [x] Delete 23 inherited external-provider secrets, detach source-project HTTP callbacks, and clear old message defaults while preserving commerce tables and in-app notifications.
- [x] Verify 38 tests, build OK, eight public/admin-login pages with no runtime errors or legacy requests, and zero legacy database function/default matches.
- [ ] Verify authenticated purchases/admin editors — no catalog or account exists; requires owner catalog/account.
- [ ] Verify blog page end-to-end — automated browser could not read the page body; source branding scan passed but rendering remains unverified.

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
- [ ] Configure owner credentials/providers — 23 inherited provider secrets removed during cleanup; retained admin/security/AI secrets require owner replacement through secure forms.
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


## Action buttons (Oct 28)
- [x] Make storefront action buttons thicker with brand white/red glossy styling (product page trio, cart/drawer and checkout CTAs). Verified in preview: Buy it now 68px, WhatsApp/Add to cart 60px, checkout order button red gradient, no console errors.
