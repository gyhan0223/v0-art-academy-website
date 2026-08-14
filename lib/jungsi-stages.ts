// 가·나·다군 둘러보기 카드 UI 보조 로직.
// 전형 bar용 단계 구조 생성, method 문자열 분리, 태그 우선순위를 담당합니다.
// 데이터 원본(method·ratio·stages)은 lib/jungsi-data.ts 에 있습니다.

import type {
  AdmissionStage,
  JungsiEntry,
  StagePart,
} from "./jungsi-data";

/** ratio.etcLabel → bar 조각 type 매핑 (모르는 라벨은 기타) */
const ETC_TYPE: Record<string, StagePart["type"]> = {
  학생부: "학생부",
  면접: "면접",
  서류: "서류",
};

/**
 * 카드 전형 bar에 쓸 단계 구조.
 * - 수기 작성된 entry.stages 가 있으면 그대로 사용 (단계별·혼합 전형)
 * - method에 단계 언급이 없는 일괄합산·수능100% 전형만 ratio에서 안전하게 생성
 * - 그 외(단계가 있는데 stages 미작성·ratio 없음)는 null → 카드에서 method 텍스트 fallback
 */
export function getAdmissionStages(entry: JungsiEntry): AdmissionStage[] | null {
  if (entry.stages) return entry.stages;
  if (!entry.ratio) return null;
  // ratio는 최종 단계 기준이라, 단계 구조가 있는데 stages가 없으면 bar를 만들지 않음
  if (entry.method.some((line) => line.includes("단계"))) return null;

  const { suneung, silgi, etc = 0, etcLabel } = entry.ratio;
  const parts: StagePart[] = [];
  if (suneung > 0) parts.push({ type: "수능", value: suneung });
  if (silgi > 0) parts.push({ type: "실기", value: silgi });
  if (etc > 0)
    parts.push({
      type: ETC_TYPE[etcLabel ?? ""] ?? "기타",
      value: etc,
      label: etcLabel,
    });
  if (parts.length === 0) return null;

  return [{ label: silgi > 0 ? "일괄합산" : "전형", parts }];
}

/** method 줄을 전형 방법 / 수능 반영으로 분리 ("수능 반영영역:" 접두어 기준의 안전한 분리) */
export function splitMethod(entry: JungsiEntry): {
  admission: string[];
  suneung: string[];
} {
  const admission: string[] = [];
  const suneung: string[] = [];
  for (const line of entry.method) {
    if (line.startsWith("수능 반영영역")) {
      suneung.push(line.replace(/^수능 반영영역:\s*/, ""));
    } else {
      admission.push(line);
    }
  }
  return { admission, suneung };
}

/**
 * 태그 노출 우선순위.
 * 1) 지원 자격·필터에 직접 영향 (여대·수학 필수·실기 없음·탐구 필수 등)
 * 2) 수능 전략에 영향 (영어·수학·탐구·국어 비중)
 * 3) 실기·전형 구조 (실기 비중·단계별·선택형 등)
 */
function tagScore(tag: string): number {
  if (tag === "여대") return 0;
  if (
    tag.includes("수학 필수") ||
    tag.includes("실기 없음") ||
    tag.includes("탐구 필수") ||
    tag.includes("직업탐구 불인정")
  )
    return 1;
  if (
    tag.includes("영어") ||
    tag.includes("수학") ||
    tag.includes("탐구") ||
    tag.includes("국어")
  )
    return 2;
  if (
    tag.includes("실기") ||
    tag.includes("단계") ||
    tag.includes("선택형") ||
    tag.includes("면접")
  )
    return 3;
  return 4;
}

/** 기본 카드에 보여줄 상위 태그 (나머지는 상세보기에서 노출) */
export function primaryTags(tags: string[] | undefined, max = 3): string[] {
  if (!tags || tags.length === 0) return [];
  return [...tags].sort((a, b) => tagScore(a) - tagScore(b)).slice(0, max);
}
