"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import AdmissionListModal from "@/components/AdmissionListModal";
import {
  universityCards,
  RECENT_YEAR,
  type UniversityCard,
} from "@/lib/admissions-data";

export default function Scene2() {
  const [selected, setSelected] = useState<UniversityCard | null>(null);

  return (
    <section className="relative w-full bg-black">
      {" "}
      {universityCards.map((card, index) => (
        <div
          key={index}
          className="sticky top-0 h-dvh w-full flex items-center justify-center overflow-hidden"
        >
          <div
            className="absolute left-0 w-full top-[1px] h-[calc(100dvh-2px)] -z-10"
            style={{ backgroundColor: card.color }}
          />
          {/* 상단 그림자 효과 */}
          {index > 0 && (
            <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-black/50 to-transparent pointer-events-none z-20" />
          )}

          {/* 배경 로고 워터마크 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div
              className={`relative transition-all duration-500 ${card.logoOpacity}`}
              style={
                {
                  width: `var(--logo-width)`,
                  height: `var(--logo-width)`,
                  "--logo-width": "min(120vw, 80vh)", // 화면을 넘어가지 않도록 보정
                  transform: `scale(${card.scale})`, // 💡 데이터에서 지정한 배수만큼 화면에서 확대됨
                } as any
              }
            >
              <Image
                src={card.logo}
                alt={`${card.name} 배경 로고`}
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>

          {/* 텍스트 레이어: 대학명 + 합격자 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}
            className="relative z-10 text-center px-6 w-full flex flex-col items-center gap-6 md:gap-10"
          >
            {/* 대학교 이름 */}
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
              {card.name}
            </h2>

            {/* 합격 실적 데이터 - 클릭 시 합격자 명단 */}
            <button
              type="button"
              onClick={() => setSelected(card)}
              aria-label={`${card.name} 합격자 명단 보기`}
              className="flex flex-col gap-2 md:gap-4 rounded-2xl px-6 py-4 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <span className="text-white/60 text-sm md:text-lg tracking-widest uppercase font-medium">
                  Cumulative Total
                </span>
                <span className="text-3xl md:text-5xl font-bold text-white">
                  누적 합격자{" "}
                  <span className="text-yellow-400">{card.total}</span>명
                </span>
              </div>

              <div className="h-px w-12 bg-white/20 mx-auto my-2" />

              <div className="flex flex-col items-center">
                <span className="text-white/60 text-sm md:text-lg tracking-widest uppercase font-medium">
                  Class of 2026
                </span>
                <span className="text-2xl md:text-4xl font-semibold text-white/90">
                  {RECENT_YEAR}{" "}
                  <span className="text-yellow-400">{card.recent}</span>명 합격
                </span>
              </div>

              <span className="mt-2 text-white/50 text-xs md:text-sm tracking-wide">
                합격자 명단 보기
              </span>
            </button>
          </motion.div>
        </div>
      ))}

      <AdmissionListModal
        card={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
