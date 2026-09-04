"use client";

/**
 * 네이버 톡톡 상담 채널.
 *
 * 전화는 문턱이 높고(밤 11시에 전화는 못 건다), 네이버 예약은 날짜·시간을
 * 정해야 해서 "그냥 좀 물어보고 싶은" 사람은 누르지 않는다. 톡톡은 그 사이를
 * 메우는 채널이라 전 페이지에 상시 노출한다.
 *
 * · NaverTalkFab    — 오른쪽 아래 떠다니는 버튼 (app/layout.tsx에서 전역 노출)
 * · NaverTalkButton — 신청·예약 버튼 옆에 두는 인라인 보조 버튼
 *
 * 인라인 버튼은 늘 테두리만 있는 연한 형태다. 주 버튼(상담 신청·네이버 예약)이
 * 채워진 색을 독점해야 "뭘 눌러야 하지"로 멈추는 일이 없다.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { NAVER_TALK_URL } from "@/lib/contact";

const ARIA_LABEL = "네이버 톡톡으로 문의하기";

/* ------------------------------ 인라인 버튼 ------------------------------- */

/** 크기·너비는 호출부가 className으로 정한다(주변 버튼과 같은 치수를 쓰기 위함). */
export function NaverTalkButton({
  className = "",
  label = "톡톡 문의",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={NAVER_TALK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#03C75A]/60 font-semibold text-[#03C75A] transition-colors hover:border-[#03C75A] hover:bg-[#03C75A]/10 ${className}`}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}

/* ------------------------------ 플로팅 버튼 ------------------------------- */

/**
 * 하단 고정 바가 뜬 동안 자기 높이를 전역 CSS 변수로 알린다.
 * 플로팅 버튼이 그만큼 위로 비켜서서 겹치지 않는다.
 * (조건부로 나타났다 사라지는 바도 있어서 값을 고정하지 않고 실측한다.)
 */
export const FAB_OFFSET_VAR = "--fab-bottom-offset";

export function useReportBottomBar(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = document.documentElement;
    const write = () =>
      root.style.setProperty(FAB_OFFSET_VAR, `${el.offsetHeight}px`);

    write();
    const observer = new ResizeObserver(write);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.style.removeProperty(FAB_OFFSET_VAR);
    };
  }, [ref]);
}

export default function NaverTalkFab() {
  const pathname = usePathname() ?? "";

  // /diagnosis 온보딩은 한 화면 한 질문에 집중해야 한다 — 플로팅 버튼도 숨긴다.
  // /consulting 전환 랜딩도 하단 sticky CTA와 겹치므로 숨긴다 —
  // 보조 문의 수단은 랜딩 폼 아래 인라인 톡톡 버튼이 담당한다.
  // /final 수능 파이널 랜딩은 마지막 상담 섹션에만 전화·네이버 예약 두 버튼을
  // 두는 것이 원칙이라 떠다니는 톡톡 버튼도 숨긴다.
  if (
    pathname.startsWith("/diagnosis") ||
    pathname.startsWith("/consulting") ||
    pathname.startsWith("/final")
  )
    return null;

  // /winter*는 모바일 하단 액션 바(MobileActionBar)가 이미 자리를 쓰고
  // 그 바 안에 톡톡 칸이 있어 모바일에서는 숨긴다.
  // (/ilsan도 예전 랜딩의 하단 고정 상담 바 때문에 숨겼지만, 새 랜딩은
  // 고정 바가 없으므로 다시 보여준다.)
  const visibility = pathname.startsWith("/winter")
    ? "hidden md:inline-flex"
    : "inline-flex";

  return (
    <a
      href={NAVER_TALK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL}
      // z-40 — 상단 네비(z-50)와 모바일 메뉴(z-100) 아래에 둔다.
      // bottom — 하단 고정 바 높이 + 여백 + 아이폰 홈바(safe-area).
      className={`fixed right-5 bottom-[calc(var(--fab-bottom-offset,0px)+1.5rem+env(safe-area-inset-bottom))] z-40 items-center gap-2 rounded-full bg-[#03C75A] py-3 pl-3.5 pr-4 text-white shadow-lg transition-all hover:brightness-95 active:scale-95 ${visibility}`}
    >
      <MessageCircle size={19} strokeWidth={2.2} />
      <span className="whitespace-nowrap text-sm font-bold tracking-tight">
        톡톡 문의
      </span>
    </a>
  );
}
