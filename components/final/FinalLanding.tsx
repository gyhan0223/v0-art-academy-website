/**
 * /final — 2027 미대입시 수능 파이널 집중반 랜딩.
 *
 * 최우선 목표는 고3·N수생과 학부모의 상담 문의·예약이다. 등록까지 설득하려
 * 들지 않고, "내 상황을 이해해 주는 것 같다 → 내 성적·희망 대학이라면 무엇부터
 * 해야 하는지 궁금하다 → 성적표를 들고 한번 상담받고 싶다"로 이어지게 한다.
 * 그렇다고 집중반 모집 페이지라는 사실을 숨기거나 무료 컨설팅처럼 포장하지
 * 않는다 — 첫 화면에서 과정명·대상·장소가 바로 보인다.
 *
 * ── 논리 흐름 (5구간) ───────────────────────────────────────
 *   A 첫 화면        수능까지 남은 시간은 같아도 필요한 공부는 다르다
 *   B 시각화         학생마다 다르게 쌓인 공부 → 점검할 부분이 다르다
 *   C 접근 방식      해온 공부 → 희망 대학 → 남은 준비 (유지할 것·보완할 것)
 *     (+ 보조 근거)  윈터스쿨 결과 — 파이널 성과처럼 보이지 않게 짧게, 표는 접어둔다
 *   D 상담에서 확인  원장님과 현재 성적·희망 대학·남은 준비 방향을 이야기한다
 *   E 상담 안내·CTA  전화 상담 · 네이버 예약(파이널 전용 상품, /booking/final)
 *
 * ── 반드시 지킬 것 ──────────────────────────────────────────
 * · 상담·전화·예약 버튼은 마지막 상담 섹션(FinalConsult) 한 곳에만 둔다.
 * · 첫 상담(원장님)과 과정 중 학습 점검(과목별 선생님)을 섞어 쓰지 않는다.
 *   첫 상담에서 세 과목 선생님을 모두 만나거나 모든 수업이 일대일인 것처럼
 *   쓰지 않는다.
 * · 확인되지 않은 것은 만들지 않는다 — 정원·소수 정원 보장, 정기 점검 주기,
 *   전담 교사·무제한 피드백, 개별 계획표·보고서 제공 보장, 무료 상담, 수강료·
 *   수업 시간·개강일, 성적 상승·합격 보장, 등록 정책("등록부터 권하지 않는다").
 * · 팝업·카운트다운·마감 임박·잔여 좌석·하단 고정 CTA를 쓰지 않는다.
 * · 성적 근거는 lib/winter-results.ts에서만 가져오고, 윈터스쿨 결과를 이 과정의
 *   성과처럼 쓰지 않는다. IS_PLACEHOLDER·서면 동의 노출 조건을 그대로 따른다.
 * · 사진·생성 이미지를 넣지 않는다. 텍스트·구분선·여백·HTML 시각화만 쓴다.
 * · 예약 주소와 연락처는 lib/contact.ts 단일 소스만 쓴다. 파이널 상담은 전용
 *   예약 상품이라 홍대 일반 상담 차단 스위치(NAVER_BOOKING_PAUSED)를 타지 않는다.
 *
 * 밝은 편집 디자인: 아이보리 배경 · 검은 본문 · 브랜드 주황은 시각화의 보완
 * 지점과 번호·구분선 강조에만. 사이트 전체가 다크 테마라 색은 이 파일과
 * StudyStackVisual 안에서 직접 지정한다.
 */

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CAMPUSES, NAVER_BOOKING_FINAL_URL, NAVER_GREEN } from "@/lib/contact";
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
import StudyStackVisual from "./StudyStackVisual";

// 전화번호·예약 주소는 lib/contact.ts의 CAMPUSES 단일 소스 — 여기서 새로 적지 않는다.
const [CAMPUS_HONGDAE] = CAMPUSES;

const ORANGE = "#f58846";

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

