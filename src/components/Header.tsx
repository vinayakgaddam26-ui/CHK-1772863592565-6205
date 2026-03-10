import React from 'react';
import { AuthButton } from './AuthButton';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="h-20 border-b border-[#ffffff10] glass-panel flex items-center justify-between px-8 sticky top-0 z-10 w-full bg-carbon-900/60 backdrop-blur-md">
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-carbon-success text-glow animate-pulse"></span>
          <span className="text-sm font-medium text-white/80 dark:text-white/80 text-carbon-900/80">Grid Status: Stable</span>
        </div>
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  );
}
