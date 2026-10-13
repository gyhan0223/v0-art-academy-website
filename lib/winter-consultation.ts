export const WINTER_CONSULT_LABEL = "우리 아이에게 맞는지 상담하기";
export const WINTER_CONSULT_DESCRIPTION =
  "현재 성적과 실기 준비 상황을 듣고, 윈터스쿨의 수업·생활 방식이 아이에게 맞는지 함께 확인합니다.";
export const CONSULT_CONCERNS = [
  {
    id: "study",
    label: "학과 성적과 공부 습관",
    description:
      "평일에는 국어·영어·탐구 수업과 클리닉을 진행하고, 모의고사와 학습 리포트로 공부 과정을 확인합니다.",
    href: "/winter/schedule",
    linkLabel: "하루 일과와 학습 관리 보기",
  },
  {
    id: "art",
    label: "실기 병행과 수업 수준",
    description:
      "주말에는 목표 대학의 실기 유형을 훈련합니다. 입소 전 레벨 테스트와 수준별 지도로 학과·실기 병행 방법을 상담합니다.",
    href: "/winter/teachers",
    linkLabel: "강사진과 수준별 수업 보기",
  },
  {
    id: "life",
    label: "기숙 생활과 안전",
    description:
      "남녀 생활관을 분리하고 야간 관리 인력이 상주합니다. 휴대폰·학부모 연락·병원 동행 등 생활 운영을 확인해 보세요.",
    href: "/winter/gallery",
    linkLabel: "생활관 사진과 생활 안내 보기",
  },
  {
    id: "cost",
    label: "비용과 등록 조건",
    description:
      "학과·실기·기숙·식사·독서실이 포함됩니다. 학생에게 맞는 구성의 비용과 등록 조건은 상담에서 안내드립니다.",
    href: "/tuition",
    linkLabel: "등록 교습비 고지 보기",
  },
] as const;
export const CONTACT_TIMES = [
  { id: "any", label: "시간 무관" },
  { id: "morning", label: "오전" },
  { id: "afternoon", label: "오후" },
  { id: "evening", label: "저녁" },
] as const;
export const CONSULT_GRADES = ["예비 고2", "예비 고3", "재수생"] as const;
export const PHONE_PATTERN = /^(010\d{8}|01[16789]\d{7,8})$/;
export type ConsultationInput = {
  name: string;
  grade: string;
  phone: string;
  university: string;
  concern: string;
  contactTime: string;
};

export function parseConsultationInput(
  data: unknown,
): ConsultationInput | null {
  if (!data || typeof data !== "object") return null;
  const v = data as Record<string, unknown>;
  if (
    typeof v.name !== "string" ||
    typeof v.grade !== "string" ||
    typeof v.phone !== "string"
  )
    return null;
  const name = v.name.trim();
  const phone = v.phone.replace(/\D/g, "");
  const university = v.university ?? "";
  const concern = v.concern ?? "";
  const contactTime = v.contactTime ?? "any";
  if (
    !name ||
    name.length > 50 ||
    !CONSULT_GRADES.some((g) => g === v.grade) ||
    !PHONE_PATTERN.test(phone)
  )
    return null;
  if (typeof university !== "string" || university.length > 100) return null;
  if (
    typeof concern !== "string" ||
    (concern !== "" && !CONSULT_CONCERNS.some((c) => c.id === concern))
  )
    return null;
  if (
    typeof contactTime !== "string" ||
    !CONTACT_TIMES.some((t) => t.id === contactTime)
  )
    return null;
  return {
    name,
    grade: v.grade,
    phone,
    university: university.trim(),
    concern,
    contactTime,
  };
}

/** Compatibility with the deployed five-column Apps Script: include context in its existing university field. */
export function consultationPayload(input: ConsultationInput, token: string) {
  const concernLabel =
    CONSULT_CONCERNS.find((c) => c.id === input.concern)?.label ??
    "선택하지 않음";
  const contactTimeLabel =
    CONTACT_TIMES.find((t) => t.id === input.contactTime)?.label ?? "시간 무관";
  const consultationSummary = `상담 고민: ${concernLabel}\n연락 희망 시간: ${contactTimeLabel} (확정 예약 아님)`;
  return {
    token,
    name: input.name,
    grade: input.grade,
    // Hyphens keep the leading zero when the legacy webhook appends to Sheets.
    phone: input.phone.replace(/^(01\d)(\d{3,4})(\d{4})$/, "$1-$2-$3"),
    university: `희망 대학: ${input.university || "(미입력)"}\n${consultationSummary}`,
    universityName: input.university || "(미입력)",
    concern: input.concern,
    concernLabel,
    contactTime: input.contactTime,
    contactTimeLabel,
    consultationSummary,
    receivedAt: new Date().toISOString(),
  };
}
