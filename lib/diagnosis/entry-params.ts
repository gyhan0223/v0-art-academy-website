/**
 * /diagnosis 진입 query(?from=…&target=…&pick=…) 정규화.
 *
 * query string의 임의 문자열을 그대로 신뢰하지 않는다 —
 * - target: jungsiEntries에 실제 존재하는 대학명일 때만 canonical 이름으로
 *   통과시키고, 아니면 null(일반 진단 fallback).
 * - pick: /guide/jungsi-2027 원서 트레이의 ?pick=id,id 와 같은 entry id 목록.
 *   실존 id이고 가·나·다군인 것만, 군마다 1개씩 통과시킨다.
 * - from: whitelist 밖이면 null. 애널리틱스 entry_source로만 쓴다.
 * 개인 성적·개인정보는 URL로 다루지 않는다 — 대학명·entry id와 유입 경로만 허용한다.
 */

import { jungsiEntries, type Gun, type JungsiEntry } from "@/lib/jungsi-data";

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

/* ------------------------------ 원서 조합(pick) ------------------------------ */

/** 조합 점검 대상 군 — 한예종(별도)은 자체 전형이라 점검 대상에서 뺀다 */
export const DIAGNOSIS_PLAN_GUNS: Gun[] = ["가", "나", "다"];

/**
 * ?pick=id,id,id → 검증된 JungsiEntry 목록 (가·나·다 순, 군마다 최대 1개).
 * /guide/jungsi-2027가 URL에 남기는 ?pick과 같은 형식·같은 id를 쓴다.
 * 유효한 항목이 하나도 없으면 빈 배열 — 호출 쪽은 length로 분기한다.
 */
export function normalizeDiagnosisPlan(
  value: string | null | undefined,
): JungsiEntry[] {
  const raw = (value ?? "").trim();
  if (raw === "") return [];
  const byGun = new Map<Gun, JungsiEntry>();
  for (const id of raw.split(",")) {
    const entry = jungsiEntries.find((e) => e.id === id.trim());
    if (!entry || !DIAGNOSIS_PLAN_GUNS.includes(entry.gun)) continue;
    if (!byGun.has(entry.gun)) byGun.set(entry.gun, entry);
  }
  return DIAGNOSIS_PLAN_GUNS.map((g) => byGun.get(g)).filter(
    (e): e is JungsiEntry => e != null,
  );
}

/**
 * /guide/jungsi-2027 → /diagnosis 개인화 진입 링크 생성 (단일 소스).
 * - target: 대학명(공개 정보) — /diagnosis 쪽 normalizeDiagnosisTarget이 재검증한다.
 * - pick: 원서 트레이에 담은 entry id 목록 — normalizeDiagnosisPlan이 재검증한다.
 * 둘 다 URLSearchParams로 안전하게 인코딩하며 성적 등 개인정보는 싣지 않는다.
 */
export function jungsiDiagnosisHref(
  target?: string | null,
  opts?: { pick?: readonly string[] },
): string {
  const params = new URLSearchParams({ from: "jungsi" });
  if (target) params.set("target", target);
  if (opts?.pick && opts.pick.length > 0) params.set("pick", opts.pick.join(","));
  return `/diagnosis?${params.toString()}`;
}
