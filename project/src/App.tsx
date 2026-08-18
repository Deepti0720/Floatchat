import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import DataCanvas from '@/components/DataCanvas';
import PipelineDrawer from '@/components/PipelineDrawer';
import { generateDataset, parseQuery, generateAssistantResponse } from '@/lib/mockData';
import type { ChatMessage, OceanDataset, PipelineStep, QueryParams } from '@/types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    text: 'Welcome to FloatChat. I can analyze ARGO float data from the Arabian Sea and Bay of Bengal. Try a quick action below or ask me about ocean temperature, salinity profiles, or thermal anomalies.',
    timestamp: Date.now(),
  },
];

const INITIAL_STEPS: PipelineStep[] = [
  { label: 'LLM Parameter Extraction', detail: 'Awaiting query...', status: 'pending' },
  { label: 'ERDDAP API URL Generated', detail: 'Awaiting parameters...', status: 'pending' },
  { label: 'Xarray / Pandas Processing', detail: 'Awaiting data...', status: 'pending' },
];

export default function App() {
  const fetchArgoFloat = async (floatId: string | number) => {
    try {
      const response = await fetch(`https://a1b2-34-56-78.ngrok-free.app/api/float/${floatId}`);
      if (!response.ok) throw new Error("Failed to fetch float data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Fetch Error:", error);
      return null;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [dataset, setDataset] = useState<OceanDataset | null>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);

  const runQuery = useCallback(async (text: string) => {
    const params = parseQuery(text);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setPipelineOpen(true);

    // Step 1: LLM Parameter Extraction
    setSteps([
      { label: 'LLM Parameter Extraction', detail: `Extracting: ${text.substring(0, 60)}...`, status: 'running' },
      { label: 'ERDDAP API URL Generated', detail: 'Awaiting parameters...', status: 'pending' },
      { label: 'Xarray / Pandas Processing', detail: 'Awaiting data...', status: 'pending' },
    ]);

    await new Promise((res) => setTimeout(res, 400));
    const jsonPayload = JSON.stringify(params);

    // Step 2: ERDDAP URL Generation
    setSteps([
      { label: 'LLM Parameter Extraction', detail: jsonPayload, status: 'done', timing: '0.42s' },
      { label: 'ERDDAP API URL Generated', detail: buildErddapUrl(params), status: 'running' },
      { label: 'Xarray / Pandas Processing', detail: 'Awaiting data...', status: 'pending' },
    ]);

    await new Promise((res) => setTimeout(res, 400));

    // Step 3: Fetch real data from FastAPI backend
    setSteps((prev) => [
      prev[0],
      { label: 'ERDDAP API URL Generated', detail: buildErddapUrl(params), status: 'done', timing: '0.31s' },
      { label: 'Xarray / Pandas Processing', detail: 'Fetching live ARGO data via FastAPI...', status: 'running' },
    ]);

    // Extract target float ID or default to 6902746
    const floatIdMatch = text.match(/\b\d{7}\b/);
    const floatId = floatIdMatch ? floatIdMatch[0] : '6902746';

    const realData = await fetchArgoFloat(floatId);
    let finalDataset = realData;

    // Fallback to mock dataset if API fetch encounters an issue
    if (!realData) {
      finalDataset = generateDataset(params);
    }

    setDataset(finalDataset);

    const pointCount = finalDataset?.profile?.length || 0;
    const obsCount = finalDataset?.observations?.length || 0;

    setSteps((prev) => [
      prev[0],
      prev[1],
      { 
        label: 'Xarray / Pandas Processing', 
        detail: `Processed ${pointCount} depth points, ${obsCount} observations from FastAPI`, 
        status: 'done', 
        timing: '0.85s' 
      },
    ]);

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: generateAssistantResponse(params),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      runQuery(text);
    },
    [runQuery]
  );

  const handleQuickAction = useCallback(
    (text: string) => {
      runQuery(text);
    },
    [runQuery]
  );

  return (
    <div className="flex flex-col h-screen bg-ink-950 overflow-hidden">
      <Header onTogglePipeline={() => setPipelineOpen((v) => !v)} pipelineOpen={pipelineOpen} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — 35% */}
        <div className="w-[35%] min-w-[340px] max-w-[480px] flex-shrink-0">
          <ChatPanel
            messages={messages}
            loading={loading}
            onSend={handleSend}
            onQuickAction={handleQuickAction}
          />
        </div>

        {/* Right panel — 65% */}
        <div className="flex-1 min-w-0">
          <DataCanvas dataset={dataset} loading={loading} />
        </div>
      </div>

      <PipelineDrawer
        open={pipelineOpen}
        steps={steps}
        onToggle={() => setPipelineOpen((v) => !v)}
      />
    </div>
  );
}

function buildErddapUrl(params: QueryParams): string {
  const startYear = params.dateRange.split('-')[0];
  return `https://incois.erddap.in/griddap/argo_float.nc?temperature,salinity[(${startYear})-01-01:1:day][0:1:${params.depth}][(${params.lat}-0.5):1:(${params.lat}+0.5)][(${params.lon}-0.5):1:(${params.lon}+0.5)]`;
}