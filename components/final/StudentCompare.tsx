/**
 * /final의 유일한 시각화 — "같은 성적이어도, 막히는 지점은 다릅니다."
 *
 * HTML/CSS만 쓰는 서버 컴포넌트. 호버·클릭·애니메이션 없이 핵심이 다 보인다.
 * · 두 학생을 서열화하지 않는다: 블록 구조와 높이를 똑같이 맞춘다.
 * · 카드 안에 카드를 겹치지 않는다. 학생당 블록 두 개(쌓아온 공부 = 중립색,
 *   보완할 부분 = 옅은 주황)와 그 밖의 짧은 한 줄이 전부다.
 * · 점수·퍼센트·막대그래프 같은 허구의 측정치를 만들지 않는다.
 * · 비상호작용 요소를 버튼처럼 보이게 하지 않는다(그림자·둥근 알약 금지).
 * · 희망 대학과의 연결은 두 사례 아래 한 문장으로만 전한다.
 */

type StudentCase = {
  label: string;
  /** 쌓아온 공부 — 두 학생이 같다(같은 출발점) */
  done: string;
  /** 보완할 부분 — 여기만 주황 */
  gap: string;
  /** 그래서 먼저 점검할 것 */
  check: string;
};

/** 설명용 가상 사례 — 실제 대학명·수치를 넣지 않는다 */
const CASES: StudentCase[] = [
  {
    label: "학생 A",
    done: "개념 학습 · 기출 풀이",
    gap: "국어에서 시간이 부족하다",
    check: "풀이 순서 · 시간 배분",
  },
  {
    label: "학생 B",
    done: "개념 학습 · 기출 풀이",
    gap: "탐구 개념을 반복해서 혼동한다",
    check: "취약 개념 · 문제 적용",
  },
];

function Block({
  tone,
  label,
  text,
}: {
  tone: "neutral" | "accent";
  label: string;
  text: string;
}) {
  const toneClass =
    tone === "accent"
      ? "border-[#f5b183] bg-[#fff1e6]"
      : "border-black/10 bg-black/[0.045]";
  return (
    <div className={`min-h-[5.5rem] border px-5 py-4 ${toneClass}`}>
      <p className="text-[13px] font-medium text-black/55">{label}</p>
      <p className="mt-1.5 text-[17px] font-semibold leading-snug break-keep md:text-lg">
        {text}
      </p>
    </div>
  );
}

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

      <ol className="mt-8 grid grid-cols-1 gap-10 md:mt-10 md:grid-cols-2 md:gap-12">
        {CASES.map((c) => (
          <li key={c.label}>
            <p className="text-[15px] font-medium text-black/55">
              {c.label}
              <span className="ml-2 font-normal text-black/40">가상 사례</span>
            </p>
            <div className="mt-3 space-y-2">
              <Block tone="neutral" label="쌓아온 공부" text={c.done} />
              <Block tone="accent" label="보완할 부분" text={c.gap} />
            </div>
            <p className="mt-3 text-[17px] leading-relaxed break-keep md:text-lg">
              <span className="text-black/55">먼저 점검</span>{" "}
              <span className="font-medium">{c.check}</span>
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-[40rem] text-[17px] leading-[1.8] break-keep md:mt-12 md:text-lg">
        어디에 더 집중할지는 희망 대학의 반영 방식까지 함께 보고 정합니다.
      </p>
      <p className="mt-3 text-[14px] leading-relaxed break-keep text-black/50">
        이해를 돕기 위한 가상 사례입니다. 실제 우선순위는 상담과 학습 상태
        확인 후 달라집니다.
      </p>
    </section>
  );
}
