# QA Issues - VibeDNA UI/UX Restructure

## Manual QA Findings (F3)

### Critical Issues
- **None**

### Warnings
1. **Hydration Mismatch on LandingNav (mobile viewport)**
   - **Location**: `src/components/landing/LandingNav.tsx` + `src/hooks/useMediaQuery.ts`
   - **Description**: When viewport is < 768px, a hydration mismatch occurs. Server renders desktop nav (`<div className="hidden md:flex...">`), client renders mobile menu button (`<button>`).
   - **Root Cause**: `useMediaQuery` initializes with `defaultState=true` during SSR, but evaluates `window.matchMedia` on client which returns `false` for narrow viewports.
   - **Impact**: React recovers automatically and re-renders on client. No visual breakage, but console error appears.
   - **Fix**: Ensure initial state is consistent between SSR and client. Use `defaultState` for initial render, update in `useEffect` only.

2. **THREE.Clock Deprecation Warning**
   - **Description**: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`
   - **Impact**: Non-critical warning from Three.js library. No functional impact.

### Verified Pages
| Page | Status | Notes |
|------|--------|-------|
| `/` (Landing) | ✅ PASS | Hero, Archetype cards (3), Galaxy preview, Nav, Footer all render correctly |
| `/dashboard` | ✅ PASS | Protected route - redirects to `/` when unauthenticated (expected behavior) |
| `/compare` | ✅ PASS | Comparison UI, archetype cards, compatibility score, shared genres, copy link button all render |

### Responsive Testing
| Viewport | Status | Notes |
|----------|--------|-------|
| 1920x1080 (Desktop) | ✅ PASS | All layouts render correctly |
| 375x768 (Mobile) | ⚠️ PASS | Content adapts correctly, but hydration warning on landing page |

### Console Summary
- **Errors**: 1 (hydration mismatch - recoverable)
- **Warnings**: 1 (THREE.Clock deprecation - non-critical)
- **Network**: All requests returning 200 OK
