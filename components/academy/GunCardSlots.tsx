"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  jungsiEntries,
  silgiCategory,
  silgiShort,
  type Gun,
} from "@/lib/jungsi-data";
import { UNIV_PLAN_2027 } from "@/lib/univ-plan-2027";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { jungsiDiagnosisHref } from "@/lib/diagnosis/entry-params";

/* 히어로: "지원 카드 3장 + 보너스 1장" — 카드를 누르면 해당 군 대학 목록 팝업 */

const SLOTS: { gun: Gun; label: string; sub: string }[] = [
  { gun: "가", label: "가군", sub: "1.11 – 1.17" },
  { gun: "나", label: "나군", sub: "1.18 – 1.24" },
  { gun: "다", label: "다군", sub: "1.25 – 1.31" },
];

const GUN_TITLE: Record<Gun, string> = {
  가: "가군 모집 대학",
  나: "나군 모집 대학",
  다: "다군 모집 대학",
  별도: "가나다군 외 별도 모집",
};


export default function GunCardSlots() {
  const [openGun, setOpenGun] = useState<Gun | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    if (openGun == null) return;
    setDetailId(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGun(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openGun]);

  const detail = detailId == null ? null : UNIV_PLAN_2027[detailId];
  const detailEntry =
    detailId == null ? null : jungsiEntries.find((e) => e.id === detailId);

  const entries =
    openGun == null ? [] : jungsiEntries.filter((e) => e.gun === openGun);

  return (
    <div className="mt-10 flex flex-col items-center">
      <span className="mb-3 text-[12px] tracking-wider text-white/50">
        전형기간 (2027학년도 기준)
      </span>
      <div className="flex w-full max-w-sm items-stretch justify-center gap-2 md:w-auto md:max-w-none md:gap-3">
        {SLOTS.map((slot, i) => (
          <button
            key={slot.gun}
            type="button"
            onClick={() => setOpenGun(slot.gun)}
            aria-label={`${slot.label} 모집 대학 목록 보기`}
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-white/15 bg-[#0a0a0a] py-5 transition-colors hover:border-accent/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-28 md:flex-none"
            style={{ transform: `rotate(${(i - 1) * 2}deg)` }}
          >
            <span className="font-mono text-lg font-bold text-accent">
              {slot.label}
            </span>
            <span className="mt-1 whitespace-nowrap text-[10px] tracking-wide text-white/50 md:text-[11px] md:tracking-wider">
              {slot.sub}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpenGun("별도")}
          aria-label="가나다군 외 별도 모집 대학 보기"
          className="flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-accent/50 py-5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-28 md:flex-none"
          style={{ transform: "rotate(4deg)" }}
        >
          <span className="font-mono text-lg font-bold text-accent/90">+</span>
          <span className="mt-1 whitespace-nowrap text-[10px] tracking-wide text-accent/80 md:text-[11px] md:tracking-wider">
            한예종 별도
          </span>
        </button>
      </div>
      <span className="mt-3 text-[12px] text-white/45">
        카드를 누르면 해당 군의 대학 목록이 열립니다
      </span>

      {openGun && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={GUN_TITLE[openGun]}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpenGun(null)}
            aria-hidden
          />
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 md:p-6">
              <div className="text-left">
                <p className="mb-1 text-[12px] tracking-[0.25em] text-accent">
                  2027학년도 정시
                </p>
                <h2 className="text-lg font-bold leading-snug text-white">
                  {GUN_TITLE[openGun]}
                  <span className="ml-2 font-mono text-sm font-medium text-white/55">
                    {entries.length}곳
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenGun(null)}
                aria-label="닫기"
                className="-mr-1 -mt-1 rounded p-1.5 text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {detail ? (
              <div className="overflow-y-auto px-5 py-4 text-left md:px-6">
                <button
                  type="button"
                  onClick={() => setDetailId(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span aria-hidden>←</span> 대학 목록으로
                </button>
                <h3 className="text-[17px] font-bold text-white">
                  {detail.title}
                </h3>
                <p className="mt-1.5 text-[12px] text-white/50">
                  {detail.source}
                </p>

                <div className="mt-4 overflow-x-auto rounded-lg border border-white/12">
                  <table className="w-full border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-white/[0.05] text-white/60">
                        <th className="px-3 py-2.5 text-left font-medium">
                          모집단위
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium">
                          전공
                        </th>
                        {detail.columns.map((col) => (
                          <th
                            key={col}
                            className="px-3 py-2.5 text-right font-medium"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.rows.map((row, i) => {
                        const firstOfGroup =
                          i === 0 || detail.rows[i - 1].group !== row.group;
                        return (
                          <tr
                            key={`${row.group}-${row.name ?? ""}`}
                            className="border-t border-white/[0.06]"
                          >
                            <td className="px-3 py-2.5 text-white/75">
                              {firstOfGroup ? row.group : ""}
                            </td>
                            <td className="px-3 py-2.5 text-white/90">
                              {row.name ?? "—"}
                            </td>
                            {row.values.map((v, vi) => (
                              <td
                                key={vi}
                                className={`px-3 py-2.5 text-right font-mono ${
                                  vi === row.values.length - 1
                                    ? "text-white"
                                    : "text-white/65"
                                }`}
                              >
                                {v}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {detail.method?.map((block) => (
                  <div
                    key={block.title}
                    className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-[13px] font-bold text-white/90">
                      {block.title}
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {block.lines.map((line) => {
                        // "실기고사: …"처럼 앞에 라벨이 있는 줄은 라벨을
                        // 먼저 보이게 한다 (데이터 문자열은 그대로).
                        const labeled = line.match(/^([^:]{1,14}):\s*(.+)$/);
                        return (
                          <li
                            key={line}
                            className="flex gap-2 text-[13px] leading-relaxed text-white/70"
                          >
                            <span className="text-accent" aria-hidden>
                              ·
                            </span>
                            <span className="min-w-0">
                              {labeled ? (
                                <>
                                  <span className="mr-1.5 font-semibold text-white/90">
                                    {labeled[1]}
                                  </span>
                                  {labeled[2]}
                                </>
                              ) : (
                                line
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <ul className="mt-4 space-y-2">
                  {detail.notes.map((note) => (
                    <li
                      key={note}
                      className="text-[12px] leading-relaxed text-white/50"
                    >
                      ※ {note}
                    </li>
                  ))}
                </ul>

                {/* 상세를 끝까지 읽은 사용자의 다음 행동 — 닫기/뒤로 대신
                    "내 성적으로 가능한가?"를 잇는다. 모달 스크롤의 일반
                    콘텐츠로 두고(fixed 금지), href·검증은 대학 카드 CTA와
                    같은 jungsiDiagnosisHref 단일 소스를 재사용한다. */}
                {detailEntry && (
                  <div className="mt-5 rounded-lg border border-accent/30 bg-accent/[0.06] p-4">
                    <p className="break-keep text-[15px] font-bold leading-snug text-white">
                      {detailEntry.university}, 내 성적으로 가능할까요?
                    </p>
                    <p className="mt-2 break-keep text-[13px] leading-relaxed text-white/65">
                      현재 성적과 실기 유형을 기준으로 지원 가능 범위를
                      확인해보세요.
                    </p>
                    <Link
                      href={jungsiDiagnosisHref(detailEntry.university)}
                      onClick={() =>
                        trackDiagnosis("jungsi_university_diagnosis_click", {
                          target_university: detailEntry.university,
                          gun: detailEntry.gun,
                          silgi_type: silgiCategory(detailEntry),
                          placement: "detail_modal",
                        })
                      }
                      className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-center text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="break-keep">
                        {detailEntry.university} 가능성 무료로 확인하기
                      </span>
                      <span aria-hidden className="shrink-0">
                        →
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ul className="overflow-y-auto px-5 py-2 md:px-6">
                  {entries.map((e) => {
                    const hasPlan = e.id in UNIV_PLAN_2027;
                    const inner = (
                      <>
                        <div className="min-w-0 text-left">
                          <p className="text-[15px] font-medium text-white">
                            {e.university}
                            {e.campus && (
                              <span className="ml-1.5 text-[13px] font-normal text-white/55">
                                {e.campus}
                              </span>
                            )}
                            {hasPlan && (
                              <span className="ml-2 inline-block whitespace-nowrap rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-medium text-accent">
                                {UNIV_PLAN_2027[e.id].source.includes("시행계획")
                                  ? "2027 시행계획"
                                  : "2027 요강 확정"}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-white/55">
                            {e.units}
                          </p>
                        </div>
                        <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                          <span className="rounded border border-white/15 px-2 py-0.5 text-[12px] text-white/65">
                            {silgiShort(e)}
                          </span>
                          {hasPlan && (
                            <span aria-hidden className="text-white/40">
                              ›
                            </span>
                          )}
                        </span>
                      </>
                    );
                    return (
                      <li
                        key={e.id}
                        className="border-b border-white/[0.06] last:border-b-0"
                      >
                        {hasPlan ? (
                          <button
                            type="button"
                            onClick={() => setDetailId(e.id)}
                            className="flex w-full items-start justify-between gap-3 py-3.5 transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-accent"
                          >
                            {inner}
                          </button>
                        ) : (
                          <div className="flex items-start justify-between gap-3 py-3.5">
                            {inner}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <p className="border-t border-white/10 px-5 py-3.5 text-[12px] leading-relaxed text-white/50 md:px-6">
                  전형방법·모집인원·경쟁률 상세는 아래{" "}
                  <span className="text-white/70">군별 대학 한눈에 보기</span>
                  에서 확인하세요.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
