"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Snowflake } from "lucide-react";
import {
  CAMP_INFO,
  getRemainingLabel,
  getRemainingTotal,
} from "@/lib/winter-camp";

/** 홈 — 합격실적(Scene2)과 커리큘럼(Scene3) 사이에 배치되는 윈터캠프 와이드 배너 */
export default function WinterBanner() {
  const remainingTotal = getRemainingTotal();
  const statusLabel =
    remainingTotal <= 0 ? "마감" : `Winter Camp · ${getRemainingLabel()}`;

  return (
    <section className="bg-black px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-5xl"
      >
        <Link
          href="/winter"
          className="group relative block overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/[0.08] via-white/[0.03] to-transparent p-8 transition-colors hover:border-accent/50 md:p-12"
        >
          <Snowflake
            size={180}
            strokeWidth={0.5}
            className="pointer-events-none absolute -right-8 -top-8 text-accent/10 transition-transform duration-700 group-hover:rotate-45"
          />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-accent uppercase">
                {statusLabel}
              </p>
              <h3 className="mt-3 text-2xl md:text-4xl font-black tracking-tight text-white break-keep">
                {CAMP_INFO.name}
              </h3>
              <p className="mt-3 text-sm md:text-base text-white/60 break-keep">
                홍대 본원 8주 기숙 · 학과 직강 + 실기 주말집중 + 숙식 · 정원{" "}
                {CAMP_INFO.capacityTotal}명
                {remainingTotal > 0 &&
                  remainingTotal < CAMP_INFO.capacityTotal && (
                    <span className="text-accent">
                      {" "}
                      · {getRemainingLabel()}
                    </span>
                  )}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform group-hover:translate-x-1">
              {remainingTotal <= 0 ? "대기 신청" : "자세히 보기"}
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
