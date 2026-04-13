"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  const handleScroll = () => {
    const el = document.querySelector("#contact")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end pb-16 overflow-hidden"
      aria-label="히어로 섹션"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="모두다른고양이 미술학원 스튜디오"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-foreground/70" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-foreground/90 to-transparent" />
      </div>

      {/* Decorative top-right label */}
      <div className="absolute top-28 right-5 flex flex-col items-end gap-1">
        <span
          className="text-[9px] tracking-[0.25em] text-background/40 font-light uppercase"
          aria-hidden="true"
        >
          Ilsan Branch
        </span>
        <div className="w-8 h-px bg-accent" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-px bg-accent" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.3em] text-background/60 font-light uppercase">
            Fine Arts Academy
          </span>
        </div>

        <h1 className="text-background font-black text-[2rem] leading-tight tracking-tight text-balance mb-4">
          다름을 만드는
          <br />
          <span className="text-accent">기초 소양</span>의 힘,
          <br />
          모두다른고양이
          <br />
          <span className="font-light text-background/80">일산점</span>
        </h1>

        <p className="text-background/60 text-sm leading-relaxed mb-8 text-pretty">
          최상위권 미대 입시 전문 학원. 체계적인 기초 소양
          커리큘럼과 1:1 맞춤 컨설팅으로 당신의 가능성을
          현실로 만들어 드립니다.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleScroll}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground py-4 px-6 text-sm font-bold tracking-wide rounded-sm transition-all active:scale-95 hover:bg-accent/90"
          >
            입학 상담 예약하기
            <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              const el = document.querySelector("#gallery")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            className="flex items-center justify-center gap-2 border border-background/30 text-background/70 py-4 px-6 text-sm font-medium tracking-wide rounded-sm transition-all active:scale-95 hover:border-background/60 hover:text-background"
          >
            합격 갤러리 보기
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex gap-6 mt-10 pt-6 border-t border-background/10">
          {[
            { number: "97%", label: "합격률" },
            { number: "200+", label: "누적 합격자" },
            { number: "15년", label: "입시 노하우" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-background font-black text-xl">{stat.number}</span>
              <span className="text-background/40 text-[10px] tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
