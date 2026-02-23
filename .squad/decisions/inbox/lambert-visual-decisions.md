# Visual Design Decisions — Lambert

## Color Palette Rationale

### Species Colors
- **Plankton (#7ec8a0)**: Soft green chosen to evoke bioluminescence and organic matter. Works well at small sizes due to brightness.
- **Sardine (#89b4d8)**: Silver-blue reflects real sardine coloring. Neutral enough to not compete with shark visually.
- **Shark (#546e7a)**: Dark slate-blue conveys predator menace. Deliberately muted to create visual tension with brighter prey.
- **Crab (#e07b39)**: Warm orange differentiates bottom-dwellers. High contrast against ocean blue background.
- **Reef (#8b7355)**: Stone brown grounds the environment. Static element shouldn't draw attention.

### Dead Variants
- **Dead (#4a5a6a)**: Desaturated grey-blue. Same shape as living variant but washed out.
- X-eyes visual: Universal symbol of death, immediately readable at any scale.

### Animation Philosophy
- Animations are toggleable via `animationEnabled` prop for accessibility/performance.
- Each species has signature motion: plankton pulse (breathing), sardine fin (swimming), shark sway (cruising).
- Dead specimens have no animation — stillness reinforces finality.

### Graph Integration
- Recharts LineChart uses exact same species colors from `palette.ts`.
- Birth/death bar chart uses semantic green/red (success/danger) for immediate comprehension.
- Graph backgrounds match panel dark theme for seamless integration.

## CSS Architecture
- CSS custom properties (`:root` variables) enable future theming.
- Utility classes (`.btn-primary`, `.form-group`) standardize UI patterns.
- Layout classes (`.app-layout`, `.simulation-layout`) define responsive grid structure.
