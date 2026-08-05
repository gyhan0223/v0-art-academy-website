"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  TESTIMONIALS,
  TESTIMONIAL_TABS,
  SHOW_TESTIMONIALS,
  type TestimonialCategory,
} from "@/lib/winter-testimonials";

/** 학생 / 학부모 후기를 탭으로 구분해 보여주는 사회적 증거 섹션.
 *  기본 탭은 '학부모' — 이 페이지의 최종 결정권자가 학부모이기 때문. */
export default function Testimonials() {
  const [active, setActive] = useState<TestimonialCategory>(
    TESTIMONIAL_TABS[0].key,
  );

  if (!SHOW_TESTIMONIALS) return null;

  const items = TESTIMONIALS.filter((t) => t.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="후기 구분"
        className="flex flex-wrap justify-center gap-2"
      >
        {TESTIMONIAL_TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              active === tab.key
                ? "bg-accent text-black"
                : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <motion.figure
            key={`${active}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
          >
            <Quote size={20} className="text-accent/60" aria-hidden />
            <blockquote className="mt-4 flex-1 text-sm md:text-base leading-relaxed text-white/80 break-keep">
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-white">{t.author}</span>
              {t.meta && (
                <span className="ml-2 text-white/45">{t.meta}</span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
