/**
 * Header component with app branding and navigation
 */

import { Clock, Globe2 } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';

export const Header = () => {
  return (
    <header
      className="bg-card/60 border-border/50 sticky top-0 z-50 border-b backdrop-blur-xl"
      role="banner"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="group flex cursor-default items-center gap-3">
            <div
              aria-hidden="true"
              className="from-primary via-primary to-primary/70 shadow-primary/30 relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
            >
              <Clock className="text-primary-foreground h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <Globe2 className="text-primary-foreground/80 absolute -right-0.5 -bottom-0.5 h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              <div className="from-primary/20 absolute -inset-1 -z-10 rounded-2xl bg-linear-to-br to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <h1 className="from-foreground via-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent transition-all duration-300">
                Time Bridge
              </h1>
              <span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                Timezone Converter
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
