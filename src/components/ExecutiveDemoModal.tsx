import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const EXECUTIVE_DEMO_SRC = '/demo/service-station-ohs-enterprise-demo.mp4';

interface ExecutiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Executive demo player. Plays the 2-minute narrated demo.
 * Closes on the close button, the Escape key, or a click on the backdrop. Playback is paused on close,
 * focus moves into the dialog on open and returns to the previously focused element on close.
 */
export const ExecutiveDemoModal: React.FC<ExecutiveDemoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = React.useCallback(() => {
    videoRef.current?.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Prevent the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="executive-demo-backdrop"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-3 sm:p-6"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Executive demo video"
        data-testid="executive-demo-modal"
        className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-3">
          <h2 className="text-sm sm:text-base font-extrabold text-white">2-Minute Executive Demo</h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close demo video"
            data-testid="executive-demo-close"
            className="h-9 w-9 flex-shrink-0 rounded-lg border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <video
            ref={videoRef}
            data-testid="executive-demo-video"
            className="w-full h-auto rounded-xl bg-black"
            controls
            playsInline
            preload="metadata"
            autoPlay
          >
            <source src={EXECUTIVE_DEMO_SRC} type="video/mp4" />
            Your browser cannot play this video.{' '}
            <a href={EXECUTIVE_DEMO_SRC} className="underline text-amber-300">
              Download the demo (MP4)
            </a>
            .
          </video>
          <p className="mt-3 text-xs text-slate-300">
            Product walkthrough for evaluation. AI-drafted documents in the product are drafts and require review by a
            competent person before use.
          </p>
        </div>
      </div>
    </div>
  );
};
