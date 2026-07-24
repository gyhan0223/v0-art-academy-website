"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

const navItems = [
  { label: "홈", href: "/" },
  { label: "홍대 미활보 가이드", href: "/guide/hongik-mihwalbo" },
  { label: "기숙학원", href: "/gisuk", badge: "3월 오픈" },
];

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/85 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="font-black text-base tracking-tight leading-tight text-white"
            aria-label="모두다른고양이 홈으로"
          >
            <span className="block text-[10px] font-light tracking-[0.25em] text-white/50 mb-0.5">
              ART ACADEMY
            </span>
            모두다른고양이
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="주 메뉴">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors ${
                    active
                      ? "text-accent"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 text-[10px] text-accent align-top">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <a
              href={NAVER_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-85"
            >
              상담 신청
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-white hover:text-accent transition-colors md:hidden"
            aria-label="메뉴 열기"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "opacity-60" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-[#0a0a0a] border-l border-white/10 flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="모바일 메뉴"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <span className="font-black text-sm tracking-tight text-white">
              모두다른고양이
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="메뉴 닫기"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <ul className="flex flex-col py-4 flex-1">
            {navItems.map((item, idx) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-6 py-4 text-sm font-medium tracking-wide text-white/80 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors"
                >
                  <span className="text-accent text-xs mr-3 font-mono">
                    0{idx + 1}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 text-[10px] text-accent">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li className="px-6 pt-5">
              <a
                href={NAVER_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md bg-accent px-4 py-3 text-center text-sm font-medium text-black"
              >
                상담 신청
              </a>
            </li>
          </ul>

          <div className="px-6 py-6 border-t border-white/10">
            <a
              href="tel:031-916-8885"
              className="block text-white/50 text-xs tracking-widest mb-1"
            >
              031-916-8885
            </a>
            <p className="text-white/30 text-xs">일산점 · 평일 13:00–19:00</p>
          </div>
        </nav>
      </div>
    </>
  );
}
