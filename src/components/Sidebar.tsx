import React from 'react';
import Image from 'next/image';
import { LayoutDashboard, Map, Settings, Activity, TreePine } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 glass-panel border-r border-[#ffffff10] flex flex-col h-full sticky top-0 bg-carbon-900/80 z-20">
      <div className="p-6 flex items-center space-x-3">
        <Image src="/logo.png" width={32} height={32} alt="Logo" />
        <span className="text-xl font-bold text-white">CarbonEye</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem href="/" icon={<LayoutDashboard />} label="Dashboard" active />
        <NavItem href="/city-map" icon={<Map />} label="City Map" />
        <NavItem href="/analytics" icon={<Activity />} label="Analytics" />
        <NavItem href="/suggestions" icon={<TreePine />} label="Suggestions" />
      </nav>

      <div className="p-4 border-t border-[#ffffff10]">
        <NavItem href="#" icon={<Settings />} label="Settings" />
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-carbon-primary/15 text-carbon-primary shadow-[0_0_20px_rgba(123,63,228,0.3)] border border-carbon-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
