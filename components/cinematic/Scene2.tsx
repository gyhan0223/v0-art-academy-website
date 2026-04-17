"use client"

import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const philosophyLines = [
  { text: "기초가 탄탄해야", highlight: false },
  { text: "창의가 빛난다", highlight: true },
  { text: "매 순간의 선택이", highlight: false },
  { text: "작품이 된다", highlight: true },
]

export default function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // 배경 이미지 이동 범위를 줄여 자연스럽게 만듭니다.
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  // 애니메이션 구간을 촘촘하게 조정하여 스크롤 지루함을 줄였습니다.
  const line0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.25], [0, 1, 1, 0.2])
  const line0Y = useTransform(scrollYProgress, [0, 0.05], [30, 0])
  
  const line1Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.35, 0.45], [0, 1, 1, 0.2])
  const line1Y = useTransform(scrollYProgress, [0.2, 0.25], [30, 0])
  
  const line2Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.65], [0, 1, 1, 0.2])
  const line2Y = useTransform(scrollYProgress, [0.4, 0.45], [30, 0])
  
  // 4번째 문구가 더 일찍 나타나서 완전히 보인 상태로 스크롤 끝까지 유지되게 합니다.
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.65, 0.8, 1], [0, 1, 1, 1])
  const line3Y = useTransform(scrollYProgress, [0.6, 0.65], [30, 0])

  const lineTransforms = [
    { opacity: line0Opacity, y: line0Y },
    { opacity: line1Opacity, y: line1Y },
    { opacity: line2Opacity, y: line2Y },
    { opacity: line3Opacity, y: line3Y },
  ]

  return (
    // 전체 길이를 300vh에서 200vh로 줄여서 스크롤 피로도를 낮췄습니다.
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
  )
}

function PhilosophyLine({
  text,
  highlight,
  opacity,
  y,
  index,
}: {
  text: string
  highlight: boolean
  opacity: MotionValue<number>
  y: MotionValue<number>
  index: number
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
  )
}