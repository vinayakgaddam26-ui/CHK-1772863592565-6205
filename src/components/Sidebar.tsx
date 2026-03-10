import React from 'react';
import Image from 'next/image';
import { LayoutDashboard, Map, Settings, Activity } from 'lucide-react';
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
        <NavItem href="#" icon={<Map />} label="City Map" />
        <NavItem href="#" icon={<Activity />} label="Analytics" />
      </nav>

      <div className="p-4 border-t border-[#ffffff10]">
        <NavItem href="#" icon={<Settings />} label="Settings" />
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-carbon-primary/10 text-carbon-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
