"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, PenLine } from "lucide-react";
import { CAMP_INFO, getCapacityLabel } from "@/lib/winter-camp";
import { CONSULT_HREF, goToConsult } from "@/components/winter/shared";
import { NaverTalkButton } from "@/components/academy/NaverTalk";

/** 섹션 사이에 반복 배치하는 전환용 CTA 밴드.
 *  읽다가 마음이 움직인 시점마다 신청 동선을 제공한다. */
export default function CtaBand({
  headline,
  sub,
}: {
  headline: React.ReactNode;
  sub?: React.ReactNode;
}) {
  const seatLabel = getCapacityLabel();

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
          {seatLabel}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* 상담 폼이 같은 페이지에 있으면 스크롤, 하위 페이지에서는 /winter로 이동 */}
          <Link
            href={CONSULT_HREF}
            onClick={goToConsult}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-black transition-opacity hover:opacity-85 sm:w-auto"
          >
            <PenLine size={16} />
            상담 신청하기
          </Link>
          <a
            href={CAMP_INFO.phoneTel}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 sm:w-auto"
          >
            <Phone size={16} />
            {CAMP_INFO.phone}
          </a>
          {/* 아직 신청까지는 아닌 분들 — 톡톡으로 먼저 물을 수 있게 */}
          <NaverTalkButton className="w-full px-8 py-4 text-base sm:w-auto" />
        </div>
        <p className="mt-4 text-xs text-white/40">
          신청은 1분이면 충분합니다 · 밤에 남겨주셔도 다음 날 연락드립니다
        </p>
      </motion.div>
    </section>
  );
}
