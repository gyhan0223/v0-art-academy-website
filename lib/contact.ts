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
 * 윈터스쿨은 홍대 본원에서만 진행하므로 윈터스쿨 쪽 버튼은 캠퍼스를
 * 고르지 않고 이 주소를 바로 쓴다. 두 캠퍼스를 모두 안내하는 자리라면
 * 아래 CAMPUSES를 쓸 것.
 */
export const NAVER_BOOKING_URL =
  "https://booking.naver.com/booking/5/bizes/770673/items/4636302";

/** 네이버 예약 — 일산 캠퍼스 상담 예약 (예약 상품이 달라 biz/item 번호가 다르다) */
export const NAVER_BOOKING_URL_ILSAN =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

/**
 * 캠퍼스별 연락 창구 — 전화와 상담 예약이 캠퍼스마다 다르다.
 * 헤더의 전화번호 줄과 "상담 신청" 버튼이 모두 이 배열을 쓰므로,
 * 순서를 바꾸면 둘이 함께 바뀐다(두 곳의 순서가 어긋나면 안 된다).
 */
export const CAMPUSES = [
  {
    label: "홍대 본원",
    phone: "02-338-3302",
    bookingUrl: NAVER_BOOKING_URL,
  },
  {
    label: "일산 캠퍼스",
    phone: "031-916-8885",
    bookingUrl: NAVER_BOOKING_URL_ILSAN,
  },
] as const;

/**
 * 지점별 네이버 블로그.
 * 두 개가 나란히 놓이므로 label에 지점 이름을 반드시 포함한다 —
 * 그냥 "블로그"라고만 쓰면 어느 지점 것인지 구분되지 않는다.
 */
export const BRANCH_BLOGS = [
  { label: "홍대 본원 블로그", href: "https://blog.naver.com/modago-" },
  { label: "일산 캠퍼스 블로그", href: "https://blog.naver.com/modagome" },
] as const;
