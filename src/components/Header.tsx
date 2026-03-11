import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, Map, Settings, Activity, TreePine } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-[60] w-full bg-transparent/10 backdrop-blur-sm font-sans">
      {/* Logo & Brand */}
      <div className="flex items-center mr-8">
        <Image src="/logo.png" width={280} height={70} className="w-auto h-14" alt="CarbonEye Logo" priority />
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-1 mr-4 overflow-x-auto hide-scrollbar">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem href="/city-map" icon={<Map size={18} />} label="City Map" />
        <NavItem href="/analytics" icon={<Activity size={18} />} label="Analytics" />
        <NavItem href="/suggestions" icon={<TreePine size={18} />} label="Suggestions" />
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <SearchBar />
      </div>
      
      {/* Actions (Grid Status, Theme, Auth) */}
      <div className="flex items-center space-x-6 ml-auto">
        <div className="hidden sm:flex items-center space-x-2 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-carbon-success text-glow animate-pulse"></span>
          <span className="text-sm font-medium text-white/80 dark:text-white/80 text-carbon-900/80 whitespace-nowrap">Grid Status: Stable</span>
        </div>
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  // Simple check assuming we don't have access to usePathname here since it's an app dir component without 'use client'
  return (
    <Link href={href} className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent whitespace-nowrap">
      {icon}
      <span className="font-bold text-base text-white tracking-wide">{label}</span>
    </Link>
  );
}
