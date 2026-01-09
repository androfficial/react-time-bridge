# Frontend Guidelines

## Component Design

### Structure

Every component file follows this pattern:

```tsx
/**
 * Brief description of the component
 */

import { ... } from 'react';          // React imports first

import type { ... } from '@/types';   // Type imports (use `type` keyword)

import { ... } from 'lucide-react';   // External imports
import { ... } from '@/components';   // Internal imports

type ComponentProps = {               // Props type (not interface)
  propA: string;
  propB: number;
};

export const Component = ({ propA, propB }: ComponentProps) => {
  // ...
};
```

### Naming Conventions

- **Components**: PascalCase, named export (`export const MyComponent`)
- **Hooks**: camelCase with `use` prefix (`useTimeConverter`)
- **Utils**: camelCase functions (`convertTime`, `formatDateTimeWithTimezone`)
- **Types**: PascalCase (`Participant`, `TimeSuggestion`)
- **Constants**: SCREAMING_SNAKE_CASE (`STORAGE_KEYS`, `TIMEZONES`)

### JSX Props

Props must be sorted alphabetically (enforced by `perfectionist/sort-jsx-props`):

```tsx
// ✓ Correct
<Button className="..." onClick={handler} size="sm" variant="outline">

// ✗ Wrong
<Button variant="outline" onClick={handler} size="sm" className="...">
```

## Hooks

### Custom Hook Pattern

Feature hooks:

- Co-locate in `features/<name>/hooks/`
- Return an object with state values and action functions
- Use `useMemo` for computed values
- Use `useCallback` for actions passed to children

```tsx
export const useFeature = () => {
  const [state, setState] = useState<Type>(initialValue);

  const computed = useMemo(() => derive(state), [state]);

  const action = useCallback(() => {
    setState(/*...*/);
  }, []);

  return { state, computed, action };
};
```

### localStorage Hooks

Never use `localStorage` directly. Always use:

```tsx
import { safeStorageGetItem, safeStorageSetItem } from '@/utils';
```

## Styling

### Tailwind Only

- Use Tailwind utility classes exclusively
- No CSS modules, styled-components, or inline styles
- Custom CSS only in `src/index.css` for theme variables and global utilities

### Class Composition

Use `cn()` from `@/lib/utils` for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-classes', isActive && 'active-classes', className)} />;
```

### Component Variants

Use `class-variance-authority` for variant-based components:

```tsx
// button-variants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', outline: '...' },
    size: { default: '...', sm: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

### Responsive Design

- Mobile-first approach
- Custom `xs` breakpoint at 475px (`xs:`)
- Standard Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## Import Order

Enforced by `eslint-plugin-perfectionist`:

1. `react` / `react-*`
2. Type imports (`import type { ... }`)
3. External packages
4. Internal (`@/...`)
5. Relative (`./`, `../`)

Use `@/*` alias for all src imports:

```tsx
// ✓ Correct
import { Button } from '@/components/ui/button';

// ✗ Wrong
import { Button } from '../../../components/ui/button';
```

## Barrel Exports

Every directory with multiple exports must have an `index.ts`:

```tsx
// features/time-converter/components/index.ts
export { AddTimezoneDialog } from './add-timezone-dialog';
export { ConvertedTimeCard } from './converted-time-card';
export { SourceTimezoneCard } from './source-timezone-card';
```

## Types

### Location

- Shared types → `src/types/`
- Feature-specific types → within the feature (or in hook file)
- Component props → inline in component file

### Type vs Interface

Use `type` for:

- Props types
- Union types
- Mapped types

Use `interface` for:

- Extendable data structures (rare in this codebase)

### Type Imports

Always use `type` keyword for type-only imports:

```tsx
import type { Participant, Timezone } from '@/types';
```

## Accessibility

- Add `aria-label` for icon-only buttons
- Use `aria-hidden="true"` on decorative icons
- Use semantic HTML (`<main>`, `role="main"`)
- Radix UI handles most a11y concerns for primitives
