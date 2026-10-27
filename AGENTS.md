# Architecture rules

- Keep the Booklover storefront in a dedicated module with scoped theme tokens; preserve the existing admin UI and shared commerce providers so storefront styling cannot alter admin pages.
- Render catalog and purchasing data from the existing managed backend, never from competitor examples or invented prices, so admin-managed products remain authoritative.