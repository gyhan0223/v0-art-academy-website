/**
 * 홍대 본원 네이버 예약 리다이렉트.
 *
 * 네이버 예약 링크의 startDate는 예약 달력이 처음 열리는 날짜다.
 * 정적 빌드에 주소를 그대로 박으면 빌드한 날짜로 굳어버리므로,
 * 사이트의 예약 버튼은 전부 이 라우트를 거쳐 클릭한 그날(KST) 날짜를
 * 붙인 채로 네이버 예약 페이지로 넘어간다.
 */

import { NextResponse } from "next/server";
import {
  NAVER_BOOKING_HONGDAE_ITEM,
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
  return NextResponse.redirect(
    `${NAVER_BOOKING_HONGDAE_ITEM}?startDate=${today}`,
    307,
  );
}
