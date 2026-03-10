'use client';

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-transparent bg-transparent">
        <span className="w-5 h-5"></span> 
      </button>
    ); // Placeholder to maintain layout space
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      title="Toggle Theme"
      className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-carbon-primary/50 bg-white/5 hover:bg-carbon-primary/10 hover:shadow-[0_0_15px_rgba(123,63,228,0.4)] transition"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-white/80 hover:text-carbon-primary transition" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-carbon-900 hover:text-carbon-primary transition" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
