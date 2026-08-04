"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, ChevronDown } from "lucide-react";
import {
  SHOW_ANNOUNCEMENT,
  WINTER_PAGES,
  getRemainingLabel,
  getRemainingTotal,
} from "@/lib/winter-camp";
import { IS_PLACEHOLDER as GRADE_CASES_PLACEHOLDER } from "@/lib/grade-cases";

const remainingTotal = getRemainingTotal();
const ANNOUNCEMENT_TEXT =
  remainingTotal <= 0
    ? "2027 모다고 윈터캠프 · 마감"
    : `2027 모다고 윈터캠프 · ${getRemainingLabel()} · 홍대 본원 기숙`;
const ANNOUNCEMENT_KEY = "modago-winter-announcement-closed";

const PHONE_HONGDAE = { label: "홍대 본원", number: "02-338-3302" };
const PHONE_ILSAN = { label: "일산 캠퍼스", number: "031-916-8885" };

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

type NavChild = {
  label: string;
  href: string;
  desc?: string;
  badge?: string;
};

type NavItem = {
  label: string;
  href: string;
  badge?: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { label: "홈", href: "/" },
  {
    label: "입시 정보",
    href: "/guide",
    children: [
      {
        label: "홍대 미활보 가이드",
        href: "/guide/hongik-mihwalbo",
        desc: "홍익대 미술활동보고서 작성 전략",
        badge: "준비중",
      },
      {
        label: "2026학년도 미대 입시 정보",
        href: "/guide/jungsi-2026",
        desc: "가·나·다군 모집군·전형방법 총정리",
      },
    ],
  },
  // 실기 모의고사(/mock)는 오픈 전까지 네비게이션에서 숨김 — 페이지 자체는 URL로 접근 가능
  // {
  //   label: "실기 모의고사",
  //   href: "/mock",
  //   badge: "접수중",
  // },
  {
    label: "성적 향상 사례",
    href: "/grade-up",
    // 실제 사례가 채워지면(lib/grade-cases.ts의 IS_PLACEHOLDER = false) 뱃지가 사라짐
    badge: GRADE_CASES_PLACEHOLDER ? "준비중" : undefined,
  },
  {
    label: "윈터캠프",
    href: "/winter",
    badge: "모집중",
    children: [
      {
        label: "윈터캠프 (개요)",
        href: "/winter",
        desc: "대상·정원·기간과 8주 운영 방식",
        badge: "모집중",
      },
      // 하위 페이지는 lib/winter-camp.ts의 WINTER_PAGES 하나만 고치면 여기와
      // /winter 하단 카드가 함께 바뀐다
      ...WINTER_PAGES.map((page) => ({
        label: page.label,
        href: page.href,
        desc: page.desc,
      })),
    ],
  },
  {
    label: "파주 기숙학원",
    href: "/gisuk",
    badge: "3월 오픈",
  },
];

/**
 * 하위 항목 활성 판정.
 * "/winter"(개요)가 "/winter/schedule"에서도 켜지지 않도록 정확히 일치하거나
 * 한 단계 아래 경로일 때만 활성으로 본다.
 */
function isChildActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 알림 띠: sessionStorage로 닫힘 상태 유지 (hydration 불일치 방지를 위해 mount 후 판단)
  useEffect(() => {
    if (SHOW_ANNOUNCEMENT && sessionStorage.getItem(ANNOUNCEMENT_KEY) !== "1") {
      setShowAnnouncement(true);
    }
  }, []);

  const closeAnnouncement = () => {
    sessionStorage.setItem(ANNOUNCEMENT_KEY, "1");
    setShowAnnouncement(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenMenu(null);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/85 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        {/* 사이트 최상단 알림 띠 */}
        {showAnnouncement && (
          <div className="relative bg-accent text-black">
            <Link
              href="/winter"
              className="block px-10 py-2 text-center text-xs md:text-sm font-semibold tracking-wide"
            >
              {ANNOUNCEMENT_TEXT}
            </Link>
            <button
              type="button"
              onClick={closeAnnouncement}
              aria-label="알림 닫기"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-black/60 transition-colors hover:text-black"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>
        )}

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
          <nav
            ref={menuRef}
            className="hidden md:flex items-center gap-7"
            aria-label="주 메뉴"
          >
            {navItems.map((item) => {
              const active = item.children
                ? item.children.some((c) => pathname.startsWith(c.href))
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.children) {
                const open = openMenu === item.href;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.href)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMenu(open ? null : item.href)}
                      aria-expanded={open}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 text-sm tracking-wide transition-colors ${
                        active || open
                          ? "text-accent"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition-all duration-200 ${
                        open
                          ? "visible opacity-100 translate-y-0"
                          : "invisible opacity-0 -translate-y-1"
                      }`}
                    >
                      <ul className="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md shadow-xl shadow-black/40">
                        {item.children.map((child) => {
                          const childActive = isChildActive(pathname, child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block px-4 py-3.5 transition-colors border-b border-white/5 last:border-b-0 hover:bg-white/5 ${
                                  childActive ? "bg-white/5" : ""
                                }`}
                              >
                                <span
                                  className={`block text-sm font-medium ${
                                    childActive
                                      ? "text-accent"
                                      : "text-white/90"
                                  }`}
                                >
                                  {child.label}
                                  {child.badge && (
                                    <span className="ml-1.5 text-[10px] font-normal text-accent align-top">
                                      {child.badge}
                                    </span>
                                  )}
                                </span>
                                {child.desc && (
                                  <span className="mt-0.5 block text-xs text-white/40">
                                    {child.desc}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors ${
                    active ? "text-accent" : "text-white/70 hover:text-white"
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
            {/* 두 캠퍼스 전화번호 */}
            <div className="hidden lg:flex flex-col items-end gap-1 leading-none">
              <a
                href={`tel:${PHONE_HONGDAE.number}`}
                className="text-[11px] tracking-wide text-white/55 transition-colors hover:text-white"
              >
                {PHONE_HONGDAE.label} {PHONE_HONGDAE.number}
              </a>
              <a
                href={`tel:${PHONE_ILSAN.number}`}
                className="text-[11px] tracking-wide text-white/55 transition-colors hover:text-white"
              >
                {PHONE_ILSAN.label} {PHONE_ILSAN.number}
              </a>
            </div>
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
            {navItems.map((item, idx) => {
              if (item.children) {
                const open = expanded === item.href;
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : item.href)}
                      aria-expanded={open}
                      className="flex w-full items-center px-6 py-4 text-sm font-medium tracking-wide text-white/80 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors"
                    >
                      <span className="text-accent text-xs mr-3 font-mono">
                        0{idx + 1}
                      </span>
                      {item.label}
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`ml-auto text-white/40 transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ${
                        open
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <ul className="overflow-hidden bg-white/[0.03]">
                        {item.children.map((child) => {
                          const childActive = isChildActive(pathname, child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block py-3.5 pl-14 pr-6 text-sm border-b border-white/5 transition-colors hover:bg-white/5 ${
                                  childActive
                                    ? "text-accent"
                                    : "text-white/70 hover:text-white"
                                }`}
                              >
                                {child.label}
                                {child.badge && (
                                  <span className="ml-2 text-[10px] text-accent">
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
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
              );
            })}
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

          <div className="px-6 py-6 border-t border-white/10 space-y-3">
            <a href={`tel:${PHONE_HONGDAE.number}`} className="block">
              <span className="block text-white/50 text-xs tracking-widest">
                {PHONE_HONGDAE.number}
              </span>
              <span className="block text-white/30 text-xs mt-0.5">
                {PHONE_HONGDAE.label}
              </span>
            </a>
            <a href={`tel:${PHONE_ILSAN.number}`} className="block">
              <span className="block text-white/50 text-xs tracking-widest">
                {PHONE_ILSAN.number}
              </span>
              <span className="block text-white/30 text-xs mt-0.5">
                {PHONE_ILSAN.label} · 평일 13:00–19:00
              </span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
