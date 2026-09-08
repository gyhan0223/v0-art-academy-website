"use client";

/**
 * 진단 결과 → 2027 수능 파이널 집중반(/final) 전환 블록.
 *
 * 고3·N수생(lib/diagnosis/types.ts의 FINAL_TRACK_GRADES)에게만 보여준다.
 * 이 학년에게는 1:1 컨설팅(StrategyConsultCta)과 윈터스쿨(WinterConversion)을
 * 아예 노출하지 않는다 — 수능이 두 달 남은 학생에게 겨울방학 과정이나
 * 유료 컨설팅을 권하면 다음 단계가 흐려진다. 다음 단계는 하나, 파이널이다.
 *
 * 프로그램 정보(명칭·기간·과목·장소)는 lib/final-program.ts 단일 소스만 쓴다.
 * /final 랜딩의 원칙을 그대로 따른다 — 카운트다운·마감 임박·잔여 좌석 같은
 * 자극 표현과 확인되지 않은 수강료·정원·개강일은 쓰지 않는다.
 */

import Link from "next/link";
import { FINAL_PROGRAM } from "@/lib/final-program";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";

/** 카드에 보여줄 확정 정보 — 값은 lib/final-program.ts 하나에서만 온다 */
const FACTS: [string, string][] = [
  ["기간", `9월 모의평가 이후 ~ ${FINAL_PROGRAM.examDateLabel} 전까지`],
  ["과목", FINAL_PROGRAM.subjects.join(" · ")],
  ["장소", FINAL_PROGRAM.venue],
];

export default function FinalConversion({
  hasGradeUp = false,
  entrySource = null,
}: {
  /** 바로 위에 "한 등급 상승" 비교를 본 학생이면 그 결과에 이어 붙이는 카피를 쓴다 */
  hasGradeUp?: boolean;
  /** 진단의 최초 유입 경로(whitelist 통과값) — 애널리틱스에만 쓴다 */
  entrySource?: string | null;
}) {
  return (
    <section
      aria-label={`${FINAL_PROGRAM.name} 안내`}
      className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6"
    >
      <p className="text-[13px] font-semibold tracking-wide text-accent">
        {FINAL_PROGRAM.targetShort}
      </p>
      <h2 className="mt-2 break-keep text-[22px] font-bold leading-snug text-white">
        수능까지 남은 기간,
        <br />
        한 등급이 지원권을 바꿔요
      </h2>
      <p className="mt-3 break-keep text-[15px] leading-relaxed text-white/75">
        {hasGradeUp
          ? "위에서 본 한 등급 상승 조합은 가정이 아니라 남은 기간의 목표예요. "
          : "지금 성적은 출발점이지 결과가 아니에요. "}
        9월 모의평가 결과와 목표 대학의 반영 방식을 기준으로, 국어·영어·사회탐구
        중 지금 올릴 수 있는 과목부터 정리해 수능까지 끌고 갑니다.
      </p>

      <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
        {FACTS.map(([label, value]) => (
          <div key={label} className="flex gap-4 py-2.5 text-[14px]">
            <dt className="w-10 shrink-0 text-white/50">{label}</dt>
            <dd className="break-keep text-white/85">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href={FINAL_PROGRAM.href}
        onClick={() =>
          trackDiagnosis("diagnosis_final_cta_click", {
            entry_source: entrySource ?? undefined,
          })
        }
        className="mt-5 block min-h-[48px] rounded-xl bg-accent px-5 py-3.5 text-center text-[15px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {FINAL_PROGRAM.shortName} 집중반 알아보기 →
      </Link>

      <p className="mt-4 break-keep text-[13px] leading-relaxed text-white/55">
        등록부터 권하지 않아요. 9평 성적표와 목표 대학을 가져오면, 남은 기간에
        실제로 바꿀 수 있는 과목부터 함께 확인합니다.
      </p>
    </section>
  );
}
