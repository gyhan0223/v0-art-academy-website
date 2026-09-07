/**
 * 원서 조합(가·나·다 담은 대학들)의 실기 종목 궁합 분석 — 단일 소스.
 *
 * /guide/jungsi-2027 원서 트레이(headline·공유 이미지)와 /diagnosis 조합 점검
 * 결과가 같은 판정을 쓰도록 컴포넌트 밖으로 뺐다. 성적은 보지 않고
 * lib/jungsi-data.ts의 subjects(응시 가능 종목)만으로 판단한다.
 */

import {
  SILGI_META,
  silgiCategory,
  type JungsiEntry,
  type SilgiSubject,
} from "@/lib/jungsi-data";

export type PlanSilgiAnalysis = {
  headline: string;
  detail: string;
  /** 선택한 실기 대학 전체가 공유하는 종목 (없으면 빈 배열) */
  common: SilgiSubject[];
};

export function analyzeSelection(picked: JungsiEntry[]): PlanSilgiAnalysis {
  const main = picked.filter((e) => e.gun !== "별도");
  const hasKarts = picked.some((e) => e.gun === "별도");
  const silgiPicks = picked.filter((e) => e.subjects.length > 0);
  const nonSilgiPicks = main.filter((e) => e.subjects.length === 0);

  // 선택한 실기 대학들이 공유하는 종목 (택1 대학은 응시 가능 종목 전체로 판정)
  const common =
    silgiPicks.length > 0
      ? silgiPicks[0].subjects.filter((s) =>
          silgiPicks.every((e) => e.subjects.includes(s)),
        )
      : [];

  if (
    silgiPicks.some((e) => e.subjects.includes("통합·자체실기")) ||
    (hasKarts && main.length > 0)
  ) {
    return {
      headline: "자체 실기 대비가 들어가는 조합",
      detail:
        "서울대·이화여대·한예종급 자체실기는 대학 기출에 맞춘 별도 준비가 필요합니다. 나머지 카드의 종목과 시간 배분을 함께 설계해야 합니다.",
      common,
    };
  }

  if (silgiPicks.length >= 2 && common.length === 0) {
    const names = [
      ...new Set(silgiPicks.map((e) => SILGI_META[silgiCategory(e)].short)),
    ];
    return {
      headline: "실기 두 갈래를 병행하는 조합",
      detail: `선택한 대학들의 실기 종목이 겹치지 않아 ${names.join("·")} 종목을 각각 준비해야 합니다. 남은 기간의 시간 배분이 합격을 가릅니다.`,
      common,
    };
  }
  if (nonSilgiPicks.length > 0 && silgiPicks.length > 0) {
    return {
      headline: "실기 + 수능·서류를 병행하는 조합",
      detail:
        "비실기 카드는 그림 대신 수능·서류 관리가 승부처입니다. 나머지 카드의 실기와 시간 배분이 필요합니다.",
      common,
    };
  }
  if (main.length > 0 && silgiPicks.length === 0) {
    return {
      headline: "실기 없이 가는 조합",
      detail:
        "실기고사 부담이 없는 대신, 수능 성적과 서류 완성도가 당락을 결정합니다.",
      common,
    };
  }
  if (silgiPicks.length > 0) {
    return {
      headline: "한 종목으로 끝나는 조합",
      detail: `${SILGI_META[common[0]].label} 하나로 선택한 실기 대학을 모두 지원할 수 있어, 실기 준비를 한 갈래에 집중할 수 있는 조합입니다.`,
      common,
    };
  }
  return { headline: "", detail: "", common };
}
