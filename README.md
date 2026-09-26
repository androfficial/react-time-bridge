# Time Bridge

Time zone converter and meeting planner for distributed teams: convert a date and time into several zones at once, or find the hours that fall inside everyone's working day. Built in January 2026 as a take-home assignment.

**Live demo:** [react-time-bridge.vercel.app](https://react-time-bridge.vercel.app)

## Features

- Converts a date and time from a source zone into several target zones at once. The source zone is taken from the browser when it is in the list, and Set Current Time fills in the current date and time.
- Each target card shows the converted time and date, the UTC offset, the difference in hours and the part of the day, with a warning for very early morning and night. Zones can be added from a dialog, switched in place or removed.
- 27 time zones grouped by region, from Los Angeles to Auckland, including UTC.
- The meeting planner takes participants with a name, a time zone and working hours, colors all 24 UTC hours by how many participants are available and lists the hours that suit everyone. Selecting one of those hours shows each participant's local time.
- Suggests the three best hours and rates them from Perfect to Not suitable: 09:00 to 18:00 local time counts fully, 06:00 to 09:00 and 18:00 to 22:00 count half, night counts zero.
- Exports the participants and the hours that suit everyone, with each participant's local time, to a `.txt` file.
- Light and dark themes that follow the system until the user picks one. The active tab, the theme and the participants are saved in localStorage.

## Tech stack

- **Framework:** React 19, TypeScript 5
- **State:** one custom hook per feature, localStorage
- **Data:** static list of IANA time zones, date-fns 4 and date-fns-tz 3 for conversions
- **UI:** shadcn/ui components on Radix UI primitives, lucide-react icons
- **Styling:** Tailwind CSS 4, class-variance-authority, tailwind-merge, tw-animate-css
- **Tooling:** Vite 7, ESLint 9 with typescript-eslint and perfectionist, Stylelint 16, Prettier 3, Husky 9 with lint-staged
- **Hosting:** Vercel

## Getting started

You need Node.js 20.19 or later; no API keys are required.

```bash
git clone https://github.com/androfficial/react-time-bridge.git
cd react-time-bridge
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Type-checks with `tsc -b` and builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint and fixes what it can |
| `npm run lint:css` | Runs Stylelint on `src/**/*.css` and fixes what it can |
| `npm run format` | Formats the project with Prettier |

Husky runs lint-staged (ESLint, Stylelint and Prettier on staged files) before every commit.

## Project structure

```text
src/
  components/   app layout (header, tabs, theme toggle), shared pickers and selects, theme provider, shadcn/ui primitives
  constants/    time zone list, storage keys, UI text and styling config
  features/     time-converter and meeting-planner, each with its components and one state hook
  lib/          cn() class name helper
  types/        time zone and meeting types
  utils/        time zone math, slot scoring, storage and file download helpers
```

## Notes

- Conversions go through `date-fns-tz` with IANA zone IDs, so daylight saving time is applied for the chosen date. The zone list is static (`src/constants/timezones.ts`), so no time zone data is fetched.
- Each feature keeps its state in one hook (`useTimeConverter`, `useMeetingPlanner`) that derives everything else with `useMemo`; there is no global store. Both tabs are rendered with `forceMount` and hidden with CSS, so switching tabs keeps the entered data.
- Participants are saved to localStorage with a 400 ms debounce and validated field by field when loaded. All storage access goes through wrappers that fall back quietly when storage is blocked.
- The reasoning behind these choices is written up in `docs/`: [architecture](docs/architecture.md), [decisions](docs/decisions.md) and [frontend guidelines](docs/frontend-guidelines.md).
