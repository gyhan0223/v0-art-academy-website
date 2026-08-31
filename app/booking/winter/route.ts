/**
 * "모다고 2027 윈터스쿨" 네이버 예약 리다이렉트.
 *
 * app/booking/hongdae/route.ts와 같은 이유로 존재한다 — 예약 달력이
 * 처음 열리는 날짜를 정적 빌드 날짜로 굳히지 않고, 클릭한 그날(KST)로
 * 채워서 넘긴다.
 *
 * 이 상품은 검수를 통과한 신규 상품이라 차단 스위치(NAVER_BOOKING_PAUSED)를
 * 타지 않고 바로 네이버로 보낸다.
 */

import { NextResponse } from "next/server";
import { NAVER_BOOKING_WINTER_ITEM } from "@/lib/contact";

export const dynamic = "force-dynamic";

export function GET() {
  // 서버는 UTC로 돌므로 반드시 KST 기준으로 날짜를 뽑는다.
  // en-CA 로케일이 YYYY-MM-DD 형식을 그대로 내준다.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  return NextResponse.redirect(
    `${NAVER_BOOKING_WINTER_ITEM}?startDate=${today}`,
    307,
  );
}
