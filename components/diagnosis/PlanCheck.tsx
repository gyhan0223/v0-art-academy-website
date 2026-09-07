"use client";

/**
 * "내가 고른 가·나·다 조합" 점검 섹션 — /guide/jungsi-2027 원서 트레이에서
 * ?pick=으로 넘어온 학생에게 결과 화면 최상단에서 먼저 답한다.
 *
 * 판정은 lib/diagnosis/plan-check.ts가 기존 데이터로 계산한 것만 보여준다 —
 * 입결이 공개된 대학만 지원권 뱃지가 붙고, 나머지는 '입결 미공개'로 남긴다.
 * 합격 확률·확정적 판정 문구는 쓰지 않는다.
 */

import { useEffect, useMemo, useRef } from "react";
import { silgiLabel, type Gun, type JungsiEntry } from "@/lib/jungsi-data";
import { checkPlan, type PlanEntryCheck } from "@/lib/diagnosis/plan-check";
import type {
  DetailedStudentScore,
  DiagnosisGender,
  DiagnosisSilgi,
} from "@/lib/diagnosis/types";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { TierBadge } from "./ComboCards";

const GUN_LABEL: Record<Gun, string> = {
  가: "가군",
  나: "나군",
  다: "다군",
  별도: "별도",
};

function nameOf(e: JungsiEntry) {
  return e.campus ? `${e.university} ${e.campus}` : e.university;
}

/** 같은 대학이 두 군에 담길 수 있어(건국대 가·다군 등) 요약 문장엔 군을 함께 적는다 */
function gunName(e: JungsiEntry) {
  return `${GUN_LABEL[e.gun]} ${e.university}`;
}

function joinNames(list: JungsiEntry[]) {
  return list.map(gunName).join(" · ");
}

/** 안정·적정·도전은 기존 TierBadge, 그 외는 판정하지 않았다는 사실을 그대로 표기 */
function StatusBadge({ item, scoreless }: { item: PlanEntryCheck; scoreless: boolean }) {
  if (scoreless) return null;
  const neutral =
    "inline-block shrink-0 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/60";
  if (item.blocked) return <span className={neutral}>계산 제외</span>;
  if (item.tier === "낮음") return <span className={neutral}>컷과 차이 큼</span>;
  if (item.tier) return <TierBadge tier={item.tier} />;
  return <span className={neutral}>입결 미공개</span>;
}

function itemLines(item: PlanEntryCheck, scoreless: boolean): string[] {
  const { entry } = item;
  const lines: string[] = [];

  if (item.genderBlocked) lines.push("여자대학교 — 남학생은 지원할 수 없어요");

  const silgi = silgiLabel(entry);
  if (item.silgiFit === "free") lines.push("실기 없음 — 수능·서류로 선발해요");
  else if (item.silgiFit === "fit") lines.push(`${silgi} — 준비 중인 종목으로 응시할 수 있어요`);
  else if (item.silgiFit === "mismatch")
    lines.push(`${silgi} — 준비 중인 종목과 달라 별도 준비가 필요해요`);
  else lines.push(`실기 ${silgi}`);

  if (item.reflectLine) lines.push(`수능 반영 · ${item.reflectLine}`);

  if (!scoreless) {
    if (item.blocked) lines.push(`${item.blocked} — 환산 비교에서 제외했어요`);
    else if (item.tier && item.cutoffLabel) lines.push(`공개 컷 기준 · ${item.cutoffLabel}`);
    else if (item.converted != null)
      lines.push("최근 입시결과가 공개되지 않아 지원권 판정 없이 반영 구조만 참고해요");
  }
  return lines;
}

