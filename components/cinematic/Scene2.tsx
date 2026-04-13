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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Pre-calculate all line transforms at the component level
  const line0Opacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0.2])
  const line0Y = useTransform(scrollYProgress, [0, 0.1], [40, 0])
  
  const line1Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0.2])
  const line1Y = useTransform(scrollYProgress, [0.2, 0.3], [40, 0])
  
  const line2Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0.2])
  const line2Y = useTransform(scrollYProgress, [0.4, 0.5], [40, 0])
  
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.7, 0.85, 1], [0, 1, 1, 1])
  const line3Y = useTransform(scrollYProgress, [0.6, 0.7], [40, 0])

  const lineTransforms = [
    { opacity: line0Opacity, y: line0Y },
    { opacity: line1Opacity, y: line1Y },
    { opacity: line2Opacity, y: line2Y },
    { opacity: line3Opacity, y: line3Y },
  ]

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-background">
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
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </motion.div>

        {/* Content overlay */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-3xl w-full space-y-6 md:space-y-8">
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
