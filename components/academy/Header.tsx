"use client"

import { useState, useEffect } from "react"
import { X, Menu } from "lucide-react"

const navItems = [
  { label: "홈", href: "#" },
  { label: "학원 소개", href: "#features" },
  { label: "합격 갤러리", href: "#gallery" },
  { label: "커리큘럼", href: "#curriculum" },
  { label: "오시는 길", href: "#location" },
  { label: "입학 상담", href: "#contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-foreground/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <a
            href="#"
            className="text-background font-black text-base tracking-tight leading-tight"
            aria-label="모두다른고양이 홈으로"
          >
            <span className="block text-[11px] font-light tracking-widest text-accent-foreground opacity-70 mb-0.5">
              ART ACADEMY
            </span>
            모두다른고양이
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-background hover:text-accent transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "opacity-60" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-foreground flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="사이드바 내비게이션"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-background/10">
            <span className="text-background font-black text-sm tracking-tight">
              모두다른고양이
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-background/60 hover:text-background transition-colors"
              aria-label="메뉴 닫기"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <ul className="flex flex-col py-6 flex-1">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left px-6 py-4 text-background/80 hover:text-background hover:bg-background/5 transition-colors text-sm font-medium tracking-wide border-b border-background/5"
                >
                  <span className="text-accent text-xs mr-3 font-mono">
                    0{idx + 1}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="px-6 py-6 border-t border-background/10">
            <a
              href="tel:031-000-0000"
              className="block text-background/50 text-xs tracking-widest mb-1"
            >
              031-000-0000
            </a>
            <p className="text-background/30 text-xs">일산점 · 평일 13:00–19:00</p>
          </div>
        </nav>
      </div>
    </>
  )
}
