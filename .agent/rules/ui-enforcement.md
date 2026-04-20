---
trigger: always_on
---

# ZEUS OS — UI Enforcement Rules

## CRITICAL: Design System Compliance

**All UI generation MUST strictly follow `docs/architecture/ZEUS_DESIGN_SYSTEM.md` ("Kinetic Monolith").**

### Mandatory Rules:
1. **No solid borders for sections.** Use Tonal Recession (background-color shifts between surface layers).
2. **Max border-radius is `0.5rem`.** Never use `rounded-3xl`, `rounded-full` on cards/sections.
3. **Amber-500 (`#FFBF00`) is ONLY for surgical accents:** active nav states, CTA buttons, focus rings, progress bars.
4. **Typography:** Labels are `10px uppercase tracking-widest text-zinc-500`. Never use decorative fonts.
5. **Surface tokens:** Always use `bg-surface-container-low` for cards, `bg-surface-container-lowest` for inputs.
6. **Font stack:** `Inter` for UI, `JetBrains Mono` for data (IBAN, keys, hashes).

### Forbidden Patterns:
- ❌ `rounded-3xl`, `rounded-[2rem]`, `rounded-[2.5rem]` on any element
- ❌ `border-white/5` as sole section separator (use tonal bg shift instead)
- ❌ Amber on card backgrounds, section titles, or large surfaces
- ❌ `font-black italic uppercase` abuse (use `font-semibold` or `font-bold`)
- ❌ Glassmorphism blur on static cards (reserve for floating overlays only)

### Reference:
- **Design Doc:** `docs/architecture/ZEUS_DESIGN_SYSTEM.md`
- **Color Tokens:** `app/globals.css` `@theme` block
