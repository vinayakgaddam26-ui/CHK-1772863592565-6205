import React from 'react';
import { AlertTriangle, CloudRain, MapPin, TrendingUp, Zap } from 'lucide-react';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <Card 
        title="Total City Emissions" 
        value="4.2M Tons" 
        subtext="+12% from last month" 
        icon={<CloudRain className="w-6 h-6 text-carbon-primary" />} 
        trend="up"
      />
      
      <Card 
        title="Active Hotspots" 
        value="12 Zones" 
        subtext="3 critical areas requiring action" 
        icon={<AlertTriangle className="w-6 h-6 text-carbon-warn" />} 
        trend="down"
      />

      <Card 
        title="Highest Emitter" 
        value="Industrial Park" 
        subtext="Energy Grid Overload" 
        icon={<MapPin className="w-6 h-6 text-carbon-alert" />} 
        trend="up"
      />

      <Card 
        title="Mitigation ETA" 
        value="2.5 Hours" 
        subtext="Grid rebalancing in progress" 
        icon={<Zap className="w-6 h-6 text-carbon-success" />} 
        trend="down"
      />

    </div>
  );
}

function Card({ title, value, subtext, icon, trend }: any) {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-[#ffffff10] hover:border-carbon-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl border border-[#ffffff10] group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend === 'up' ? (
          <TrendingUp className="w-5 h-5 text-carbon-alert" />
        ) : (
          <TrendingUp className="w-5 h-5 text-carbon-success transform rotate-180" />
        )}
      </div>
      <h3 className="text-white/60 font-medium text-sm mb-1">{title}</h3>
      <div className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</div>
      <p className="text-xs text-white/60">{subtext}</p>
      
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-carbon-primary/10 rounded-full blur-2xl group-hover:bg-carbon-primary/20 transition-all"></div>
    </div>
  );
}
