---
name: Amber Glow
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#c8c6c9'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#8fd5ff'
  on-tertiary: '#00344a'
  tertiary-container: '#1abdff'
  on-tertiary-container: '#004966'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#e4e1e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7fd0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#121316'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  monospace:
    fontFamily: ui-monospace, SFMono-Regular
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  panel-gap: 1px
  container-padding: 1.5rem
  element-gap: 0.75rem
  handle-width: 2px
  sidebar-width: 260px
---

## Brand & Style

This design system is built on the philosophy of "Luminous Precision." It targets power users, developers, and writers who require a high-focus environment that feels both industrial and warm. The aesthetic is a blend of **Minimalism** and **Tactile Dark Mode**, drawing inspiration from modern knowledge management tools like Obsidian. 

The emotional response should be one of "quiet productivity." By utilizing a nearly black foundation punctuated by sharp, amber highlights, the UI directs focus toward active content while receding secondary controls into the shadows. The atmosphere is intellectual, sophisticated, and deeply focused.

## Colors

The palette is strictly anchored in the Zinc scale to maintain a neutral, achromatic base that prevents visual fatigue. 

- **The Foundation**: The root uses `zinc-950`, providing a deep, ink-like canvas. 
- **The Secondary Surface**: Panels and sidebars utilize a semi-transparent `zinc-900/40`, allowing for subtle depth through stacking rather than color shifts.
- **The Accents**: Amber-500 is used sparingly and exclusively for interactive states, progress indicators, and active focus. 
- **The Typography**: Base text resides at `zinc-300` to maintain high legibility without the harshness of pure white.

## Typography

This design system employs a dual-sans serif approach. **Manrope** is used for headlines to provide a modern, slightly rounded technical feel that softens the brutalist layout. **Inter** handles all body and UI text, selected for its exceptional clarity in small-scale dark interfaces.

Use `label-caps` for sidebar headers and small metadata labels to create a clear information hierarchy. Monospace fonts should be reserved for code blocks or technical data points, integrated seamlessly into the Zinc color palette.

## Layout & Spacing

The layout follows a **split-pane philosophy** where content is divided by thin, purposeful boundaries. 

- **Split-Panes**: Use a 1px border (`zinc-800`) to separate panels instead of margins. 
- **Resize Handles**: Vertical and horizontal dividers are custom 2px interaction zones. They remain invisible or `zinc-800` until hover, where they transition to `amber-500`.
- **Rhythm**: A strict 4px grid governs internal padding. Standardize on 24px (`1.5rem`) for main container gutters to provide "breathing room" against the dense, dark UI.

## Elevation & Depth

Depth is conveyed through **Low-contrast outlines** and **Tonal Layering** rather than traditional shadows. 

1. **Level 0 (Root)**: `zinc-950` - The furthest back layer.
2. **Level 1 (Panels)**: `zinc-900/40` with a `zinc-800` border.
3. **Level 2 (Popovers/Modals)**: `zinc-900` solid with a slightly brighter `zinc-700` border to simulate "lift."

Avoid drop shadows entirely to maintain the minimalist, Obsidian-inspired aesthetic. Use backdrop blurs (`blur-md`) on Level 2 elements to maintain context of the layer beneath.

## Shapes

The design system adopts a **Soft (0.25rem)** roundedness profile. This slight rounding prevents the UI from feeling overly aggressive or "brutalist," while maintaining the structural integrity of a grid-based layout. 

- Buttons and Input fields use `rounded`.
- Large panels or cards use `rounded-lg` (0.5rem).
- Interactive indicators (like active tab underlines) should remain sharp (0px) to contrast with the container's softness.

## Components

- **Buttons**: Primary buttons are ghost-style with an `amber-500` border and text. Secondary buttons use a `zinc-800` border and `zinc-300` text.
- **Input Fields**: Subtle `zinc-900` background with a `zinc-800` border. On focus, the border transitions to `amber-500` with no outer glow.
- **Tabs/Navigation**: Vertical list items in sidebars. Active states use a 2px `amber-500` left-border (accent) and `amber-500` text.
- **Resize Handles**: Custom thin lines between panes. On hover, the cursor changes to `col-resize` and the line illuminates to `amber-500`.
- **Chips**: Small, pill-shaped `zinc-800` containers with `zinc-400` text. No borders unless the chip is "Active," in which case it uses the `amber-500` border.
- **Checkboxes**: Square with a 1px `zinc-700` border. When checked, the fill is `amber-500` with a `zinc-950` checkmark icon.