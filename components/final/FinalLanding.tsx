/**
 * /final — 2027 미대입시 수능 파이널 집중반 랜딩.
 *
 * 목표는 고3·N수생과 학부모의 상담 문의·예약이다. 상담은 원장님이 진행한다.
 * 집중반 모집 페이지라는 사실은 첫 화면에서 바로 드러내되(과정명·대상·장소),
 * 등록까지 설득하려 들지 않는다.
 *
 * ── 네 구간, 구간마다 새 정보 하나 ────────────────────────────
 *   A 첫 화면   관점 — 남은 시간은 같아도 필요한 공부는 다르다
 *   B 학생 비교 시각화 — 개념·기출을 공부했어도 어려운 곳이 다르다 (StudentCompare)
 *   C 학원의 역할 방법 — 과목 선생님과 해온 공부를 직접 짚어본다. 제목/설명 좌우
 *               분할 뒤, 윈터스쿨 참고 기록과 소형 FAQ는 중앙 40rem 폭으로 모은다
 *   D 상담·예약  원장님과 우선순위를 살펴본다 → 전화 · 네이버 예약 (유일한 CTA)
 * "성적·목표·우선순위" 논리는 D에서 한 번만 말한다. 목록·도식으로 반복하지 않는다.
 *
 * ── 반드시 지킬 것 ──────────────────────────────────────────
 * · 상담·전화·예약 버튼은 D 한 곳에만. 첫 화면·중간·헤더·하단 고정 바 금지.
 * · 첫 상담(원장님)과 과정 중 학습 점검(과목 선생님)을 섞지 않는다.
 * · 확인되지 않은 운영은 만들지 않는다 — 정원·소수 정원 보장, 점검 주기,
 *   전담·일대일 수업·무제한 피드백, 개별 과제·계획표·보고서, 무료 상담,
 *   수강료·수업 시간·개강일, 성적 상승·합격 보장, 등록 정책.
 * · 팝업·카운트다운·마감 임박·잔여 좌석·하단 고정 CTA·사진·아이콘·그라데이션 금지.
 * · 성적 근거는 lib/winter-results.ts에서만, 윈터스쿨 결과임과 비교 기준을
 *   명시하고 IS_PLACEHOLDER·isValid·서면 동의 조건을 그대로 따른다.
 * · 연락처·예약 주소는 lib/contact.ts 단일 소스. 파이널 상담은 전용 예약
 *   상품(NAVER_BOOKING_FINAL_URL)이라 홍대 일반 상담 차단 스위치를 타지 않는다.
 *
 * 레이아웃: 바깥 폭 1040px, 긴 본문은 40rem(640px) 안. 구간 번호·STEP·검은
 * 상단 선 없이 여백과 배경 변화로만 나눈다. 제목 600~700, 본문 400~500.
 * 사이트 전체가 다크 테마라 색은 이 파일과 StudentCompare에서 직접 지정한다.
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
import StudentCompare from "./StudentCompare";

// 전화번호는 lib/contact.ts의 CAMPUSES 단일 소스 — 여기서 새로 적지 않는다.
const [CAMPUS_HONGDAE] = CAMPUSES;

const ORANGE = "#f58846";

/** 키보드 포커스 표시 — 링크·버튼·아코디언·details가 전부 같은 스타일을 쓴다 */
const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f58846]";

/** 바깥 폭 — 데스크톱에서 1040px까지 쓴다 */
const WRAP = "mx-auto w-full max-w-[1040px] px-5 md:px-8";
/** 긴 본문 폭 — 읽기 편하게 640px 안 */
const PROSE = "max-w-[40rem]";

export default function FinalLanding() {
  return (
    <div className="min-h-dvh bg-[#fbfaf8] text-[#161616]">
      <FinalHeader />
      <main>
        <Hero />
        <StudentCompare />
        <Approach />
        <Consult />
      </main>
      <FinalFooter />
    </div>
  );
}

/* ------------------------------ 전용 최소 헤더 ------------------------------ */

function FinalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf8]/95 backdrop-blur-sm">
      <div className={`${WRAP} flex items-baseline gap-3 py-4`}>
        <Link
          href="/"
          aria-label="모두다른고양이 홈으로"
          className={`shrink-0 text-[15px] font-semibold tracking-tight ${FOCUS_RING}`}
        >
          모두다른고양이
        </Link>
        <span aria-hidden="true" className="text-black/25">
          |
        </span>
        <p className="truncate text-[15px] text-black/65">{FINAL_PROGRAM.shortName}</p>
      </div>
    </header>
  );
}

/* --------------------------------- A · 첫 화면 --------------------------------- */

function Hero() {
  return (
    <section aria-labelledby="final-hero-title" className={`${WRAP} pt-14 pb-6 md:pt-24 md:pb-10`}>
      <p className="text-[15px] font-medium md:text-base" style={{ color: ORANGE }}>
        {FINAL_PROGRAM.name}
      </p>
      <h1
        id="final-hero-title"
        className="mt-4 max-w-[46rem] text-[2rem] font-bold leading-[1.3] tracking-tight break-keep md:text-[3rem] md:leading-[1.25]"
      >
        수능까지 남은 시간은 같아도,{" "}
        <br className="hidden md:block" />
        필요한 공부는 다릅니다.
      </h1>
      <p className={`${PROSE} mt-6 text-[17px] leading-[1.8] break-keep text-black/75 md:text-lg`}>
        지금까지 해온 공부와 희망 대학을 함께 살펴보고,{" "}
        <br className="hidden md:block" />
        남은 기간에 집중할 부분을 찾습니다.
      </p>
      {/* 모집 페이지임을 한 줄로 — 표·목록·버튼 없음 */}
      <p className="mt-8 text-[15px] text-black/55 md:text-base">
        {FINAL_PROGRAM.target} · {FINAL_PROGRAM.venue}
      </p>
    </section>
  );
}

/* ----------------------------- C · 학원의 역할 ----------------------------- */

/** 과정 정보 — 값은 lib/final-program.ts 하나에서만 온다. 한 줄 메타로만 보여준다 */
const PROGRAM_META: [string, string][] = [
  ["대상", FINAL_PROGRAM.target],
  ["과목", FINAL_PROGRAM.subjects.join(" · ")],
  ["기간", `9월 모의평가 이후 ~ ${FINAL_PROGRAM.examDateLabel} 전`],
  ["장소", FINAL_PROGRAM.venue],
];

/** 실제 문의에 필요한 것만. D의 상담 설명과 겹치는 질문은 두지 않는다 */
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "지금 시작해도 늦지 않았나요?",
    a: "남은 기간에 전 범위를 처음부터 다시 보기는 어렵습니다. 그래서 지금까지 해온 공부를 먼저 확인하고, 유지할 부분과 보완할 부분을 나누어 시작합니다.",
  },
  {
    q: "9평 성적이 낮아도 상담할 수 있나요?",
    a: "네. 현재 성적과 무관하게 상담할 수 있습니다. 상담에서 성적 상승을 약속하지는 않습니다.",
  },
  {
    q: "수능 전까지 실기는 중단하나요?",
    a: "중단을 전제로 하지 않습니다. 희망 대학의 실기 비중과 현재 실기 일정을 보고, 실기를 유지하면서 학과에 쓸 수 있는 시간을 정합니다.",
  },
];

