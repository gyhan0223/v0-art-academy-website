/**
 * 진단에서 고른 실기 종목 ↔ 대학(모집단위) 응시 가능 판정.
 *
 * lib/jungsi-data.ts가 entry.subjects(응시 가능 종목 배열, OR·빈 배열=비실기)를
 * 직접 들고 있으므로, 판정은 그 데이터를 그대로 읽는다.
 * (과거의 수기 호환 맵은 subjects 도입으로 필요 없어져 제거했다)
 */

import type { JungsiEntry } from "@/lib/jungsi-data";
import type { DiagnosisSilgi } from "./types";

/**
 * 준비 중인 실기로 이 모집단위에 응시할 수 있는가.
 * - "모름": 실기 조건으로 걸러내지 않는다 → 항상 true
 * - "비실기" 선택: 실기 없는 전형만 남긴다
 * - 그 외: 응시 가능 종목에 포함된 곳 + 비실기(실기 무관) 포함
 */
export function isCompatibleSilgi(
  entry: JungsiEntry,
  silgi: DiagnosisSilgi,
): boolean {
  if (silgi === "모름") return true;
  if (silgi === "비실기") return entry.subjects.length === 0;
  if (entry.subjects.length === 0) return true; // 실기 무관 — UI에서 별도 표시
  return entry.subjects.includes(silgi);
}

/**
 * 복수 선택 판정 — 고른 종목 중 하나라도 응시 가능하면 포함(OR).
 * 아무것도 안 골랐거나 "모름"이 섞여 있으면 실기 조건으로 걸러내지 않는다.
 */
export function isCompatibleSilgiAny(
  entry: JungsiEntry,
  selected: DiagnosisSilgi[],
): boolean {
  if (selected.length === 0 || selected.includes("모름")) return true;
  return selected.some((s) => isCompatibleSilgi(entry, s));
}

/** 결과 카드에서 "실기 무관" 뱃지를 붙일지 */
export function isSilgiFree(entry: JungsiEntry): boolean {
  return entry.subjects.length === 0;
}
