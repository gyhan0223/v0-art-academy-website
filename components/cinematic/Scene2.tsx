"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// 1. 각 문구에 해당하는 로고 이미지 경로와 대체 텍스트(alt)를 추가합니다.
const philosophyLines = [
  {
    text: "기초가 탄탄해야",
    highlight: false,
    logo: "/images/logo-snu.png",
    alt: "서울대학교 로고",
  },
  {
    text: "창의가 빛난다",
    highlight: true,
    logo: "/images/logo-hongik.png",
    alt: "홍익대학교 로고",
  },
  {
    text: "매 순간의 선택이",
    highlight: false,
    logo: "/images/logo-kookmin.png",
    alt: "국민대학교 로고",
  },
  {
    text: "작품이 된다",
    highlight: true,
    logo: "/images/logo-ewha.png",
    alt: "이화여자대학교 로고",
  },
];

export default function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const line0Opacity = useTransform(
    scrollYProgress,
    [0.05, 0.1, 0.15, 0.2], // 기존 [0, 0.1, 0.2, 0.3]에서 수정
    [0, 1, 1, 0.3],
  );
  const line0Y = useTransform(scrollYProgress, [0.05, 0.15], [30, 0]);

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
    [0.3, 0.35, 0.4, 0.45],
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
    <section ref={containerRef} className="relative h-[200vh] bg-background">
      <div className="absolute top-0 left-0 w-full h-2 bg-green-500 z-50" />

      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* 2. 기존의 전체 배경화면(gallery-1.jpg) 코드를 제거했습니다. */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-4xl w-full space-y-8 md:space-y-12">
            {philosophyLines.map((line, index) => (
              <PhilosophyLine
                key={index}
                text={line.text}
                highlight={line.highlight}
                logo={line.logo}
                alt={line.alt}
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
  logo,
  alt,
  opacity,
  y,
  index,
}: {
  text: string;
  highlight: boolean;
  logo: string;
  alt: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      // 3. Flexbox를 사용하여 로고와 텍스트를 나란히 배치합니다.
      className={`flex items-center gap-4 md:gap-8 ${
        isLeft ? "justify-start" : "justify-end"
      }`}
      style={{ opacity, y }}
    >
      {/* 왼쪽 정렬일 때는 로고가 텍스트 왼쪽에 배치됩니다. */}
      {isLeft && (
        <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
          <Image
            src={logo}
            alt={alt}
            fill
            className="object-contain dark:invert"
            /* 필요시 다크모드에서 로고 색상을 반전시키려면 dark:invert 유지 */
          />
        </div>
      )}

      <div
        className={`text-3xl md:text-5xl lg:text-6xl font-black ${isLeft ? "text-left" : "text-right"}`}
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
      </div>

      {/* 오른쪽 정렬일 때는 로고가 텍스트 오른쪽에 배치됩니다. */}
      {!isLeft && (
        <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
          <Image
            src={logo}
            alt={alt}
            fill
            className="object-contain dark:invert"
          />
        </div>
      )}
    </motion.div>
  );
}
