"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// 1. 전달해주신 대학별 합격자 데이터를 구조화했습니다.
const universityCards = [
  {
    name: "서울대학교",
    total: "252",
    recent: "5",
    logo: "/images/logo-snu.png",
    color: "#1D418A",
    logoSize: { mobile: "120vw", desktop: "80vw" },
    logoOpacity: "opacity-10",
    scale: 1,
  },
  {
    name: "홍익대학교",
    total: "792",
    recent: "28",
    logo: "/images/logo-hongik.png",
    color: "#9C1F22",
    logoSize: { mobile: "150vw", desktop: "150vw" },
    logoOpacity: "opacity-10",
    scale: 1.6,
  },
  {
    name: "국민대학교",
    total: "438",
    recent: "22",
    logo: "/images/logo-kookmin.png",
    color: "#0054A6",
    logoSize: { mobile: "110vw", desktop: "70vw" },
    logoOpacity: "opacity-25", // 가독성을 위해 투명도 상향 유지
    scale: 1,
  },
  {
    name: "이화여자대학교",
    total: "530",
    recent: "9",
    logo: "/images/logo-ewha.png",
    color: "#004933",
    logoSize: { mobile: "130vw", desktop: "85vw" },
    logoOpacity: "opacity-30", // 가독성을 위해 투명도 상향 유지
    scale: 1,
  },
];

export default function Scene2() {
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

            {/* 합격 실적 데이터 */}
            <div className="flex flex-col gap-2 md:gap-4">
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
                  2026학년도{" "}
                  <span className="text-yellow-400">{card.recent}</span>명 합격
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
