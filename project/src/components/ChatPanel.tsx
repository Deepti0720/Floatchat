import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
  onQuickAction: (text: string) => void;
}

const QUICK_ACTIONS = [
  'Show ocean temperature profile near Mumbai (Arabian Sea)',
  'Plot salinity depth profile at 15°N, 70°E down to 1000m',
  'Detect thermal anomalies in Bay of Bengal (2020-2025)',
];

export default function ChatPanel({ messages, loading, onSend, onQuickAction }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full glass border-r border-cyan-500/10">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-cyan-500/10 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          AI Query Console
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-500/15 border border-cyan-400/25 text-slate-100'
                  : 'glass border border-slate-600/30 text-slate-300'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  FloatChat AI
                </div>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass rounded-xl px-3.5 py-2.5 border border-slate-600/30">
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono">Querying ERDDAP...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Quick actions */}
      <div className="px-4 py-2.5 border-t border-cyan-500/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Quick Actions
          </span>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            {showQuickActions ? (
              <>
                <span>Minimize</span>
                <ChevronDown className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Expand</span>
                <ChevronUp className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {showQuickActions && (
          <div className="flex flex-col gap-1.5 animate-fade-in">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => onQuickAction(action)}
                disabled={loading}
                className="text-left text-xs px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-cyan-400/30 hover:bg-cyan-500/5 text-slate-400 hover:text-cyan-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="text-cyan-500/60 font-mono mr-1.5">{i + 1}.</span>
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-cyan-500/10">
        <div className="flex items-center gap-2 glass rounded-xl border border-cyan-500/15 px-3 py-2 focus-within:border-cyan-400/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ocean parameters..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </div>
    </div>
  );
}