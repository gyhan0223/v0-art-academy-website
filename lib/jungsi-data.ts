// 2027학년도 미대 정시 모집군 · 전형방법 · 실기유형 데이터.
//
// ⚠️ 확인 필요
// 아래 값들은 각 대학이 발표한 대학입학전형 시행계획을 기준으로 정리한
// 초안입니다. 모집군·반영비율·실기유형은 최종 모집요강(2026년 9월경 발표)에서
// 바뀔 수 있고, 학과 단위로 다른 경우도 많습니다.
// 페이지를 공개하기 전에 각 대학 입학처 자료로 한 줄씩 대조하세요.

export type Gun = "가" | "나" | "다" | "별도";

export type SilgiType = "기초소양" | "기초디자인" | "비실기" | "자체실기";

export const GUN_ORDER: Gun[] = ["가", "나", "다", "별도"];

export const SILGI_META: Record<
  SilgiType,
  { label: string; short: string; description: string }
> = {
  기초소양: {
    label: "기초소양평가",
    short: "기초소양",
    description:
      "주제어를 보고 아이디어를 도출해 화면으로 풀어내는 유형입니다. 사물 묘사력보다 발상과 전개 과정을 봅니다. 서울대·홍익대 등 상위권 대학이 주로 채택하는 유형입니다.",
  },
  기초디자인: {
    label: "기초디자인",
    short: "기초디자인",
    description:
      "제시된 사물과 조건으로 화면을 구성하는 유형입니다. 묘사력·구성력·완성도가 핵심이며, 가장 많은 대학이 채택하고 있습니다.",
  },
  비실기: {
    label: "비실기(서류·면접)",
    short: "비실기",
    description:
      "학교별로 문제 유형이 완전히 다른 통합·전공별 실기입니다. 기출 경향이 제각각이라 기초소양·기초디자인과는 별도의 준비 시간이 필요합니다.",
  },
  자체실기: {
    label: "대학 자체 실기",
    short: "자체실기",
    description:
      "대학이 독자 출제하는 통합·전공별 실기입니다. 기출 경향이 학교마다 달라 기초소양·기초디자인과 별도의 준비 시간이 필요합니다.",
  },
};

export type JungsiEntry = {
  id: string;
  university: string;
  /** 캠퍼스나 단과대 구분이 필요한 경우에만 (예: ERICA, 조형대학) */
  campus?: string;
  /** 해당 모집군에서 뽑는 학과·학부 */
  units: string;
  gun: Gun;
  silgi: SilgiType;
  /** 전형방법 요약. 한 줄에 한 항목. */
  method: string[];
  /** 최종 단계 기준 반영비율(%). 합이 100이 되도록. */
  ratio?: {
    suneung: number;
    silgi: number;
    etc?: number;
    etcLabel?: string;
  };
  tags?: string[];
  note?: string;
  /** 모집군·전형이 최근 변동돼 확정본 대조가 특히 필요한 경우 */
  unverified?: boolean;
};

export const jungsiEntries: JungsiEntry[] = [
  /* ─────────────── 가군 ─────────────── */
  {
    id: "snu-art",
    university: "서울대학교",
    units: "디자인과, 공예, 동양화, 서양화, 조소",
    gun: "가",
    silgi: "자체실기",
    method: [
      "1단계 수능 100%로 모집인원의 2배수 내외 선발",
      "2단계 1단계 성적 + 대학 자체 실기고사",
    ],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["2단계 전형", "교과평가 반영"],
    note: "전공별 실기 종목과 시간이 다릅니다. 학과별 세부 반영비율은 모집요강에서 확인하세요.",
    unverified: true,
  },
  {
    id: "korea-design",
    university: "고려대학교",
    units: "디자인조형학부",
    gun: "가",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가", "수능 최저학력기준 적용"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["수능 최저 있음"],
  },
  {
    id: "ewha-design",
    university: "이화여자대학교",
    units: "조형예술대학 디자인학부, 조형예술학부",
    gun: "가",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["여대"],
  },
  {
    id: "seoultech-design",
    university: "서울과학기술대학교",
    units: "디자인학과(시각·산업), 조형예술학과",
    gun: "가",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "sejong-design",
    university: "세종대학교",
    units: "디자인이노베이션전공, 회화과",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "sangmyung-design-ga",
    university: "상명대학교",
    campus: "서울",
    units: "커뮤니케이션디자인, 텍스타일디자인",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "konkuk-ga",
    university: "건국대학교",
    units: "커뮤니케이션디자인학과",
    gun: "가",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
    note: "건국대는 학과별로 모집군이 나뉘어 있어 한 학교에 두 번 이상 지원할 수 있습니다.",
  },

  /* ─────────────── 나군 ─────────────── */
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
    id: "skku-design",
    university: "성균관대학교",
    units: "디자인학과",
    gun: "나",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "uos-design",
    university: "서울시립대학교",
    units: "산업디자인학과(공업·시각)",
    gun: "나",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "cau-design",
    university: "중앙대학교",
    campus: "서울",
    units: "디자인학부(시각디자인·산업디자인·실내환경디자인)",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "khu-art",
    university: "경희대학교",
    units: "시각디자인학과, 산업디자인학과, 환경조경디자인학과",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "hanyang-erica-design",
    university: "한양대학교",
    campus: "ERICA",
    units: "커뮤니케이션디자인학과, 주얼리·패션디자인학과",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "sookmyung-design",
    university: "숙명여자대학교",
    units: "시각·영상디자인과, 환경디자인과, 산업디자인과",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["여대"],
  },
  {
    id: "konkuk-na",
    university: "건국대학교",
    units: "리빙디자인학과, 현대미술학과",
    gun: "나",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },

  /* ─────────────── 다군 ─────────────── */
  {
    id: "kookmin-design",
    university: "국민대학교",
    campus: "조형대학",
    units: "공업디자인, 시각디자인, 금속공예, 도자공예, 의상디자인, 영상디자인",
    gun: "다",
    silgi: "기초소양",
    method: ["수능 + 기초소양평가"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["다군 최상위권"],
    note: "다군은 모집인원이 적어 경쟁률과 합격선 변동이 큽니다.",
  },
  {
    id: "dankook-design",
    university: "단국대학교",
    campus: "죽전",
    units: "커뮤니케이션디자인, 패션산업디자인, 도예",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
  },
  {
    id: "swu-design",
    university: "서울여자대학교",
    units: "시각디자인전공, 산업디자인전공, 현대미술전공",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["여대"],
  },
  {
    id: "sungshin-design",
    university: "성신여자대학교",
    units: "산업디자인과, 서비스·디자인공학과, 동양화과, 서양화과",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["여대"],
  },
  {
    id: "duksung-design",
    university: "덕성여자대학교",
    units: "시각디자인전공, 실내디자인전공, 텍스타일디자인전공",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
    tags: ["여대"],
  },
  {
    id: "gachon-design",
    university: "가천대학교",
    units: "시각디자인전공, 산업디자인전공, 패션디자인전공",
    gun: "다",
    silgi: "기초디자인",
    method: ["수능 + 기초디자인"],
    ratio: { suneung: 60, silgi: 40 },
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
  {
    university: "명지대학교",
    units: "디자인학부",
    reason: "모집군과 실기유형이 최종 모집요강에서 확정됩니다.",
  },
];