/** 섹션 제목 — 굵은 상단선 하나로만 구간을 나눈다 */
function SectionHead({
  id,
  title,
  lead,
}: {
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
}) {
  return (
    <div className="border-t-2 border-[#161616] pt-6 md:pt-8">
      <h2
        id={id}
        className="text-[1.6rem] font-black leading-[1.35] tracking-tight break-keep md:text-4xl md:leading-[1.3]"
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-5 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}

export default function FinalLanding() {
  return (
    <div className="min-h-dvh bg-[#fbfaf8] text-[#161616]">
      <FinalHeader />
      <main>
        <Hero />
        <StudyStackVisual />
        <Approach />
        {!IS_PLACEHOLDER && <Evidence />}
        <ConsultPreview />
        <Faq />
        <FinalConsult />
      </main>
      <FinalFooter />
    </div>
  );
}

/* ------------------------------ 전용 최소 헤더 ------------------------------ */

/** 홈 링크는 로고 하나뿐 — 별도 "홈으로"를 두면 같은 링크가 두 번 반복된다. */
function FinalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf8]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-baseline gap-3 px-5 py-4 md:px-6">
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
    </header>
  );
}

/* --------------------------------- A · 첫 화면 --------------------------------- */

/** 확정된 프로그램 정보 — 값은 lib/final-program.ts 하나에서만 온다 */
const PROGRAM_FACTS: [string, string][] = [
  ["대상", FINAL_PROGRAM.target],
  ["기간", `9월 모의평가 이후부터 ${FINAL_PROGRAM.examDateLabel} 전까지`],
  ["과목", FINAL_PROGRAM.subjects.join(" · ")],
  ["장소", FINAL_PROGRAM.venue],
];

