// 2027학년도 미대 정시 모집군 · 전형방법 · 실기유형 데이터.
//
// ⚠️ 데이터 출처 · 확인 필요
// - 서울 소재 21개 대학의 학과별 상세(모집인원·실기내용·화지규격·실기시간)는
//   직전(2026학년도) 모집요강 기준으로 정리했습니다.
// - 경쟁률은 2025학년도 정시 기준입니다.
// - 2027학년도 최종 모집요강은 2026년 9월경 발표되며, 모집군·반영비율·실기유형이
//   바뀔 수 있습니다. 실제 지원 전에는 반드시 각 대학 입학처 자료로 대조하세요.
// - JSON에 포함되지 않은 대학(홍익대·한국예술종합학교)은
//   시행계획 기준 개략 정보로 유지했습니다.
// - 고려대·삼육대·서경대는 2026학년도 정시 모집요강 상세로 정리했습니다.

export type Gun = "가" | "나" | "다" | "별도";

export type SilgiType =
  | "기초소양"
  | "기초디자인"
  | "선택실기"
  | "비실기"
  | "자체실기";

export const GUN_ORDER: Gun[] = ["가", "나", "다", "별도"];

export const SILGI_META: Record<
  SilgiType,
  { label: string; short: string; description: string }
> = {
  기초디자인: {
    label: "기초디자인",
    short: "기초디자인",
    description:
      "제시된 사물과 조건으로 화면을 구성하는 유형입니다. 묘사력·구성력·완성도가 핵심이며, 가장 많은 대학이 채택하고 있습니다.",
  },
  기초소양: {
    label: "기초소양·기초조형",
    short: "기초소양",
    description:
      "주제·대상을 보고 발상을 이끌어내 화면으로 풀어내는 유형입니다. 국민대(기초조형평가)·성균관대(기초실기소양평가)처럼 사물 묘사보다 관찰·사고 과정을 봅니다.",
  },
  선택실기: {
    label: "선택실기(택1)",
    short: "선택실기",
    description:
      "학교가 지정한 여러 유형(기초디자인·기초소양·소묘 등) 중 하나를 골라 응시합니다. 준비하던 유형을 그대로 살려 지원할 수 있는 것이 장점입니다.",
  },
  자체실기: {
    label: "자체·통합실기",
    short: "자체실기",
    description:
      "대학이 독자 출제하는 통합·전공별 실기입니다. 서울대·서울시립대·이화여대처럼 재료·주제가 학교마다 달라 기초소양·기초디자인과 별도의 준비가 필요합니다.",
  },
  비실기: {
    label: "비실기(서류·면접)",
    short: "비실기",
    description:
      "실기고사 없이 학생부·미술활동보고서·면접으로 선발합니다. 홍익대가 대표적이며, 그림 연습보다 수능과 서류 관리가 승부처입니다.",
  },
};

/** 대학 카드 안에 펼쳐 보이는 학과(전공)별 상세 */
export type Major = {
  name: string;
  /** 모집인원(명). 미정·수시이월이면 null */
  quota: number | null;
  quotaNote?: string;
  /** 2025학년도 정시 경쟁률(:1). 자료 없으면 null */
  rate: number | null;
  /** 대학 안에서 전형 구조가 갈릴 때만 표기 (예: 일괄합산 / 단계별) */
  stageTag?: string;
  /** 대학 공통값과 다를 때만 표기 */
  practical?: string;
  duration?: string;
};

export type JungsiEntry = {
  id: string;
  university: string;
  /** 캠퍼스나 단과대 구분이 필요한 경우에만 (예: ERICA, 죽전) */
  campus?: string;
  /** 해당 모집군에서 뽑는 학과·학부 요약 */
  units: string;
  gun: Gun;
  silgi: SilgiType;
  /** 전형방법 요약. 한 줄에 한 항목. */
  method: string[];
  /** 최종(또는 실기 반영) 단계 기준 반영비율(%). 합이 100이 되도록. */
  ratio?: {
    suneung: number;
    silgi: number;
    etc?: number;
    etcLabel?: string;
  };
  /** 실기 내용(공통) */
  practical?: string;
  /** 화지 규격 */
  paper?: string;
  /** 실기 시간(공통) */
  duration?: string;
  /** 학과별 상세 (JSON 수록 대학만) */
  majors?: Major[];
  tags?: string[];
  note?: string;
};

