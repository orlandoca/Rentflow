# Rentflow Design System

## Direction and Feel
**Intent**: The administrator feels like an architect of their finances. The interface is **Precise, Official, and Robust**, mimicking high-end architectural software or professional accounting tools.
**Tone**: Technical, authoritative, and clean.

## Palette
- **Canvas (Background)**: `#020617` (Deep Ink Navy)
- **Surface (Cards/Elements)**: `#0f172a` (Layered Navy)
- **Primary Accent**: `#2563eb` (Blueprint Blue)
- **Success Accent**: `#10b981` (Emerald Seal)
- **Warning Accent**: `#f97316` (Official Orange)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#94a3b8` (Slate 400)
- **Borders**: `white/[0.05]` (Whisper-quiet separation)

## Depth Strategy
- **Layered Elevation**: Use surface color shifts (`#0f172a` over `#020617`) combined with sutil shadows.
- **Shadow Scale**: `shadow-xl` for standard cards, `shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]` for critical entry points like Login.
- **Interactive States**: Subtle light leaks (`blur-[80px]`) and active scale transforms (`active:scale-[0.98]`).

## Typography
- **Headings**: Sans-serif (Inter/Geist) with black weights (`font-black`) and tight tracking (`tracking-tighter`).
- **Data/Metrics**: **Tabular Figures** (`tabular-nums`) are mandatory for alignment in financial data.
- **Labels**: Monospace or uppercase Sans-serif with wide tracking (`tracking-widest`) at small sizes (`text-[10px]`).

## Spacing
- **Base Unit**: 4px
- **Standard Padding**: `p-6` (24px) or `p-10` (40px) for high-impact cards.
- **Radius**: Large, friendly but technical. `rounded-2xl` (16px) for inputs, `rounded-[2rem]` (32px) for cards, `rounded-[3rem]` (48px) for major containers.

## Key Component Patterns
- **Blueprint Grid**: Signature background element using linear gradients (40px and 8px variants).
- **Official Seal**: High-contrast, vibrant cards (like Net Profit) with internal radial gradients and distinct badges.
- **Input Fields**: Darker than the surrounding surface (`bg-[#020617]`) to signal "inset" interaction.
- **Navigation**: Sidebar/Header should use the same background as the main content but separated by a whisper-quiet border to maintain visual unity.
