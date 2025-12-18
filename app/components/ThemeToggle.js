// components/ThemeToggle.jsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggle = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 p-4 bg-background rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border border-border text-foreground hover:bg-muted"
      aria-label="Сэдэв солих"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="size-7" />
      ) : (
        <Sun className="size-7 text-yellow-500" />
      )}
    </button>
  );
}