function Approach() {
  return (
    <section
      aria-labelledby="final-approach-title"
      className="border-t border-black/10 py-14 md:py-20"
    >
      <div className={WRAP}>
        {/* 데스크톱: 제목 왼쪽 · 설명 오른쪽. 모바일: 한 열 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <h2
            id="final-approach-title"
            className="text-[1.5rem] font-semibold leading-[1.35] tracking-tight break-keep md:text-[2rem]"
          >
            해온 공부부터,
            <br />
            과목 선생님과 직접 짚어봅니다.
          </h2>
          <div>
            <p className="text-[17px] leading-[1.8] break-keep text-black/80 md:text-lg">
              과정 중에는 국어·영어·사회탐구 선생님과 사용한 교재와 진도, 어려운
              부분을 이야기하며 학습 상태를 살펴봅니다.
            </p>
            <dl className="mt-8 grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 text-[15px] md:text-base">
              {PROGRAM_META.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-black/50">{label}</dt>
                  <dd className="break-keep text-black/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 실적·FAQ — 위의 넓은 2열에서 중앙의 좁은 본문 폭(40rem)으로 모은다.
            텍스트는 왼쪽 정렬, 래퍼만 가운데. 새 배경·카드 없음 */}
        <div className="mx-auto mt-12 max-w-[40rem] md:mt-16">
          {!IS_PLACEHOLDER && <Evidence />}

          <Accordion
            type="single"
            collapsible
            className="mt-10 border-t border-black/10 md:mt-12"
          >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="border-b border-black/10 last:border-b"
            >
              <AccordionTrigger
                className={`py-4 text-[17px] font-medium leading-snug tracking-tight break-keep hover:no-underline md:text-lg [&>svg]:size-5 [&>svg]:text-[#161616] ${FOCUS_RING} focus-visible:ring-0`}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[16px] leading-[1.8] break-keep text-black/75 md:text-[17px]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ------------------- 윈터스쿨 참고 기록 (C 안의 보조 정보) ------------------- */

/** "5 → 4"처럼 진단→재측정 등급을 표기. 오른 과목만 굵게 + 브랜드색 */
function GradeChange({ item, subject }: { item: WinterResultCase; subject: string }) {
  const r = item.results.find((x) => x.subject === subject);
  if (!r) return <span className="text-black/30">—</span>;
  const gain = getGain(r);
  return (
    <span className={`whitespace-nowrap tabular-nums ${gain > 0 ? "font-semibold" : "text-black/60"}`}>
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
 * 참고 기록이다. 출처 → "N명 중 M명" 한 줄 → 무슨 변화인지 → 비교 기준·
 * 면책 순서로 짧게 두고, 사례 표는 <details>로 접는다. 비율(rate)은 표로
 * 펼쳤을 때 한 번만 보여 같은 결과를 두 번 강조하지 않는다.
 * 노출 조건(IS_PLACEHOLDER·isValid·서면 동의)은 lib/winter-results.ts 그대로다.
 */
function Evidence() {
  const cohort = WINTER_COHORT;
  const summary = getWinterCohortSummary(cohort);
  const cases = getPublishableResults();
  if (!summary.isValid) return null;

  const allMeasured = cohort.measured === cohort.total;

  return (
    <div className="border-t border-black/10 pt-8">
      <p className="text-[15px] text-black/55 md:text-base">참고 · {cohort.term} 운영 결과</p>
      <p className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-tight tabular-nums md:text-[1.75rem]">
        {cohort.measured}명 중 {cohort.improved}명
      </p>
      <p className="mt-2 text-[17px] leading-[1.7] break-keep md:text-lg">
        {cohort.criterion}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed break-keep text-black/55 md:text-base">
        {cohort.basis}
        {allMeasured
          ? ` · 8주 수료 ${cohort.total}명 전원 재측정 참여`
          : ` · 8주 수료 ${cohort.total}명 중 ${cohort.measured}명 재측정 참여`}
        . 이번 파이널 집중반의 성과나 보장 수치가 아니며, 학생별 출발점과
        결과는 다릅니다.
      </p>

      {cases.length > 0 && (
        <details className="group mt-4">
          <summary
            className={`inline-flex cursor-pointer list-none items-center gap-2 rounded-sm text-[15px] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black md:text-base ${FOCUS_RING}`}
          >
            <span
              aria-hidden="true"
              className="inline-block text-black/40 transition-transform group-open:rotate-90"
            >
              ▸
            </span>
            서면 동의를 받아 공개하는 {cases.length}명의 변화 보기
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-t border-black/20 text-[15px] md:text-base">
              <caption className="sr-only">
                {cohort.term} 공개 사례 — 과목별 1주차 진단고사와 8주차 재측정 등급
              </caption>
              <thead>
                <tr className="border-b border-black/10 text-[14px] text-black/50">
                  <th scope="col" className="py-2.5 pr-2 text-left font-normal">
                    학생
                  </th>
                  {SUBJECT_ORDER.map((s) => (
                    <th key={s} scope="col" className="px-1 py-2.5 text-center font-normal">
                      {s}
                    </th>
                  ))}
                  <th scope="col" className="hidden py-2.5 pl-4 text-right font-normal md:table-cell">
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
                        <span className="font-semibold" style={{ color: ORANGE }}>
                          {bestGain}등급
                        </span>{" "}
                        상승
                      </>
                    ) : (
                      <span className="text-black/50">유지</span>
                    );
                  return (
                    <tr key={item.id} className="border-b border-black/10 align-top">
                      <th scope="row" className="py-3 pr-2 text-left font-normal">
                        {item.name}
                        <span className="block text-[14px] text-black/50 md:ml-2 md:inline">
                          {item.grade}
                        </span>
                        <span className="mt-1 block text-[14px] md:hidden">{bestLabel}</span>
                      </th>
                      {SUBJECT_ORDER.map((s) => (
                        <td key={s} className="px-1 py-3 text-center">
                          <GradeChange item={item} subject={s} />
                        </td>
                      ))}
                      <td className="hidden py-3 pl-4 text-right whitespace-nowrap md:table-cell">
                        {bestLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-[14px] text-black/50">
              1주차 진단고사 등급 → 8주차 재측정 등급 · 상승 비율 {summary.rate}
              {cohort.excluded ? ` · ${cohort.excluded}` : ""}
            </p>
          </div>
        </details>
      )}
    </div>
  );
}

/* ----------------------- D · 상담 안내 + 예약 (유일한 CTA) ----------------------- */

function Consult() {
  // 파이널 상담은 전용 네이버 예약 상품(NAVER_BOOKING_FINAL_URL)을 쓴다.
  // 윈터스쿨·컨설팅과 같은 검수 통과 사업자의 상품이라 홍대 일반 상담의
  // 차단 스위치(NAVER_BOOKING_PAUSED)와 무관하게 항상 실제 예약으로 이어진다.
  // 홍대 일반 상담 예약(CAMPUS_HONGDAE.bookingUrl)을 여기에 걸지 말 것 —
  // 그쪽은 검수 중이라 전화 안내 화면으로 빠진다.
  return (
    <section aria-labelledby="final-consult-title" className="bg-[#f2efe9] py-16 md:py-24">
      <div className={`${WRAP}`}>
        <div className="mx-auto max-w-[40rem] md:text-center">
          <h2
            id="final-consult-title"
            className="text-[1.5rem] font-semibold leading-[1.3] tracking-tight break-keep md:text-[2.25rem]"
          >
            내 성적과 목표라면,
            <br />
            무엇부터 준비해야 할까요?
          </h2>
          <p className="mt-5 text-[17px] leading-[1.8] break-keep text-black/80 md:text-lg">
            현재 성적과 희망 대학을 바탕으로,{" "}
            <br className="hidden md:block" />
            원장님과 남은 공부의 우선순위를 함께 살펴봅니다.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed break-keep text-black/55 md:text-base">
            9평 성적표나 가채점 결과가 있으면 상담에 도움이 됩니다.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${CAMPUS_HONGDAE.phone}`}
              aria-label={`${CAMPUS_HONGDAE.label} 전화 상담 ${CAMPUS_HONGDAE.phone}`}
              className={`inline-flex min-h-14 flex-1 flex-col items-center justify-center rounded-md bg-[#161616] px-6 py-3.5 text-center text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            >
              <span className="text-[17px] font-semibold md:text-lg">전화 상담</span>
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
              <span className="text-[17px] font-semibold md:text-lg">네이버로 상담 예약하기</span>
              <span className="mt-0.5 text-[15px] text-black/50">네이버 예약 · 홍대 본원</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- 푸터 ---------------------------------- */

function FinalFooter() {
  return (
    <footer className="border-t border-black/10 py-8" role="contentinfo">
      <div className={`${WRAP} flex flex-col gap-2 text-[15px] text-black/50 sm:flex-row sm:items-center sm:justify-between`}>
        <p>모두다른고양이 미술학원 · {FINAL_PROGRAM.venue}</p>
        <Link
          href="/"
          className={`rounded-sm underline decoration-black/20 underline-offset-4 transition-colors hover:text-black ${FOCUS_RING}`}
        >
          모두다른고양이 홈
        </Link>
      </div>
    </footer>
  );
}
