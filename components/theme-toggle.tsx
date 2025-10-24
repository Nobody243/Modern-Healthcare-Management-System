'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-border bg-card/80 flex items-center justify-center ${className}`}>
        <Sun className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`w-9 h-9 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${className}`}
      aria-label="Toggle theme mode"
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground transition-transform duration-300 rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
