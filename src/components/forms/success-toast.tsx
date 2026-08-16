"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";

export function SuccessToast({
  message,
  title = "Submitted successfully",
  onClose,
  duration = 6000,
}: {
  message?: string;
  title?: string;
  onClose?: () => void;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onCloseRef.current?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      className="animate-fade-up fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[100] w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-emerald-500/30 bg-[#12141c] p-4 shadow-2xl shadow-black/30"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onCloseRef.current?.();
          }}
          aria-label="Dismiss notification"
          className="-m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-[#181a24] hover:text-slate-100"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
