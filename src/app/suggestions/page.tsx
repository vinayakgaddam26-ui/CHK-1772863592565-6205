import React from 'react';
import { Leaf, MapPin, TreePine, Wind } from 'lucide-react';
import Link from 'next/link';

const suggestionsData = [
  {
    id: 1,
    zone: 'Delhi NCR',
    emissions: '1.2M Tons',
    primaryCause: 'Traffic Congestion & Industrial',
    recommendation: 'Urban Forest Belt',
    treesRequired: '150,000',
    type: 'Critical',
    impact: 'Offset 15% local CO2e annually'
  },
  {
    id: 2,
    zone: 'Mumbai Coastway',
    emissions: '850k Tons',
    primaryCause: 'Heavy Transit',
    recommendation: 'Mangrove Restoration',
    treesRequired: '80,000',
    type: 'High',
    impact: 'Offset 8% local CO2e annually + flood defense'
  },
  {
    id: 3,
    zone: 'Pune IT Park',
    emissions: '420k Tons',
    primaryCause: 'Energy Grid Load',
    recommendation: 'Boulevard Micro-forests',
    treesRequired: '25,000',
    type: 'Moderate',
    impact: 'Offset 5% local CO2e annually + cooling shadow'
  }
];

export default function SuggestionsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <TreePine className="w-8 h-8 mr-3 text-carbon-success" /> 
            Mitigation Suggestions
          </h1>
          <p className="text-white/50 mt-1">Data-driven tree plantation targets to offset highest emitting zones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestionsData.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-[#00E676]/30 transition-all flex flex-col h-full">
            
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] transition-all
              ${item.type === 'Critical' ? 'bg-carbon-alert/10 group-hover:bg-carbon-alert/20' : 
                item.type === 'High' ? 'bg-carbon-warn/10 group-hover:bg-carbon-warn/20' : 
                'bg-carbon-primary/10 group-hover:bg-carbon-primary/20'}
            `}></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3 inline-block
                  ${item.type === 'Critical' ? 'bg-carbon-alert/20 text-carbon-alert' : 
                    item.type === 'High' ? 'bg-[#FFD600]/20 text-[#FFD600]' : 
                    'bg-carbon-primary/20 text-carbon-primary'}
                `}>
                  {item.type} Priority
                </span>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-white/50" /> {item.zone}
                </h3>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm text-white/50 mb-1">Current Output</p>
                <p className="text-lg font-bold text-white">{item.emissions}</p>
                <p className="text-xs text-white/40">{item.primaryCause}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-carbon-success font-bold flex items-center mb-1">
                  <Leaf className="w-4 h-4 mr-1" /> Recommended Action
                </p>
                <p className="text-lg font-bold text-white">{item.recommendation}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-carbon-800/50 rounded-xl border border-carbon-success/20">
              <p className="text-sm text-white/60 mb-1">Required Plantation</p>
              <p className="text-2xl font-bold text-carbon-success">{item.treesRequired} <span className="text-base font-normal text-white/50">Trees</span></p>
              <p className="text-xs text-white/40 mt-2 flex items-center">
                <Wind className="w-3 h-3 mr-1" /> {item.impact}
              </p>
            </div>
            
            <Link href={`/city/${item.zone.split(' ')[0].toLowerCase()}`} className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-center font-medium text-white text-sm transition-colors border border-white/10">
              View Zone Telemetry
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}
