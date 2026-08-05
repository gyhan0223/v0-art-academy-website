/**
 * 강사진 데이터 단일 소스.
 * 페이지(/teachers)·네비게이션·사이트맵이 전부 이 파일만 참조한다.
 * 강사가 들고 나면 컴포넌트는 건드리지 않고 이 파일만 고치면 된다.
 *
 * ── 이 페이지가 지키는 원칙 ─────────────────────────────────────
 * 1. 한 줄 헤드라인(headline)이 카드의 주인공이다.
 *    "전) 대성학원 / 전) 청솔학원"은 모든 재수학원이 똑같이 쓰는 줄이라
 *    아홉 명을 나란히 놓으면 아무도 구분하지 못한다.
 *    이 강사가 "무엇을 해결해 주는 사람인지" 한 문장으로 먼저 말한다.
 * 2. 경력은 최대 4줄(MAX_CAREERS). 6~7줄은 아무도 읽지 않는다.
 *    - "현) 아름다운학원" 류의 당연한 줄은 넣지 않는다. 이 페이지가 곧 소속이다.
 *    - 오래된 브랜드명(예: 올래(olleh) KT — 10년도 더 전에 사라진 이름)은
 *      실력 증명이 아니라 "옛날 사람" 신호로 읽히므로 넣지 않는다.
 * 3. 기숙 과정에서 학부모가 가장 먼저 묻는 것은 "우리 애 볼 시간이 있나"다.
 *    그래서 소속 형태(residency)를 숨기지 않고 카드에 박아 둔다.
 *    타 학원 현직을 함께 쓰면서 상주라고 적으면 그 자리에서 신뢰를 잃는다.
 * 4. 미대 특화(mihakNote) 한 줄을 넣는다. 이게 없으면 일반 재수학원
 *    강사진과 완전히 똑같이 보인다.
 * ───────────────────────────────────────────────────────────────
 *
 * ── 값의 근거 ─────────────────────────────────────────────────
 * · 경력·학력 줄 — 기존 강사 소개 자료 그대로.
 * · headline — 그 경력만 근거로 쓴 문장. 사실 주장이 아니라 수업 방식
 *   설명이므로, 문구가 마음에 들지 않으면 이 필드만 고치면 된다.
 * · residency — 원장 확인 결과, 본원에 상주하는 사람은 실기(한동희) 한 명뿐이고
 *   학과 강사는 전원 담당 수업 시간에 들어오는 출강이다. 그래서 학과 아홉 명은
 *   모두 "visiting"이다. 근무 형태가 바뀌면 해당 줄만 고치면 카드 뱃지와
 *   상단 숫자(getFacultyCount)가 따라 바뀐다.
 * · 미대 특화 — 강사별 연차는 자료가 없어 숫자를 쓰지 않았다. 대신 과목
 *   섹션에 "미대 지원자 대상 편성"을 표시한다(SUBJECT_NOTE).
 *   개인 연차가 확인되면 mihakNote에 "미대 입시반 지도 12년" 식으로 넣으면
 *   카드에 칩으로 붙는다.
 * ───────────────────────────────────────────────────────────────
 */

/* ------------------------------- 공개 스위치 ------------------------------- */

/**
 * 페이지를 아직 공개 전(초안) 상태로 둘지 여부.
 * true  — 상단 안내 배너 표시 · noindex · 사이트맵 제외 · 네비 "준비중" 뱃지
 * false — 정식 공개
 *
 * 지금은 false(공개). 강사 문구를 다시 손볼 동안 검색에 노출하고 싶지
 * 않으면 이 값만 true로 되돌리면 된다.
 */
export const IS_PLACEHOLDER = false;

/** 카드에 표시할 경력 최대 줄 수. 넘치면 코드가 알아서 잘라낸다. */
export const MAX_CAREERS = 4;

/* --------------------------------- 타입 --------------------------------- */

