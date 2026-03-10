import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-[#ffffff10] glass-panel flex items-center justify-between px-8 sticky top-0 z-10 w-full bg-carbon-900/60 backdrop-blur-md">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search zones, hotspots..." 
            className="w-full bg-carbon-800/50 border border-[#ffffff10] text-gray-200 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-carbon-primary transition"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-carbon-success text-glow animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">Grid Status: Stable</span>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 transition relative">
          <Bell className="w-5 h-5 text-gray-300 hover:text-white transition" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-carbon-alert rounded-full"></span>
        </button>
        <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-carbon-primary flex items-center justify-center border border-[#ffffff20] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}
