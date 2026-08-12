# Theme-aware header logo

**Date:** 2026-08-12

## Product

- The Migration Pulse header shows a company logo in the top-left corner.
- Light theme uses the dark logo; dark theme uses the white logo.
- Branding is visible in both theme modes during the demo.

## Technical

- Updated `src/components/layout/PortalShell.tsx` to render `/logo-no-background.png` or `/logo-white-no-background.png` from `public/` based on `isDark` from theme context.
- No DAX, schema, or wiring changes.

## Verification

- `npm run verify`
- Thermo-nuclear review outcome: pass (optional naming cleanup applied)
