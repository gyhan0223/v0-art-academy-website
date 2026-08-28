/**
 * 일산 캠퍼스 네이버 예약 리다이렉트.
 *
 * 일산 예약 주소가 여러 페이지에 하드코딩되어 있던 것을 이 라우트 하나로
 * 모았다 — 예약 상품이 바뀌면 lib/contact.ts의 NAVER_BOOKING_ILSAN_ITEM만
 * 고치면 되고, 차단 스위치(NAVER_BOOKING_PAUSED)도 여기서 함께 태운다.
 * 일산 상품은 지도 연동 주소라 홍대처럼 startDate를 붙일 필요가 없다.
 */

import { NextResponse } from "next/server";
import {
  NAVER_BOOKING_ILSAN_ITEM,
  NAVER_BOOKING_PAUSED,
  NAVER_BOOKING_PAUSED_URL,
} from "@/lib/contact";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  if (NAVER_BOOKING_PAUSED) {
    return NextResponse.redirect(
      new URL(NAVER_BOOKING_PAUSED_URL, request.url),
      307,
    );
  }
  return NextResponse.redirect(NAVER_BOOKING_ILSAN_ITEM, 307);
}
