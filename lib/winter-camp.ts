/**
 * 2027 모다고 윈터캠프 — 캠프 정보 단일 소스.
 * 페이지·배너·네비게이션 등 모든 곳에서 이 객체만 참조한다.
 * 미확정 값은 대괄호 [ ]로 표기.
 */

/** 최상단 알림 띠 on/off 스위치 */
export const SHOW_ANNOUNCEMENT = true;

export const CAMP_INFO = {
  name: "2027 모다고 윈터캠프",
  subtitle: "2028학년도 미대입시 대비 · 홍대 본원 기숙 윈터스쿨",

  // 장소 — 윈터캠프는 홍대 본원에서만 진행 (파주 기숙학원과 무관)
  venueName: "모두다른고양이 미술학원 홍대 본원",
  address: "서울시 마포구 와우산로23길 9 칼리오페 5층",
  mapUrl: "https://naver.me/5wWq5AUs",
  phone: "02-338-3302",
  phoneTel: "tel:02-338-3302",

  period: "2027년 1월 4일 ~ 2027년 2월 26일 (약 8주)",
  target: "예비 고2·고3 / 재수생 선행반",
  capacity: "여 8명 · 남 6명",
  capacityTotal: 14,
  capacityNote: "선착순",

  deadline: "2027년 1월 3일",
  /** D-day 자동 계산용 실제 마감일 (KST 기준) */
  deadlineISO: "2027-01-03",

  // 수강료 — 구체 금액은 홈페이지에 게시하지 않고 상담 시 개별 안내.
  // 법정 교습비 고지는 /tuition 페이지(학원등록번호 제02201000109호)에 게시.
  tuition: "상담 시 개별 안내",
  tuitionIncludes: "학과(국어·영어·탐구) · 실기 · 기숙 · 식사 · 독서실 포함",
  earlyBird:
    "8주 일괄 등록 시 뒤 4주 35% 할인 적용 (월별 개별 납부 시 할인 적용 불가)",
} as const;

/* -------------------------------- 상담 채널 -------------------------------- */

/** 문자 문의 수신 번호 (하이픈 없음) */
export const SMS_PHONE = "0233833302";

/** 문자 문의 기본 문구 */
export const SMS_BODY = "[윈터캠프 문의] 학년:    / 이름: ";

/** iOS는 `sms:번호&body=`, Android는 `sms:번호?body=` — `?&body=` 표기가 양쪽 모두에서 동작 */
export const SMS_HREF = `sms:${SMS_PHONE}?&body=${encodeURIComponent(SMS_BODY)}`;

// TODO: 2026년 9월 카카오톡 채널 개설 후 여기에 채널 URL만 넣으면 버튼이 자동 노출됨
export const KAKAO_CHANNEL_URL = "";
