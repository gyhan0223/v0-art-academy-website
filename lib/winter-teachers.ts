/**
 * 윈터캠프 강사진 데이터 단일 소스.
 * /winter/teachers 페이지가 이 파일만 참조한다.
 *
 * ── 작성 규칙 ────────────────────────────────────────────────
 * · headline(한 줄 헤드라인)은 필수다. "이 강사가 무엇을 책임지는가"를
 *   한 문장으로 쓴다. 수식어를 늘어놓지 않는다.
 * · careers(경력)는 4줄에서 자른다. 5줄째부터는 화면에 나가지 않는다.
 *   (getCareers()가 자동으로 잘라 준다 — 중요한 것을 위에 쓸 것)
 * · resident(상주 여부)는 학부모가 가장 먼저 확인하는 정보라 배지로 뺀다.
 *   상주가 아니면 residentNote에 언제 오는지 반드시 적는다.
 * · 실명·사진은 본인 동의를 받은 뒤에만 넣는다.
 * ─────────────────────────────────────────────────────────────
 */

/* ------------------------------- 공개 스위치 ------------------------------- */

/**
 * 아직 자리표시자(샘플) 상태인지 여부.
 * true  — 페이지 상단에 "준비 중" 안내 표시 · noindex · 사이트맵 제외
 * false — 실제 강사진으로 정식 공개
 */
export const IS_PLACEHOLDER = true;

/* --------------------------------- 타입 ---------------------------------- */

export type TeacherTrack = "학과" | "실기";

export const TEACHER_TRACKS: TeacherTrack[] = ["학과", "실기"];

export interface Teacher {
  /** 고유 키 — 예: "2027-kor-01" */
  id: string;
  /** 표기명 — 예: "김○○ 선생님" */
  name: string;
  track: TeacherTrack;
  /** 담당 — 학과는 "국어"·"영어"·"탐구", 실기는 "기초디자인" 등 */
  subject: string;
  /** 한 줄 헤드라인 — 필수. 이 강사가 8주 동안 무엇을 책임지는지. */
  headline: string;
  /** 경력 — 4줄에서 잘린다. 중요한 것을 위에 쓸 것. */
  careers: string[];
  /** 캠프 기간 중 상주 여부 */
  resident: boolean;
  /** 상주가 아닐 때 언제 오는지. 예: "주말 출강" */
  residentNote?: string;
  /** 프로필 사진 — 본인 동의 후에만. 없으면 이니셜 원으로 대체된다. */
  photo?: string;
}

/** 화면에 내보낼 경력 줄 수 상한 */
export const MAX_CAREER_LINES = 4;

/** 경력은 항상 이 함수를 거쳐 화면에 나간다 — 4줄 컷 */
export function getCareers(teacher: Teacher): string[] {
  return teacher.careers.slice(0, MAX_CAREER_LINES);
}

/** 트랙별로 나눈 강사 목록 */
export function getTeachersByTrack(
  track: TeacherTrack,
  teachers: Teacher[] = TEACHERS,
): Teacher[] {
  return teachers.filter((t) => t.track === track);
}

/** 상주 배지에 쓸 문구 */
export function getResidentLabel(teacher: Teacher): string {
  if (teacher.resident) return "캠프 상주";
  return teacher.residentNote ?? "출강";
}

/* -------------------------------- 강사 데이터 ------------------------------- */

// TODO: 원장님 확인 — 아래는 전부 자리표시자.
//       실제 강사진으로 교체한 뒤 위의 IS_PLACEHOLDER를 false로 바꿔 주세요.
export const TEACHERS: Teacher[] = [
  {
    id: "sample-kor",
    name: "[국어 ○○○ 선생님]",
    track: "학과",
    subject: "국어",
    headline: "[8주 동안 문학·독서 기출 지문을 끝까지 끌고 갑니다.]",
    careers: [
      "[前 ○○학원 국어 대표강사]",
      "[○○대학교 국어교육과 졸업]",
      "[미대 입시 국어 지도 ○년]",
      "[EBS 연계교재 분석 자료 집필]",
    ],
    resident: true,
  },
  {
    id: "sample-eng",
    name: "[영어 ○○○ 선생님]",
    track: "학과",
    subject: "영어",
    headline: "[매일 밤 100단어, 8주 5,000단어를 끝까지 확인합니다.]",
    careers: [
      "[前 ○○학원 영어 대표강사]",
      "[○○대학교 영어영문학과 졸업]",
      "[수능 영어 절대평가 대비 커리큘럼 설계]",
      "[미대 입시 영어 지도 ○년]",
    ],
    resident: true,
  },
  {
    id: "sample-soc",
    name: "[탐구 ○○○ 선생님]",
    track: "학과",
    subject: "탐구",
    headline: "[겨울 안에 선택 과목 개념 1회독을 끝냅니다.]",
    careers: [
      "[前 ○○학원 사회탐구 강사]",
      "[○○대학교 사회교육과 졸업]",
      "[생활과윤리·사회문화 담당]",
    ],
    resident: false,
    residentNote: "주 3회 출강",
  },
  {
    id: "sample-silgi-01",
    name: "[실기 ○○○ 선생님]",
    track: "실기",
    subject: "기초디자인",
    headline: "[주말 이틀로 목표 대학 출제 유형에 손을 맞춥니다.]",
    careers: [
      "[○○대학교 시각디자인과 졸업]",
      "[모다고 홍대 본원 기초디자인 담당 ○년]",
      "[홍익대·국민대 유형 지도]",
    ],
    resident: false,
    residentNote: "주말 출강",
  },
  {
    id: "sample-silgi-02",
    name: "[실기 ○○○ 선생님]",
    track: "실기",
    subject: "발상과 표현",
    headline: "[레벨 테스트로 시작해 8주 뒤 한 단계 위 반으로 올립니다.]",
    careers: [
      "[○○대학교 회화과 졸업]",
      "[모다고 홍대 본원 발상과 표현 담당 ○년]",
      "[수준별 분반 · 개별 피드백 진행]",
    ],
    resident: false,
    residentNote: "주말 출강",
  },
];
