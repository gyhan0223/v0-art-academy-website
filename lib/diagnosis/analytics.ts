/**
 * 진단 퍼널 GA4 이벤트 helper.
 * 새 라이브러리 없이, layout.tsx가 이미 심어 둔 gtag가 있을 때만 안전하게 쏜다.
 * 이벤트 parameter에는 개인정보·점수 원문을 넣지 않는다 —
 * 학년 그룹, 성별, 실기 유형, 상세 성적 입력 여부, 결과 분기 정도만 보낸다.
 */

export type DiagnosisEventName =
  | "diagnosis_start"
  | "diagnosis_grade_complete"
  | "diagnosis_gender_complete"
  | "diagnosis_silgi_complete"
  | "diagnosis_score_complete"
  | "diagnosis_target_university_complete"
  | "diagnosis_analysis_start"
  | "diagnosis_result_view"
  | "diagnosis_gradeup_view"
  | "diagnosis_winter_cta_click"
  | "diagnosis_winter_results_click"
  | "diagnosis_consult_click"
  | "diagnosis_restart"
  // /guide/jungsi-2027 → /diagnosis micro-conversion (대학 카드·원서 트레이)
  | "jungsi_university_diagnosis_click"
  | "jungsi_plantray_diagnosis_click";

export type DiagnosisEventParams = {
  grade_group?: string;
  gender?: string;
  silgi_type?: string;
  has_detailed_score?: boolean;
  result_branch?: string;
  /** /diagnosis 유입 경로 — lib/diagnosis/entry-params.ts whitelist 값만 */
  entry_source?: string;
  /** 공개 대학명(개인정보 아님) — canonical 이름만 */
  target_university?: string;
  gun?: string;
  /** 원서 트레이에서 채워진 가·나·다 슬롯 수 */
  plan_filled_count?: number;
};

export function trackDiagnosis(
  event: DiagnosisEventName,
  params?: DiagnosisEventParams,
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", event, params ?? {});
}
