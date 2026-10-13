/**
 * 윈터스쿨 후기 데이터 단일 소스.
 * 학생 / 학부모 후기를 구분해 관리한다.
 * 확인된 실제 후기를 확보한 뒤에만 공개한다. 새로 추가할 때도 원문 그대로 넣는다.
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

export const TESTIMONIALS: Testimonial[] = [];

/** 후기 섹션 노출 스위치. 등록된 후기가 없으면 false로 내려 섹션을 감춘다. */
export const SHOW_TESTIMONIALS = false;
