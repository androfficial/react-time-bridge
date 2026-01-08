/**
 * Theme context type and context definition
 */

import { createContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

export type ThemeContextType = {
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
