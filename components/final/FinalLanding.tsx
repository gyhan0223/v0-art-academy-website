/**
 * /final — 2027 미대입시 수능 파이널 집중반 랜딩.
 *
 * 9월 모의평가 이후부터 수능 전까지의 학과(국어·영어·사회탐구) 집중 과정을
 * 미대 정시 준비 고3·N수생에게 소개한다. 사이트 공통 크롬(SiteNav·톡톡 FAB)은
 * 이 경로에서 숨기고 전용 최소 헤더만 쓴다.
 *
 * ── 이 페이지의 전환 원칙 ───────────────────────────────────
 * · 상담·전화·예약 버튼은 마지막 상담 섹션(FinalConsult) 한 곳에만 둔다.
 *   첫 화면·본문 중간·헤더·FAQ·하단 고정 바 어디에도 CTA를 넣지 않는다.
 * · 마지막 CTA는 "전화 상담"과 "네이버 상담 예약" 둘뿐이다(톡톡 추가 금지).
 * · 팝업·카운트다운·마감 임박·잔여 좌석 같은 자극 장치를 쓰지 않는다.
 * · 확인되지 않은 개강일·수업 시간·정원·수강료·수업 횟수는 만들지 않는다.
 * · 성적 근거는 lib/winter-results.ts에서만 가져오고, 윈터스쿨 결과를
 *   이 과정의 성과처럼 보이게 쓰지 않는다.
 * ─────────────────────────────────────────────────────────────
 *
 * 밝은 편집 디자인: 아이보리 배경 · 검은 본문 · 브랜드 주황은 숫자와 구분선에만.
 * 사이트 전체가 다크 테마라 색은 전부 이 파일 안에서 직접 지정한다.
 */

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CAMPUSES, NAVER_BOOKING_PAUSED, NAVER_GREEN } from "@/lib/contact";
import { FINAL_PROGRAM } from "@/lib/final-program";
import {
  IS_PLACEHOLDER,
  SUBJECT_ORDER,
  WINTER_COHORT,
  getBestResult,
  getGain,
  getPublishableResults,
  getWinterCohortSummary,
  type WinterResultCase,
} from "@/lib/winter-results";

// 전화번호·예약 주소는 lib/contact.ts의 CAMPUSES 단일 소스 — 여기서 새로 적지 않는다.
const [CAMPUS_HONGDAE] = CAMPUSES;

/** 키보드 포커스 표시 — 링크·버튼·아코디언이 전부 같은 스타일을 쓴다 */
const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f58846]";

/** 본문 공통 폭 — 보고서처럼 읽히도록 텍스트 폭을 좁게 잡는다 */
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-3xl px-5 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

/** 섹션 번호 + 제목. 번호는 브랜드색, 제목은 검정 — 카드 없이 구분선으로만 나눈다 */
function SectionHead({
  number,
  title,
  id,
}: {
  number: string;
  title: React.ReactNode;
  id: string;
}) {
  return (
    <div className="border-t-2 border-[#161616] pt-6 md:pt-8">
      <p className="font-mono text-sm font-semibold tracking-[0.2em] text-[#f58846]">
        {number}
      </p>
      <h2
        id={id}
        className="mt-3 text-[1.75rem] font-black leading-[1.35] tracking-tight break-keep md:text-4xl md:leading-[1.3]"
      >
        {title}
      </h2>
    </div>
  );
}

export default function FinalLanding() {
  return (
    <div className="min-h-dvh bg-[#fbfaf8] text-[#161616]">
      <FinalHeader />
      <main>
        <Hero />
        <Decisions />
        <Method />
        {!IS_PLACEHOLDER && <Evidence />}
        <Fit />
        <Faq />
        <FinalConsult />
      </main>
      <FinalFooter />
    </div>
  );
}

/* ------------------------------ 전용 최소 헤더 ------------------------------ */

function FinalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf8]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link
            href="/"
            aria-label="모두다른고양이 홈으로"
            className={`shrink-0 text-[15px] font-black tracking-tight ${FOCUS_RING}`}
          >
            모두다른고양이
          </Link>
          <span aria-hidden="true" className="text-black/25">
            |
          </span>
          <p className="truncate text-[15px] font-semibold text-black/70">
            {FINAL_PROGRAM.shortName}
          </p>
        </div>
        <Link
          href="/"
          className={`shrink-0 rounded-md px-2 py-1.5 text-[15px] text-black/60 transition-colors hover:text-black ${FOCUS_RING}`}
        >
          홈으로
        </Link>
      </div>
    </header>
  );
}

/* --------------------------------- 첫 화면 --------------------------------- */

const HERO_FLOW = ["9월 모평 분석", "과목별 우선순위", FINAL_PROGRAM.examDateLabel];

function Hero() {
  return (
    <section aria-labelledby="final-hero-title" className="pt-14 pb-16 md:pt-24 md:pb-24">
      <Container>
        <p className="text-base font-semibold tracking-[0.12em] text-[#f58846] md:text-lg">
          {FINAL_PROGRAM.targetShort}
        </p>
        <h1
          id="final-hero-title"
          className="mt-5 text-[2.25rem] font-black leading-[1.3] tracking-tight break-keep md:text-[3.25rem] md:leading-[1.25]"
        >
          9평은 끝났고,
          <br />
          수능 성적은 아직 끝나지 않았습니다.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
          이제 필요한 것은 전 범위를 다시 시작하는 일이 아닙니다. 목표 대학의
          반영 방식과 9평에서 드러난 약점을 기준으로, 수능까지 가져갈 것과 버릴
          것을 정해야 합니다.
        </p>

        {/* 남은 기간의 흐름 — 세 단계만, 버튼 없이 */}
        <ol
          aria-label="수능까지의 흐름"
          className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 md:flex-row md:items-center md:gap-0"
        >
          {HERO_FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-3 md:gap-0">
              <span className="text-lg font-bold tracking-tight md:text-xl">
                <span className="mr-2 font-mono text-sm font-semibold text-[#f58846]">
                  {i + 1}
                </span>
                {step}
              </span>
              {i < HERO_FLOW.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden text-[#f58846] md:mx-5 md:inline"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* 확인된 운영 정보만 — 나머지는 개별 상담 후 안내 */}
        <dl className="mt-10 border-t border-black/10">
          {[
            ["과정", FINAL_PROGRAM.name],
            ["대상", FINAL_PROGRAM.target],
            ["기간", `9월 모의평가 이후부터 2026년 ${FINAL_PROGRAM.examDateLabel} 전까지`],
            ["과목", FINAL_PROGRAM.subjects.join(" · ")],
            ["장소", FINAL_PROGRAM.venue],
            ["개강일 · 수업 시간 · 정원 · 수강료", "개별 상담 후 안내"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-black/10 py-4 md:grid-cols-[12rem_1fr]"
            >
              <dt className="text-[15px] text-black/50 md:text-base">{label}</dt>
              <dd className="text-base font-medium leading-relaxed break-keep md:text-lg">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* --------------------- 01 · 지금 결정해야 하는 세 가지 --------------------- */

const DECISIONS = [
  {
    title: "목표 대학에서 실제 점수가 되는 과목",
    body: "대학과 학과마다 수능 반영영역과 비율이 다릅니다. 같은 등급표를 들고 있어도 어느 대학을 목표로 하느냐에 따라 먼저 올려야 할 과목과 뒤로 미뤄도 되는 과목이 달라집니다.",
  },
  {
    title: "몰라서 틀린 문제와 반복해서 틀리는 문제",
    body: "틀린 문항의 개수보다 원인을 나누는 일이 먼저입니다. 개념이 비어서 틀린 문제와 알면서도 반복해서 틀리는 문제는 처방이 다르고, 원인을 구분해야 남은 기간의 계획을 줄일 수 있습니다.",
  },
  {
    title: "실기를 유지하면서 확보할 수 있는 학과 시간",
    body: "모든 학생에게 같은 시간표를 적용하지 않습니다. 목표 대학의 실기 비중과 현재 실기 수준을 함께 보고, 실기를 흔들지 않는 범위에서 학과에 쓸 수 있는 시간을 정합니다.",
  },
];

function Decisions() {
  return (
    <section aria-labelledby="final-decisions-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          number="01"
          id="final-decisions-title"
          title={
            <>
              이제는 얼마나 많이 공부할지가 아니라,
              <br className="hidden md:block" /> 무엇을 남길지 결정해야 합니다.
            </>
          }
        />
        <ol className="mt-10 md:mt-12">
          {DECISIONS.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-black/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-[5rem_1fr] md:gap-x-6 md:py-10"
            >
              <span
                aria-hidden="true"
                className="font-mono text-4xl font-black leading-none text-[#f58846] md:text-5xl"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold leading-snug tracking-tight break-keep md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-[1.85] break-keep text-black/75 md:text-lg">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------- 02 · 모다고가 파이널 계획을 만드는 방식 ------------------- */

const METHOD_STEPS = [
  {
    title: "9평 진단",
    body: "가채점표와 틀린 문항을 기준으로 과목별 손실 원인을 구분합니다.",
  },
  {
    title: "대학별 환산",
    body: "목표 대학에서 국어·영어·사회탐구가 어떻게 반영되는지 확인합니다.",
  },
  {
    title: "주간 우선순위",
    body: "모든 과목을 똑같이 공부하지 않고, 실제 점수 상승 가능성이 있는 영역부터 배치합니다.",
  },
  {
    title: "재측정과 수정",
    body: "시간 안에 다시 풀어보고, 결과에 따라 다음 계획을 조정합니다.",
  },
];

function Method() {
  return (
    <section aria-labelledby="final-method-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          number="02"
          id="final-method-title"
          title="같은 9평 성적표에서도 계획은 달라야 합니다."
        />
        <p className="mt-6 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
          네 단계는 한 번으로 끝나지 않고, 수능 전까지 하나의 과정으로 반복됩니다.
        </p>

        {/* 왼쪽 세로선으로 네 단계를 하나의 흐름으로 잇는다 */}
        <ol className="relative mt-10 border-l-2 border-[#f58846] pl-8 md:mt-12 md:pl-10">
          {METHOD_STEPS.map((step, i) => (
            <li key={step.title} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[calc(2rem+9px)] top-1.5 h-4 w-4 rounded-full border-2 border-[#f58846] bg-[#fbfaf8] md:-left-[calc(2.5rem+9px)]"
              />
              <p className="font-mono text-sm font-semibold tracking-[0.2em] text-[#f58846]">
                STEP {i + 1}
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight break-keep md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-[1.85] break-keep text-black/75 md:text-lg">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------ 03 · 검증된 데이터로 신뢰 형성 ------------------------ */

/** "5 → 4"처럼 진단→재측정 등급을 표기. 오른 과목만 브랜드색 */
function GradeChange({ item, subject }: { item: WinterResultCase; subject: string }) {
  const r = item.results.find((x) => x.subject === subject);
  if (!r) return <span className="text-black/30">—</span>;
  const gain = getGain(r);
  return (
    <span className={`whitespace-nowrap tabular-nums ${gain > 0 ? "font-bold" : "text-black/60"}`}>
      {r.diagnostic}
      <span aria-hidden="true" className="mx-1 text-black/30">
        →
      </span>
      <span className={gain > 0 ? "text-[#f58846]" : ""}>{r.retest}</span>
      <span className="sr-only">
        {gain > 0 ? `, ${gain}등급 상승` : ", 유지"}
      </span>
    </span>
  );
}

function Evidence() {
  const cohort = WINTER_COHORT;
  const summary = getWinterCohortSummary(cohort);
  const cases = getPublishableResults();
  const allMeasured = cohort.measured === cohort.total;

  const criteria: [string, string][] = [
    ["비교 기준", cohort.basis],
    ["상승 판정", cohort.criterion],
    [
      "재측정 참여",
      allMeasured
        ? `전원 재측정 참여 (${cohort.measured}명 / ${cohort.total}명)`
        : `${cohort.measured}명 / ${cohort.total}명 재측정 참여`,
    ],
  ];
  if (cohort.excluded) criteria.push(["제외 인원", cohort.excluded]);

  return (
    <section aria-labelledby="final-evidence-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          number="03"
          id="final-evidence-title"
          title="잘 오른 학생만 골라 말하지 않았습니다."
        />

        {summary.isValid && (
          <div className="mt-8 border-b border-black/10 pb-8 md:mt-10">
            <p className="text-[2.75rem] font-black leading-none tracking-tight md:text-6xl">
              {cohort.measured}명 중{" "}
              <span className="text-[#f58846]">{cohort.improved}명</span>
            </p>
            <p className="mt-3 font-mono text-base text-black/50 md:text-lg">
              {summary.rate}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
              {cohort.term} 8주 과정을 마친 {cohort.total}명{" "}
              {allMeasured ? "전원이" : `중 ${cohort.measured}명이`} 재측정에
              참여했고, {cohort.improved}명이 {cohort.criterion}했습니다.
            </p>
          </div>
        )}

        {/* 집계 기준 — 숨기지 않는다 */}
        <dl className="mt-2">
          {criteria.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-black/10 py-4 md:grid-cols-[9rem_1fr]"
            >
              <dt className="text-[15px] text-black/50 md:text-base">{label}</dt>
              <dd className="text-base font-medium leading-relaxed break-keep md:text-lg">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {cases.length > 0 && (
          <>
            <h3 className="mt-12 text-xl font-bold tracking-tight break-keep md:text-2xl">
              서면 동의를 받아 공개하는 {cases.length}명의 변화
            </h3>
            <p className="mt-2 text-[15px] text-black/50 md:text-base">
              1주차 진단고사 등급 → 8주차 재측정 등급
            </p>
            {/* 375px에서도 가로 스크롤 없이 들어가도록 — 좁은 화면에서는
                "가장 큰 변화" 열을 접고 학생 이름 아래 줄로 내린다 */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-t-2 border-[#161616] text-base md:text-lg">
                <caption className="sr-only">
                  {cohort.term} 공개 사례 — 과목별 1주차 진단고사와 8주차 재측정 등급
                </caption>
                <thead>
                  <tr className="border-b border-black/10 text-[15px] text-black/50">
                    <th scope="col" className="py-3 pr-2 text-left font-normal">
                      학생
                    </th>
                    {SUBJECT_ORDER.map((s) => (
                      <th key={s} scope="col" className="px-1 py-3 text-center font-normal">
                        {s}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="hidden py-3 pl-4 text-right font-normal md:table-cell"
                    >
                      가장 큰 변화
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((item) => {
                    const best = getBestResult(item);
                    const bestGain = best ? getGain(best) : 0;
                    const bestLabel =
                      best && bestGain > 0 ? (
                        <>
                          {best.subject}{" "}
                          <span className="font-bold text-[#f58846]">{bestGain}등급</span> 상승
                        </>
                      ) : (
                        <span className="text-black/50">유지</span>
                      );
                    return (
                      <tr key={item.id} className="border-b border-black/10 align-top">
                        <th scope="row" className="py-4 pr-2 text-left font-medium">
                          {item.name}
                          <span className="block text-[15px] font-normal text-black/50 md:ml-2 md:inline">
                            {item.grade}
                          </span>
                          <span className="mt-1 block text-[15px] font-normal md:hidden">
                            {bestLabel}
                          </span>
                        </th>
                        {SUBJECT_ORDER.map((s) => (
                          <td key={s} className="px-1 py-4 text-center">
                            <GradeChange item={item} subject={s} />
                          </td>
                        ))}
                        <td className="hidden py-4 pl-4 text-right font-medium whitespace-nowrap md:table-cell">
                          {bestLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="mt-8 text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
          ※ 위 기록은 {cohort.term} 8주 운영 결과이며, 이번 파이널 과정의 성적을
          보장하는 수치는 아닙니다. 학생별 출발점과 결과는 다를 수 있습니다.
        </p>
      </Container>
    </section>
  );
}

/* --------------------- 04 · 적합한 학생과 그렇지 않은 학생 --------------------- */

const FIT_YES = [
  "9평 이후 무엇부터 정리해야 할지 모르는 학생",
  "목표 대학은 있지만 과목별 우선순위가 불분명한 학생",
  "혼자 계획은 세우지만 점검과 수정이 반복되지 않는 학생",
  "실기와 수능 사이의 시간 배분이 계속 흔들리는 학생",
];

const FIT_CONSULT_FIRST = [
  "목표 대학과 현재 성적을 아직 전혀 정하지 못한 경우",
  "이미 안정적인 학습 계획과 점검 체계가 작동하고 있는 경우",
  "단기간 성적 상승을 보장받기 위해 등록하려는 경우",
];

function FitList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xl font-bold tracking-tight break-keep md:text-2xl">{heading}</h3>
      <ul className="mt-4 border-t border-black/10">
        {items.map((text) => (
          <li
            key={text}
            className="border-b border-black/10 py-4 text-base leading-[1.75] break-keep md:text-lg"
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fit() {
  return (
    <section aria-labelledby="final-fit-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          number="04"
          id="final-fit-title"
          title="누구에게나 등록을 권하지 않습니다."
        />
        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-8">
          <FitList heading="잘 맞는 경우" items={FIT_YES} />
          <FitList heading="먼저 상담이 필요한 경우" items={FIT_CONSULT_FIRST} />
        </div>
        <p className="mt-10 text-lg font-semibold leading-[1.7] break-keep md:text-xl">
          등록 여부는 9평 결과와 목표 대학을 함께 확인한 뒤 판단합니다.
        </p>
      </Container>
    </section>
  );
}

/* ---------------------------------- 05 · FAQ ---------------------------------- */

const FAQ_ITEMS: { q: string; a: React.ReactNode }[] = [
  {
    q: "지금 시작해도 늦지 않았나요?",
    a: "남은 기간에 전 범위를 다시 보는 것은 어렵습니다. 그래서 이 과정은 9평에서 드러난 약점과 목표 대학의 반영 방식을 기준으로 범위를 좁혀 시작합니다. 시작 시점보다 무엇을 남기고 무엇을 버릴지 정하는 일이 결과를 더 크게 좌우합니다.",
  },
  {
    q: "9평 성적이 낮아도 상담할 수 있나요?",
    a: "네. 현재 성적과 무관하게 상담할 수 있습니다. 다만 상담에서는 성적 상승을 약속하지 않고, 목표 대학의 반영 방식에서 현재 성적으로 실제 점수가 될 수 있는 과목이 무엇인지부터 함께 확인합니다.",
  },
  {
    q: "수능 전까지 실기는 중단하나요?",
    a: "중단을 전제로 하지 않습니다. 목표 대학의 실기 비중과 현재 실기 수준을 함께 보고, 실기를 유지하면서 학과에 쓸 수 있는 시간을 정합니다. 학생마다 배분이 다르므로 시간표는 상담에서 개별적으로 안내합니다.",
  },
  {
    q: "상담할 때 무엇을 준비해야 하나요?",
    a: (
      <>
        <p>다음 네 가지를 가져오면 첫 상담에서 바로 계획의 윤곽을 잡을 수 있습니다.</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>9월 모평 가채점 결과 또는 성적표</li>
          <li>틀린 문항을 확인할 수 있는 문제지</li>
          <li>희망 대학과 학과</li>
          <li>현재 실기 수업 일정</li>
        </ul>
      </>
    ),
  },
];

function Faq() {
  return (
    <section aria-labelledby="final-faq-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead number="05" id="final-faq-title" title="자주 묻는 질문" />
        <Accordion type="single" collapsible className="mt-8 border-t border-black/10 md:mt-10">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="border-b border-black/10 last:border-b"
            >
              <AccordionTrigger
                className={`py-5 text-lg font-bold leading-snug tracking-tight break-keep hover:no-underline md:text-xl [&>svg]:size-5 [&>svg]:text-[#161616] ${FOCUS_RING} focus-visible:ring-0`}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-[1.85] break-keep text-black/75 md:text-lg">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

/* ---------------------- 06 · 마지막 상담 섹션 (유일한 CTA) ---------------------- */

function FinalConsult() {
  // 네이버 예약이 검수 중(NAVER_BOOKING_PAUSED)이면 /booking/hongdae가 전화 안내
  // 화면으로 넘기므로 버튼 문구도 그에 맞게 정직하게 바꾼다. 스위치는 건드리지 않는다.
  const bookingLabel = NAVER_BOOKING_PAUSED
    ? "예약 안내 확인하기"
    : "네이버로 상담 예약하기";

  return (
    <section
      aria-labelledby="final-consult-title"
      className="border-t-2 border-[#161616] py-16 md:py-24"
    >
      <Container>
        <p className="font-mono text-sm font-semibold tracking-[0.2em] text-[#f58846]">
          06
        </p>
        <h2
          id="final-consult-title"
          className="mt-3 text-[1.75rem] font-black leading-[1.35] tracking-tight break-keep md:text-4xl md:leading-[1.3]"
        >
          등록부터 권하지 않습니다.
          <br />
          먼저 9평을 함께 펼쳐보겠습니다.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
          가채점 결과와 목표 대학을 가져오면, 남은 기간에 실제로 바꿀 수 있는
          과목과 현재 계획에서 덜어낼 부분부터 확인합니다.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${CAMPUS_HONGDAE.phone}`}
            aria-label={`${CAMPUS_HONGDAE.label} 전화 상담 ${CAMPUS_HONGDAE.phone}`}
            className={`inline-flex min-h-14 flex-1 flex-col items-center justify-center rounded-md bg-[#161616] px-6 py-3.5 text-center text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
          >
            <span className="text-base font-bold md:text-lg">전화 상담</span>
            <span className="mt-0.5 text-[15px] tabular-nums text-white/70">
              {CAMPUS_HONGDAE.label} {CAMPUS_HONGDAE.phone}
            </span>
          </a>
          <a
            href={CAMPUS_HONGDAE.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${bookingLabel} (네이버 예약, 새 창)`}
            style={{ borderColor: NAVER_GREEN, color: NAVER_GREEN }}
            className={`inline-flex min-h-14 flex-1 flex-col items-center justify-center rounded-md border-2 bg-white px-6 py-3.5 text-center transition-colors hover:bg-[#03C75A]/5 ${FOCUS_RING}`}
          >
            <span className="text-base font-bold md:text-lg">{bookingLabel}</span>
            <span className="mt-0.5 text-[15px] text-black/50">네이버 예약 · 홍대 본원</span>
          </a>
        </div>

        {NAVER_BOOKING_PAUSED && (
          <p className="mt-4 text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
            네이버 예약 상품이 검수 중인 동안에는 예약 페이지 대신 전화 안내
            화면으로 연결될 수 있습니다.
          </p>
        )}
      </Container>
    </section>
  );
}

/* ---------------------------------- 푸터 ---------------------------------- */

function FinalFooter() {
  return (
    <footer className="border-t border-black/10 py-8" role="contentinfo">
      <Container className="flex flex-col gap-2 text-[15px] text-black/50 sm:flex-row sm:items-center sm:justify-between">
        <p>모두다른고양이 미술학원 · {FINAL_PROGRAM.venue}</p>
        <Link
          href="/"
          className={`rounded-md underline decoration-black/20 underline-offset-4 transition-colors hover:text-black ${FOCUS_RING}`}
        >
          모두다른고양이 홈
        </Link>
      </Container>
    </footer>
  );
}
