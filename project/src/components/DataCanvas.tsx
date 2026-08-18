import { useState } from 'react';
import { LineChart, Map, Table2, BrainCircuit, Loader2 } from 'lucide-react';
import DepthProfileTab from './DepthProfileTab';
import TrajectoryMapTab from './TrajectoryMapTab';
import RawDataTab from './RawDataTab';
import AISummaryTab from './AISummaryTab';
import type { OceanDataset } from '@/types';

interface DataCanvasProps {
  dataset: OceanDataset | null;
  loading: boolean;
}

const TABS = [
  { id: 'profile', label: 'Depth Profiles', icon: LineChart },
  { id: 'map', label: 'Float Trajectory Map', icon: Map },
  { id: 'raw', label: 'Raw Observations', icon: Table2 },
  { id: 'summary', label: 'Scientific AI Summary', icon: BrainCircuit },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function DataCanvas({ dataset, loading }: DataCanvasProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-cyan-500/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 shadow-glow-cyan'
                  : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-20 glass-strong flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-sm font-mono text-cyan-300">Fetching ERDDAP data...</div>
              <div className="text-xs text-slate-500">Processing oceanographic parameters</div>
            </div>
          </div>
        )}

        {!dataset && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-400/20 flex items-center justify-center">
                <LineChart className="w-7 h-7 text-cyan-400/50" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">No data loaded</h3>
              <p className="text-xs text-slate-500">
                Send a query or click a quick action to visualize oceanographic data.
              </p>
            </div>
          </div>
        )}

        {dataset && (
          <div className="h-full animate-fade-in">
            {activeTab === 'profile' && <DepthProfileTab profile={dataset.profile} params={dataset.params} />}
            {activeTab === 'map' && <TrajectoryMapTab floats={dataset.floats} params={dataset.params} />}
            {activeTab === 'raw' && <RawDataTab observations={dataset.observations} />}
            {activeTab === 'summary' && <AISummaryTab summary={dataset.summary} />}
          </div>
        )}
      </div>
    </div>
  );
}