export const jungsiEntries: JungsiEntry[] = [
  /* ─────────────── 가군 ─────────────── */
  {
    id: "ewha-ga",
    university: "이화여자대학교",
    units: "디자인학부 · 조형예술학부(서양화·도자예술) · 섬유패션학부(섬유예술·패션디자인)",
    gun: "가",
    silgi: "자체실기",
    method: [
      "1단계 수능 100% (4~8배수 선발)",
      "2단계 1단계성적 60% + 실기 40% (디자인학부 실기전형은 1단계성적 40% + 실기 60%)",
    ],
    ratio: { suneung: 60, silgi: 40 },
    practical: "제시된 대상과 주제를 다양한 재료로 표현 (통합실기)",
    paper: "2절",
    duration: "5시간",
    majors: [
      { name: "디자인학부(실기전형)", quota: 20, rate: null, practical: "통합실기(문제 2개)", stageTag: "실기 60%" },
      { name: "디자인학부(수능전형)", quota: 36, rate: 6.66, practical: "통합실기(문제 2개)" },
      { name: "조형예술학부 서양화", quota: 35, rate: 3.04 },
      { name: "조형예술학부 도자예술", quota: 25, rate: 4.35 },
      { name: "섬유패션학부 섬유예술", quota: 27, rate: 3.09 },
      { name: "섬유패션학부 패션디자인", quota: 20, rate: 3.25 },
    ],
    tags: ["여대", "단계별 전형"],
    note: "1단계 수능 100%로 통과해야 실기를 봅니다. 디자인학부 실기전형만 실기 비중이 60%로 높습니다.",
  },
  {
    id: "kookmin-ga",
    university: "국민대학교",
    units: "공업·공간·시각·영상·의상·자동차운송·AI디자인, 금속·도자공예",
    gun: "가",
    silgi: "기초소양",
    method: [
      "[일괄합산] 수능 60% + 기초조형평가 40%",
      "[단계별] 1단계 수능 60% + 기초조형 40%(5배수) → 2단계 1단계성적 80% + 사고력평가 20%",
    ],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초조형평가 — 관찰하고 그리기 (대상을 관찰·표현하는 조형 능력 평가)",
    paper: "3절",
    duration: "5시간",
    majors: [
      { name: "공업디자인", quota: 21, rate: 2.67, stageTag: "일괄합산" },
      { name: "공간디자인", quota: 24, rate: 3.18, stageTag: "일괄합산" },
      { name: "시각디자인", quota: 9, rate: 3.5, stageTag: "단계별·사고력평가" },
      { name: "금속공예", quota: 16, rate: 5.13, stageTag: "단계별·사고력평가" },
      { name: "도자공예", quota: 15, rate: 5.13, stageTag: "단계별·사고력평가" },
      { name: "의상디자인", quota: 22, rate: 3.59, stageTag: "단계별·사고력평가" },
      { name: "영상디자인", quota: 20, rate: 3.74, stageTag: "단계별·사고력평가" },
      { name: "자동차운송디자인", quota: 18, rate: 3.44, stageTag: "단계별·사고력평가" },
      { name: "AI디자인", quota: 12, rate: 3.23, stageTag: "단계별·사고력평가" },
    ],
    note: "공업·공간디자인은 일괄합산, 그 외 7개 학과는 단계별로 2단계에서 사고력평가 20%가 추가됩니다.",
  },
  {
    id: "skku-ga",
    university: "성균관대학교",
    units: "디자인학과(시각디자인·써피스디자인)",
    gun: "가",
    silgi: "기초소양",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초실기소양평가 — ①정밀소묘 ②사고의 이미지화",
    paper: "4절(2장)",
    duration: "5시간",
    majors: [
      {
        name: "디자인학과 (시각디자인·써피스디자인 통합)",
        quota: 38,
        rate: null,
      },
    ],
    note: "2026학년도부터 시각디자인·써피스디자인을 디자인학과로 통합해 38명 선발합니다. 통합 전형이라 지원 풀이 하나이므로 경쟁률도 하나입니다. 전공을 나눠 뽑던 2025학년도 경쟁률(참고)은 시각디자인 3.95:1, 써피스디자인 9.32:1이었습니다.",
  },
  {
    id: "uos-ga",
    university: "서울시립대학교",
    units: "디자인학과(시각디자인·산업디자인)",
    gun: "가",
    silgi: "자체실기",
    method: ["1단계 수능 100% (6배수 선발)", "2단계 수능 40% + 실기 50% + 면접 10%"],
    ratio: { suneung: 40, silgi: 50, etc: 10, etcLabel: "면접" },
    practical: "통합실기",
    paper: "3절",
    duration: "4시간",
    majors: [
      { name: "시각디자인", quota: 14, rate: 6.13 },
      { name: "산업디자인", quota: 15, rate: 7.79 },
    ],
    tags: ["단계별 전형"],
  },
  {
    id: "korea-design",
    university: "고려대학교",
    units: "디자인조형학부",
    gun: "가",
    silgi: "기초소양",
    method: [
      "수능 70% + 실기 30% 일괄합산",
      "수능 반영영역: 국어 + 탐구 2과목 (영어·한국사 등급별 감점)",
    ],
    ratio: { suneung: 70, silgi: 30 },
    practical: "발상과 표현 (제시 자료를 관찰·해석해 창의적으로 표현)",
    paper: "4절",
    duration: "4시간",
    majors: [
      { name: "디자인조형학부 (일반)", quota: 35, rate: 6.46 },
      { name: "디자인조형학부 (농어촌학생)", quota: 2, rate: 3.5 },
      { name: "디자인조형학부 (사회배려자)", quota: 1, rate: 6.0 },
    ],
    tags: ["발상과 표현", "실기 30%"],
    note: "정시에는 수능 최저학력기준이 없으며, 지정 응시영역(국어·탐구) 충족과 영어·한국사 등급별 감점제가 적용됩니다. 최근 3년 출제 — 커터칼·손·타자기(2023) / 피아노 건반·구름·연필(2024) / 불·톱니바퀴·목장갑(2025).",
  },
  {
    id: "sookmyung-ga",
    university: "숙명여자대학교",
    units: "시각·영상디자인, 산업디자인, 환경디자인, 공예",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "3절",
    duration: "5시간",
    majors: [
      { name: "시각·영상디자인과", quota: 28, rate: 2.46 },
      { name: "산업디자인과", quota: 16, rate: 3.88 },
      { name: "환경디자인과", quota: 15, rate: 4.6 },
      { name: "공예과", quota: 23, rate: 6.13 },
    ],
    tags: ["여대"],
  },
  {
    id: "swu-ga",
    university: "서울여자대학교",
    units: "산업디자인, 공예(컬렉터블디자인)",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "4절",
    duration: "4시간",
    majors: [
      { name: "산업디자인학과", quota: 15, rate: 6.47 },
      { name: "공예_컬렉터블디자인 (아트앤디자인스쿨)", quota: 13, rate: 11.08 },
    ],
    tags: ["여대"],
  },
  {
    id: "skuniv-ga",
    university: "서경대학교",
    units: "디자인학부(비주얼디자인·라이프스타일디자인)",
    gun: "가",
    silgi: "선택실기",
    method: ["수능 20% + 실기 80% 일괄합산"],
    ratio: { suneung: 20, silgi: 80 },
    practical: "발상과 표현 · 기초디자인 중 택1",
    paper: "4절",
    duration: "4시간",
    majors: [
      { name: "VD 비주얼디자인", quota: 23, rate: 20.09 },
      { name: "LF 라이프스타일디자인", quota: 23, rate: 21.61 },
    ],
    tags: ["실기 80%", "택1"],
    note: "실기 비중이 80%로 매우 높아 실기 완성도가 당락을 크게 좌우합니다. 발상과 표현으로도 지원할 수 있습니다.",
  },
  {
    id: "syu-ga",
    university: "삼육대학교",
    units: "아트앤디자인학과",
    gun: "가",
    silgi: "선택실기",
    method: ["수능 51% + 실기 49% 일괄합산"],
    ratio: { suneung: 51, silgi: 49 },
    practical: "기초디자인 · 발상과 표현 · 기초소양 중 택1",
    paper: "4절 (화지 본교 준비)",
    duration: "4시간",
    majors: [{ name: "아트앤디자인학과", quota: 15, rate: 28.73 }],
    tags: ["택1", "발상과 표현"],
    note: "주제는 고사 당일 발표되며, 화지는 본교에서 준비합니다. 콜라주(색칠 이외 부착물)는 금지입니다.",
  },
  {
    id: "konkuk-ga",
    university: "건국대학교",
    campus: "서울",
    units: "영상학과",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "화용지(당일 제시)",
    duration: "미정",
    majors: [{ name: "영상학과", quota: 35, rate: 12.63 }],
    note: "건국대는 학과별로 가·나·다군에 나뉘어 있어 한 학교에 두 번 이상 지원할 수 있습니다.",
  },

  /* ─────────────── 나군 ─────────────── */
  {
    id: "snu-art",
    university: "서울대학교",
    units: "디자인과, 공예, 서양화과",
    gun: "나",
    silgi: "자체실기",
    method: [
      "1단계 수능 100% (5배수 선발)",
      "2단계 1단계성적 40% + 실기 30% + 면접 30%",
    ],
    ratio: { suneung: 40, silgi: 30, etc: 30, etcLabel: "면접" },
    practical: "주어진 주제를 제시된 재료로 표현",
    paper: "미정",
    duration: "6시간",
    majors: [
      { name: "서양화과", quota: 20, rate: 5.67 },
      { name: "공예과", quota: 15, rate: 6.19 },
      { name: "디자인과", quota: 21, rate: 6.62, duration: "4시간" },
    ],
    tags: ["단계별 전형", "면접 반영"],
    note: "디자인과 실기는 4시간, 서양화·공예는 6시간입니다. 전공별 실기 종목이 다릅니다.",
  },
  {
    id: "hongik-art",
    university: "홍익대학교",
    units: "미술대학 자율전공, 디자인학부, 미술학부",
    gun: "나",
    silgi: "비실기",
    method: [
      "1단계 수능 100%로 일정 배수 선발",
      "2단계 수능 60% + 서류평가 40%(학생부·미술활동보고서)",
      "심층면접 실시",
    ],
    ratio: { suneung: 60, silgi: 0, etc: 40, etcLabel: "서류" },
    tags: ["실기 없음", "미술활동보고서"],
    note: "그림 연습보다 수능 성적과 미술활동보고서 관리가 우선입니다.",
  },
  {
    id: "seoultech-na",
    university: "서울과학기술대학교",
    units: "디자인학과(산업·시각), 금속공예디자인, 도예학과",
    gun: "나",
    silgi: "기초디자인",
    method: [
      "1단계 수능 100% (4배수 선발)",
      "2단계 1단계성적 60% + 실기 40% (도예학과는 50% + 50%)",
    ],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "3절",
    duration: "5시간",
    majors: [
      { name: "디자인학과 산업디자인", quota: 26, rate: 5.04 },
      { name: "디자인학과 시각디자인", quota: 31, rate: 4.53 },
      { name: "금속공예디자인학과", quota: 19, rate: 5.58 },
      { name: "도예학과", quota: 21, rate: 6.55, stageTag: "실기 50%" },
    ],
    tags: ["단계별 전형"],
    note: "1단계 수능 100%로 4배수를 뽑습니다. 도예학과만 2단계 실기 비중이 50%입니다.",
  },
  {
    id: "sejong-na",
    university: "세종대학교",
    units: "패션디자인학과",
    gun: "나",
    silgi: "기초디자인",
    method: ["학생부 20% + 수능 50% + 실기 30% 일괄합산"],
    ratio: { suneung: 50, silgi: 30, etc: 20, etcLabel: "학생부" },
    practical: "기초디자인",
    paper: "3절(48.5×64cm)",
    duration: "5시간",
    majors: [{ name: "패션디자인학과", quota: 14, rate: 4.14 }],
  },
  {
    id: "konkuk-na",
    university: "건국대학교",
    campus: "서울",
    units: "커뮤니케이션디자인, 의상디자인, 리빙디자인",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "화용지(당일 제시)",
    duration: "미정",
    majors: [
      { name: "커뮤니케이션디자인학과", quota: 39, rate: 13.87 },
      { name: "의상디자인학과(예체능)", quota: 17, rate: 11.71 },
      { name: "리빙디자인학과", quota: 45, rate: 11.62 },
    ],
  },
  {
    id: "swu-na",
    university: "서울여자대학교",
    units: "아트앤디자인스쿨 시각디자인",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "4절",
    duration: "4시간",
    majors: [{ name: "시각디자인", quota: 16, rate: 8.38 }],
    tags: ["여대"],
  },
  {
    id: "duksung-na",
    university: "덕성여자대학교",
    units: "Art&Design대학(기초디자인·기초소양 전형)",
    gun: "나",
    silgi: "선택실기",
    method: ["수능 20% + 실기 80% 일괄합산"],
    ratio: { suneung: 20, silgi: 80 },
    practical: "기초디자인 / 기초소양 중 택1",
    paper: "3절",
    duration: "5시간",
    majors: [
      { name: "기초디자인 전형", quota: 18, rate: 23.22 },
      { name: "기초소양 전형", quota: 5, rate: 21.2 },
    ],
    tags: ["여대", "택1", "실기 80%"],
  },
  {
    id: "sangmyung-na",
    university: "상명대학교",
    campus: "서울",
    units: "미술학부 생활예술전공",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 20% + 실기 80% 일괄합산"],
    ratio: { suneung: 20, silgi: 80 },
    practical: "기초디자인",
    paper: "3절(가로)",
    duration: "5시간",
    majors: [
      { name: "생활예술", quota: null, quotaNote: "수시 이월 인원으로 선발", rate: null },
    ],
    tags: ["실기 80%"],
    note: "정시 모집인원이 수시 이월로 정해져 사전 확정 인원·경쟁률이 없습니다.",
  },

  /* ─────────────── 다군 ─────────────── */
  {
    id: "konkuk-da",
    university: "건국대학교",
    campus: "서울",
    units: "산업디자인학과",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "화용지(당일 제시)",
    duration: "미정",
    majors: [{ name: "산업디자인학과", quota: 34, rate: 20.91 }],
    note: "다군은 모집인원이 적어 경쟁률·합격선 변동이 큽니다.",
  },
  {
    id: "sungshin-da",
    university: "성신여자대학교",
    units: "디자인과",
    gun: "다",
    silgi: "선택실기",
    method: ["수능 55% + 실기 45% 일괄합산"],
    ratio: { suneung: 55, silgi: 45 },
    practical: "기초디자인 / 소묘 / 기초조형 중 택1",
    paper: "4절(54×39cm)",
    duration: "4시간",
    majors: [{ name: "디자인과", quota: 42, rate: 12.97 }],
    tags: ["여대", "택1"],
  },
  {
    id: "dongduk-da",
    university: "동덕여자대학교",
    units: "시각·실내·미디어디자인, 디지털공예, 패션디자인(주·야)",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "4절",
    duration: "4시간",
    majors: [
      { name: "시각디자인", quota: 12, rate: 6.09 },
      { name: "실내디자인", quota: 11, rate: 8.73 },
      { name: "미디어디자인전공", quota: 12, rate: 6.91 },
      { name: "디지털공예전공", quota: 11, rate: 9.4 },
      { name: "패션디자인전공(주간)", quota: 16, rate: 5.27 },
      { name: "패션디자인전공(야간)", quota: 15, rate: 10.57 },
    ],
    tags: ["여대"],
  },
  {
    id: "mju-da",
    university: "명지대학교",
    campus: "서울",
    units: "디지털콘텐츠디자인학과",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 60% + 실기 40% 일괄합산"],
    ratio: { suneung: 60, silgi: 40 },
    practical: "기초디자인",
    paper: "4절",
    duration: "4시간",
    majors: [{ name: "디지털콘텐츠디자인학과", quota: 8, rate: 19.25 }],
    note: "다군 소수 모집이라 경쟁률이 높게 형성됩니다.",
  },

  /* ─────────────── 군 외 ─────────────── */
  {
    id: "karts-art",
    university: "한국예술종합학교",
    campus: "미술원",
    units: "조형예술과, 디자인과, 건축과",
    gun: "별도",
    silgi: "자체실기",
    method: [
      "가·나·다군과 무관한 자체 일정으로 선발",
      "1차 서류·실기, 2차 실기·면접 등 학과별 단계 전형",
    ],
    tags: ["수능 미반영 전형 있음", "추가 지원 기회"],
    note: "문화체육관광부 소속 특수학교라 가나다군 3장의 카드와 별개로 지원할 수 있습니다. 전형 일정과 방법이 학과마다 크게 다릅니다.",
  },
];

/** 모집군·전형이 확정되지 않아 카드로 싣지 않은 대학 */
export const pendingUniversities: {
  university: string;
  units: string;
  reason: string;
}[] = [
  {
    university: "인하대학교",
    units: "디자인테크놀로지학과",
    reason:
      "학과 개편에 따라 2027학년도 실기 반영 여부가 시행계획 이후 조정될 예정입니다.",
  },
];
