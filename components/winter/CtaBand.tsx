"use client";

import { motion } from "framer-motion";
import { Phone, PenLine } from "lucide-react";
import { CAMP_INFO } from "@/lib/winter-camp";

/** 섹션 사이에 반복 배치하는 전환용 CTA 밴드.
 *  읽다가 마음이 움직인 시점마다 신청 동선을 제공한다. */
export default function CtaBand({
  headline,
  sub,
}: {
  headline: React.ReactNode;
  sub?: React.ReactNode;
}) {
  const scrollToConsult = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("consult-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="px-6 py-14 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-3xl rounded-2xl border border-accent/30 bg-accent/[0.06] px-7 py-9 md:px-12 md:py-11 text-center"
      >
        <p className="text-xl md:text-2xl font-bold text-white leading-snug break-keep">
          {headline}
        </p>
        {sub && (
          <p className="mt-2.5 text-sm md:text-base text-white/60 break-keep">
            {sub}
          </p>
        )}
        <p className="mt-4 text-xs font-semibold tracking-wide text-accent">
          정원 {CAMP_INFO.capacityTotal}명 · {CAMP_INFO.capacityNote} 조기마감
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#consult-form"
            onClick={scrollToConsult}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-black transition-opacity hover:opacity-85 sm:w-auto"
          >
            <PenLine size={16} />
            상담 신청하기
          </a>
          <a
            href={CAMP_INFO.phoneTel}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 sm:w-auto"
          >
            <Phone size={16} />
            {CAMP_INFO.phone}
          </a>
        </div>
        <p className="mt-4 text-xs text-white/40">
          신청은 1분이면 충분합니다 · 밤에 남겨주셔도 다음 날 연락드립니다
        </p>
      </motion.div>
    </section>
  );
}
