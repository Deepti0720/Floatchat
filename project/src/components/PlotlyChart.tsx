import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { Data, Layout, Config } from 'plotly.js-dist-min';

interface PlotlyChartProps {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
}

export default function PlotlyChart({ data, layout, config }: PlotlyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const defaultLayout: Partial<Layout> = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, sans-serif', size: 11, color: '#94a3b8' },
      margin: { l: 60, r: 30, t: 40, b: 50 },
      showlegend: true,
      legend: {
        font: { color: '#94a3b8' },
        bgcolor: 'rgba(10,20,40,0.7)',
        bordercolor: 'rgba(34,211,238,0.2)',
        borderwidth: 1,
      },
      hoverlabel: {
        bgcolor: 'rgba(10,20,40,0.95)',
        bordercolor: 'rgba(34,211,238,0.5)',
        font: { color: '#e2e8f0', family: 'Inter, sans-serif' },
      },
    };
    const mergedLayout = { ...defaultLayout, ...layout };
    const defaultConfig: Partial<Config> = {
      responsive: true,
      displayModeBar: false,
    };
    Plotly.react(containerRef.current, data, mergedLayout, { ...defaultConfig, ...config });

    const handleResize = () => {
      if (containerRef.current) Plotly.Plots.resize(containerRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) Plotly.purge(containerRef.current);
    };
  }, [data, layout, config]);

  return <div ref={containerRef} className="w-full h-full" />;
}
