/**
 * /diagnosis 진입 query(?from=…&target=…) 정규화.
 *
 * query string의 임의 문자열을 그대로 신뢰하지 않는다 —
 * - target: jungsiEntries에 실제 존재하는 대학명일 때만 canonical 이름으로
 *   통과시키고, 아니면 null(일반 진단 fallback).
 * - from: whitelist 밖이면 null. 애널리틱스 entry_source로만 쓴다.
 * 개인 성적·개인정보는 URL로 다루지 않는다 — 대학명과 유입 경로만 허용한다.
 */

import { jungsiEntries } from "@/lib/jungsi-data";

export const DIAGNOSIS_ENTRY_SOURCES = ["jungsi"] as const;
export type DiagnosisEntrySource = (typeof DIAGNOSIS_ENTRY_SOURCES)[number];

export function normalizeDiagnosisEntrySource(
  value: string | null | undefined,
): DiagnosisEntrySource | null {
  return (DIAGNOSIS_ENTRY_SOURCES as readonly string[]).includes(value ?? "")
    ? (value as DiagnosisEntrySource)
    : null;
}

/** 실존 대학명이면 canonical 이름, 아니면 null (일반 진단으로 fallback) */
export function normalizeDiagnosisTarget(
  value: string | null | undefined,
): string | null {
  const q = (value ?? "").trim();
  if (q === "") return null;
  const entry = jungsiEntries.find((e) => e.university === q);
  return entry ? entry.university : null;
}