/**
 * 과목.
 * 수학이 없는 이유 — 미대 정시는 대부분 국어·영어·탐구만 반영한다.
 * (lib/grade-cases.ts의 Subject와 같은 기준)
 */
export type TeacherSubject = "국어" | "영어" | "사회탐구" | "실기";

/**
 * 소속 형태. 기숙 과정에서는 이게 경력보다 중요한 정보다.
 * resident    — 본원 상주 전임. 정규 수업 외 질문·보충까지 가능한 강사.
 * visiting    — 출강. 담당 수업 시간에 들어온다.
 * unconfirmed — 확인 전. 카드에 아무것도 표시하지 않는다(추측해서 적지 않는다).
 */
export type Residency = "resident" | "visiting" | "unconfirmed";

export const RESIDENCY_LABEL: Record<Exclude<Residency, "unconfirmed">, string> =
  {
    resident: "본원 상주 전임",
    visiting: "출강",
  };

export interface Teacher {
  /** 사진 파일명과 맞춘 식별자 */
  id: string;
  name: string;
  subject: TeacherSubject;
  /** 직함 — 대표처럼 별도 직함이 있을 때만 */
  role?: string;
  /**
   * 카드에서 유일하게 기억에 남는 한 줄.
   * "이 강사가 무엇을 해결해 주는가"를 한 문장으로. 수식어보다 동작을 쓴다.
   */
  headline: string;
  /**
   * 미대 특화 한 줄. 일반 재수학원 강사진과 구분되는 지점.
   * 예: "미대 입시반 지도 12년", "미대 지원자 전용 사탐 커리큘럼 설계"
   */
  mihakNote?: string;
  /** 소속 형태 */
  residency: Residency;
  /** 소속 형태에 붙는 단서 — 예: "주 5일 상주", "주 2회 출강" */
  residencyNote?: string;
  /** 최대 MAX_CAREERS줄. 센 것부터. 학력 → 대표 경력 → 저서 순이 읽기 좋다. */
  careers: string[];
  /** /public/images/teachers/ 아래 파일. 없으면 이름 첫 글자 원형으로 대체된다. */
  photoSrc?: string;
}

/* ------------------------------- 강사 데이터 ------------------------------- */

/**
 * 경력·학력 줄은 기존 강사 소개 자료에서 그대로 옮긴 것이다.
 *
 * 옮기면서 뺀 줄과 이유:
 * · "현) 아름다운학원 …" 전원 — 이 페이지가 곧 소속이라 아홉 번 반복될 뿐이다.
 * · 김준범 "현) 올래(olleh)KT TV 외국어 영역 강의" — olleh는 KT가 10년도 더 전에
 *   쓰던 브랜드다. 실력 증명이 아니라 연식 신호로 읽힌다.
 * · 김준범 "아름다운학원 대치본원" — 본원은 대치가 아니라 홍대앞(마포구
 *   와우산로23길 9, 02-338-3302)이다. 다른 학원 자료를 옮겨 온 흔적으로
 *   보여 뺐다. 대치에 별도 캠퍼스가 생기면 그때 careers에 다시 넣으면 된다.
 */
