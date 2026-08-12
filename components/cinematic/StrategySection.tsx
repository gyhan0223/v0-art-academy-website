"use client";

/**
 * 수능 중심 미대입시 포지셔닝 섹션.
 * 합격 실적(Scene2) 바로 뒤에서 "왜 이런 결과가 나오는가"에 답한다:
 * 실기만 가르치는 학원이 아니라, 목표 대학 기준으로 수능과 실기를 함께 설계한다.
 * 마지막 한 줄이 실기 커리큘럼(Scene3)으로 흐름을 넘긴다.
 */

import { motion } from "framer-motion";

const STEPS = [
  {
    title: "목표 대학 기준 설정",
    desc: "희망 대학에 필요한 수능 성적과 실기 수준을 먼저 확인합니다.",
  },
  {
    title: "수능 성적 관리",
    desc: "최상위권 미대 지원 가능성을 결정하는 수능을 실기와 같은 무게로 다룹니다.",
  },
  {
    title: "수능과 실기의 시간 배분",
    desc: "학생의 현재 위치와 입시 시기에 따라 두 축의 비중을 조절합니다.",
  },
  {
    title: "수능 이후 실기 집중",
    desc: "수능이 끝나면 대학별 실기 전형에 맞춰 완전히 전환합니다.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function StrategySection() {
  return (
    <section className="relative w-full bg-black px-6 py-24 md:py-32 overflow-hidden">
      {/* 은은한 좌측 광원 — 합격 실적과 톤을 이으면서 새 이야기가 시작됨을 알린다 */}
      <div
        className="absolute top-1/4 -left-1/4 w-[70vw] h-[60vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245, 136, 70, 0.07), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto grid gap-14 md:gap-16 md:grid-cols-[1fr_1.1fr] md:items-center">
        {/* ---- 메시지: 수능부터 설계한다 ---- */}
        <motion.div {...fadeUp}>
          <span className="inline-block text-primary font-bold tracking-widest text-xs md:text-sm uppercase px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            The Strategy
          </span>
          <p className="mt-7 text-lg md:text-xl font-semibold text-white/55 break-keep">
            실기만 잘해서 만들어진 결과가 아닙니다
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight text-white break-keep">
            최상위권 미대는
            <br />
            <span
              className="text-primary"
              style={{
                textShadow:
                  "0 0 40px rgba(245, 136, 70, 0.35), 0 0 80px rgba(245, 136, 70, 0.15)",
              }}
            >
              수능부터 설계
            </span>
            해야 합니다
          </h2>
          <p className="mt-6 text-white/60 text-base md:text-lg leading-relaxed break-keep">
            서울대·홍익대·국민대 등 최상위권 미대 입시에서 수능 성적은 지원
            가능한 대학과 합격 가능성을 결정합니다. 모다고는 실기 수업에 수능을
            얹는 것이 아니라, 목표 대학을 기준으로 수능과 실기를 하나의 입시로
            설계합니다.
          </p>
        </motion.div>

        {/* ---- 설계 흐름: 카드 나열 대신 하나의 타임라인으로 ---- */}
        <motion.ol {...fadeUp} className="flex flex-col">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5 md:gap-6">
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-black tabular-nums">
                  0{i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="w-px flex-1 bg-linear-to-b from-primary/30 to-white/5" />
                )}
              </div>
              <div className={i < STEPS.length - 1 ? "pb-9" : ""}>
                <p className="pt-2 text-lg md:text-xl font-bold text-white break-keep">
                  {step.title}
                </p>
                <p className="mt-1.5 text-sm md:text-base text-white/55 leading-relaxed break-keep">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </motion.ol>
      </div>

      {/* 실기 커리큘럼으로 넘기는 한 줄 — 수능을 강조했다고 실기가 약한 게 아니다 */}
      <motion.p
        {...fadeUp}
        className="relative z-10 mt-16 md:mt-24 text-center text-base md:text-xl font-semibold text-white/60 break-keep"
      >
        수능만으로도, 실기만으로도 완성되지 않습니다
      </motion.p>
    </section>
  );
}
