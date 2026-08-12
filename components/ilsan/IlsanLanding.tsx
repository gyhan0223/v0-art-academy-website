"use client";

/**
 * 일산캠퍼스 랜딩(/ilsan).
 *
 * 2027학년도 예비 고3(현 고2)이 1순위, 예비 고2(현 고1)가 2순위 타겟인
 * 상담 전환용 페이지. 흐름은 "현재 준비 상태 확인 → 목표 설정 → 필요한
 * 실기 방향 파악 → 상담" — 불안·긴급성을 자극하는 문구("지금 안 하면
 * 늦습니다" 류)는 넣지 않는다는 것이 이 페이지의 규칙이다.
 *
 * 사이트 전체가 다크 테마인 것과 달리 이 페이지만 밝은 배경을 쓴다.
 * (SiteNav가 /ilsan에서는 처음부터 불투명해지도록 처리되어 있다.)
 *
 * 합격 실적은 lib/admissions-data.ts를 그대로 쓰되, 일산 단독 실적처럼
 * 보이면 안 되므로 "모두다른고양이 전체 합격 실적 기준"을 반드시 밝힌다.
 *
 * CTA에는 광고 전환 추적용 id/data-cta를 붙인다(클릭 위치 구분):
 * ilsan_hero_consult · ilsan_bottom_consult · ilsan_bottom_call
 */

import { useState } from "react";
import { motion } from "framer-motion";
import AdmissionListModal from "@/components/AdmissionListModal";
import {
  universityCards,
  RECENT_YEAR,
  type UniversityCard,
} from "@/lib/admissions-data";
import {
  ILSAN_INFO,
  ILSAN_AUDIENCE,
  ILSAN_FLOW,
  ILSAN_SCHEDULE,
  ILSAN_FACTS,
} from "@/lib/ilsan";

/** 스크롤 시 살짝 떠오르는 정도만 — 이 페이지는 motion을 절제해서 쓴다 */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/** 본문 공통 폭 — 네비(max-w-5xl)와 같은 축을 쓰고 텍스트는 그 안에서 좁힌다 */
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

export default function IlsanLanding() {
  return (
    <main className="bg-[#fbfaf8] text-[#161616]">
      <Hero />
      <Audience />
      <Direction />
      <Hours />
      <Results />
      <Facts />
      <FinalCta />
    </main>
  );
}

/* --------------------------------- HERO ---------------------------------- */

