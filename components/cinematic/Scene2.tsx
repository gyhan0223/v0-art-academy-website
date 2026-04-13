"use client"

import { motion, useScroll, useTransform } from "framer-motion"
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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-background">
      {/* Sticky background image */}
      <div className="sticky top-0 h-screen overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        </motion.div>

        {/* Content overlay */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-3xl w-full">
            {philosophyLines.map((line, index) => {
              const start = index * 0.2
              const end = start + 0.25
              return (
                <PhilosophyLine
                  key={index}
                  text={line.text}
                  highlight={line.highlight}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                  index={index}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhilosophyLine({
  text,
  highlight,
  scrollYProgress,
  start,
  end,
  index,
}: {
  text: string
  highlight: boolean
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  start: number
  end: number
  index: number
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.1, end, end + 0.1],
    [0, 1, 1, 0.3]
  )
  const y = useTransform(scrollYProgress, [start, start + 0.1], [60, 0])
  const blur = useTransform(
    scrollYProgress,
    [start, start + 0.1, end, end + 0.1],
    [10, 0, 0, 5]
  )

  return (
    <motion.div
      className={`text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 ${
        index % 2 === 0 ? "text-left" : "text-right"
      }`}
      style={{
        opacity,
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
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
