# Decisions

Non-obvious or intentional decisions in this codebase. If something looks strange, check here first.

## Architectural Decisions

### No Global State Library

**Decision**: Use feature-scoped hooks (`useTimeConverter`, `useMeetingPlanner`) instead of Redux/Zustand.

**Rationale**:

- Features don't share runtime state
- Each feature has isolated state needs
- Custom hooks provide sufficient encapsulation

### Timezone Data is Static

**Decision**: Timezones are hardcoded in `src/constants/timezones.ts`, not fetched from an API.

**Rationale**:

- Guarantees consistent behavior offline
- Avoids IANA database sync complexity
- Sufficient coverage for common use cases
- `date-fns-tz` handles DST calculations

### Safe Storage Wrappers

**Decision**: All localStorage calls go through `safeStorageGetItem`/`safeStorageSetItem`.

**Rationale**:

- localStorage throws in private browsing mode on some browsers
- Handles restricted iframe contexts
- Provides fallback behavior (returns `null` / `false`)

## Component Decisions

### Variant Files Separated from Components

**Decision**: `button-variants.ts` exists alongside `button.tsx`.

**Rationale**:

- shadcn/ui pattern for re-exporting variants
- Allows importing variants without importing component
- Satisfies `react-refresh/only-export-components` lint rule with `allowConstantExport`

### ForceMount on TabsContent

**Decision**: `TabsContent` uses `forceMount` with `data-[state=inactive]:hidden`.

**Rationale**:

- Preserves scroll position when switching tabs
- Maintains form state in inactive tabs
- CSS hiding is cheaper than unmount/remount

### Inline Props Types (Not Separate Files)

**Decision**: Component props are defined inline as `type ComponentProps = {...}`.

**Rationale**:

- Co-location improves readability
- Props are rarely shared between components
- Reduces file count

## Styling Decisions

### No CSS Modules

**Decision**: Pure Tailwind utility classes, no component-scoped CSS.

**Rationale**:

- Tailwind 4 handles all styling needs
- `cn()` utility provides conditional class merging
- Reduces context switching between files

### Custom `xs` Breakpoint

**Decision**: Added `@custom-variant xs (@media (width >= 475px))` in `index.css`.

**Rationale**:

- Standard `sm` (640px) is too wide for some mobile layouts
- Provides finer control for narrow viewports

### Theme via CSS Variables

**Decision**: Theme colors use CSS custom properties (`--primary`, `--background`, etc.).

**Rationale**:

- Enables dark mode toggle without re-render
- shadcn/ui convention
- Single source of truth in `index.css`

## Code Organization Decisions

### Types Directory is Flat

**Decision**: Types are split by domain (`meeting.ts`, `timezone.ts`) but not nested.

**Rationale**:

- Only two domains exist currently
- Over-nesting adds navigation overhead
- Re-exported from single `index.ts`

### No `src/hooks` Directory

**Decision**: Hooks live in `features/<name>/hooks/` or `components/theme/`.

**Rationale**:

- No truly global hooks exist yet
- Feature hooks should be co-located with features
- Theme hook is part of theme module

### Utils Are Pure Functions

**Decision**: `src/utils/` contains only pure functions with no React dependencies.

**Rationale**:

- Testable in isolation
- Reusable outside React context
- Clear separation: React logic in hooks, pure logic in utils

## Linting Decisions

### Perfectionist Plugin

**Decision**: Enforces alphabetical sorting for imports, exports, props, and object types.

**Rationale**:

- Eliminates bikeshedding over order
- Reduces merge conflicts
- Consistent codebase appearance

### Type Import Enforcement

**Decision**: Use `import type { ... }` for type-only imports.

**Rationale**:

- Explicitly marks compile-time-only imports
- Improves tree-shaking
- TypeScript best practice