function Hero() {
  const scrollToHours = (e: React.MouseEvent) => {
    const el = document.getElementById("ilsan-hours");
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="pt-36 pb-20 md:pt-48 md:pb-28">
      <Container>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-[11px] font-semibold tracking-[0.3em] text-accent md:text-xs"
        >
          MODAGO ILSAN · 입시미술 실기
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="text-[2.5rem] font-black leading-[1.18] tracking-tight break-keep md:text-6xl"
        >
          고3이 되기 전,
          <br />
          실기 준비의 <span className="text-accent">방향</span>을 점검할 때.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
        >
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-black/60 break-keep md:text-lg">
            목표 대학도, 현재 실력도 학생마다 다릅니다.
            <br />
            일산 모다고는 예비 고2·고3 학생이 자신의 목표에 맞는 실기 준비를
            이어갈 수 있도록 함께 방향을 잡습니다.
          </p>

          <p className="mt-6 font-mono text-xs tracking-wide text-black/40 md:text-sm">
            {ILSAN_INFO.hours} · 입시미술 실기 · 일산 캠퍼스
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              id="ilsan_hero_consult"
              data-cta="ilsan_hero_consult"
              data-campus="ilsan"
              href={ILSAN_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-accent px-7 py-3.5 text-[15px] font-semibold text-black transition-opacity hover:opacity-85"
            >
              일산 캠퍼스 상담 예약
            </a>
            <a
              href="#ilsan-hours"
              onClick={scrollToHours}
              className="text-[15px] font-medium text-black/55 transition-colors hover:text-black"
            >
              수업 방식 알아보기 ↓
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------- SECTION 2 — 대상 학생 -------------------------- */

function Audience() {
  return (
    <section className="border-t border-black/[0.07] py-20 md:py-28">
      <Container>
        <motion.h2
          {...fadeUp}
          className="text-3xl font-black tracking-tight break-keep md:text-4xl"
        >
          지금 이런 준비를 하고 있다면
        </motion.h2>

        <div className="mt-12 md:mt-16">
          {ILSAN_AUDIENCE.map((item) => (
            <motion.div
              key={item.no}
              {...fadeUp}
              className="grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-black/[0.07] py-8 first:border-t-0 first:pt-0 md:grid-cols-[8rem_1fr] md:py-10"
            >
              <div>
                <span className="font-mono text-2xl font-bold text-accent md:text-3xl">
                  {item.no}
                </span>
                <span className="mt-1 hidden text-xs font-medium tracking-wide text-black/40 md:block">
                  {item.grade}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold leading-snug break-keep md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-black/55 break-keep md:text-base">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------ SECTION 3 — 핵심 메시지 ------------------------- */

function Direction() {
  return (
    <section className="border-t border-black/[0.07] py-20 md:py-28">
      <Container>
        <motion.h2
          {...fadeUp}
          className="text-3xl font-black leading-snug tracking-tight break-keep md:text-4xl"
        >
          잘 그리는 것보다 먼저,
          <br />
          어디를 향해 준비하는지 알아야 합니다.
        </motion.h2>

        {/* Flow: 데스크톱은 가로, 모바일은 세로 흐름 */}
        <motion.div
          {...fadeUp}
          className="mt-14 flex flex-col items-start gap-4 md:mt-20 md:flex-row md:items-center md:justify-between md:gap-3"
        >
          {ILSAN_FLOW.map((step, i) => {
            const last = i === ILSAN_FLOW.length - 1;
            return (
              <div
                key={step}
                className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-3"
              >
                <span
                  className={`text-2xl font-black tracking-tight md:text-3xl ${
                    last ? "text-accent" : ""
                  }`}
                >
                  {step}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="pl-1 text-xl text-black/25 md:pl-0 md:text-2xl"
                  >
                    <span className="hidden md:inline">→</span>
                    <span className="md:hidden">↓</span>
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>

        <motion.div {...fadeUp} className="mt-14 max-w-2xl md:mt-20">
          <p className="text-base leading-relaxed text-black/60 break-keep md:text-lg">
            같은 고2라도 목표 대학과 전형에 따라 준비해야 할 실기는 달라집니다.
          </p>
          <p className="mt-3 text-base leading-relaxed text-black/60 break-keep md:text-lg">
            무작정 진도를 나가기보다 현재 위치와 목표를 먼저 확인하고, 앞으로
            무엇을 준비할지 방향을 잡는 것이 중요합니다.
          </p>
          {/* "모두다른고양이"라는 이름과 이어지는 한 줄 — 길게 풀지 않는다 */}
          <p className="mt-8 text-sm font-medium text-black/40 break-keep">
            학생마다 목표와 상황이 다르기에, 준비 방식도 모두 달라야 한다고
            믿습니다. 그래서 이름도 모두다른고양이입니다.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------ SECTION 4 — 운영 방식 --------------------------- */

function Hours() {
  return (
    <section
      id="ilsan-hours"
      className="border-t border-black/[0.07] py-20 md:py-28 scroll-mt-20"
    >
      <Container>
        <motion.h2
          {...fadeUp}
          className="text-3xl font-black tracking-tight break-keep md:text-4xl"
        >
          평일 저녁은 실기에 집중합니다.
        </motion.h2>

        <motion.div
          {...fadeUp}
          className="mt-14 flex flex-col items-center md:mt-20"
        >
          {ILSAN_SCHEDULE.map((slot, i) => (
            <div key={slot.figure} className="flex flex-col items-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="my-5 h-10 w-px bg-black/15 md:my-6 md:h-12"
                />
              )}
              <span className="font-mono text-5xl font-black tracking-tight md:text-7xl">
                {slot.figure}
              </span>
              <span className="mt-2 text-sm text-black/50 md:text-base">
                {slot.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="mx-auto mt-14 max-w-2xl text-center md:mt-20">
          <p className="text-base leading-relaxed text-black/60 break-keep md:text-lg">
            일산 캠퍼스에서는 학과 수업을 운영하지 않습니다.
          </p>
          <p className="mt-3 text-base leading-relaxed text-black/60 break-keep md:text-lg">
            학교와 학과 공부를 이어가면서 평일 저녁 시간을 활용해 입시미술
            실기에 집중할 수 있도록 운영합니다.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------ SECTION 5 — 합격 실적 --------------------------- */

function Results() {
  const [selected, setSelected] = useState<UniversityCard | null>(null);

  return (
    <section className="border-t border-black/[0.07] py-20 md:py-28">
      <Container>
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-black tracking-tight break-keep md:text-4xl">
            모두다른고양이가 만들어온 결과
          </h2>
          {/* 일산 단독 실적으로 오해되지 않도록 제목 바로 아래에 명시한다 */}
          <p className="mt-4 text-sm font-medium text-black/55">
            ※ 모두다른고양이 전체 합격 실적 기준
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-10 md:mt-14">
          {universityCards.map((card) => (
            <li key={card.name} className="border-t border-black/[0.07] last:border-b">
              <button
                type="button"
                onClick={() => setSelected(card)}
                aria-label={`${card.name} ${RECENT_YEAR} 합격자 명단 보기`}
                className="flex w-full items-baseline justify-between gap-4 py-6 text-left transition-colors hover:bg-black/[0.025] md:py-7"
              >
                <span className="text-lg font-bold tracking-tight md:text-2xl">
                  {card.name}
                </span>
                <span className="text-right">
                  <span className="block text-xl font-black md:text-2xl">
                    {RECENT_YEAR}{" "}
                    <span className="text-accent">{card.recent}</span>명
                  </span>
                  <span className="mt-1 block text-xs text-black/40 md:text-[13px]">
                    누적 {card.total}명 · 명단 보기
                  </span>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      </Container>

      <AdmissionListModal card={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ----------------------- SECTION 6 — 확인용 정보 -------------------------- */

function Facts() {
  return (
    <section className="border-t border-black/[0.07] py-20 md:py-28">
      <Container>
        <motion.h2
          {...fadeUp}
          className="text-3xl font-black tracking-tight break-keep md:text-4xl"
        >
          학생에게 맞는 선택인지부터
          <br className="md:hidden" /> 확인해보세요.
        </motion.h2>

        <motion.dl {...fadeUp} className="mt-10 max-w-3xl md:mt-14">
          {ILSAN_FACTS.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-black/[0.07] py-4.5 first:border-t-0 md:grid-cols-[10rem_1fr] md:py-5"
            >
              <dt className="text-sm text-black/45 md:text-[15px]">
                {row.label}
              </dt>
              <dd className="text-[15px] font-medium leading-relaxed break-keep md:text-base">
                {row.value}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-black/[0.07] py-4.5 md:grid-cols-[10rem_1fr] md:py-5">
            <dt className="text-sm text-black/45 md:text-[15px]">전화</dt>
            <dd className="text-[15px] font-medium md:text-base">
              <a
                href={ILSAN_INFO.phoneTel}
                className="transition-colors hover:text-accent"
              >
                {ILSAN_INFO.phone}
              </a>
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-black/[0.07] py-4.5 md:grid-cols-[10rem_1fr] md:py-5">
            <dt className="text-sm text-black/45 md:text-[15px]">위치</dt>
            <dd className="text-[15px] font-medium leading-relaxed break-keep md:text-base">
              {ILSAN_INFO.address}
              <a
                href={ILSAN_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 whitespace-nowrap text-sm text-accent hover:underline"
              >
                지도 보기 ↗
              </a>
            </dd>
          </div>
        </motion.dl>
      </Container>
    </section>
  );
}

/* -------------------------- SECTION 7 — 마무리 CTA ------------------------ */

function FinalCta() {
  return (
    <section className="border-t border-black/[0.07] py-24 md:py-32">
      <Container className="text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-black tracking-tight break-keep md:text-5xl">
            준비 방향부터 이야기해보세요.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-black/60 break-keep md:text-lg">
            학원을 옮겨야 하는지부터 결정할 필요는 없습니다.
            <br />
            현재 어떤 준비를 하고 있고, 앞으로 무엇이 필요한지 먼저
            상담해보세요.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            <a
              id="ilsan_bottom_consult"
              data-cta="ilsan_bottom_consult"
              data-campus="ilsan"
              href={ILSAN_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 text-base font-semibold text-black transition-opacity hover:opacity-85"
            >
              일산 모다고 상담 예약
            </a>
            <a
              id="ilsan_bottom_call"
              data-cta="ilsan_bottom_call"
              data-campus="ilsan"
              href={ILSAN_INFO.phoneTel}
              className="font-mono text-sm tracking-wide text-black/55 transition-colors hover:text-black md:text-base"
            >
              전화 상담 {ILSAN_INFO.phone}
            </a>
          </div>
        </motion.div>

        {/* 페이지 하단 정보 줄 — 별도 푸터가 없는 사이트 구조에 맞춘 최소 표기 */}
        <div className="mt-24 border-t border-black/[0.07] pt-8 text-xs leading-relaxed text-black/35 md:mt-32">
          <p>
            {ILSAN_INFO.name} · {ILSAN_INFO.address}
          </p>
          <p className="mt-1.5">
            {ILSAN_INFO.hours} ·{" "}
            <a
              href={ILSAN_INFO.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black/60"
            >
              일산 캠퍼스 블로그
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
