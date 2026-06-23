'use client';

export const AI_MODELS: { value: string; label: string }[] = [
  { value: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
  { value: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6' },
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash' },
  { value: 'google/gemini-2.5-pro-preview-06-05', label: 'Gemini 2.5 Pro' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct' },
  { value: 'mistralai/mistral-large', label: 'Mistral Large' },
  { value: 'deepseek/deepseek-chat-v3-0324', label: 'DeepSeek Chat v3' },
  { value: 'cohere/command-r-plus', label: 'Command R+' },
];

export const AI_CONTACT_MODELS: { value: string; label: string }[] = [
  { value: 'google/gemini-3.1-pro-preview', label: 'Google Gemini 3.1 Preview' },
  { value: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
  { value: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6' },
  { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
  { value: 'google/gemini-3-flash-preview', label: 'Google Gemini 3 Flash' },
  { value: 'openai/gpt-5.2-chat', label: 'OpenAI 5.2 Chat' },
  { value: 'amazon/nova-2-lite-v1', label: 'Amazon Nova Lite' },
  { value: 'deepseek/deepseek-v3.2', label: 'DeepSeek 3.2' },
  { value: 'x-ai/grok-4.1-fast', label: 'Grok 4.1 Fast' },
  { value: 'perplexity/sonar-pro-search', label: 'Perplexity Sonar Pro' },
  { value: 'minimax/minimax-m2', label: 'MiniMax M2' },
];

interface AIModelSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  models?: { value: string; label: string }[];
}

export function AIModelSelect({
  value,
  onChange,
  className = '',
  models = AI_CONTACT_MODELS,
}: AIModelSelectProps) {
  const inList = models.some((m) => m.value === value);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {!inList && value && (
        <option value={value}>{value}</option>
      )}
      {models.map((m) => (
        <option key={m.value} value={m.value}>
          {m.label}
        </option>
      ))}
    </select>
  );
}
