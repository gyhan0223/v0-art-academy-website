"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const philosophyLines = [
  { text: "기초가 탄탄해야", highlight: false },
  { text: "창의가 빛난다", highlight: true },
  { text: "매 순간의 선택이", highlight: false },
  { text: "작품이 된다", highlight: true },
];

export default function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // 1. 전체 스크롤 진행도를 촘촘하게 압축하여 속도감을 높였습니다.
  const line0Opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.15],
    [0, 1, 1, 0.3],
  );
  const line0Y = useTransform(scrollYProgress, [0, 0.1], [30, 0]);

  const line1Opacity = useTransform(
    scrollYProgress,
    [0.1, 0.15, 0.2, 0.25],
    [0, 1, 1, 0.3],
  );
  const line1Y = useTransform(scrollYProgress, [0.2, 0.3], [30, 0]);

  const line2Opacity = useTransform(
    scrollYProgress,
    [0.2, 0.25, 0.3, 0.35],
    [0, 1, 1, 0.3],
  );
  const line2Y = useTransform(scrollYProgress, [0.4, 0.5], [30, 0]);

  // 2. 4번째 문구("작품이 된다")가 0.6에서 이미 나오기 시작해 0.7에 100%가 됩니다.
  // 남은 30%의 스크롤 동안 화면에 굳건히 고정되어 절대 화면 밖으로 잘리지 않습니다.
  const line3Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.35, 0.45, 0.5],
    [0, 1, 1, 1],
  );
  const line3Y = useTransform(scrollYProgress, [0.6, 0.7], [30, 0]);

  const lineTransforms = [
    { opacity: line0Opacity, y: line0Y },
    { opacity: line1Opacity, y: line1Y },
    { opacity: line2Opacity, y: line2Y },
    { opacity: line3Opacity, y: line3Y },
  ];

  return (
    // 3. 기존 h-[300vh] 또는 h-[250vh]였던 높이를 h-[200vh]로 대폭 줄여
    // 문장이 뜨는 데 필요한 스크롤 소모량을 눈에 띄게 줄였습니다.
    <section ref={containerRef} className="relative h-[200vh] bg-background">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          <Image
            src="/images/gallery-1.jpg"
            alt="Art studio atmosphere"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </motion.div>

        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-3xl w-full space-y-4 md:space-y-6">
            {philosophyLines.map((line, index) => (
              <PhilosophyLine
                key={index}
                text={line.text}
                highlight={line.highlight}
                opacity={lineTransforms[index].opacity}
                y={lineTransforms[index].y}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyLine({
  text,
  highlight,
  opacity,
  y,
  index,
}: {
  text: string;
  highlight: boolean;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  index: number;
}) {
  return (
    <motion.div
      className={`text-3xl md:text-5xl lg:text-6xl font-black ${
        index % 2 === 0 ? "text-left" : "text-right"
      }`}
      style={{ opacity, y }}
    >
      <span
        className={highlight ? "text-primary" : "text-foreground"}
        style={
          highlight
            ? {
                textShadow:
                  "0 0 40px rgba(245, 136, 70, 0.4), 0 0 80px rgba(245, 136, 70, 0.2)",
              }
            : undefined
        }
      >
        {text}
      </span>
    </motion.div>
  );
}
