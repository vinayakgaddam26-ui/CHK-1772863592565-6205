'use client';

import React from 'react';
import { Activity, TrendingUp, TrendingDown, Wind } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const trendData = [
  { name: 'Mon', emissions: 4000, target: 2400, offset: 2400 },
  { name: 'Tue', emissions: 3000, target: 1398, offset: 2210 },
  { name: 'Wed', emissions: 2000, target: 9800, offset: 2290 },
  { name: 'Thu', emissions: 2780, target: 3908, offset: 2000 },
  { name: 'Fri', emissions: 1890, target: 4800, offset: 2181 },
  { name: 'Sat', emissions: 2390, target: 3800, offset: 2500 },
  { name: 'Sun', emissions: 3490, target: 4300, offset: 2100 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Analytics</h1>
        <p className="text-white/50 mt-1">Deep-dive into emission trends, sources, and offset metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 font-medium">Weekly Carbon Output</h3>
            <Activity className="w-5 h-5 text-carbon-primary" />
          </div>
          <p className="text-3xl font-bold text-white">19.5k <span className="text-lg text-white/50 font-normal">Tons</span></p>
          <p className="text-xs text-carbon-success flex items-center mt-2 font-medium">
            <TrendingDown className="w-3 h-3 mr-1" /> 4.2% less than last week
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-primary/10 rounded-full blur-[50px] group-hover:bg-carbon-primary/20 transition-all"></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 font-medium">Average AQI</h3>
            <Wind className="w-5 h-5 text-carbon-warn" />
          </div>
          <p className="text-3xl font-bold text-white">68 <span className="text-lg text-white/50 font-normal">Moderate</span></p>
          <p className="text-xs text-carbon-alert flex items-center mt-2 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +12 point variance
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-warn/10 rounded-full blur-[50px] group-hover:bg-carbon-warn/20 transition-all"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Trend Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">7-Day Emission vs Target Target</h3>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF2A5F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF2A5F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#FF2A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
                <Area type="monotone" dataKey="target" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdowns */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Emissions by Source Category</h3>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="emissions" name="Traffic" stackId="a" fill="#FF2A5F" radius={[0, 0, 4, 4]} />
                <Bar dataKey="target" name="Infrastructure" stackId="a" fill="#00E5FF" />
                <Bar dataKey="offset" name="Energy" stackId="a" fill="#FFD600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
