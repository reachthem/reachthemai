'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Circle } from 'lucide-react';

interface AutomationKeywordPhrasesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phrases: string[];
  currentKeywordIndex: number;
}

export default function AutomationKeywordPhrasesModal({
  open,
  onOpenChange,
  phrases,
  currentKeywordIndex,
}: AutomationKeywordPhrasesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-secondary-900">Keyword phrases</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-secondary-500 mb-4">
          Phrases searched by this automation. Completed phrases have been used to find contacts.
        </p>
        <ul className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-2">
          {phrases.map((phrase, i) => {
            const isComplete = i < currentKeywordIndex;
            return (
              <li
                key={`${i}-${phrase}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-secondary-100 bg-secondary-50/50"
              >
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" aria-label="Complete" />
                ) : (
                  <Circle className="h-5 w-5 text-secondary-300 shrink-0" aria-label="Pending" />
                )}
                <span className={`text-sm ${isComplete ? 'text-secondary-700' : 'text-secondary-500'}`}>
                  {phrase || '(empty)'}
                </span>
                {isComplete && (
                  <span className="text-xs text-secondary-400 shrink-0">Completed</span>
                )}
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
