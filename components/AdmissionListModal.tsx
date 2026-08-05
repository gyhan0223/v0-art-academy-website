"use client";

/**
 * 대학별 합격자 명단 모달.
 * 메인 페이지(Scene2)와 윈터스쿨 합격 실적 섹션이 함께 사용한다.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  admissionLists,
  RECENT_YEAR,
  type UniversityCard,
} from "@/lib/admissions-data";

export default function AdmissionListModal({
  card,
  onClose,
}: {
  card: UniversityCard | null;
  onClose: () => void;
}) {
  const list = card ? admissionLists[card.name] : undefined;
  const isOpen = card !== null;

  // 호출부가 인라인 함수를 넘겨도 열려 있는 동안 효과가 재실행되지 않도록 ref로 참조한다.
  // (재실행되면 잠금 해제용으로 저장해 둔 overflow 값이 "hidden"으로 덮여 스크롤이 풀리지 않는다)
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 모달이 열려 있는 동안 배경 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${card.name} 합격자 명단`}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-2xl max-h-[85dvh] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: card.color }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b border-white/15">
              <div className="text-left">
                <h3 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                  {card.name}
                </h3>
                <p className="mt-2 text-white/70 text-sm md:text-base">
                  {list?.year ?? RECENT_YEAR}{" "}
                  <span className="text-yellow-400 font-semibold">
                    {card.recent}
                  </span>
                  명 합격 · 누적{" "}
                  <span className="text-yellow-400 font-semibold">
                    {card.total}
                  </span>
                  명
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="shrink-0 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8">
              {list && list.admittees.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {list.admittees.map((admittee, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 text-left"
                    >
                      <span className="text-white/90 text-sm md:text-base">
                        {admittee.major}
                      </span>
                      <span className="text-white font-semibold text-sm md:text-base">
                        {admittee.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60 text-sm">
                  합격자 명단을 준비 중입니다.
                </p>
              )}

              <p className="mt-6 text-white/40 text-xs">
                합격자 성명은 개인정보보호를 위해 일부 마스킹 처리되었습니다.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
