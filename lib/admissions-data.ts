// 대학별 최종 합격자 명단.
// 합격자 성명은 개인정보보호를 위해 마스킹 처리되어 있습니다.
export type Admittee = {
  major: string;
  name: string;
};

export type AdmissionList = {
  year: string;
  admittees: Admittee[];
};

/** 가장 최근에 마감된 입시 연도 — "작년 합격자" 표기의 단일 기준 */
export const RECENT_YEAR = "2026학년도";

/** 대학별 합격 실적 카드. 메인(Scene2)·윈터스쿨 실적 섹션이 함께 사용한다. */
export type UniversityCard = {
  name: string;
  /** 누적 합격자 수 */
  total: string;
  /** RECENT_YEAR 합격자 수 */
  recent: string;
  /** 배경 워터마크 로고. 이미지가 준비되지 않은 대학은 생략한다. */
  logo?: string;
  color: string;
  logoSize: { mobile: string; desktop: string };
  logoOpacity: string;
  scale: number;
};

export const universityCards: UniversityCard[] = [
  {
    name: "서울대학교",
    total: "252",
    recent: "5",
    logo: "/images/logo-snu.png",
    color: "#1D418A",
    logoSize: { mobile: "120vw", desktop: "80vw" },
    logoOpacity: "opacity-10",
    scale: 1,
  },
  {
    name: "홍익대학교",
    total: "792",
    recent: "28",
    logo: "/images/logo-hongik.png",
    color: "#9C1F22",
    logoSize: { mobile: "150vw", desktop: "150vw" },
    logoOpacity: "opacity-10",
    scale: 1.6,
  },
  {
    name: "국민대학교",
    total: "438",
    recent: "22",
    logo: "/images/logo-kookmin.png",
    color: "#0054A6",
    logoSize: { mobile: "110vw", desktop: "70vw" },
    logoOpacity: "opacity-25", // 가독성을 위해 투명도 상향 유지
    scale: 1,
  },
  {
    name: "이화여자대학교",
    total: "530",
    recent: "9",
    logo: "/images/logo-ewha.png",
    color: "#004933",
    logoSize: { mobile: "130vw", desktop: "85vw" },
    logoOpacity: "opacity-30", // 가독성을 위해 투명도 상향 유지
    scale: 1,
  },
  {
    name: "건국대학교",
    total: "402",
    recent: "16",
    logo: "/images/logo-konkuk.png",
    color: "#007346",
    logoSize: { mobile: "120vw", desktop: "80vw" },
    logoOpacity: "opacity-25", // 가는 선으로 된 인장이라 투명도 상향
    scale: 1,
  },
];

export const admissionLists: Record<string, AdmissionList> = {
  서울대학교: {
    year: "2026학년도",
    admittees: [
      { major: "공예", name: "박00" },
      { major: "공예", name: "이00" },
      { major: "디자인과", name: "김00" },
      { major: "디자인과", name: "이00" },
      { major: "디자인과", name: "한00" },
    ],
  },
  홍익대학교: {
    year: "2026학년도",
    admittees: [
      { major: "디자인학부", name: "전00" },
      { major: "디자인학부", name: "김00" },
      { major: "디자인학부", name: "이00" },
      { major: "디자인학부", name: "이00" },
      { major: "디자인학부", name: "이00" },
      { major: "디자인학부", name: "한00" },
      { major: "디자인학부", name: "조00" },
      { major: "디자인학부", name: "정00" },
      { major: "디자인학부", name: "김00" },
      { major: "자율전공", name: "박00" },
      { major: "자율전공", name: "강00" },
      { major: "자율전공", name: "전00" },
      { major: "자율전공", name: "소0" },
      { major: "자율전공", name: "이00" },
      { major: "자율전공", name: "전00" },
      { major: "자율전공", name: "서00" },
      { major: "자율전공", name: "이00" },
      { major: "서양화", name: "조00" },
      { major: "서양화", name: "성00" },
      { major: "목조형가구", name: "박00" },
      { major: "목조형가구", name: "박00" },
      { major: "의상디자인학부", name: "이00" },
      { major: "의상디자인학부", name: "안00" },
      { major: "디자인컨버전스", name: "박00" },
      { major: "디자인컨버전스", name: "임00" },
      { major: "디자인컨버전스", name: "양00" },
      { major: "디자인컨버전스", name: "박00" },
      { major: "디자인컨버전스", name: "권00" },
    ],
  },
  국민대학교: {
    year: "2026학년도",
    admittees: [
      { major: "시각디자인과", name: "박00" },
      { major: "시각디자인과", name: "김00" },
      { major: "공간디자인과", name: "김00" },
      { major: "공간디자인과", name: "박00" },
      { major: "의상디자인과", name: "정00" },
      { major: "의상디자인과", name: "이00" },
      { major: "의상디자인과", name: "정00" },
      { major: "의상디자인과", name: "한00" },
      { major: "영상디자인과", name: "박0" },
      { major: "영상디자인과", name: "이00" },
      { major: "영상디자인과", name: "서00" },
      { major: "자동차운송디자인과", name: "양00" },
      { major: "자동차운송디자인과", name: "양00" },
      { major: "자동차운송디자인과", name: "양00" },
      { major: "자동차운송디자인과", name: "양00" },
      { major: "금속공예", name: "전00" },
      { major: "금속공예", name: "이00" },
      { major: "금속공예", name: "김00" },
      { major: "금속공예", name: "윤0" },
      { major: "도자공예", name: "조00" },
      { major: "도자공예", name: "이00" },
      { major: "도자공예", name: "김00" },
    ],
  },
  이화여자대학교: {
    year: "2026학년도",
    admittees: [
      { major: "디자인학부", name: "김00" },
      { major: "디자인학부", name: "이00" },
      { major: "디자인학부", name: "박00" },
      { major: "디자인학부", name: "한00" },
      { major: "디자인학부", name: "강00" },
      { major: "디자인학부", name: "이00" },
      { major: "패션디자인전공", name: "김00" },
      { major: "패션디자인전공", name: "이00" },
      { major: "패션디자인전공", name: "조00" },
    ],
  },
  건국대학교: {
    year: "2026학년도",
    admittees: [
      { major: "커뮤니케이션디자인", name: "김00" },
      { major: "커뮤니케이션디자인", name: "이00" },
      { major: "산업디자인", name: "김00" },
      { major: "산업디자인", name: "조00" },
      { major: "산업디자인", name: "박00" },
      { major: "리빙디자인", name: "조00" },
      { major: "리빙디자인", name: "이00" },
      { major: "패션디자인", name: "윤0" },
      { major: "패션디자인", name: "김00" },
      { major: "의상디자인", name: "이00" },
      { major: "의상디자인", name: "정00" },
      { major: "의상디자인", name: "강00" },
      { major: "조형예술", name: "박00" },
      { major: "조형예술", name: "김00" },
      { major: "영상디자인", name: "유0" },
      { major: "시각영상디자인", name: "이00" },
    ],
  },
};
