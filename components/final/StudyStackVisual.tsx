/**
 * /final 첫 화면 바로 아래 — "학생마다 다르게 쌓인 공부" 시각화.
 *
 * 사진·이미지 없이 HTML/CSS만으로 그린다. 서버 컴포넌트이며 호버·클릭·
 * 애니메이션이 없다 — 핵심 내용은 화면에 뜬 순간 전부 보인다.
 *
 * ── 구성 원칙 ──────────────────────────────────────────────
 * · 두 학생을 서열화하지 않는다. 두 기둥의 층 구조·높이·시각적 무게를 같게
 *   두고, "보완할 내용이 다르다"만 다르게 보이게 한다.
 * · 아래층(중립색) = 지금까지 해온 공부, 위층(주황 테두리) = 지금 점검할 부분.
 *   DOM 순서는 해온 공부 → 점검할 부분 → 희망 대학에서 확인 → 우선 점검이고
 *   (flex-col-reverse로 시각만 뒤집는다), 각 층에 번호 라벨을 붙여 색만으로
 *   의미를 전달하지 않는다.
 * · 희망 대학 정보는 장식으로 떼어두지 않고 "점검할 부분 → 확인할 반영 요소
 *   → 우선 점검" 한 줄기로 잇는다.
 * · 숫자·실제 대학명·확정 처방을 쓰지 않는다. "우선 점검"까지만 말한다.
 * · 모바일에서 내부 스크롤을 만들지 않는다 — 세로로 쌓이면 그만이다.
 * ─────────────────────────────────────────────────────────────
 */

type StudentCase = {
  label: string;
  /** 지금까지 해온 공부 (두 학생이 같다 — 같은 출발점을 보여주기 위함) */
  done: string[];
  /** 지금 막히는 부분 */
  stuck: string;
  /** 희망 대학에서 함께 확인할 반영 요소 */
  goalCheck: string;
  /** 우선 점검할 것 — 확정 처방이 아니다 */
  priority: string[];
};

/** 설명용 가상 사례 — 수치·실제 대학명 없이 구조만 보여준다 */
const CASES: StudentCase[] = [
  {
    label: "학생 A",
    done: ["개념 학습", "기출 풀이"],
    stuck: "국어에서 시간이 부족해 뒤쪽 문항을 놓친다",
    goalCheck: "희망 대학의 국어 반영 비중",
    priority: ["풀이 순서", "시간 배분"],
  },
  {
    label: "학생 B",
    done: ["개념 학습", "기출 풀이"],
    stuck: "탐구에서 특정 개념을 반복해서 혼동한다",
    goalCheck: "희망 대학의 탐구 반영 방식",
    priority: ["취약 개념", "문제 적용"],
  },
];

const ORANGE = "#f58846";

function StudentColumn({ item }: { item: StudentCase }) {
  return (
    <li className="flex flex-col">
      <p className="text-lg font-black tracking-tight md:text-xl">
        {item.label}
        <span className="ml-2 text-[15px] font-medium text-black/45 md:text-base">
          가상 사례
        </span>
      </p>

      {/* 두 층의 기둥 — DOM은 해온 공부(1)가 먼저, 화면은 점검할 부분(2)이 위 */}
      <ol className="mt-4 flex flex-col-reverse" aria-label={`${item.label}의 공부 구성`}>
        <li className="min-h-[7.5rem] rounded-b-lg border border-black/15 bg-black/[0.05] px-5 py-4 md:min-h-[8rem]">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-black/50">
            1 · 지금까지 해온 공부
          </p>
          <p className="mt-2 text-lg font-bold leading-snug break-keep md:text-xl">
            {item.done.join(" · ")}
          </p>
        </li>
        <li
          className="min-h-[7.5rem] rounded-t-lg border-2 bg-[#fff4ec] px-5 py-4 md:min-h-[8rem]"
          style={{ borderColor: ORANGE }}
        >
          <p
            className="text-[13px] font-semibold tracking-[0.12em]"
            style={{ color: ORANGE }}
          >
            2 · 지금 점검할 부분
          </p>
          <p className="mt-2 text-lg font-bold leading-snug break-keep md:text-xl">
            {item.stuck}
          </p>
        </li>
      </ol>

      {/* 목표와 연결 — 기둥에서 바로 이어지는 두 줄. 화살표 남발 대신 세로선 하나 */}
      <dl
        className="ml-5 mt-1 border-l-2 pl-4"
        style={{ borderColor: ORANGE }}
      >
        <div className="pt-3">
          <dt className="text-[13px] font-semibold tracking-[0.12em] text-black/50">
            3 · 희망 대학에서 확인
          </dt>
          <dd className="mt-1 text-base font-medium leading-relaxed break-keep md:text-lg">
            {item.goalCheck}
          </dd>
        </div>
        <div className="pt-3 pb-1">
          <dt className="text-[13px] font-semibold tracking-[0.12em] text-black/50">
            4 · 우선 점검
          </dt>
          <dd className="mt-1 text-base font-bold leading-relaxed break-keep md:text-lg">
            {item.priority.join(" · ")}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function StudyStackVisual() {
  return (
    <section aria-labelledby="final-stack-title" className="pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-6">
        <div className="border-t border-black/10 pt-8 md:pt-10">
          <h2
            id="final-stack-title"
            className="text-[1.6rem] font-black leading-[1.35] tracking-tight break-keep md:text-3xl md:leading-[1.3]"
          >
            같은 성적이어도,
            <br className="md:hidden" /> 마지막 공부는 달라집니다.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
            해온 공부가 같아 보여도 막히는 자리는 다르고, 희망 대학에서 확인할
            반영 요소도 다릅니다. 그래서 먼저 점검할 것이 달라집니다.
          </p>
        </div>

        <ol className="mt-8 grid grid-cols-1 gap-10 md:mt-10 md:grid-cols-2 md:gap-8">
          {CASES.map((item) => (
            <StudentColumn key={item.label} item={item} />
          ))}
        </ol>

        <p className="mt-8 text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
          ※ 이해를 돕기 위한 가상 사례이며, 실제 우선순위는 개별 상담과 학습
          상태 확인 후 달라집니다.
        </p>

        <p className="mt-8 border-t border-black/10 pt-6 text-lg font-semibold leading-[1.7] break-keep md:text-xl">
          지금까지 해온 공부와 희망 대학을 함께 봐야,
          <br className="hidden md:block" /> 남은 공부가 구체적이 됩니다.
        </p>
      </div>
    </section>
  );
}