export default function PlanCheck({
  plan,
  score,
  gender,
  silgi,
}: {
  plan: JungsiEntry[];
  score: DetailedStudentScore;
  gender: DiagnosisGender;
  silgi: DiagnosisSilgi[];
}) {
  const check = useMemo(
    () => checkPlan(plan, score, { gender, silgi }),
    [plan, score, gender, silgi],
  );
  const { items, scoreless, range } = check;

  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackDiagnosis("diagnosis_jungsi_plan_result_view", {
      plan_filled_count: plan.length,
      plan_ids: plan.map((e) => e.id).join(","),
      plan_universities: plan.map((e) => e.university).join(","),
      has_detailed_score: !scoreless,
    });
  }, [plan, scoreless]);

  const countLabel = plan.length === 3 ? "3장" : `${plan.length}장`;

  return (
    <section aria-label="내가 고른 조합 점검">
      <p className="text-[13px] tracking-wider text-white/50">
        정시 가이드에서 고른 가·나·다군 {countLabel} 기준
      </p>
      <h2 className="mt-2 text-[22px] font-bold leading-snug text-white">
        내 {countLabel} 조합,
        <br />
        지금 성적으로 점검해봤어요
      </h2>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item.entry.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-[16px] font-bold leading-snug text-white">
                <span className="mr-2 font-mono text-[13px] font-normal text-accent">
                  {GUN_LABEL[item.entry.gun]}
                </span>
                {nameOf(item.entry)}
              </p>
              <StatusBadge item={item} scoreless={scoreless} />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-white/50">
              {item.entry.units}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {itemLines(item, scoreless).map((line) => (
                <li
                  key={line}
                  className="flex gap-2 text-[13px] leading-relaxed text-white/70"
                >
                  <span aria-hidden className="select-none text-white/25">
                    ·
                  </span>
                  <span className="min-w-0 break-keep">{line}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* 조합 전체 요약 — 데이터로 말할 수 있는 것만 */}
      <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
        <p className="text-[15px] font-bold text-white">조합 전체로 보면</p>
        <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-white/75">
          {check.silgi.headline && (
            <li className="break-keep">
              <span className="font-medium text-accent">{check.silgi.headline}</span>{" "}
              — {check.silgi.detail}
            </li>
          )}

          {!scoreless && check.bestFit && (
            <li className="break-keep">
              수능 반영 구조상{" "}
              <span className="font-medium text-white">
                {gunName(check.bestFit.entry)}
              </span>
              가 현재 성적 프로필이 가장 잘 반영되는 곳이에요 (반영식 환산 기준,
              다음 학교보다 약 {Math.round(check.bestFit.margin)}점 차이).
            </li>
          )}
          {!scoreless && !check.bestFit && check.fitComparable && (
            <li className="break-keep">
              선택한 학교들의 수능 반영 구조에서 현재 성적의 유불리 차이는 크지
              않아요.
            </li>
          )}

          {!scoreless && (range.reachable.length > 0 || range.stretch.length > 0 || range.far.length > 0) && (
            <li className="break-keep">
              2026 공개 컷 기준으로{" "}
              {range.reachable.length > 0 && (
                <>
                  지원권(안정·적정)에 드는 곳은{" "}
                  <span className="font-medium text-white">{joinNames(range.reachable)}</span>
                  {range.stretch.length > 0 || range.far.length > 0 ? ", " : "예요."}
                </>
              )}
              {range.stretch.length > 0 && (
                <>
                  도전권은{" "}
                  <span className="font-medium text-white">{joinNames(range.stretch)}</span>
                  {range.far.length > 0 ? ", " : "예요."}
                </>
              )}
              {range.far.length > 0 && (
                <>
                  현재 성적과 컷 차이가 큰 곳은{" "}
                  <span className="font-medium text-white">{joinNames(range.far)}</span>
                  예요.
                </>
              )}
              {range.unpublished.length > 0 && (
                <> {joinNames(range.unpublished)}는 입결이 공개되지 않아 판정하지 않았어요.</>
              )}
              {range.excluded.length > 0 && (
                <> {joinNames(range.excluded)}는 환산 비교에서 제외했어요.</>
              )}
            </li>
          )}
          {!scoreless && range.reachable.length === 0 && range.stretch.length === 0 && range.far.length === 0 && (
            <li className="break-keep">
              선택한 학교 모두 최근 입결이 공개되지 않았거나 자체 기준이라, 현재
              데이터로는 지원권을 판정하지 않았어요.
            </li>
          )}

          {!scoreless && check.gradeUpChanges.length > 0 && (
            <li className="break-keep">
              국어·영어·탐구가 한 등급씩 오르면{" "}
              {check.gradeUpChanges.map((c, i) => (
                <span key={c.entry.id}>
                  {i > 0 && ", "}
                  <span className="font-medium text-white">{gunName(c.entry)}</span>
                  {`가 ${c.from} → ${c.to}`}
                </span>
              ))}
              으로 들어와요.
            </li>
          )}
          {!scoreless && check.gradeUpUnchanged && (
            <li className="break-keep">
              한 등급이 올라도 공개 컷 기준 판정은 그대로예요.
            </li>
          )}

          {scoreless && (
            <li className="break-keep">
              성적을 입력하면 대학별 수능 반영 구조와 공개 컷 기준 점검까지 볼 수
              있어요.
            </li>
          )}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-white/50">
          최종 지원 여부는 실기 수준과 해당 연도 경쟁률까지 함께 확인해야 해요.
        </p>
      </div>
    </section>
  );
}
