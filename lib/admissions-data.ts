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
};