export const TEACHERS: Teacher[] = [
  /* ---------------------------------- 국어 ---------------------------------- */
  {
    id: "kim-jijung",
    name: "김지중",
    subject: "국어",
    headline: "출제자 쪽에 서 봤기 때문에, 지문에서 문제가 나올 자리를 먼저 짚습니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "전국연합모의고사 출제위원",
      "전) 서초 메가스터디학원",
      "전) 강북 중앙학원",
    ],
    photoSrc: "/images/teachers/teacher-kim-jijung.jpg",
  },
  {
    id: "song-chunggi",
    name: "송충기",
    subject: "국어",
    headline:
      "기출을 출제 의도 단위로 쪼개, 처음 보는 지문에서도 같은 방식이 통하게 만듭니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "전국연합모의고사 출제위원",
      "전) 노량진 대성학원",
      "전) 강남 대한민국학원",
    ],
    photoSrc: "/images/teachers/teacher-song-chunggi.jpg",
  },
  {
    id: "no-hwajin",
    name: "노화진",
    subject: "국어",
    headline:
      "문학에서 점수가 흔들리는 학생을, 감상이 아니라 근거로 푸는 쪽으로 돌려놓습니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "고려대학교 국어국문학 전공",
      "전) 대성학원",
      "전) 정일에듀학원 · 제일학원",
      "전) 탑클래스학원",
    ],
    photoSrc: "/images/teachers/teacher-no-hwajin.jpg",
  },

  /* ---------------------------------- 영어 ---------------------------------- */
  {
    id: "son-jongseok",
    name: "손종석",
    subject: "영어",
    headline:
      "해석은 되는데 답이 틀리는 구간, 문장이 아니라 글의 논리에서 원인을 찾습니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "고려대학교 영어영문학과",
      "캘리포니아주립대 영어교육학",
      "코리아헤럴드 영자신문 교육부",
      "전) 대치동 W입시사관학교",
    ],
    photoSrc: "/images/teachers/teacher-son-jongseok.jpg",
  },
  {
    id: "kim-junbeom",
    name: "김준범",
    subject: "영어",
    headline:
      "재수 종합반에서 다듬은 구문·어법 정리로, 독해 속도부터 정상으로 돌립니다.",
    // 학과 강사는 전원 출강. 종로학원 강북본원 현직이 함께 적혀 있어 더더욱
    // 상주라고 쓸 수 없다 — 타 학원 현직과 상주를 같이 적으면 그 자리에서 신뢰를 잃는다.
    residency: "visiting",
    careers: [
      "고려대학교 영어영문학과 졸업",
      "현) 종로학원 강북본원 영어과",
      "전) 강동 대일학원",
    ],
    photoSrc: "/images/teachers/teacher-kim-junbeom.jpg",
  },
  {
    id: "park-sehee",
    name: "박세희",
    subject: "영어",
    headline:
      "어학원에서 쌓은 감각으로 어휘·듣기까지, 남들이 버리고 가는 배점을 챙깁니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "The University of Sydney 졸업",
      "전) 스카이에듀학원",
      "전) 하이스트학원",
      "전) 정상어학원 · 미래어학원",
    ],
    photoSrc: "/images/teachers/teacher-park-sehee.jpg",
  },

  /* -------------------------------- 사회탐구 -------------------------------- */
  {
    id: "park-jeongsik",
    name: "박정식",
    subject: "사회탐구",
    headline: "기출 문제집을 쓴 사람이, 그 기출 중 무엇을 풀지 직접 골라 줍니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "저서: 자이스토리 사회문화·정치와법",
      "저서: 네비게이션 사회문화·정치와법",
      "전) 대성학원 전임강사",
      "전) 이투스학원 · 청솔학원 전임강사",
    ],
    photoSrc: "/images/teachers/teacher-park-jeongsik.jpg",
  },
  {
    id: "lim-seongjun",
    name: "임성준",
    subject: "사회탐구",
    headline: "법학 전공자의 개념 정리로, 사탐 용어를 암기가 아니라 이해로 바꿉니다.",
    residency: "visiting", // 학과 강사는 전원 출강 — 상주는 실기(한동희)뿐
    careers: [
      "성균관대학교 법학 전공",
      "전) 대성학원",
      "전) 청솔학원",
      "전) 중앙학원 · 한국학원",
    ],
    // 사진 없음 — 기존 사진이 캐리커처라 아홉 명 중 혼자 튀었다. 옮겨오지 않았다.
    // 실사 프로필을 아래 경로(288×288 정방형)에 넣고 주석을 풀 것.
    // photoSrc: "/images/teachers/teacher-lim-seongjun.jpg",
  },
  {
    id: "lee-myeongsin",
    name: "이명신",
    subject: "사회탐구",
    headline:
      "개념 → 기출 → 실전을 같은 주기로 반복시켜, 사탐 점수의 진폭을 줄입니다.",
    // 학과 강사는 전원 출강. 스카이에듀 사회탐구영역 현직도 함께 적혀 있다.
    residency: "visiting",
    careers: [
      "고려대학교 졸업",
      "현) 스카이에듀 사회탐구영역",
      "전) 서초 종로학원 · 하이퍼리뷰학원",
      "전) 노량진 위너스터 · 부천 늘푸른학원",
    ],
    photoSrc: "/images/teachers/teacher-lee-myeongsin.jpg",
  },

  /* ---------------------------------- 실기 ---------------------------------- */
  {
    id: "han-donghee",
    name: "한동희",
    subject: "실기",
    role: "대표",
    headline:
      "1989년부터 미대 실기만 가르쳐 온 사람이, 학생 그림의 방향을 직접 잡습니다.",
    mihakNote: `미대 실기 지도 ${new Date().getFullYear() - 1989}년`,
    // 강사진 중 유일한 상주. 2004년 개원 이후 홍대 본원을 직접 운영 중이다(아래 경력 참고).
    residency: "resident",
    residencyNote: "홍대 본원",
    careers: [
      "홍익대학교 시각디자인 학사 · 동 대학원 석사",
      "1989년 푸른솔 미술학원에서 미대 실기 지도 시작",
      "전) ipsa 미대기숙학원 · 화력푸른솔 · 한국조형폴리오",
      "2004년 홍대앞 모두다른고양이 미술학원 개원 · 현재까지 운영",
    ],
    photoSrc: "/images/teachers/teacher-han-donghee.jpg",
  },
];

