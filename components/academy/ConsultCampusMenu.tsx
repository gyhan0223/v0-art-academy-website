"use client";

/**
 * 캠퍼스를 고르는 상담 예약 버튼.
 *
 * ConsultCampusLinks처럼 버튼 두 개를 나란히 둘 자리가 없는 곳
 * (하단 고정 트레이, 결과 패널 안쪽 등)에서 쓴다. 눌러야 캠퍼스가
 * 나오므로 한 단계가 늘지만, 좁은 자리에서 버튼이 두 줄로 접히는 것보다는 낫다.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CAMPUSES } from "@/lib/contact";

export default function ConsultCampusMenu({
  label,
  className = "",
  wrapperClassName = "",
  align = "right",
  direction = "down",
  onSelect,
}: {
  /** 버튼 문구 */
  label: string;
  /** 버튼에 적용할 클래스 — 페이지의 기존 CTA 스타일을 그대로 넘긴다 */
  className?: string;
  /** 버튼을 감싸는 relative 컨테이너 클래스. 버튼이 flex 자식이었다면
   *  w-full·shrink-0 같은 폭 관련 클래스를 여기로 옮겨야 배치가 안 깨진다. */
  wrapperClassName?: string;
  align?: "left" | "right";
  /** 화면 아래쪽에 붙는 버튼이면 "up"으로 열어야 목록이 잘리지 않는다 */
  direction?: "down" | "up";
  /** 캠퍼스를 고른 순간 실행할 부가 처리(조합 내용 복사 등) */
  onSelect?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${wrapperClassName}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={className}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          aria-hidden
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          className={`absolute z-50 w-60 overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] shadow-xl shadow-black/40 ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          } ${align === "right" ? "right-0" : "left-0"}`}
        >
          {CAMPUSES.map((campus) => (
            <li key={campus.label}>
              <a
                href={campus.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onSelect?.();
                  setOpen(false);
                }}
                className="block border-b border-white/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
              >
                <span className="block text-sm font-medium text-white/90">
                  {campus.label}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-white/40">
                  네이버 예약 · {campus.phone}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
