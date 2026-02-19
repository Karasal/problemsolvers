# Problem Solvers — Lessons Learned

## Tailwind v4
- Config is done via `@theme inline` in CSS, not `tailwind.config.ts`
- CSS variables defined in `:root` can be referenced in `@theme inline` with `var()`
- Color classes use `--color-{name}` pattern in theme block

## GSAP + Lenis
- Lenis must be dynamically imported (ESM only, no SSR)
- Register ScrollTrigger with `gsap.registerPlugin()` before any use
- Gate check for `typeof window !== "undefined"` before plugin registration
- Sync Lenis with GSAP via `lenis.on('scroll', ScrollTrigger.update)` + ticker

## Next.js App Router
- `"use client"` required on any component using hooks, state, or browser APIs
- Dynamic imports for heavy libraries (Spline, Howler) to keep bundle small
- `data-alive` attribute on `<html>` for CSS state switching — set via useEffect
