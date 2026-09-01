"use client";

/**
 * 진단 온보딩 공용 UI 조각.
 * 한 화면 한 질문 — 큰 질문, 큰 선택지, 넓은 여백.
 * 애니메이션은 opacity + translateY 8~12px로 제한하고
 * prefers-reduced-motion을 존중한다.
 */

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function useFadeProps() {
  const reduced = useReducedMotion();
  if (reduced) {
    return { initial: false as const };
  }
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: "easeOut" as const },
  };
}

/** 선택 피드백을 잠깐 보여준 뒤 다음 단계로 — 중복 호출은 무시한다 */
export function useAutoAdvance(onNext: () => void, delay = 220) {
  const timer = useRef<number | null>(null);
  const next = useRef(onNext);
  next.current = onNext;
  useEffect(
    () => () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    },
    [],
  );
  return () => {
    if (timer.current != null) return;
    timer.current = window.setTimeout(() => next.current(), delay);
  };
}

export function StepLayout({
  title,
  sub,
  onBack,
  children,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const fade = useFadeProps();
  return (
    <motion.div {...fade} className="mx-auto w-full max-w-md px-5 pb-28 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 -ml-1 inline-flex min-h-[44px] items-center gap-1 rounded-md px-1 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden>←</span> 이전
        </button>
      ) : (
        <div className="mb-6 h-[44px]" aria-hidden />
      )}
      <h1 className="whitespace-pre-line text-[26px] font-bold leading-snug text-white">
        {title}
      </h1>
      {sub != null && (
        <p className="mt-3 text-[15px] leading-relaxed text-white/65">{sub}</p>
      )}
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

export function OptionButton({
  selected,
  onClick,
  children,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`block w-full rounded-xl border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? "border-accent bg-accent/10"
          : "border-white/12 bg-white/[0.03] hover:border-white/30"
      }`}
    >
      <span
        className={`block text-base font-medium ${
          selected ? "text-accent" : "text-white/90"
        }`}
      >
        {children}
      </span>
      {hint != null && (
        <span className="mt-1.5 block text-sm leading-relaxed text-white/60">
          {hint}
        </span>
      )}
    </button>
  );
}

/** 결과 화면 하단 고정형 주요 버튼 */
export function PrimaryButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="block w-full rounded-xl bg-accent px-6 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}
