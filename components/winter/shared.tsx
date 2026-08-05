"use client";

/**
 * 윈터캠프 페이지들이 함께 쓰는 조각들.
 * /winter(개요)와 4개 하위 페이지가 같은 얼굴을 유지하도록 여기에 모아 둔다.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, ImageIcon } from "lucide-react";
import { WINTER_PAGES } from "@/lib/winter-camp";

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/** 상담 폼은 /winter 한 곳에만 있다. 하위 페이지에서는 그리로 이동한다. */
export const CONSULT_HREF = "/winter#consult-form";

/**
 * 같은 페이지에 상담 폼이 있으면 부드럽게 스크롤하고,
 * 없으면 기본 동작(= /winter#consult-form 이동)을 그대로 둔다.
 */
export function goToConsult(e?: React.MouseEvent) {
  if (typeof document === "undefined") return;
  const el = document.getElementById("consult-form");
  if (!el) return;
  e?.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------- 섹션 제목 -------------------------------- */

export function SectionHead({
  en,
  ko,
  sub,
}: {
  en: string;
  ko: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="mb-12 md:mb-16 text-center">
      <p className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
        {en}
      </p>
      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-snug break-keep">
        {ko}
      </h2>
      {sub && (
        <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed break-keep">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ----------------------------- 하위 페이지 머리 ---------------------------- */

/** 하위 페이지 상단 — 빵부스러기 + 제목 + 형제 페이지 이동 */
export function SubPageHeader({
  en,
  title,
  sub,
}: {
  en: string;
  title: string;
  sub?: React.ReactNode;
}) {
  return (
    <header className="text-center">
      <nav
        aria-label="현재 위치"
        className="flex items-center justify-center gap-1.5 text-xs text-white/40"
      >
        <Link href="/winter" className="transition-colors hover:text-white/70">
          윈터캠프
        </Link>
        <ChevronRight size={12} />
        <span className="text-white/70">{title}</span>
      </nav>

      <p className="mt-6 text-accent text-xs tracking-[0.3em] uppercase">
        {en}
      </p>
      <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-white break-keep">
        {title}
      </h1>
      {sub && (
        <p className="mx-auto mt-5 max-w-xl text-sm md:text-base leading-relaxed text-white/60 break-keep">
          {sub}
        </p>
      )}
    </header>
  );
}

/** 윈터캠프 5개 페이지 — 개요가 맨 앞, 순서는 어느 페이지에서나 같다 */
const WINTER_TABS = [
  { href: "/winter", label: "캠프 개요" },
  ...WINTER_PAGES.map((page) => ({ href: page.href, label: page.label })),
];

/**
 * 윈터캠프 페이지끼리 오가는 줄 — 개요(/winter)를 포함한 다섯 페이지 모두에 같은 모습으로 둔다.
 * 어느 페이지로 넘어가도 이 줄이 화면 상단에서 사라지지 않아야 한다.
 *
 * 모바일에서는 줄바꿈 대신 가로 스크롤 한 줄로 둔다. 다섯 개가 두세 줄로 접히면
 * 첫 화면에서 CTA를 밀어내기 때문이다.
 */
export function WinterTabs({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  /* 현재 페이지 칩이 가로 스크롤 밖에 있을 때만, 딱 보일 만큼만 당겨온다.
     가운데로 몰면 앞쪽 칩(캠프 개요)이 잘려 나가고, 페이지 세로 스크롤은 건드리지 않는다. */
  useEffect(() => {
    const list = listRef.current;
    const chip = activeRef.current;
    if (!list || !chip) return;

    const margin = 20; // 다음 칩이 살짝 보이도록 남기는 여백
    const left = chip.offsetLeft;
    const right = left + chip.offsetWidth;
    if (left - margin < list.scrollLeft) {
      list.scrollLeft = Math.max(0, left - margin);
    } else if (right + margin > list.scrollLeft + list.clientWidth) {
      list.scrollLeft = right + margin - list.clientWidth;
    }
  }, [pathname]);

  return (
    <nav aria-label="윈터캠프 메뉴" className={className}>
      {/* -mx-5 px-5: 모바일에서 스크롤 영역만 화면 끝까지 늘려 칩이 잘린 채 이어짐을 보여준다 */}
      <div
        ref={listRef}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:overflow-x-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {WINTER_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              ref={active ? activeRef : undefined}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs transition-colors md:px-4 md:text-sm ${
                active
                  ? "bg-accent font-semibold text-black"
                  : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* --------------------------------- 이미지 -------------------------------- */

/**
 * 파일이 아직 없어도 레이아웃이 무너지지 않는 이미지 틀.
 * 비율은 호출부에서 aspectClass로 통일한다(갤러리는 전부 4:3).
 */
export function SafeImage({
  src,
  alt,
  aspectClass = "aspect-[4/3]",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] ${aspectClass} ${className}`}
    >
      {failed ? (
        <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
          <ImageIcon size={28} strokeWidth={1.5} />
          <span className="text-xs">이미지 준비 중</span>
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/* --------------------------------- 아코디언 -------------------------------- */

export function AccordionItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm md:text-base font-medium text-white/90 break-keep">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-white/60 break-keep">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- 자리표시자 안내 문구 --------------------------- */

/** 아직 실제 데이터가 들어오지 않은 페이지에 띄우는 안내 */
export function PlaceholderNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-xl rounded-lg border border-dashed border-accent/40 bg-accent/[0.06] px-4 py-3 text-center text-xs leading-relaxed text-accent break-keep">
      {children}
    </p>
  );
}
