/**
 * 사이트 전역 상담 채널 단일 소스.
 * 채널 주소가 바뀌면 이 파일만 고치면 전 페이지에 반영된다.
 */

/** 네이버 톡톡 — 모두다른고양이 미술학원 프로필 */
export const NAVER_TALK_URL = "https://talk.naver.com/profile/w44x0x";

/**
 * [임시] 네이버 예약 전면 차단 스위치.
 * 네이버 예약 상품이 검수 중이라 예약 진입을 잠시 막아둔다.
 * true인 동안 모든 예약 리다이렉트(app/booking/*)가 네이버 대신
 * 준비 중 안내 페이지(NAVER_BOOKING_PAUSED_URL)로 보내 전화 예약을 안내한다.
 * 검수가 끝나면 이 값만 false로 되돌리면 전부 원상복구된다.
 */
export const NAVER_BOOKING_PAUSED = true;

/** 예약 차단 중 안내 페이지 — 전화 예약을 안내한다 (app/booking/paused/page.tsx) */
export const NAVER_BOOKING_PAUSED_URL = "/booking/paused";

/** 네이버 브랜드 그린 — 톡톡·예약 버튼 전용 색 */
export const NAVER_GREEN = "#03C75A";

/**
 * 네이버 예약 — 홍대 본원 상담 예약 상품의 실제 주소.
 * 예약 상품이 바뀌면 biz/item 번호가 달라지므로 이 값만 고치면 된다.
 *
 * 버튼에 직접 걸지 말 것 — startDate를 클릭 시점 날짜로 채워야 하므로
 * 아래 NAVER_BOOKING_URL(/booking/hongdae 리다이렉트)을 거쳐야 한다.
 */
export const NAVER_BOOKING_HONGDAE_ITEM =
  "https://booking.naver.com/booking/6/bizes/1713916/items/7946327";

/**
 * 네이버 예약 — 홍대 본원 상담 예약 (일반 입학 상담).
 * 정적 페이지에 네이버 주소를 그대로 박으면 startDate가 빌드 날짜로
 * 굳어버리므로, 클릭할 때마다 오늘 날짜를 붙여 보내는 내부 리다이렉트
 * (app/booking/hongdae/route.ts)를 가리킨다.
 *
 * 윈터스쿨 상담은 전용 상품(NAVER_BOOKING_WINTER_URL)이 따로 있다 —
 * 윈터스쿨 쪽 버튼에 이 주소를 쓰지 말 것.
 */
export const NAVER_BOOKING_URL = "/booking/hongdae";

/**
 * 네이버 예약 — "2027 윈터스쿨 상담신청" 전용 상품의 실제 주소.
 * 홍대 일반 상담과 예약 서비스 버전(booking/5)·biz 번호가 다르다.
 * 버튼에는 아래 NAVER_BOOKING_WINTER_URL(내부 리다이렉트)을 걸 것 —
 * startDateTime을 클릭한 날짜로 채워야 하기 때문(hongdae와 같은 이유).
 */
export const NAVER_BOOKING_WINTER_ITEM =
  "https://booking.naver.com/booking/5/bizes/770673/items/8004638";

/** 윈터스쿨 상담 예약 버튼이 실제로 거는 주소 (app/booking/winter/route.ts) */
export const NAVER_BOOKING_WINTER_URL = "/booking/winter";

/**
 * 네이버 예약 — "1:1 컨설팅 예약하기" 전용 상품의 실제 주소.
 * 유료 1:1 입시 전략 컨설팅(lib/consulting.ts)의 예약 창구다 —
 * 무료 입학 상담(hongdae)·윈터스쿨 상담과 상품이 다르니 섞지 말 것.
 */
export const NAVER_BOOKING_CONSULTING_ITEM =
  "https://booking.naver.com/booking/5/bizes/770673/items/8004662";

/** 1:1 컨설팅 예약 버튼이 실제로 거는 주소 (app/booking/consulting/route.ts) */
export const NAVER_BOOKING_CONSULTING_URL = "/booking/consulting";

/**
 * 네이버 예약 — 일산 캠퍼스 상담 예약 상품의 실제 주소
 * (예약 상품이 달라 biz/item 번호가 홍대와 다르다).
 * 버튼에 직접 걸지 말 것 — 차단 스위치(NAVER_BOOKING_PAUSED)를 태우려면
 * 아래 NAVER_BOOKING_URL_ILSAN(내부 리다이렉트)을 거쳐야 한다.
 */
export const NAVER_BOOKING_ILSAN_ITEM =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

/** 일산 캠퍼스 예약 버튼이 실제로 거는 주소 (app/booking/ilsan/route.ts) */
export const NAVER_BOOKING_URL_ILSAN = "/booking/ilsan";

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
