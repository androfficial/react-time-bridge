# ⏰ Time Bridge

A React application for time zone conversion and meeting planning. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Radix UI**.

## ✨ Features

- **Time Converter** — Convert time between any timezones with auto-detection
- **Meeting Planner** — Find optimal meeting slots for participants across timezones
- **Responsive UI** — Light/dark theme, accessible, mobile-friendly

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Radix UI
- date-fns + date-fns-tz

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📜 Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run lint:css` | Run Stylelint            |
| `npm run format`   | Format with Prettier     |

## 📁 Project Structure

```
src/
├── components/       # Layout, shared & UI components
├── features/         # Time converter & meeting planner
├── constants/        # Timezone data
├── types/            # TypeScript definitions
├── utils/            # Utility functions
└── lib/              # Helpers (cn utility)
```

## 📄 License

MIT
