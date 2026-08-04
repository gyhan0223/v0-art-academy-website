/**
 * 사이트 전역 상담 채널 단일 소스.
 * 채널 주소가 바뀌면 이 파일만 고치면 전 페이지에 반영된다.
 */

/** 네이버 톡톡 — 모두다른고양이 미술학원 프로필 */
export const NAVER_TALK_URL = "https://talk.naver.com/profile/w44x0x";

/** 네이버 브랜드 그린 — 톡톡 버튼 전용 색 */
export const NAVER_GREEN = "#03C75A";

/**
 * 지점별 네이버 블로그.
 * 두 개가 나란히 놓이므로 label에 지점 이름을 반드시 포함한다 —
 * 그냥 "블로그"라고만 쓰면 어느 지점 것인지 구분되지 않는다.
 */
export const BRANCH_BLOGS = [
  { label: "홍대 본원 블로그", href: "https://blog.naver.com/modago-" },
  { label: "일산 캠퍼스 블로그", href: "https://blog.naver.com/modagome" },
] as const;