function Hero() {
  return (
    <section aria-labelledby="final-hero-title" className="pt-14 pb-14 md:pt-24 md:pb-20">
      <Container>
        <p className="text-base font-semibold tracking-[0.12em] md:text-lg" style={{ color: ORANGE }}>
          {FINAL_PROGRAM.name}
        </p>
        <h1
          id="final-hero-title"
          className="mt-5 text-[2.1rem] font-black leading-[1.3] tracking-tight break-keep md:text-[3.25rem] md:leading-[1.25]"
        >
          수능까지 남은 시간은 같아도,{" "}
          <br className="hidden md:block" />
          필요한 공부는 다릅니다.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
          지금까지 해온 공부와 희망 대학을 함께 살펴보고, 남은 기간에 유지할
          공부와 먼저 보완할 부분을 정합니다.
        </p>

        {/* 과정 정보 — 첫 화면에서 모집 페이지임이 바로 드러나도록. 버튼은 없다 */}
        <dl className="mt-10 border-t border-black/10">
          {PROGRAM_FACTS.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-black/10 py-3.5 md:grid-cols-[5rem_1fr] md:gap-x-6"
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

/* ----------------------------- C · 학원의 접근 방식 ----------------------------- */

const APPROACH_STEPS = [
  {
    title: "해온 공부",
    body: "쓰고 있는 교재, 진도, 지금까지의 성적, 막히는 부분을 먼저 확인합니다.",
  },
  {
    title: "희망 대학",
    body: "지원할 대학·학과에서 국어·영어·사회탐구가 어떻게 반영되는지 확인합니다.",
  },
  {
    title: "남은 준비",
    body: "그대로 유지할 공부와 먼저 보완할 부분을 나누어 남은 기간의 방향을 정합니다.",
  },
];

function Approach() {
  return (
    <section aria-labelledby="final-approach-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          id="final-approach-title"
          title={
            <>
              해온 공부부터 확인하고,
              <br className="hidden md:block" /> 목표에 맞춰 방향을 잡습니다.
            </>
          }
        />

        <ol className="mt-8 md:mt-10">
          {APPROACH_STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-t border-black/10 py-6 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr] md:gap-x-6 md:py-8"
            >
              <span
                aria-hidden="true"
                className="font-mono text-3xl font-black leading-none md:text-4xl"
                style={{ color: ORANGE }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold leading-snug tracking-tight break-keep md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-[1.85] break-keep text-black/75 md:text-lg">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* 과정 중 학습 점검 — 원장님 첫 상담과 구분해 "과정 중"임을 밝힌다.
            주기·전담·무제한 같은 미확인 운영 사실은 적지 않는다. */}
        <div className="mt-8 border-t border-black/10 pt-6 md:mt-10 md:pt-8">
          <h3 className="text-xl font-bold tracking-tight break-keep md:text-2xl">
            과정 중에는 과목별 선생님과 직접 이야기합니다
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-[1.85] break-keep text-black/75 md:text-lg">
            국어·영어·사회탐구 선생님에게 어떤 교재로 어디까지 했는지, 어느
            자리에서 반복해서 막히는지를 직접 이야기하고 학습 상태를 확인할 수
            있습니다. 시험지 위의 점수만 보는 것이 아니라, 그 점수가 나온
            과정을 선생님이 듣고 함께 살펴보는 방식입니다.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------- 보조 근거 · 윈터스쿨 결과 (짧게) ------------------------- */

/** "5 → 4"처럼 진단→재측정 등급을 표기. 오른 과목만 굵게 + 브랜드색 */
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
      <span style={gain > 0 ? { color: ORANGE } : undefined}>{r.retest}</span>
      <span className="sr-only">{gain > 0 ? `, ${gain}등급 상승` : ", 유지"}</span>
    </span>
  );
}

/**
 * 윈터스쿨 결과는 이 과정의 성과가 아니라 "학습 상태를 확인하며 운영한 과정"의
 * 참고 기록이다. 집계 한 문장과 기준만 펼쳐 두고, 사례 표는 <details>로 접는다
 * (클라이언트 JS 없이 접힌다). 노출 조건(IS_PLACEHOLDER·isValid·서면 동의)은
 * lib/winter-results.ts 그대로다.
 */
function Evidence() {
  const cohort = WINTER_COHORT;
  const summary = getWinterCohortSummary(cohort);
  const cases = getPublishableResults();
  if (!summary.isValid) return null;

  const allMeasured = cohort.measured === cohort.total;

  return (
    <section aria-labelledby="final-evidence-title" className="pb-16 md:pb-24">
      <Container>
        <div className="border-t border-black/10 pt-6 md:pt-8">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-black/50">
            참고 · {cohort.term} 운영 결과
          </p>
          <h2
            id="final-evidence-title"
            className="mt-2 text-xl font-bold leading-snug tracking-tight break-keep md:text-2xl"
          >
            {cohort.measured}명 중{" "}
            <span style={{ color: ORANGE }}>{cohort.improved}명</span>이{" "}
            {cohort.criterion}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
            {cohort.basis}
            {allMeasured
              ? ` · 8주 수료 ${cohort.total}명 전원 재측정 참여`
              : ` · 8주 수료 ${cohort.total}명 중 ${cohort.measured}명 재측정 참여`}
            {cohort.excluded ? ` · ${cohort.excluded}` : ""} · 상승 비율{" "}
            {summary.rate}
          </p>

          {cases.length > 0 && (
            <details className="group mt-5">
              <summary
                className={`inline-flex cursor-pointer list-none items-center gap-2 rounded-md text-base font-semibold underline decoration-black/25 underline-offset-4 hover:decoration-black md:text-lg ${FOCUS_RING}`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-open:rotate-90"
                  style={{ color: ORANGE }}
                >
                  ▸
                </span>
                서면 동의를 받아 공개하는 {cases.length}명의 변화 보기
              </summary>
              <div className="mt-4 overflow-x-auto">
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
                            <span className="font-bold" style={{ color: ORANGE }}>
                              {bestGain}등급
                            </span>{" "}
                            상승
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
                <p className="mt-2 text-[15px] text-black/50">
                  1주차 진단고사 등급 → 8주차 재측정 등급
                </p>
              </div>
            </details>
          )}

          <p className="mt-5 text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
            ※ {cohort.term} 8주 운영 기록이며, 이번 파이널 집중반의 성과나 성적
            보장 수치가 아닙니다. 학생별 출발점과 결과는 다릅니다.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------- D · 상담에서 확인할 내용 ---------------------------- */

const CONSULT_TOPICS = [
  "현재 성적과 희망 대학을 함께 살펴보기",
  "우선 보완할 부분 이야기하기",
  "실기 일정까지 고려해 남은 준비 방향 살펴보기",
];

/** 상담에서 함께 놓고 보는 세 가지 — 입력 폼이나 분석 도구처럼 보이지 않게 정적으로만 */
const CONSULT_INPUTS = ["현재 성적", "해온 공부", "희망 대학"];

function ConsultPreview() {
  return (
    <section aria-labelledby="final-consult-preview-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead
          id="final-consult-preview-title"
          title={
            <>
              내 성적과 목표라면,
              <br className="hidden md:block" /> 무엇부터 준비해야 할까요?
            </>
          }
          lead="첫 상담은 원장님이 진행합니다. 현재 성적과 희망 대학을 바탕으로, 남은 기간에 무엇부터 준비할지 방향을 함께 이야기합니다."
        />

        <ul className="mt-8 border-t border-black/10">
          {CONSULT_TOPICS.map((text, i) => (
            <li
              key={text}
              className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-black/10 py-4 md:grid-cols-[2.5rem_1fr] md:py-5"
            >
              <span
                aria-hidden="true"
                className="pt-0.5 font-mono text-[15px] font-semibold md:text-base"
                style={{ color: ORANGE }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium leading-[1.75] break-keep md:text-lg">
                {text}
              </span>
            </li>
          ))}
        </ul>

        {/* 두 번째 시각 요소 — 세 가지를 한 묶음으로, 아래에 결론 한 줄.
            보고서·자동 분석처럼 보이지 않도록 정적 텍스트 블록만 쓴다. */}
        <div
          className="mt-10 rounded-lg border-2 px-5 py-6 md:px-8 md:py-8"
          style={{ borderColor: ORANGE }}
          aria-label="상담에서 함께 살펴보는 것"
        >
          <p className="text-[13px] font-semibold tracking-[0.12em] text-black/50">
            상담에서 함께 놓고 봅니다
          </p>
          {/* 모바일은 세로로 쌓고, md 이상에서 한 줄로 — 좁은 화면에서 "+"가
              줄 끝에 홀로 남지 않게 한다 */}
          <ul className="mt-3 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
            {CONSULT_INPUTS.map((label, i) => (
              <li key={label} className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
                <span className="whitespace-nowrap rounded-md border border-black/15 bg-black/[0.04] px-3.5 py-2 text-base font-bold md:text-lg">
                  {label}
                </span>
                {i < CONSULT_INPUTS.length - 1 && (
                  <span aria-hidden="true" className="pl-4 text-black/30 md:pl-0">
                    +
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-black/10 pt-4 text-lg font-bold leading-[1.6] break-keep md:text-xl">
            <span aria-hidden="true" className="mr-2" style={{ color: ORANGE }}>
              ↓
            </span>
            남은 기간의 우선순위를 함께 확인합니다
          </p>
        </div>

        <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
          상담은 방향을 잡는 자리입니다. 과목별 세부 점검은 과정 중에 선생님과
          학습 상태를 확인하며 이어집니다.
        </p>
      </Container>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */

/** 실제 문의에 필요한 것만. 새 운영 사실을 만들지 않는다. */
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "지금 시작해도 늦지 않았나요?",
    a: "남은 기간에 전 범위를 처음부터 다시 보기는 어렵습니다. 그래서 지금까지 해온 공부를 먼저 확인하고, 그대로 유지할 부분과 먼저 보완할 부분을 나누어 시작합니다. 시작 시점보다 무엇을 먼저 보완할지 정하는 일이 남은 기간을 좌우합니다.",
  },
  {
    q: "9평 성적이 낮아도 상담할 수 있나요?",
    a: "네. 현재 성적과 무관하게 상담할 수 있습니다. 상담에서는 성적 상승을 약속하지 않고, 희망 대학의 반영 방식에서 현재 성적으로 어떤 과목부터 보완하는 것이 나은지 함께 확인합니다.",
  },
  {
    q: "수능 전까지 실기는 중단하나요?",
    a: "중단을 전제로 하지 않습니다. 희망 대학의 실기 비중과 현재 실기 일정을 함께 보고, 실기를 유지하면서 학과에 쓸 수 있는 시간을 정합니다. 학생마다 배분이 다르므로 상담에서 개별적으로 이야기합니다.",
  },
];

function Faq() {
  return (
    <section aria-labelledby="final-faq-title" className="pb-16 md:pb-24">
      <Container>
        <SectionHead id="final-faq-title" title="자주 묻는 질문" />
        <Accordion type="single" collapsible className="mt-6 border-t border-black/10 md:mt-8">
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

/* ---------------------- E · 마지막 상담 안내 (유일한 CTA) ---------------------- */

const CONSULT_PREP: [string, string][] = [
  ["대상", "미대 정시를 준비하는 고3·N수생과 학부모"],
  ["있으면 좋은 자료", "9평 성적표 또는 가채점 결과 · 희망 대학과 학과"],
  ["함께 이야기할 것", "현재 하고 있는 공부와 실기 일정"],
];

function FinalConsult() {
  // 수능 파이널 상담은 전용 네이버 예약 상품(NAVER_BOOKING_FINAL_URL)을 쓴다.
  // 윈터스쿨·컨설팅과 같은 검수 통과 사업자의 상품이라 홍대 일반 상담의
  // 차단 스위치(NAVER_BOOKING_PAUSED)와 무관하게 항상 실제 예약으로 이어진다.
  // 홍대 일반 상담 예약(CAMPUS_HONGDAE.bookingUrl)을 여기에 걸지 말 것 —
  // 그쪽은 검수 중이라 전화 안내 화면으로 빠진다.
  return (
    <section
      aria-labelledby="final-consult-title"
      className="border-t-2 border-[#161616] py-16 md:py-24"
    >
      <Container>
        <p className="text-[13px] font-semibold tracking-[0.12em]" style={{ color: ORANGE }}>
          상담 안내
        </p>
        <h2
          id="final-consult-title"
          className="mt-3 text-[1.6rem] font-black leading-[1.35] tracking-tight break-keep md:text-4xl md:leading-[1.3]"
        >
          현재 성적과 희망 대학을
          <br className="hidden md:block" /> 함께 살펴보겠습니다.
        </h2>

        <dl className="mt-8 border-t border-black/10">
          {CONSULT_PREP.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-y-1 border-b border-black/10 py-4 md:grid-cols-[9rem_1fr] md:gap-x-6"
            >
              <dt className="text-[15px] text-black/50 md:text-base">{label}</dt>
              <dd className="text-base font-medium leading-relaxed break-keep md:text-lg">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] break-keep text-black/60 md:text-base">
          자료가 아직 없어도 괜찮습니다. 먼저 문의하시면 무엇을 준비하면 좋을지
          함께 안내해 드립니다.
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
            href={NAVER_BOOKING_FINAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="네이버로 상담 예약하기 (네이버 예약, 새 창)"
            style={{ borderColor: NAVER_GREEN, color: NAVER_GREEN }}
            className={`inline-flex min-h-14 flex-1 flex-col items-center justify-center rounded-md border-2 bg-white px-6 py-3.5 text-center transition-colors hover:bg-[#03C75A]/5 ${FOCUS_RING}`}
          >
            <span className="text-base font-bold md:text-lg">네이버로 상담 예약하기</span>
            <span className="mt-0.5 text-[15px] text-black/50">네이버 예약 · 홍대 본원</span>
          </a>
        </div>
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
