'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, Wand2, Send, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { executeWithOrchestrator } from '@/app/actions/orchestrator';

interface ZeusClowProps {
  width?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hasCode?: boolean;
}

export default function ZeusClow({ width: controlledWidth }: ZeusClowProps) {
  const [internalWidth, setInternalWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const width = controlledWidth ?? internalWidth;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const hasCodeBlock = (content: string): boolean => {
    return content.includes('```') || content.includes('function ') || content.includes('const ') || content.includes('export ');
  };

  const extractCode = (content: string): string => {
    const codeBlockMatch = content.match(/```(?:typescript|javascript|ts|js|python|py)?\n([\s\S]*?)```/);
    if (codeBlockMatch) return codeBlockMatch[1];
    
    const lines = content.split('\n');
    const codeLines = lines.filter(line => 
      line.includes('function ') || 
      line.includes('const ') || 
      line.includes('export ') ||
      line.includes('import ') ||
      line.includes('class ')
    );
    
    return codeLines.length > 0 ? codeLines.join('\n') : content;
  };

  const handleDownloadCode = (content: string) => {
    const code = extractCode(content);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jarvis-plugin.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleMouseDown = () => setIsResizing(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        setInternalWidth(Math.max(300, Math.min(600, newWidth)));
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput('');
    appendMessage({ role: 'user', content: trimmedInput });
    setIsLoading(true);

    try {
      const response = await executeWithOrchestrator(trimmedInput);

      if (response.success) {
        const formattedResponse = response.output || 'Nessuna risposta';
        appendMessage({ role: 'assistant', content: formattedResponse });
      } else {
        appendMessage({ role: 'assistant', content: `ZEUS CLOW OFFLINE: ${response.error || 'Controlla API Key nel terminale'}` });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Controlla API Key nel terminale';
      appendMessage({ role: 'assistant', content: `ZEUS CLOW OFFLINE: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const isInputEmpty = input.trim().length === 0;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 bg-zinc-950/90 backdrop-blur-xl border-l border-zinc-800/50 flex flex-col z-20 shadow-2xl"
      style={{ width: `${width}px` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-amber-400/50 transition-colors rounded-l-md"
        onMouseDown={handleMouseDown}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/50 bg-zinc-900/20">
          <h2 className="text-sm font-semibold text-amber-400 tracking-wide">ZEUS CLOW</h2>
          <p className="text-xs text-zinc-500 mt-0.5 font-medium">AI Orchestrator</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mb-3">
                <Loader2 className="w-6 h-6 text-amber-400/60 animate-spin" />
              </div>
              <p className="text-zinc-500 text-sm">Pronto per ricevere comandi</p>
              <p className="text-zinc-600 text-xs mt-1">Digita per iniziare</p>
            </div>
          )}
          {messages.map((msg, idx) => {
            const hasCode = hasCodeBlock(msg.content);
            return (
            <div
              key={idx}
              className={`p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-zinc-800/60 text-zinc-300 ml-8 border border-zinc-700/30'
                  : 'bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 text-zinc-200 mr-8 border border-amber-400/10'
              }`}
            >
              <div className="overflow-y-auto max-h-96">
                <div className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-amber-400 prose-headings:font-semibold prose-headings:mb-2
                  prose-p:text-zinc-300 prose-p:mb-3 prose-p:leading-relaxed
                  prose-strong:text-amber-300 prose-strong:font-bold
                  prose-ul:text-zinc-300 prose-ul:mb-2 prose-ul:pl-4
                  prose-li:text-zinc-300 prose-li:mb-1
                  prose-code:text-amber-200 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                  prose-pre:bg-zinc-900 prose-pre:text-zinc-300 prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-blockquote:border-l-4 prose-blockquote:border-amber-400/50 prose-blockquote:pl-4 prose-blockquote:text-zinc-400 prose-blockquote:italic">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              {hasCode && msg.role === 'assistant' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDownloadCode(msg.content)}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-amber-400/10 text-amber-400 rounded-lg hover:bg-amber-400/20 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download Plugin
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractCode(msg.content));
                      alert('Codice copiato! Usa "PUSH TO GIT" per salvare su GitHub');
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-zinc-700/30 text-zinc-300 rounded-lg hover:bg-zinc-700/50 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Push to Git
                  </button>
                </div>
              )}
            </div>
            );
          })}
          {isLoading && (
            <div className="p-3 rounded-xl text-sm bg-zinc-900/60 text-amber-400 mr-8 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Elaborazione...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800/50 bg-zinc-900/20">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Invia un comando..."
              className="flex-1 bg-zinc-900/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || isInputEmpty}
              className="p-3 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-xl hover:bg-amber-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="px-4 py-3 border-t border-zinc-800/50 flex items-center justify-center gap-3 bg-zinc-900/20">
        <button
          className="p-2.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50 transition-all hover:scale-105"
          title="Allegati"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <button
          className="p-2.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50 transition-all hover:scale-105"
          title="Bacchetta Magica"
        >
          <Wand2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}