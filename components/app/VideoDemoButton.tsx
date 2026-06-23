'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const VIDEO_ID = '-9FZYstTdCY';
const VIDEO_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`;

const defaultButtonClassName =
  'inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-white font-semibold hover:bg-primary-100 dark:hover:bg-primary-800/50 hover:border-primary-600 transition-all';

export interface VideoDemoButtonProps {
  className?: string;
}

export default function VideoDemoButton({ className = defaultButtonClassName }: VideoDemoButtonProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setVideoOpen(true)}
        className={className}
      >
        Video Demo
        <Play className="ml-2 h-5 w-5" />
      </button>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {videoOpen && (
              <iframe
                src={VIDEO_EMBED_URL}
                title="Video Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
