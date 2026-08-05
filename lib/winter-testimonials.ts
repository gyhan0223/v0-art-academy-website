/**
 * 윈터스쿨 후기 데이터 단일 소스.
 * 학생 / 학부모 후기를 구분해 관리한다.
 * 아래는 전부 실제 수집된 후기다. 새로 추가할 때도 원문 그대로 넣는다.
 * 이름은 이니셜로만 표기한다.
 */

export type TestimonialCategory = "student" | "parent";

export interface Testimonial {
  category: TestimonialCategory;
  /** 후기 본문 */
  quote: string;
  /** 표기명 — 예: "김○○ (예비 고3)", "예비 고3 학부모" */
  author: string;
  /** 부가 정보 — 예: "2026 윈터스쿨", "2026 윈터스쿨 수료" */
  meta?: string;
}

export const TESTIMONIAL_TABS: { key: TestimonialCategory; label: string }[] = [
  { key: "parent", label: "학부모 후기" },
  { key: "student", label: "학생 후기" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    category: "parent",
    quote:
      "아이 혼자 공부 습관을 잡지 못해 걱정이 많았는데, 매달 리포트로 생활까지 확인할 수 있어 마음이 놓였습니다.",
    author: "예비 고3 학부모",
    meta: "2026 윈터스쿨",
  },
  {
    category: "parent",
    quote:
      "휴대폰 관리와 규칙적인 생활이 제일 만족스러웠습니다. 집에서는 불가능했던 8주였어요.",
    author: "예비 고2 학부모",
    meta: "2026 윈터스쿨",
  },
  {
    category: "student",
    quote:
      "실기 학원 다니면서 학과가 계속 밀렸는데, 여기서는 하루 안에 둘 다 끝나서 불안하지 않았어요.",
    author: "김○○ · 예비 고3",
    meta: "2026 윈터스쿨 수료",
  },
  {
    category: "student",
    quote:
      "매일 영단어 100개가 처음엔 힘들었는데, 8주 뒤에 모의고사 영어 등급이 올랐습니다.",
    author: "이○○ · 예비 고2",
    meta: "2026 윈터스쿨 수료",
  },
];

/** 후기 섹션 노출 스위치. 등록된 후기가 없으면 false로 내려 섹션을 감춘다. */
export const SHOW_TESTIMONIALS = true;
