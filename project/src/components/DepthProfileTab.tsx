import { useMemo } from 'react';
import PlotlyChart from './PlotlyChart';
import type { DepthPoint, QueryParams } from '@/types';
import type { Data, Layout } from 'plotly.js-dist-min';

interface DepthProfileTabProps {
  profile: DepthPoint[];
  params: QueryParams;
}

export default function DepthProfileTab({ profile, params }: DepthProfileTabProps) {
  const { data, layout } = useMemo(() => {
    const pressures = profile.map((p) => p.pressure);
    const temperatures = profile.map((p) => p.temperature);
    const salinities = profile.map((p) => p.salinity);

    const traces: Data[] = [];
    const xaxisTitles: string[] = [];

    if (params.variable === 'temperature' || params.variable === 'both') {
      traces.push({
        x: temperatures,
        y: pressures,
        mode: 'lines+markers',
        name: 'Temperature (°C)',
        line: { color: '#22d3ee', width: 2.5, shape: 'spline' },
        marker: { size: 4, color: '#22d3ee', line: { color: '#0e7490', width: 1 } },
        fill: 'tozerox',
        fillcolor: 'rgba(34, 211, 238, 0.06)',
        hovertemplate: 'Temp: %{x:.2f}°C<br>Depth: %{y:.0f}m<extra></extra>',
      } as Data);
      xaxisTitles.push('Temperature (°C)');
    }

    if (params.variable === 'salinity' || params.variable === 'both') {
      const xaxisKey = params.variable === 'both' ? 'x2' : 'x';
      traces.push({
        x: salinities,
        y: pressures,
        xaxis: xaxisKey,
        mode: 'lines+markers',
        name: 'Salinity (PSU)',
        line: { color: '#2dd4bf', width: 2.5, shape: 'spline', dash: 'dot' },
        marker: { size: 4, color: '#2dd4bf', line: { color: '#0f766e', width: 1 } },
        hovertemplate: 'Salinity: %{x:.2f} PSU<br>Depth: %{y:.0f}m<extra></extra>',
      } as Data);
      xaxisTitles.push('Salinity (PSU)');
    }

    const layoutObj: Partial<Layout> = {
      title: {
        text: `Vertical Profile — ${params.lat}°N, ${params.lon}°E`,
        font: { size: 13, color: '#cbd5e1' },
        x: 0.5,
      },
      yaxis: {
        title: { text: 'Depth / Pressure (dbar)', font: { size: 11, color: '#94a3b8' } },
        autorange: 'reversed',
        gridcolor: 'rgba(34, 211, 238, 0.08)',
        zerolinecolor: 'rgba(34, 211, 238, 0.15)',
        showline: true,
        linecolor: 'rgba(34, 211, 238, 0.15)',
        tickfont: { size: 10, color: '#64748b' },
      },
      xaxis: {
        title: { text: xaxisTitles[0], font: { size: 11, color: '#94a3b8' } },
        gridcolor: 'rgba(34, 211, 238, 0.08)',
        zerolinecolor: 'rgba(34, 211, 238, 0.15)',
        showline: true,
        linecolor: 'rgba(34, 211, 238, 0.15)',
        tickfont: { size: 10, color: '#64748b' },
      },
      margin: { l: 65, r: 60, t: 45, b: 55 },
    };

    if (params.variable === 'both') {
      layoutObj.xaxis2 = {
        title: { text: 'Salinity (PSU)', font: { size: 11, color: '#94a3b8' } },
        overlaying: 'x',
        side: 'top',
        gridcolor: 'rgba(45, 212, 191, 0.08)',
        zerolinecolor: 'rgba(45, 212, 191, 0.15)',
        showline: true,
        linecolor: 'rgba(45, 212, 191, 0.15)',
        tickfont: { size: 10, color: '#64748b' },
      };
      layoutObj.margin = { l: 65, r: 60, t: 75, b: 55 };
    }

    return { data: traces, layout: layoutObj };
  }, [profile, params]);

  return (
    <div className="h-full w-full p-4">
      <PlotlyChart data={data} layout={layout} />
    </div>
  );
}
