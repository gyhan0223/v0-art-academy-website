/**
 * 진단에서 고른 실기 과목 ↔ 대학(모집단위) 실기 호환 판정.
 *
 * 기존 isCompatibleTrack()은 PrepTrack(기초디자인·기초소양) 2종만 다루므로
 * 기존 정시 페이지용으로 그대로 두고, 여기서는 전체 DiagnosisSilgi를 다룬다.
 *
 * 판정은 lib/jungsi-data.ts 각 entry의 실기 내용(practical·method)을 사람이
 * 대조해 만든 명시적 매핑이다. 문자열 자동 매칭은 요강 표기가 조금만 바뀌어도
 * 잘못 걸러내므로 쓰지 않는다. 데이터에 대학이 추가되면 이 맵도 함께 갱신한다.
 */

import type { JungsiEntry, SilgiType } from "@/lib/jungsi-data";
import type { DiagnosisSilgi } from "./types";

/** 매핑에 실기 과목 선택지로 실제 들어가는 값 (모름·비실기 제외) */
type SilgiSubjectKey = Exclude<DiagnosisSilgi, "모름" | "비실기">;

/**
 * entry.id → 해당 실기 과목으로 응시할 수 있는 진단 실기 목록.
 * 여기 없는 entry는 아래 silgi 유형 기본값(DEFAULT_BY_TYPE)을 따른다.
 * 선택실기(택1) 대학은 요강의 선택지 그대로 나열했다.
 */
const COMPAT_BY_ENTRY: Record<string, SilgiSubjectKey[]> = {
  // ── 가군 ──
  // 고려대 디자인조형학부 — 실기 유형 분류는 기초소양이지만 출제는 발상과 표현
  "korea-design": ["발상과 표현", "기초조형·소양평가"],
  // 성균관대 미술학과 — 인물화(연필·수채·먹 자유)
  "skku-fine-ga": ["수채화·수묵담채"],
  // 서울시립대 조각 — 소조(인물두상) + 주제소묘
  "uos-sculpture-ga": ["소조·입체"],
  // 숙명여대 회화 — 수묵담채·인체수채화
  "sookmyung-fine-ga": ["수채화·수묵담채"],
  // 서경대 디자인학부 — 발상과 표현·기초디자인 중 택1
  "skuniv-ga": ["기초디자인", "발상과 표현"],
  // 삼육대 — 기초디자인·발상과 표현·기초소양 중 택1
  "syu-ga": ["기초디자인", "발상과 표현", "기초조형·소양평가"],
  // 건국대 현대미술 — 인체색채소묘
  "konkuk-hyeondae-ga": ["소묘"],
  // 경기대 애니메이션 — 4컷 표현·웹툰
  "gyeonggi-ga": ["만화·상황표현"],
  // ── 나군 ──
  // 세종대 회화 — 인체수묵담채·인체수채화
  "sejong-fine-na": ["수채화·수묵담채"],
  // 경희대 미술학부 — 한국화·회화(수묵담채·수채화) / 조소(소조)
  "khu-na": ["수채화·수묵담채", "소조·입체"],
  // 동국대 조소 — 인물 두상 모델링
  "dgu-na": ["소조·입체"],
  // 중앙대 공간연출 — 소묘
  "cau-na": ["소묘"],
  // 국민대 입체미술 — 소조(주제가 있는 두상)
  "kookmin-na": ["소조·입체"],
  // 동덕여대 회화
  "dongduk-na": ["수채화·수묵담채"],
  // 서울여대 현대미술 — 발상과 묘사(색채·정물/인물)
  "swu-hyeondae-na": ["발상과 표현", "수채화·수묵담채"],
  // 덕성여대 — 수묵담채·인체수채·기초디자인·기초소양 중 택1
  "duksung-na": ["수채화·수묵담채", "기초디자인", "기초조형·소양평가"],
  // ── 다군 ──
  // 추계예대 — 수묵담채 / 수채화·소묘 중 선택
  "chugye-da": ["수채화·수묵담채", "소묘"],
  // 한성대 예술학부 — 수묵담채·인물수채화
  "hansung-da": ["수채화·수묵담채"],
  // 성신여대 디자인과 — 기초디자인(소묘)·기초조형 중 택1
  "sungshin-da": ["기초디자인", "기초조형·소양평가"],
};

/** 명시 매핑이 없는 entry의 실기유형별 기본 호환 */
const DEFAULT_BY_TYPE: Record<SilgiType, SilgiSubjectKey[]> = {
  기초디자인: ["기초디자인"],
  기초소양: ["기초조형·소양평가"],
  // 선택실기는 학교마다 선택지가 달라 반드시 COMPAT_BY_ENTRY에 명시한다.
  // 명시가 빠진 경우를 대비해 가장 흔한 조합을 기본값으로 둔다.
  선택실기: ["기초디자인", "기초조형·소양평가"],
  자체실기: ["통합·자체실기"],
  비실기: [],
};

function compatOf(entry: JungsiEntry): SilgiSubjectKey[] {
  return COMPAT_BY_ENTRY[entry.id] ?? DEFAULT_BY_TYPE[entry.silgi];
}

/**
 * 준비 중인 실기로 이 모집단위에 응시할 수 있는가.
 * - "모름": 실기 조건으로 걸러내지 않는다 → 항상 true
 * - "비실기" 선택: 실기 없는 전형만 남긴다
 * - 그 외: 해당 실기로 응시 가능한 곳 + 비실기(실기 무관) 포함
 */
export function isCompatibleSilgi(
  entry: JungsiEntry,
  silgi: DiagnosisSilgi,
): boolean {
  if (silgi === "모름") return true;
  if (silgi === "비실기") return entry.silgi === "비실기";
  if (entry.silgi === "비실기") return true; // 실기 무관 — UI에서 별도 표시
  return compatOf(entry).includes(silgi);
}

/**
 * 복수 선택 판정 — 고른 유형 중 하나라도 응시 가능하면 포함(OR).
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
  return entry.silgi === "비실기";
}
