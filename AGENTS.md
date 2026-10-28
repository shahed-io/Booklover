# Architecture rules

- Storefront Google sign-in uses the managed OAuth helper and validates the returned user before closing the login dialog; this keeps preview popups and published redirects on the same session flow.
- The account route uses its own sign-in presentation with shared AuthModal handlers and account-scoped theme tokens; checkout modals, admin screens and the signed-in dashboard remain independent.

- Keep the Booklover storefront in a dedicated module with scoped theme tokens; preserve the existing admin UI and shared commerce providers so storefront styling cannot alter admin pages.
- Render catalog and purchasing data from the existing managed backend, never from competitor examples or invented prices, so admin-managed products remain authoritative.
- Keep unconfigured payment recipients and external transports disabled with blank contact defaults; retain commerce schemas and admin editors so owner setup never reactivates inherited destinations.
- Route through TanStack Start file routes in src/routes with legacy pages imported via the src/lib/router-compat shim, so old react-router call sites keep working until rewritten natively.
- Serve fixed public feed and storage URLs through server routes that proxy the backend (src/lib/public-proxy.ts), because the old static-host redirect file no longer applies.
- Booklover keeps no software-license/CID, Telegram/WhatsApp bot, or affiliate/referral features; their empty legacy tables are marked DEPRECATED and must not be re-wired, because the store sells books only.
