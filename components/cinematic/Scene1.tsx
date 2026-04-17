"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Scene1() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. offset을 "end end"로 변경하여 스크롤 범위 단축
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. useSpring을 제거하고 scrollYProgress를 바로 사용하여 즉각 반응하도록 수정
  // 3. 텍스트가 매우 빠르게 사라지도록 범위를 [0, 0.4]로 좁힘
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const glowIntensity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.5, 1, 0]);

  return (
    // 4. 전체 높이를 h-[120dvh] -> h-[100dvh]로 줄여 빈 공간(붕 뜨는 현상) 제거
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
          className="text-center px-6 max-w-4xl"
          style={{ opacity, scale }}
        >
          <motion.p
            className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            모두다른고양이 미술학원
          </motion.p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            <motion.span
              className="block text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              우리는
            </motion.span>
            <motion.span
              className="block mt-2"
              style={{
                color: "var(--orange-glow)",
                textShadow:
                  "0 0 50px rgba(245, 136, 70, 0.4), 0 0 100px rgba(245, 136, 70, 0.2)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              생각의 구조를
            </motion.span>
            <motion.span
              className="block mt-2 text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              설계합니다
            </motion.span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}