/**
 * "1:1 컨설팅 예약하기" 네이버 예약 리다이렉트.
 *
 * app/booking/hongdae/route.ts와 같은 이유로 존재한다 — 예약 달력이
 * 처음 열리는 날짜를 정적 빌드 날짜로 굳히지 않고, 클릭한 그날(KST)로
 * 채워서 넘긴다. 이 상품은 신형 예약 서비스(booking/5)라 파라미터가
 * startDate가 아니라 startDateTime(타임존 포함)이다.
 */

import { NextResponse } from "next/server";
import {
  NAVER_BOOKING_CONSULTING_ITEM,
  NAVER_BOOKING_PAUSED,
  NAVER_BOOKING_PAUSED_URL,
} from "@/lib/contact";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  // 예약 상품 검수 중에는 네이버 대신 전화 예약 안내로 보낸다.
  if (NAVER_BOOKING_PAUSED) {
    return NextResponse.redirect(
      new URL(NAVER_BOOKING_PAUSED_URL, request.url),
      307,
    );
  }
  // 서버는 UTC로 돌므로 반드시 KST 기준으로 날짜를 뽑는다.
  // en-CA 로케일이 YYYY-MM-DD 형식을 그대로 내준다.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const startDateTime = encodeURIComponent(`${today}T00:00:00+09:00`);
  return NextResponse.redirect(
    `${NAVER_BOOKING_CONSULTING_ITEM}?startDateTime=${startDateTime}`,
    307,
  );
}
