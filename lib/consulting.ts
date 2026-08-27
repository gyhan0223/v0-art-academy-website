/**
 * 유료 1:1 입시 전략 컨설팅 — 상품 정보 단일 소스.
 *
 * 가격·이름·문구가 바뀌면 이 파일만 고치면 랜딩(/consulting)·진단 결과 CTA·
 * 네비게이션·JSON-LD가 함께 바뀐다. 컴포넌트에 가격을 하드코딩하지 말 것.
 *
 * 이 상품은 "학원 등록을 전제로 한 무료 입학 상담"(네이버 예약·lib/contact.ts)과
 * 다른 별도 상품이다 — 성적·실기·희망 대학을 분석해 지원 전략을 짜주는
 * 유료 서비스. 두 동선을 코드에서 섞지 않는다.
 */

export const CONSULTING_INFO = {
  /** 상품명 — 카피 전반에서 이 이름을 그대로 쓴다 */
  name: "1:1 입시 전략 컨설팅",
  /** JSON-LD·API 등 기계용 숫자 가격 */
  price: 20000,
  /** 화면 표기용 가격 */
  priceLabel: "20,000원",
  /** 가격 단위 표기 — "20,000원 / 1회" 형태로 조합해 쓴다 */
  priceUnit: "1회",
  path: "/consulting",
} as const;

/* ------------------------------ 유입 경로 추적 ------------------------------ */

/**
 * /consulting?from=… 과 신청 API의 source로 허용하는 값.
 * 사용자가 쿼리를 조작해도 이 목록 밖의 문자열은 저장·전송되지 않는다.
 */
export const CONSULTING_SOURCES = [
  "consulting", // 직접 유입·기타
  "diagnosis", // /diagnosis 결과 화면
  "jungsi", // /guide/jungsi-2027
  "nav", // 상단 네비게이션
] as const;

export type ConsultingSource = (typeof CONSULTING_SOURCES)[number];

export function normalizeConsultingSource(
  value: string | null | undefined,
): ConsultingSource {
  return (CONSULTING_SOURCES as readonly string[]).includes(value ?? "")
    ? (value as ConsultingSource)
    : "consulting";
}

/* -------------------------------- 신청 폼 -------------------------------- */

/**
 * 신청 폼 학년 선택지.
 * /diagnosis의 DiagnosisGrade(lib/diagnosis/types.ts)와 같은 표기·순서를 쓴다 —
 * 진단에서 넘어온 학생이 같은 라벨을 다시 만나게 하기 위함.
 */
export const CONSULTING_GRADE_OPTIONS = [
  "중3 이하",
  "고1",
  "고2",
  "고3",
  "N수생",
] as const;

/** "지금 가장 고민되는 점" textarea 최대 길이 (서버도 같은 값으로 자른다) */
export const CONSULTING_CONCERN_MAX = 300;

/* ---------------------------------- FAQ ---------------------------------- */

/**
 * 랜딩 FAQ. 페이지 노출과 FAQPage JSON-LD가 같은 데이터를 쓰므로
 * 답변은 plain string으로 유지한다.
 */
export const CONSULTING_FAQS: { q: string; a: string }[] = [
  {
    q: "학원에 등록하지 않아도 받을 수 있나요?",
    a: "네. 컨설팅만 이용해도 됩니다. 컨설팅은 학원 등록을 전제로 한 무료 상담이 아니라, 학생의 현재 입시 상황을 분석하는 별도의 서비스입니다.",
  },
  {
    q: "무료 성적 진단과 무엇이 다른가요?",
    a: "무료 진단은 공개된 대학 데이터 기반의 자동 분석이고, 1:1 컨설팅은 학생의 목표 대학·실기 준비 상태·남은 기간까지 함께 보고 사람이 직접 판단합니다.",
  },
  {
    q: "성적표가 꼭 필요한가요?",
    a: "필수는 아니지만, 최근 모의고사 성적이 있으면 더 구체적으로 상담할 수 있습니다.",
  },
  {
    q: "실기를 아직 시작하지 않았어도 가능한가요?",
    a: "가능합니다. 현재 준비 상태와 목표 대학을 함께 보고, 어떤 실기 유형이 유리한지부터 상담합니다.",
  },
  {
    q: "비용은 얼마인가요?",
    a: `1회 ${CONSULTING_INFO.priceLabel}입니다. 네이버 예약으로 상담 시간을 선택하시면 결제 방법을 함께 안내해 드립니다.`,
  },
];

/* -------------------------------- 애널리틱스 ------------------------------- */

/**
 * 컨설팅 퍼널 GA4 이벤트 helper — lib/diagnosis/analytics.ts와 같은 방식.
 * layout.tsx가 심어 둔 gtag가 있을 때만 안전하게 쏜다.
 * parameter에는 개인정보(이름·연락처·대학명·고민 내용)를 절대 넣지 않는다 —
 * source(허용된 유입 경로) 정도만 보낸다.
 */
export type ConsultingEventName =
  | "consulting_view"
  | "consulting_primary_cta_click"
  | "consulting_diagnosis_click"
  | "consulting_form_start"
  | "consulting_form_submit"
  | "consulting_form_success"
  | "consulting_form_error"
  | "consulting_winter_click";

export type ConsultingEventParams = {
  source?: ConsultingSource;
};

export function trackConsulting(
  event: ConsultingEventName,
  params?: ConsultingEventParams,
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", event, params ?? {});
}
