# Architecture

## Overview

Time Bridge is a single-page React application for timezone conversion and meeting scheduling. It follows a feature-based architecture with clear separation between UI primitives, shared components, and feature modules.

## Structural Decisions

### Feature-Based Organization

```
src/features/
├── time-converter/      # Convert time between timezones
│   ├── components/      # Feature-specific UI
│   ├── hooks/           # Feature state (useTimeConverter)
│   └── utils/           # Feature logic
├── meeting-planner/     # Find optimal meeting times
│   ├── components/
│   ├── hooks/           # Feature state (useMeetingPlanner)
│   └── utils/
```

**Why**: Each feature is self-contained with its own components, hooks, and utilities. This prevents cross-feature coupling and makes features independently testable and removable.

### Component Layering

```
components/
├── ui/          # shadcn/ui primitives (Button, Card, Select, etc.)
├── shared/      # Reusable domain components (TimezoneSelect, HourPicker)
├── layout/      # App shell (Header, MainTabs)
└── theme/       # Theme provider and context
```

**Why**:

- `ui/` contains zero business logic—only styling variants
- `shared/` holds domain-aware but feature-agnostic components
- `layout/` composes features without containing feature logic
- `theme/` isolates theming concerns from component logic

## Data Flow

### State Management Pattern

Each feature uses a single custom hook as the state container:

```
useTimeConverter() → returns state + actions
useMeetingPlanner() → returns state + actions
```

**Flow**:

1. Hook initializes state (from localStorage if persisted)
2. Hook exposes computed values via `useMemo`
3. Hook exposes actions via `useCallback`
4. Main feature component destructures and passes down to child components

### localStorage Persistence

Persisted data:

- Active tab (`time-bridge-active-tab`)
- Participants list (`time-bridge-participants`)
- Theme preference (`time-bridge-theme`)

All localStorage access goes through `safeStorageGetItem`/`safeStorageSetItem` to handle environments where localStorage is unavailable.

## Domain Modeling

### Timezone Domain (`src/types/timezone.ts`)

```typescript
Timezone {
  id: string;           // IANA identifier (e.g., "America/New_York")
  name: string;         // Display name
  abbreviation: string; // Short code
  offset: string;       // UTC offset
  region: string;       // Grouping key
}
```

### Meeting Domain (`src/types/meeting.ts`)

```typescript
Participant {
  id: string;
  name: string;
  timezone: Timezone;
  workingHours: WorkingHours;
}

WorkingHours {
  start: number;  // 0-23
  end: number;    // 0-23
}
```

## Feature Boundaries

| Feature           | Owns                                           | Does NOT own                       |
| ----------------- | ---------------------------------------------- | ---------------------------------- |
| `time-converter`  | Source/target timezone state, conversion logic | Timezone data (uses `constants/`)  |
| `meeting-planner` | Participants, slots, suggestions               | Timezone utilities (uses `utils/`) |

Features communicate through shared types and constants, never directly importing each other.

## Key Dependencies

| Dependency                 | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `date-fns`                 | Date manipulation                                                         |
| `date-fns-tz`              | Timezone conversions (`toZonedTime`, `fromZonedTime`, `formatInTimeZone`) |
| `class-variance-authority` | Component variant definitions                                             |
| `clsx` + `tailwind-merge`  | Conditional class merging via `cn()`                                      |
| `@radix-ui/*`              | Accessible UI primitives                                                  |
