/**
 * 네이버 예약 상담 채널.
 *
 * 톡톡(NaverTalk)이 "일단 물어보는" 창구라면, 예약은 날짜·시간을 골라 방문을
 * 확정하는 창구다. 상담 폼처럼 연락을 기다릴 필요가 없어서, 이미 마음을
 * 정하고 들어온 학부모님이 가장 빨리 끝낼 수 있는 경로다.
 *
 * 채워진 네이버 그린은 이 버튼만 쓴다. 톡톡 인라인 버튼은 늘 테두리만 있는
 * 연한 형태이므로(components/academy/NaverTalk.tsx), 둘이 나란히 놓여도
 * 무엇이 주 동선인지 흐려지지 않는다.
 *
 * 색은 Tailwind 임의값이라 리터럴로 써야 한다 — lib/contact.ts의
 * NAVER_GREEN과 같은 값이니 한쪽을 고치면 다른 쪽도 함께 고칠 것.
 */

import { CalendarCheck } from "lucide-react";
import { NAVER_BOOKING_URL } from "@/lib/contact";

const ARIA_LABEL = "네이버 예약으로 상담 예약하기";

/**
 * 크기·너비는 호출부가 className으로 정한다(주변 버튼과 같은 치수를 쓰기 위함).
 * href 기본값은 홍대 본원 일반 상담이다 — 윈터스쿨처럼 전용 예약 상품이 있는
 * 자리는 lib/contact.ts의 해당 URL을 href로 넘겨야 한다.
 */
export function NaverBookingButton({
  className = "",
  label = "네이버 예약하기",
  href = NAVER_BOOKING_URL,
}: {
  className?: string;
  label?: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#03C75A] font-bold text-white transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#03C75A] ${className}`}
    >
      <CalendarCheck size={16} />
      {label}
    </a>
  );
}
