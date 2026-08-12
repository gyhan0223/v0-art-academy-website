/**
 * 일산캠퍼스 랜딩(/ilsan) 전용 데이터.
 *
 * 일산은 홍대 본원과 운영 방식이 다르다 — 입시미술 "실기 수업만" 진행하고
 * 학과 수업·기숙·윈터스쿨이 없다. 이 파일의 문구를 고칠 때도 일산에
 * 학과 관리·윈터스쿨이 있는 것처럼 읽히는 표현을 넣으면 안 된다.
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
  /* Scene4(메인 오시는 길)와 같은 주소·지도 링크 */
  address: "경기 고양시 일산동구 원중1길 56 8층",
  mapUrl: "https://naver.me/FpPBS3sw",
  /* 수업 시간 — 평일 저녁 실기 수업 */
  hours: "평일 18:00 – 22:00",
} as const;

/**
 * 18:00 → 22:00 시그니처 섹션의 흐름.
 * TODO: 실제 일산캠퍼스 세부 수업 프로세스가 확정되면 문구를 맞춰 넣을 것 —
 * 지금은 사실을 지어내지 않도록 일반적인 실기 수업 흐름으로만 적어 두었다.
 */
export const ILSAN_TIMELINE = [
  { time: "18:00", label: "수업 시작", desc: "오늘 그릴 주제와 목표를 확인합니다." },
  { time: "", label: "작품 진행", desc: "제한 시간 안에서 화면을 구성하고 그려 나갑니다." },
  { time: "", label: "강사 피드백", desc: "진행 중인 그림을 기준으로 고칠 점을 짚습니다." },
  { time: "", label: "수정과 반복", desc: "피드백 받은 부분을 다시 그리며 몸에 익힙니다." },
  { time: "22:00", label: "수업 마무리", desc: "오늘 연습에서 남은 과제를 정리하고 끝냅니다." },
] as const;

/** WHY 섹션 — 실기 '전문' 수업임을 보여주는 포인트. 확인되지 않은 운영 디테일은 넣지 않는다. */
export const ILSAN_WHY = [
  {
    title: "목표 대학 기준의 실기",
    desc: "취미 미술이 아니라, 목표 대학과 전형을 기준에 두고 실기를 준비합니다.",
  },
  {
    title: "지금 수준에 맞는 피드백",
    desc: "잘 그린 그림의 흉내가 아니라, 현재 실기 수준에서 고쳐야 할 것부터 짚습니다.",
  },
  {
    title: "완성보다 과정",
    desc: "한 장의 완성작보다, 실력이 늘어나는 연습 과정 자체에 집중합니다.",
  },
  {
    title: "입시를 위한 반복",
    desc: "같은 유형을 반복해서 그리며 시험장에서 흔들리지 않는 손을 만듭니다.",
  },
] as const;

/**
 * 대상 학년 안내.
 * TODO: 실제 모집 대상(학년·재수생 포함 여부)이 확정되면 이 배열만 고치면 된다.
 */
export const ILSAN_AUDIENCE = [
  { grade: "고1", desc: "미대입시를 처음 시작하고 싶은 학생" },
  { grade: "고2", desc: "본격적으로 실기 준비량을 늘려야 하는 학생" },
  { grade: "고3", desc: "수시·정시 실기를 집중적으로 준비해야 하는 학생" },
  { grade: "재수생", desc: "다시 실기 방향을 잡고 입시에 도전하는 학생" },
] as const;

/**
 * 작품·수업 현장 섹션 이미지.
 * 지금 코드베이스에는 일산캠퍼스에서 찍은 것으로 확인된 사진이 없다.
 * 예시작(사이트 전체에서 쓰는 이미지)만 넣고, 일산 현장 사진 자리는
 * src를 비워 placeholder로 둔다 — 파일이 준비되면 src만 채우면 된다.
 *
 * TODO(사진 교체 목록):
 *  - 일산캠퍼스 실기 수업 장면
 *  - 강사 첨삭·피드백 장면
 *  - 일산캠퍼스 공간(강의실) 사진
 */
export const ILSAN_WORKS = [
  { src: "/images/silgi/gicho-design-1.jpg", alt: "유리구슬·부채·노끈을 얽어 화면을 구성한 기초디자인 예시작", caption: "기초디자인 예시작" },
  { src: "/images/silgi/gicho-design-3.jpg", alt: "유리구슬과 주름 금속·부채를 역동적으로 구성한 기초디자인 예시작", caption: "기초디자인 예시작" },
  { src: "/images/silgi/gicho-soyang-1.jpg", alt: "기초소양·기초조형 예시작", caption: "기초소양 예시작" },
  { src: "/images/silgi/gicho-design-4.jpg", alt: "부채와 유리구슬을 방사형으로 구성한 기초디자인 예시작", caption: "기초디자인 예시작" },
  { src: "/images/silgi/gicho-soyang-3.jpg", alt: "기초소양·기초조형 예시작", caption: "기초소양 예시작" },
  { src: "/images/silgi/gicho-design-5.jpg", alt: "유리구슬·금속판·나무막대를 사선으로 구성한 기초디자인 예시작", caption: "기초디자인 예시작" },
] as const;

/** 일산 현장 사진 자리 — 파일이 들어오면 src를 채운다 */
export const ILSAN_SCENE_PLACEHOLDERS = [
  { src: "", alt: "일산캠퍼스 실기 수업 장면", caption: "실기 수업 장면 · 사진 준비 중" },
  { src: "", alt: "일산캠퍼스 강사 첨삭 장면", caption: "첨삭·피드백 장면 · 사진 준비 중" },
] as const;
