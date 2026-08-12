"use client";

/**
 * 합격 실적 섹션.
 * 설득 순서: 최근(2026학년도) 결과 → 대표 합격 사례 → 누적 실적(신뢰 보강) → 교육 과정 브릿지.
 * 누적을 앞세우지 않고 "지금도 결과를 내는 학원"이라는 인상을 먼저 만든다.
 * 데이터는 lib/admissions-data.ts 하나만 고치면 된다.
 */

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import AdmissionListModal from "@/components/AdmissionListModal";
import {
  universityCards,
  admissionLists,
  RECENT_YEAR,
  type UniversityCard,
} from "@/lib/admissions-data";

/** 대표 사례로 내세울 대학·학과 — 명단 데이터에 실제로 있는 항목만 고른다 */
const FEATURED_PICKS = [
  { university: "서울대학교", major: "디자인과" },
  { university: "홍익대학교", major: "디자인학부" },
  { university: "국민대학교", major: "자동차운송디자인과" },
];

const featuredCases = FEATURED_PICKS.flatMap((pick) => {
  const card = universityCards.find((c) => c.name === pick.university);
  const admittee = admissionLists[pick.university]?.admittees.find(
    (a) => a.major === pick.major,
  );
  return card && admittee ? [{ ...pick, card, name: admittee.name }] : [];
});

/** "이화여자대학교" → "이화여대", "서울대학교" → "서울대" */
const shortName = (name: string) =>
  name.replace("여자대학교", "여대").replace("대학교", "대");

/** 최근 결과 리스트 배지용 영문 약칭 — 인장형 공식 로고는 작은 크기에서 뭉개져 쓰지 않는다 */
const UNIVERSITY_ABBR: Record<string, string> = {
  서울대학교: "SNU",
  홍익대학교: "HONGIK",
  국민대학교: "KMU",
  이화여자대학교: "EWHA",
  건국대학교: "KONKUK",
};

