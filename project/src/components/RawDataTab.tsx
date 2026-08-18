import { Download, Table } from 'lucide-react';
import type { FloatObservation } from '@/types';

interface RawDataTabProps {
  observations: FloatObservation[];
}

export default function RawDataTab({ observations }: RawDataTabProps) {
  const exportCSV = () => {
    const headers = ['Date', 'Latitude', 'Longitude', 'Pressure (dbar)', 'Temperature (°C)', 'Salinity (PSU)'];
    const rows = observations.map((o) => [
      o.date,
      o.latitude.toString(),
      o.longitude.toString(),
      o.pressure.toString(),
      o.temperature.toFixed(2),
      o.salinity.toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'floatchat_observations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">
            Raw Observations ({observations.length} records)
          </span>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all text-xs font-medium text-slate-300 hover:text-cyan-200"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin glass rounded-xl border border-cyan-500/10">
        <table className="w-full text-xs">
          <thead className="sticky top-0 glass-strong z-10">
            <tr className="border-b border-cyan-500/15">
              {['Date', 'Latitude', 'Longitude', 'Pressure (dbar)', 'Temp (°C)', 'Salinity (PSU)'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-cyan-400/70"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {observations.map((o, i) => (
              <tr
                key={i}
                className="border-b border-slate-700/30 hover:bg-cyan-500/5 transition-colors"
              >
                <td className="px-4 py-2 text-slate-300 font-mono">{o.date}</td>
                <td className="px-4 py-2 text-slate-400 font-mono">{o.latitude.toFixed(2)}°N</td>
                <td className="px-4 py-2 text-slate-400 font-mono">{o.longitude.toFixed(2)}°E</td>
                <td className="px-4 py-2 text-slate-400 font-mono">{o.pressure}</td>
                <td className="px-4 py-2 font-mono">
                  <span
                    className={
                      o.temperature > 20
                        ? 'text-orange-300'
                        : o.temperature > 10
                          ? 'text-cyan-300'
                          : 'text-blue-300'
                    }
                  >
                    {o.temperature.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-2 text-teal-300 font-mono">{o.salinity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
