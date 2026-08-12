/**
 * 일산캠퍼스 랜딩(/ilsan) 전용 데이터.
 *
 * 일산은 홍대 본원과 운영 방식이 다르다 — 입시미술 "실기 수업만" 진행하고
 * 학과 수업·기숙·윈터스쿨이 없다. 이 파일의 문구를 고칠 때도 일산에
 * 학과 관리·윈터스쿨이 있는 것처럼 읽히는 표현을 넣으면 안 된다.
 *
 * 랜딩의 톤 원칙: 불안·공포·긴급성("지금 안 하면 늦습니다" 류)을 자극하는
 * 문구를 넣지 않는다. "현재 위치 확인 → 목표 → 준비 방향 → 상담"의 흐름.
 *
 * 전화·예약 주소는 lib/contact.ts의 CAMPUSES가 단일 소스다.
 * 여기서는 그 값을 다시 꺼내 쓰기만 한다.
 */

import { CAMPUSES, BRANCH_BLOGS } from "@/lib/contact";

const ILSAN_CAMPUS = CAMPUSES[1];
const ILSAN_BLOG = BRANCH_BLOGS[1];

export const ILSAN_INFO = {
  name: "모두다른고양이 일산캠퍼스",
  phone: ILSAN_CAMPUS.phone,
  phoneTel: `tel:${ILSAN_CAMPUS.phone}`,
  bookingUrl: ILSAN_CAMPUS.bookingUrl,
  blogUrl: ILSAN_BLOG.href,
  /* 메인(Scene4 오시는 길)과 같은 주소·지도 링크 */
  address: "경기 고양시 일산동구 원중1길 56 8층",
  mapUrl: "https://naver.me/FpPBS3sw",
  /* 수업 시간 — 평일 저녁 실기 수업 */
  hours: "평일 18:00–22:00",
} as const;

/** SECTION 2 — 이런 학생을 위한 수업. 핵심 타겟(예비 고3) 순서를 바꾸지 말 것. */
export const ILSAN_AUDIENCE = [
  {
    no: "01",
    grade: "현재 고2",
    title: "이제 고3을 앞두고 있는 학생",
    desc: "지금까지의 실기 준비를 돌아보고 앞으로의 방향을 구체화할 시기입니다.",
  },
  {
    no: "02",
    grade: "현재 고1",
    title: "고2부터 입시미술을 본격적으로 준비하고 싶은 학생",
    desc: "서두르기보다 기본기를 만들고, 자신의 목표에 맞는 준비를 시작합니다.",
  },
  {
    no: "03",
    grade: "학과 병행",
    title: "학교와 학과 공부를 이어가면서",
    desc: "평일 저녁에는 입시미술 실기에 집중하고 싶은 학생에게 적합합니다.",
  },
] as const;

/** SECTION 3 — 준비 방향 Flow. 순서 자체가 메시지(현재 확인이 먼저)다. */
export const ILSAN_FLOW = [
  "현재 실기",
  "목표 대학",
  "필요한 준비",
  "수업 방향",
] as const;

/** SECTION 4 — 평일 저녁 시간 구조. 숫자가 주인공인 섹션. */
export const ILSAN_SCHEDULE = [
  { figure: "18:00", label: "수업 시작" },
  { figure: "4 HOURS", label: "입시미술 실기 집중" },
  { figure: "22:00", label: "수업 종료" },
] as const;

/**
 * SECTION 6 — 학부모 확인용 정보. FAQ 카드가 아니라 좌우 정렬 리스트로 쓴다.
 * 전화·위치는 링크가 필요해 컴포넌트에서 ILSAN_INFO로 직접 그린다.
 */
export const ILSAN_FACTS = [
  { label: "수업 대상", value: "예비 고2·고3 중심" },
  { label: "수업 시간", value: ILSAN_INFO.hours },
  { label: "수업 내용", value: "입시미술 실기" },
  { label: "학과 수업", value: "일산 캠퍼스에서는 운영하지 않음" },
  {
    label: "상담",
    value: "현재 학년, 준비 상황, 목표 대학 등을 기준으로 안내",
  },
] as const;
