'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Send, Loader2, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AdvisorChatInterfaceProps {
  caseId: string;
  initialSessionId?: string | null;
}

export default function AdvisorChatInterface({ caseId, initialSessionId }: AdvisorChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const res = await fetch('/api/ai/removal-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const returnedSessionId = res.headers.get('X-Session-Id');
      if (returnedSessionId) setSessionId(returnedSessionId);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b p-4">
        <MessageCircle className="h-5 w-5 text-primary-600" />
        <h3 className="font-semibold">Ask Follow-up Questions</h3>
      </div>

      <div ref={scrollRef} className="max-h-[400px] overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-secondary-500">
            Ask any follow-up questions about removing this review...
          </p>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {msg.content || '...'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-gray-100 px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
