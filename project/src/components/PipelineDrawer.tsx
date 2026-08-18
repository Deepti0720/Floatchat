import { ChevronDown, Terminal, Check, Loader2, Clock } from 'lucide-react';
import type { PipelineStep } from '@/types';

interface PipelineDrawerProps {
  open: boolean;
  steps: PipelineStep[];
  onToggle: () => void;
}

export default function PipelineDrawer({ open, steps, onToggle }: PipelineDrawerProps) {
  return (
    <>
      {/* Toggle bar */}
      <button
        onClick={onToggle}
        className="w-full glass-strong border-t border-cyan-500/15 px-5 py-2 flex items-center justify-between hover:bg-cyan-500/5 transition-colors z-30 relative"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
            Inspect Pipeline / Execution Log
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Drawer content */}
      <div
        className={`glass-strong border-t border-cyan-500/15 overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="px-5 py-4 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 glass rounded-lg border border-slate-700/30 px-4 py-2.5"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-cyan-500/20 text-xs font-mono text-cyan-400 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{step.label}</span>
                    <div className="flex items-center gap-2">
                      {step.timing && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                          <Clock className="w-2.5 h-2.5" />
                          {step.timing}
                        </span>
                      )}
                      {step.status === 'done' && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1 break-all">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
