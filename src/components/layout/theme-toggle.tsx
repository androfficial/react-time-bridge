/**
 * Theme toggle button component
 */

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
