"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// 1. 데이터에 logoOpacity 속성을 추가하여 개별 투명도를 설정합니다.
const universityCards = [
  {
    text: "기초가 탄탄해야",
    highlight: false,
    logo: "/images/logo-snu.png",
    color: "#0F0F70",
    logoSize: { mobile: "120vw", desktop: "70vw" },
    logoOpacity: "opacity-10", // 굵은 로고는 10% 유지
  },
  {
    text: "창의가 빛난다",
    highlight: true,
    logo: "/images/logo-hongik.png",
    color: "#1833DB",
    logoSize: { mobile: "150vw", desktop: "100vw" },
    logoOpacity: "opacity-10",
  },
  {
    text: "매 순간의 선택이",
    highlight: false,
    logo: "/images/logo-kookmin.png",
    color: "#004F9E",
    logoSize: { mobile: "110vw", desktop: "60vw" },
    logoOpacity: "opacity-25", // 선이 얇은 로고는 20~30%로 투명도를 올림
  },
  {
    text: "작품이 된다",
    highlight: true,
    logo: "/images/logo-ewha.png",
    color: "#00643E",
    logoSize: { mobile: "130vw", desktop: "70vw" },
    logoOpacity: "opacity-30", // 가장 디테일이 많은 로고는 더 밝게
  },
];

export default function Scene2() {
  return (
    <section className="relative w-full bg-background">
      {universityCards.map((card, index) => (
        <div
          key={index}
          // 💡 핵심: h-screen과 sticky top-0을 사용하여 스크롤 시 다음 카드가 이전 카드를 덮어씌웁니다.
          className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: card.color }}
        >
          {/* 이전 카드를 덮을 때 입체감을 주는 상단 그림자 */}
          {index > 0 && (
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-20" />
          )}

          {/* 배경 로고 워터마크 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {/* 2. 데이터에서 가져온 개별 사이즈를 인라인 스타일로 적용합니다. */}
            <div
              className="relative transition-all duration-500"
              style={
                {
                  // 브라우저 너비에 따라 반응형으로 작동하도록 CSS 변수나 미디어 쿼리 대신
                  // 단순하게 모바일/데스크탑 값을 상황에 맞춰 조절할 수 있습니다.
                  width: `var(--logo-width)`,
                  height: `var(--logo-width)`,
                  // Tailwind의 arbitrary values나 CSS 변수를 활용해 반응형 구현
                  "--logo-width":
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? card.logoSize.mobile
                      : card.logoSize.desktop,
                } as any
              }
            >
              <Image
                src={card.logo}
                alt={`${card.text} 배경 로고`}
                fill
                className="object-contain brightness-0 invert opacity-10"
              />
            </div>
          </div>

          {/* 텍스트 레이어 (카드가 화면에 들어올 때 쓱 올라오며 등장) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            // 뷰포트의 40% 지점에 도달했을 때 애니메이션 실행
            viewport={{ once: false, amount: 0.4 }}
            className="relative z-10 text-center px-6 w-full"
          >
            <h2
              className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter break-keep ${
                card.highlight ? "text-white" : "text-white/70"
              }`}
              style={{
                textShadow: card.highlight
                  ? "0 0 40px rgba(255,255,255,0.4)"
                  : "none",
              }}
            >
              {card.text}
            </h2>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
