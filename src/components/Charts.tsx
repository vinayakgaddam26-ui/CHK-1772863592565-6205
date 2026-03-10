'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Charts() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const evtSource = new EventSource('/api/emissions/stream');
    evtSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.success) {
        setData(parsed.data.slice(0, 7).map((item: any) => ({
          name: item.zone.split(' ')[0],
          traffic: item.trafficLevel,
          energy: item.energyUsage,
          infra: item.infrastructure
        })));
      }
    };
    return () => evtSource.close();
  }, []);

  if (data.length === 0) {
    return <div className="text-gray-500 text-sm w-full h-full flex items-center justify-center">Loading trend data...</div>;
  }

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF2A5F" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FF2A5F" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFC200" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FFC200" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(19, 21, 26, 0.9)', borderColor: '#ffffff10', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="traffic" stroke="#00E5FF" fillOpacity={1} fill="url(#colorTraffic)" stackId="1" />
          <Area type="monotone" dataKey="energy" stroke="#FF2A5F" fillOpacity={1} fill="url(#colorEnergy)" stackId="1" />
          <Area type="monotone" dataKey="infra" stroke="#FFC200" fillOpacity={1} fill="url(#colorInfra)" stackId="1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