const recentTotal = universityCards.reduce(
  (sum, c) => sum + Number(c.recent),
  0,
);
const cumulativeTotal = universityCards.reduce(
  (sum, c) => sum + Number(c.total),
  0,
);

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function Scene2() {
  const [selected, setSelected] = useState<UniversityCard | null>(null);

  return (
    <section className="relative w-full bg-black px-6 py-24 md:py-36 overflow-hidden">
      {/* 은은한 상단 광원 — Scene1의 오렌지 글로우와 톤을 잇는다 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245, 136, 70, 0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* ---- 1. 최근 학년도 합격 결과 (주인공) ---- */}
        <motion.div {...fadeUp} className="text-center">
          <span className="inline-block text-primary font-bold tracking-widest text-xs md:text-sm uppercase px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            Class of 2026
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-white break-keep">
            {RECENT_YEAR} 합격 결과
          </h2>
          {/* 설명하지 않는다 — 결과 자체가 말하게 둔다 */}
          <p className="mt-6 text-sm md:text-base text-white/45 tracking-wide break-keep">
            {universityCards.map((c) => shortName(c.name)).join(" · ")}
          </p>
          <p className="mt-2 text-lg md:text-2xl font-bold text-white">
            주요 5개 대학 총{" "}
            <span className="text-primary">{recentTotal}명</span> 합격
          </p>
        </motion.div>

        {/* 최근 결과 원장 — 같은 정보를 카드로 반복하지 않고 한 장의 표로 압축 */}
        <motion.div {...fadeUp} className="mt-12 md:mt-16">
          <ul className="border-t border-white/10">
            {universityCards.map((card) => (
              <li key={card.name} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setSelected(card)}
                  aria-label={`${card.name} ${RECENT_YEAR} 합격자 명단 보기`}
                  className="group flex w-full items-center justify-between gap-4 py-5 md:py-6 px-1 md:px-3 transition-colors hover:bg-white/5 cursor-pointer"
                >
                  <span className="flex items-center gap-3 md:gap-4 min-w-0">
                    {/* 통일 규격의 약칭 pill 배지 — 브랜드 컬러는 옅은 배경·테두리로만 쓰고,
                        학교명·합격자 수를 보조하는 요소로 조용히 둔다 */}
                    <span
                      aria-hidden
                      className="flex items-center justify-center w-16 md:w-20 h-7 md:h-8 shrink-0 rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.12em] text-white/85"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${card.color} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${card.color} 30%, transparent)`,
                      }}
                    >
                      {UNIVERSITY_ABBR[card.name] ?? shortName(card.name)}
                    </span>
                    <span className="text-lg md:text-2xl font-bold text-white tracking-tight truncate">
                      {card.name}
                    </span>
                  </span>

                  <span className="flex items-center gap-2 md:gap-3 shrink-0">
                    <span className="text-2xl md:text-4xl font-black tabular-nums text-primary">
                      {card.recent}
                      <span className="ml-1 text-sm md:text-lg font-semibold text-white/70">
                        명
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs md:text-sm text-white/40">
            학교를 누르면 {RECENT_YEAR} 학과별 합격자 명단을 볼 수 있습니다.
          </p>
        </motion.div>

        {/* ---- 2. 대표 합격 사례 ---- */}
        <motion.div {...fadeUp} className="mt-24 md:mt-32">
          <p className="text-white/40 text-xs md:text-sm tracking-[0.25em] uppercase text-center">
            Featured Cases
          </p>
          <h3 className="mt-3 text-2xl md:text-4xl font-black text-white text-center tracking-tight break-keep">
            {RECENT_YEAR} 대표 합격 사례
          </h3>

          <div className="mt-10 md:mt-14 grid gap-4 md:gap-6 md:grid-cols-3">
            {featuredCases.map((item) => (
              <div
                key={`${item.university}-${item.major}`}
                className="relative rounded-2xl bg-white/[0.04] p-6 md:p-8 overflow-hidden"
              >
                {/* 대학 브랜드 컬러 바 — 카드마다 다른 정체성을 부여 */}
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: item.card.color }}
                />
                {item.card.logo && (
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.07] pointer-events-none">
                    <Image
                      src={item.card.logo}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                )}

                <p className="text-white/50 text-xs tracking-widest">
                  {RECENT_YEAR}
                </p>
                <p className="mt-3 text-xl md:text-2xl font-black text-white tracking-tight break-keep">
                  {item.university}
                </p>
                <p className="mt-1 text-base md:text-lg font-semibold text-white/85 break-keep">
                  {item.major} <span className="text-primary">합격</span>
                </p>
                <p className="mt-4 text-sm text-white/45">{item.name} 학생</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---- 3. 누적 실적 — 최근 결과가 우연이 아님을 증명하는 보조 정보 ---- */}
        <motion.div {...fadeUp} className="mt-24 md:mt-32 text-center">
          <h3 className="text-xl md:text-3xl font-bold text-white/85 tracking-tight break-keep">
            그리고 이 결과는
            <br className="md:hidden" /> 하루아침에 만들어지지 않았습니다
          </h3>
          <p className="mt-4 text-sm md:text-base text-white/50 break-keep">
            같은 5개 대학 기준, 누적{" "}
            <span className="text-white/85 font-semibold tabular-nums">
              {cumulativeTotal.toLocaleString()}명
            </span>
            이 합격했습니다.
          </p>

          <dl className="mt-10 md:mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-5 border-t border-white/10 pt-10">
            {universityCards.map((card) => (
              <div key={card.name} className="flex flex-col items-center gap-1">
                <dd className="order-2 text-3xl md:text-4xl font-black tabular-nums text-white/80">
                  {Number(card.total).toLocaleString()}
                </dd>
                <dt className="order-1 text-xs md:text-sm text-white/40 break-keep">
                  {card.name}
                </dt>
              </div>
            ))}
          </dl>
        </motion.div>

      </div>

      <AdmissionListModal card={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
