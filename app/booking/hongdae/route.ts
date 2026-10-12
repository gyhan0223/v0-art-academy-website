/** 기존 홍대 상담 주소도 모집 중인 윈터스쿨 전용 상품으로 연결한다. */
import { GET as getWinterBooking } from "../winter/route";

export const dynamic = "force-dynamic";

export function GET() {
  return getWinterBooking();
}
