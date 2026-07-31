/**
 * 윈터캠프 후기 데이터 단일 소스.
 * 학생 / 학부모 / 합격 후기를 구분해 관리한다.
 * 미확정(실제 후기 수집 전) 문구는 대괄호 [ ]로 표기 — 게시 전 반드시 실제 후기로 교체할 것.
 */

export type TestimonialCategory = "student" | "parent" | "result";

export interface Testimonial {
  category: TestimonialCategory;
  /** 후기 본문 */
  quote: string;
  /** 표기명 — 예: "김○○ (예비 고3)", "홍익대 합격생 학부모" */
  author: string;
  /** 부가 정보 — 예: "2026 윈터캠프 수료", "국민대 시각디자인 합격" */
  meta?: string;
}

export const TESTIMONIAL_TABS: { key: TestimonialCategory; label: string }[] = [
  { key: "parent", label: "학부모 후기" },
  { key: "student", label: "학생 후기" },
  { key: "result", label: "합격 후기" },
];

// TODO: 원장님 확인 — 아래는 전부 자리표시자. 실제 수집된 후기로 교체 필요.
export const TESTIMONIALS: Testimonial[] = [
  {
    category: "parent",
    quote:
      "[아이 혼자 공부 습관을 잡지 못해 걱정이 많았는데, 매달 리포트로 생활까지 확인할 수 있어 마음이 놓였습니다.]",
    author: "[예비 고3 학부모]",
    meta: "[2026 윈터캠프]",
  },
  {
    category: "parent",
    quote:
      "[휴대폰 관리와 규칙적인 생활이 제일 만족스러웠습니다. 집에서는 불가능했던 8주였어요.]",
    author: "[예비 고2 학부모]",
    meta: "[2026 윈터캠프]",
  },
  {
    category: "student",
    quote:
      "[실기 학원 다니면서 학과가 계속 밀렸는데, 여기서는 하루 안에 둘 다 끝나서 불안하지 않았어요.]",
    author: "[김○○ · 예비 고3]",
    meta: "[2026 윈터캠프 수료]",
  },
  {
    category: "student",
    quote:
      "[매일 영단어 100개가 처음엔 힘들었는데, 8주 뒤에 모의고사 영어 등급이 올랐습니다.]",
    author: "[이○○ · 예비 고2]",
    meta: "[2026 윈터캠프 수료]",
  },
  {
    category: "result",
    quote:
      "[겨울에 잡아둔 국어·탐구 덕분에 수능 최저를 맞췄고, 실기는 캠프에서 배운 유형 그대로 나왔습니다.]",
    author: "[박○○]",
    meta: "[홍익대학교 합격]",
  },
  {
    category: "result",
    quote:
      "[성적이 안 되면 실기가 아무리 좋아도 소용없다는 말을 캠프에서 처음 실감했습니다.]",
    author: "[최○○]",
    meta: "[국민대학교 합격]",
  },
];

/** 실제 후기가 하나라도 등록되면 true로 바꿔 노출 (자리표시자 상태로 게시 방지) */
export const SHOW_TESTIMONIALS = true;
