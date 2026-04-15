"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function Scene1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // scrollYProgress를 직접 쓰지 말고, useSpring으로 한 번 거르세요!
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, // 탄성 (높을수록 빠르게 반응)
    damping: 30, // 저항 (높을수록 덜 출렁거림)
    restDelta: 0.001,
  });

  // Simpler, more responsive transforms
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.05]);
  const glowIntensity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7],
    [0.5, 1, 0.3],
  );

  return (
    <section ref={containerRef} className="relative h-[150dvh] bg-background">
      <div className="sticky top-0 h-dvh flex items-center justify-center overflow-hidden">
        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: glowIntensity,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245, 136, 70, 0.12), transparent 70%)",
          }}
        />

        {/* Main text content */}
        <motion.div
          className="text-center px-6 max-w-4xl"
          style={{ opacity, scale }}
        >
          <motion.p
            className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            모두다른고양이 미술학원
          </motion.p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            <motion.span
              className="block text-foreground"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              우리는
            </motion.span>
            <motion.span
              className="block mt-2"
              style={{
                color: "var(--orange-glow)",
                textShadow:
                  "0 0 60px rgba(245, 136, 70, 0.5), 0 0 120px rgba(245, 136, 70, 0.3)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              생각의 구조를
            </motion.span>
            <motion.span
              className="block mt-2 text-foreground"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              설계합니다
            </motion.span>
          </h1>

          <motion.p
            className="mt-12 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            단순한 기술 훈련이 아닌, 창의적 사고의 본질을 탐구합니다
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1 h-2 bg-primary rounded-full mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
