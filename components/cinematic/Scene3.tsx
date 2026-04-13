"use client"

import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const features = [
  {
    title: "기초 조형",
    subtitle: "Foundation",
    description: "드로잉, 색채, 구성의 본질을 탐구하며 시각 언어의 기초를 다집니다",
    image: "/images/gallery-1.jpg",
  },
  {
    title: "입시 전략",
    subtitle: "Strategy",
    description: "서울대, 홍익대 등 최상위권 미대 합격을 위한 맞춤형 포트폴리오 설계",
    image: "/images/gallery-2.jpg",
  },
  {
    title: "창의 워크숍",
    subtitle: "Workshop",
    description: "실험적 프로젝트와 협업을 통해 자신만의 예술 세계를 구축합니다",
    image: "/images/gallery-3.jpg",
  },
  {
    title: "1:1 멘토링",
    subtitle: "Mentoring",
    description: "개인별 성향과 목표에 맞춘 진학 상담 및 포트폴리오 피드백",
    image: "/images/gallery-4.jpg",
  },
]

function ProgressIndicator({ 
  scrollYProgress, 
  index, 
  total 
}: { 
  scrollYProgress: MotionValue<number>
  index: number
  total: number
}) {
  const segmentProgress = useTransform(
    scrollYProgress,
    [(index * 1) / total, ((index + 1) * 1) / total],
    [0, 1]
  )
  const height = useTransform(segmentProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="w-1 h-8 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="w-full bg-primary rounded-full"
        style={{ height }}
      />
    </div>
  )
}

export default function Scene3() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(features.length - 1) * 100}%`]
  )

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section header */}
        <motion.div
          className="absolute top-8 left-6 md:left-12 z-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs md:text-sm text-muted-foreground tracking-[0.2em] uppercase">
            Our Programs
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
            커리큘럼
          </h2>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 z-10 hidden md:flex flex-col gap-2">
          {features.map((_, index) => (
            <ProgressIndicator 
              key={index}
              scrollYProgress={scrollYProgress}
              index={index}
              total={features.length}
            />
          ))}
        </div>

        {/* Horizontal scrolling cards */}
        <div className="h-full flex items-center">
          <motion.div
            className="flex gap-8 pl-6 md:pl-24"
            style={{ x }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  return (
    <motion.div
      className="relative w-[85vw] md:w-[60vw] lg:w-[50vw] h-[70vh] flex-shrink-0 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background image */}
      <Image
        src={feature.image}
        alt={feature.title}
        fill
        className="object-cover"
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div
          className="backdrop-blur-xl rounded-xl p-6 md:p-8 border"
          style={{
            backgroundColor: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <p className="text-primary text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
            {feature.subtitle}
          </p>
          <h3 className="text-2xl md:text-4xl font-black text-foreground mt-2">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mt-4 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Index number */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10">
        <span
          className="text-6xl md:text-8xl font-black"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
          }}
        >
          0{index + 1}
        </span>
      </div>
    </motion.div>
  )
}
