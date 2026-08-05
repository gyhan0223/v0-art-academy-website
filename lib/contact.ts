/**
 * 사이트 전역 상담 채널 단일 소스.
 * 채널 주소가 바뀌면 이 파일만 고치면 전 페이지에 반영된다.
 */

/** 네이버 톡톡 — 모두다른고양이 미술학원 프로필 */
export const NAVER_TALK_URL = "https://talk.naver.com/profile/w44x0x";

/** 네이버 브랜드 그린 — 톡톡·예약 버튼 전용 색 */
export const NAVER_GREEN = "#03C75A";

/**
 * 네이버 예약 — 홍대 본원 상담 예약 (윈터스쿨 상담이 여기로 들어온다).
 * 예약 상품이 바뀌면 biz/item 번호가 달라지므로 이 값만 고치면 된다.
 *
 * 일산 캠퍼스 예약은 별도 상품(biz 1602022)이라 주소가 다르다 —
 * 윈터스쿨은 홍대 본원에서만 진행하므로 이 주소를 쓴다.
 */
export const NAVER_BOOKING_URL =
  "https://booking.naver.com/booking/5/bizes/770673/items/4636302";

/**
 * 지점별 네이버 블로그.
 * 두 개가 나란히 놓이므로 label에 지점 이름을 반드시 포함한다 —
 * 그냥 "블로그"라고만 쓰면 어느 지점 것인지 구분되지 않는다.
 */
export const BRANCH_BLOGS = [
  { label: "홍대 본원 블로그", href: "https://blog.naver.com/modago-" },
  { label: "일산 캠퍼스 블로그", href: "https://blog.naver.com/modagome" },
] as const;
