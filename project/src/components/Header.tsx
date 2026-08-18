import { Waves, Activity, ChevronUp } from 'lucide-react';

interface HeaderProps {
  onTogglePipeline: () => void;
  pipelineOpen: boolean;
}

export default function Header({ onTogglePipeline, pipelineOpen }: HeaderProps) {
  return (
    <header className="glass-strong border-b border-cyan-500/15 px-5 py-3 flex items-center justify-between z-30 relative">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-400/30 flex items-center justify-center shadow-glow-cyan">
            <Waves className="w-5 h-5 text-cyan-300" />
          </div>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-100 leading-tight">
            FloatChat <span className="text-cyan-400">🌊</span>
            <span className="text-slate-500 font-normal mx-1.5">|</span>
            <span className="text-slate-300 font-normal">Oceanographic AI Intelligence Agent</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              INCOIS / ERDDAP Node: Connected (Live)
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onTogglePipeline}
        className="group flex items-center gap-2 px-3.5 py-2 rounded-lg glass border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all text-xs font-medium text-slate-300 hover:text-cyan-200"
      >
        <Activity className="w-3.5 h-3.5" />
        <span>Execution Pipeline</span>
        <ChevronUp
          className={`w-3.5 h-3.5 transition-transform ${pipelineOpen ? '' : 'rotate-180'}`}
        />
      </button>
    </header>
  );
}
