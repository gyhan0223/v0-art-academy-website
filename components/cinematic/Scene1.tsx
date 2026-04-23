"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Scene1() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const glowIntensity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4],
    [0.5, 1, 0],
  );

  return (
    <section ref={containerRef} className="relative h-[100dvh] bg-background">
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: glowIntensity,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245, 136, 70, 0.15), transparent 70%)",
          }}
        />

        {/* Main text content */}
        <motion.div
          className="text-center px-6 max-w-4xl flex flex-col items-center"
          style={{ opacity, scale }}
        >
          {/* 상단 서브 타이틀 영역 */}
          <div className="flex flex-col items-center gap-3 mb-10">
            <motion.p
              className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              모두다른고양이 미술학원
            </motion.p>

            {/* 💡 물방울처럼 투명하게 스며드는 서브 텍스트 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white/50 text-sm md:text-base tracking-[0.2em] font-light mix-blend-screen">
                최상위권 미대 전문
              </span>
            </motion.div>
          </div>

          {/* 💡 메인 타이틀 (개별 애니메이션 제거하고 통째로 한 호흡에 등장) */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <span className="block text-foreground">우리는</span>
            <span
              className="block mt-2"
              style={{
                color: "var(--orange-glow)",
                textShadow:
                  "0 0 50px rgba(245, 136, 70, 0.4), 0 0 100px rgba(245, 136, 70, 0.2)",
              }}
            >
              생각의 구조를
            </span>
            <span className="block mt-2 text-foreground">설계합니다</span>
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