/* -------------------------------- 파생 유틸 -------------------------------- */

/** 페이지에 나오는 순서. 학과가 먼저, 실기가 뒤. */
export const SUBJECT_ORDER: TeacherSubject[] = [
  "국어",
  "영어",
  "사회탐구",
  "실기",
];

/**
 * 과목 제목 옆에 붙는 미대 특화 표시.
 * 이 한 줄이 없으면 일반 재수학원 강사진과 완전히 똑같이 보인다.
 * 학과 세 과목은 미대 지원자만 모아 편성한 반이라는 사실이 핵심이다.
 */
export const SUBJECT_NOTE: Record<TeacherSubject, string> = {
  국어: "미대 지원자 대상 편성",
  영어: "미대 지원자 대상 편성",
  사회탐구: "미대 지원자 대상 편성",
  실기: "지원 대학 실기 유형별",
};

export const SUBJECT_DESC: Record<TeacherSubject, string> = {
  국어: "독서·문학의 근거 찾는 법을 고정시켜, 지문이 바뀌어도 점수가 덜 흔들리게 합니다.",
  영어: "구문·독해 루틴을 정리하고 실전 시간 배분까지 같이 잡습니다.",
  사회탐구: "개념 → 기출 → 실전을 반복 구조로 돌려 취약 단원을 빠르게 메웁니다.",
  실기: "학과 성적으로 갈 수 있는 대학이 정해진 뒤, 그 대학의 실기 유형에 맞춰 그림을 맞춥니다.",
};

export function getTeachersBySubject(subject: TeacherSubject): Teacher[] {
  return TEACHERS.filter((t) => t.subject === subject);
}

/** 경력은 어떤 경우에도 MAX_CAREERS줄을 넘기지 않는다. */
export function getCareers(teacher: Teacher): string[] {
  return teacher.careers.slice(0, MAX_CAREERS);
}

/** 상단 요약용 — 학과 몇 명, 실기 몇 명, 그중 상주 몇 명. */
export function getFacultyCount() {
  const practical = TEACHERS.filter((t) => t.subject === "실기").length;
  return {
    total: TEACHERS.length,
    academic: TEACHERS.length - practical,
    practical,
    /** 기숙 과정에서 가장 먼저 읽혀야 하는 숫자 */
    resident: TEACHERS.filter((t) => t.residency === "resident").length,
  };
}
