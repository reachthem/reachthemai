'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StrategyResultsCard from '@/components/removal-advisor/StrategyResultsCard';
import ProfessionalUpsellBanner from '@/components/removal-advisor/ProfessionalUpsellBanner';
import AdvisorChatInterface from '@/components/removal-advisor/AdvisorChatInterface';
import { type ReviewCase } from '@/app/actions/removal-advisor';

interface CasePageClientProps {
  reviewCase: ReviewCase;
}

export default function CasePageClient({ reviewCase: initialCase }: CasePageClientProps) {
  const router = useRouter();
  const [reviewCase, setReviewCase] = useState(initialCase);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const analysisTriggeredRef = useRef(false);

  const triggerAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setStreamingContent('');
    setAnalysisError(null);

    try {
      const res = await fetch('/api/ai/removal-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: initialCase.id,
          messages: [{ role: 'user', content: 'Analyze this review and provide removal instructions.' }],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = typeof data?.error === 'string' ? data.error : 'Analysis failed';
        setAnalysisError(message);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      router.refresh();
    } catch (e) {
      console.error('Analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [initialCase.id, router]);

  useEffect(() => {
    if (!initialCase.ai_strategy && !analysisTriggeredRef.current) {
      analysisTriggeredRef.current = true;
      triggerAnalysis();
    }
  }, [initialCase.ai_strategy, triggerAnalysis]);

  useEffect(() => {
    setReviewCase(initialCase);
    if (initialCase.ai_strategy) {
      setStreamingContent('');
      setAnalysisError(null);
    }
  }, [initialCase]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/app/removal-advisor"
          className="flex items-center gap-1 text-primary-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Removal Advisor
        </Link>
        <span className="text-secondary-400">/</span>
        <span className="text-secondary-500">Case #{reviewCase.id.slice(0, 8)}</span>
      </div>

      {/* Strategy Results */}
      <StrategyResultsCard
        reviewCase={reviewCase}
        isAnalyzing={isAnalyzing}
        streamingContent={streamingContent || undefined}
        analysisError={analysisError || undefined}
      />

      {/* Upsell */}
      <ProfessionalUpsellBanner
        caseId={reviewCase.id}
        status={reviewCase.status}
      />

      {/* Follow-up Chat */}
      <AdvisorChatInterface
        caseId={reviewCase.id}
        initialSessionId={reviewCase.ai_session_id}
      />
    </div>
  );
}
