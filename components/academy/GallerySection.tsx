"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const cards = [
  {
    image: "/images/gallery-1.jpg",
    title: "소묘 기초 집중반",
    school: "서울대학교 미술대학",
    year: "2024 합격",
    quote:
      "기초 소양 수업을 통해 단순히 그리는 것을 넘어 '보는 눈'을 키울 수 있었어요. 덕분에 면접에서도 자신 있게 제 작품을 설명할 수 있었습니다.",
    name: "김○○ 학생",
  },
  {
    image: "/images/gallery-2.jpg",
    title: "색채 표현 고급반",
    school: "홍익대학교 미술대학",
    year: "2024 합격",
    quote:
      "선생님이 제 개성을 살리면서도 부족한 부분을 정확히 짚어주셨어요. 1:1 컨설팅이 없었다면 포트폴리오 방향을 잡지 못했을 것 같아요.",
    name: "이○○ 학생",
  },
  {
    image: "/images/gallery-3.jpg",
    title: "입시 집중 심화반",
    school: "연세대학교 커뮤니케이션디자인",
    year: "2024 합격",
    quote:
      "단기간에 실력이 비약적으로 성장했습니다. 체계적인 커리큘럼과 선생님들의 열정 덕분에 원하는 학교에 합격할 수 있었어요.",
    name: "박○○ 학생",
  },
  {
    image: "/images/gallery-4.jpg",
    title: "수묵·한국화 전문반",
    school: "이화여자대학교 동양화과",
    year: "2024 합격",
    quote:
      "전통 기법부터 현대적 해석까지 폭넓게 배울 수 있었어요. 다른 학원에서 해결 못했던 부분들을 여기서 단번에 해결했습니다.",
    name: "최○○ 학생",
  },
]

export default function GallerySection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  const scrollToCard = useCallback((index: number) => {
    if (!trackRef.current) return
    const card = trackRef.current.children[index] as HTMLElement
    if (card) {
      const offset = card.offsetLeft - (trackRef.current.offsetWidth - card.offsetWidth) / 2
      trackRef.current.scrollTo({ left: offset, behavior: "smooth" })
    }
    setCurrent(index)
  }, [])

  const prev = () => scrollToCard(Math.max(0, current - 1))
  const next = () => scrollToCard(Math.min(cards.length - 1, current + 1))

  // Touch drag handling
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    scrollStart.current = trackRef.current?.scrollLeft ?? 0
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
  }

  // Update dot on scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const handleScroll = () => {
      const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth + 16
      const idx = Math.round(track.scrollLeft / cardWidth)
      setCurrent(Math.max(0, Math.min(cards.length - 1, idx)))
    }
    track.addEventListener("scroll", handleScroll, { passive: true })
    return () => track.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="gallery"
      className="bg-foreground py-16 overflow-hidden"
      aria-labelledby="gallery-heading"
    >
      {/* Header */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-px bg-accent" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.3em] text-background/40 font-light uppercase">
            Success Stories
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h2
            id="gallery-heading"
            className="text-background font-black text-2xl leading-tight tracking-tight text-balance"
          >
            합격자
            <br />
            인터뷰 &amp; 갤러리
          </h2>
          {/* Nav buttons */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-background hover:border-background/50 disabled:opacity-30 transition-all"
              aria-label="이전"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={next}
              disabled={current === cards.length - 1}
              className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-background hover:border-background/50 disabled:opacity-30 transition-all"
              aria-label="다음"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pl-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="list"
        aria-label="합격자 인터뷰 목록"
      >
        {cards.map((card, idx) => (
          <article
            key={idx}
            className="flex-shrink-0 w-[80vw] max-w-[300px] snap-start"
            role="listitem"
            onClick={() => scrollToCard(idx)}
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-4">
              <Image
                src={card.image}
                alt={`${card.name} - ${card.title} 작품`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30" />
              {/* Badge */}
              <div className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full tracking-wide">
                {card.year}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <p className="text-background/50 text-[10px] tracking-wider uppercase">
                {card.title}
              </p>
              <p className="text-background font-bold text-sm leading-snug">
                {card.school}
              </p>

              {/* Quote */}
              <div className="pt-3 border-t border-background/10">
                <Quote
                  size={14}
                  className="text-accent mb-2"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-background/50 text-xs leading-relaxed line-clamp-3">
                  {card.quote}
                </p>
                <p className="mt-2 text-background/30 text-[10px] font-medium">
                  — {card.name}
                </p>
              </div>
            </div>
          </article>
        ))}
        {/* Trailing spacer */}
        <div className="flex-shrink-0 w-5" aria-hidden="true" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="갤러리 페이지">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToCard(idx)}
            role="tab"
            aria-selected={current === idx}
            aria-label={`${idx + 1}번째 카드`}
            className={`transition-all duration-300 rounded-full ${
              current === idx
                ? "w-6 h-1.5 bg-accent"
                : "w-1.5 h-1.5 bg-background/20"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
