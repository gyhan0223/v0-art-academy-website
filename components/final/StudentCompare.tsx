/**
 * /final의 유일한 시각화 — "같은 성적이어도, 막히는 지점은 다릅니다."
 *
 * HTML/CSS만 쓰는 서버 컴포넌트. 호버·클릭·애니메이션 없이 핵심이 다 보인다.
 * · 두 학생이 공통으로 해온 공부(개념·기출)는 제목 아래 한 문장으로만 말하고,
 *   학생별로는 "어려운 부분"(제목)과 "먼저 점검할 것"만 대비시킨다.
 *   같은 내용을 담은 회색 박스를 학생마다 반복하지 않는다.
 * · 카드 안에 카드를 겹치지 않는다. 박스·화살표·아이콘·단계 번호 없이
 *   간격·정렬·글자 위계로만 나눈다.
 * · 두 사례의 구조와 높이를 같게 두어 서열화하지 않는다.
 * · 주황은 점검 키워드 한 곳에만 쓴다.
 * · 점수·퍼센트·막대그래프 같은 허구의 측정치를 만들지 않는다.
 * · 희망 대학과의 연결은 두 사례 아래 한 문장으로만 전한다.
 */

type StudentCase = {
  /** 어려움 — 제목으로 강조 (학생 A/B 라벨 대신) */
  title: string;
  /** 그래서 먼저 점검할 것 */
  check: string;
};

/** 설명용 가상 사례 — 실제 대학명·수치·실명을 넣지 않는다 */
const CASES: StudentCase[] = [
  { title: "국어에서 시간이 부족한 학생", check: "풀이 순서 · 시간 배분" },
  { title: "탐구 개념이 자꾸 헷갈리는 학생", check: "취약 개념 · 문제 적용" },
];

const ORANGE = "#f58846";

export default function StudentCompare() {
  return (
    <section
      aria-labelledby="final-compare-title"
      className="mx-auto w-full max-w-[1040px] px-5 py-14 md:px-8 md:py-20"
    >
      <h2
        id="final-compare-title"
        className="max-w-[40rem] text-[1.5rem] font-semibold leading-[1.35] tracking-tight break-keep md:text-[2rem]"
      >
        같은 성적이어도,
        <br />
        막히는 지점은 다릅니다.
      </h2>
      <p className="mt-4 max-w-[40rem] text-[17px] leading-[1.8] break-keep text-black/75 md:text-lg">
        개념과 기출을 공부했어도, 어려운 부분은 학생마다 다릅니다.
      </p>

      {/* 모바일: 한 학생(제목→점검)을 다 읽고 다음 학생으로. PC: 나란히 */}
      <ul className="mt-8 grid grid-cols-1 gap-8 border-t border-black/10 md:mt-10 md:grid-cols-2 md:gap-12">
        {CASES.map((c) => (
          <li key={c.title} className="pt-6 md:pt-8">
            <h3 className="text-[1.25rem] font-semibold leading-[1.4] tracking-tight break-keep md:text-[1.5rem]">
              {c.title}
            </h3>
            <p className="mt-3 text-[17px] leading-relaxed break-keep md:text-lg">
              <span className="text-black/55">먼저 점검</span>
              <span className="ml-3 font-medium" style={{ color: ORANGE }}>
                {c.check}
              </span>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-[40rem] text-[17px] leading-[1.8] break-keep md:mt-12 md:text-lg">
        어디에 더 집중할지는 희망 대학의 반영 방식까지 함께 보고 정합니다.
      </p>
      <p className="mt-3 text-[14px] leading-relaxed break-keep text-black/50">
        이해를 돕기 위한 가상 사례입니다.
      </p>
    </section>
  );
}
