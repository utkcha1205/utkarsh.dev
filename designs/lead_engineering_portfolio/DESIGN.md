---
name: Lead Engineering Portfolio
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  mono-label:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  section-gap: 160px
  gutter: 24px
  margin-safe: 32px
  unit: 4px
---

## Brand & Style

The design system is engineered to project technical authority, precision, and premium craftsmanship. It targets high-end recruiters and CTOs, evoking the "developer-centric" aesthetics of Vercel and Linear. 

The style merges **Dark Minimalism** with high-fidelity **Glassmorphism**. It relies on high-contrast typography and subtle light-leak effects to simulate a sophisticated, hardware-like interface. The emotional goal is to feel like a powerful, well-optimized IDE: focused, efficient, and technologically advanced.

## Colors

The palette is anchored by a deep navy-black that serves as the canvas for high-energy accents. 
- **Deep Navy Background**: A custom near-black that provides more depth than pure hex black, allowing for subtle shadow definitions.
- **Electric Blue (Primary)**: Used for critical actions, active states, and primary highlights.
- **Soft Purple (Secondary)**: Used for secondary visual interest, gradients, and distinguishing tech-stack categories.
- **Off-White Text**: Reduces eye strain compared to pure white while maintaining maximum readability against the dark background.

## Typography

This design system utilizes **Inter** for all functional and expressive roles to maintain a clean, SaaS-inspired look. 

- **Headlines**: Set in bold weights with tight letter-spacing to create a "locked-in" technical feel.
- **Body**: Generous line-height ensures long-form case studies remain legible.
- **Monospace Labels**: **Space Grotesk** is used for technical metadata (e.g., git hashes, tech stacks, timestamps) to reinforce the engineering narrative. 
- **Hierarchy**: Contrast is achieved through size and weight rather than font switching.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop, centered within the viewport to maintain focus. 

- **Generous Whitespace**: High "breathing room" between sections (160px+) to signal premium quality.
- **Grid Strategy**: A 12-column system where most content lives in the center 8 columns, while visual flourishes can bleed to the edges.
- **Dividers**: Instead of solid lines, use ultra-thin (1px) horizontal rules with a subtle linear gradient that fades at the edges, glowing slightly in the center.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional drop shadows.

- **The Stack**: Surfaces are elevated using a backdrop-filter (blur: 12px) and a semi-transparent fill (rgba(255, 255, 255, 0.03)).
- **Borders**: Elements are defined by 1px "inner-glow" borders—a subtle white-to-transparent gradient on the top and left edges.
- **Glowing States**: Hovering over interactive cards triggers a "bloom" effect: a soft radial gradient of the Primary Blue appearing behind the glass panel, simulating a backlight.
- **Sticky Navbar**: The top navigation remains fixed, blurring the content beneath it as it scrolls, maintaining a sense of layered space.

## Shapes

The design system adopts a **Soft** shape language (roundedness level 1) to balance technical precision with modern friendliness.

- **Standard Radius**: 4px for buttons and small inputs.
- **Card Radius**: 8px (rounded-lg) for the primary project and content cards.
- **Interactive Elements**: Use sharp, precise corners for smaller icons, but maintain the subtle rounding on all container edges to keep the SaaS aesthetic consistent.

## Components

### Buttons
- **Primary**: Solid Electric Blue with off-white text. No shadow; instead, use a 0.5px white inner border on the top edge.
- **Ghost**: Transparent background with a 1px border (#F1F5F9 at 10% opacity). On hover, background fills to 10% white.

### Glass Cards
- The signature component. Use a background of `rgba(17, 24, 39, 0.7)` with a `backdrop-filter: blur(20px)`. 
- Hover state: The border-color transitions from 10% white to the Primary Blue.

### Tech Chips
- Small, monospaced labels with a subtle dark-grey background and 1px border. 
- Use the Secondary Purple for the text color to denote "Technical Skill."

### Input Fields
- Dark backgrounds (#0A0E1A) with 1px borders. 
- Focus state: The entire border glows with the Primary Blue, accompanied by a subtle outer glow (box-shadow).

### Horizontal Dividers
- 1px height. Background: `linear-gradient(90deg, transparent 0%, rgba(241, 245, 249, 0.2) 50%, transparent 100%)`.