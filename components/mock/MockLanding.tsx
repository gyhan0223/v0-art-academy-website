"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Phone,
  ChevronDown,
  X,
  ImageIcon,
} from "lucide-react";
import { NAVER_BOOKING_URL } from "@/lib/contact";

/* ---------------------------------- 공통 ---------------------------------- */

// 모의고사는 홍대 본원 실기실에서만 치른다 — 캠퍼스를 고르게 하면 안 된다.
// 일산 캠퍼스 예약으로 보내면 응시 자체가 성립하지 않는다.
const NAVER_BOOKING = NAVER_BOOKING_URL;

const PHONE = "02-338-3302";
const PHONE_TEL = "tel:02-338-3302";
const ADDRESS = "서울시 마포구 와우산로23길 9 칼리오페 5층";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function SectionHead({
  en,
  ko,
}: {
  en: string;
  ko: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="mb-8 md:mb-12 text-center">
      <p className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
        {en}
      </p>
      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-snug break-keep">
        {ko}
      </h2>
    </motion.div>
  );
}

/* --------------------------------- 데이터 ---------------------------------- */

const HERO_INFO = [
  { label: "시간", value: "4시간" },
  { label: "응시료", value: "47,600원" },
  { label: "일정", value: "토·일 13:00 / 18:00" },
  { label: "장소", value: "홍대 본원" },
];

const STEPS = [
  {
    no: "01",
    title: "응시",
    desc: "대학 실기고사와 동일한 4시간. 홍대 본원 실기실에서 실제 시험과 같은 조건으로 진행합니다.",
  },
  {
    no: "02",
    title: "채점",
    desc: "6개 항목을 100점 만점으로 채점하고, 목표 대학 합격선과 나란히 놓습니다.",
  },
  {
    no: "03",
    title: "성적표",
    desc: "항목별 점수, 담당 강사 총평, 입시까지의 로드맵을 담아 모의고사가 끝나면 담당 강사가 작성해 전달해 드립니다.",
  },
];

const REPORT_IMAGES = [
  { src: "/images/mock/report-1.jpg", caption: "성적표 1p" },
  { src: "/images/mock/report-2.jpg", caption: "성적표 2p" },
];

const CRITERIA = [
  { name: "형태력", desc: "비례와 구조의 정확도" },
  { name: "구도 · 구성", desc: "화면 배치와 짜임새" },
  { name: "명암 · 양감", desc: "빛과 입체의 표현" },
  { name: "질감 · 묘사", desc: "재질 구분과 묘사 밀도" },
  { name: "발상 · 주제해석", desc: "아이디어와 표현 의도" },
  { name: "완성도", desc: "제한 시간 내 마무리" },
];

const FAQ_ITEMS = [
  {
    q: "미술을 시작한 지 얼마 안 됐는데 응시해도 되나요?",
    a: "네. 현재 위치를 확인하는 것이 목적이라 오히려 초반일수록 도움이 됩니다. 점수가 낮게 나오는 것을 걱정하지 않으셔도 됩니다.",
  },
  {
    q: "다른 학원에 다니고 있는데 응시할 수 있나요?",
    a: "네. 등록이나 상담 조건은 없습니다. 실기 모의고사만 응시하셔도 됩니다.",
  },
  {
    q: "성적표는 언제 받나요?",
    a: "모의고사가 끝나면 담당 강사가 채점 내용을 입력해 성적표를 작성한 뒤 전달해 드립니다.",
  },
  {
    q: "학부모도 함께 가야 하나요?",
    a: "학생만 응시하셔도 됩니다. 성적표 설명이 필요하시면 홍대 본원(02-338-3302)으로 문의해 주세요.",
  },
];

/* ------------------------------- 하위 컴포넌트 ------------------------------- */

function ReportImage({
  src,
  caption,
  onOpen,
}: {
  src: string;
  caption: string;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${caption} 확대 보기`}
        className="group relative block w-full aspect-[210/297] overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {failed ? (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
            <ImageIcon size={28} strokeWidth={1.5} />
            <span className="text-xs">이미지 준비 중</span>
          </span>
        ) : (
          <Image
            src={src}
            alt={caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setFailed(true)}
          />
        )}
      </button>
      <figcaption className="mt-2 text-center text-xs md:text-sm text-white/50">
        {caption}
      </figcaption>
    </figure>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: { src: string; caption: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.caption} 확대 이미지`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-5 right-5 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={26} />
          </button>
          <motion.figure
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[210/297] max-h-[85dvh] overflow-hidden rounded-xl bg-[#0d0d12]">
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {item.caption}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AccordionItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="text-sm md:text-base font-medium text-white/90 break-keep">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/40 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-white/60 break-keep">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaButtons() {
  return (
    <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href={NAVER_BOOKING}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-full bg-accent px-8 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        응시 예약하기
      </a>
      <a
        href={PHONE_TEL}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        <Phone size={17} />
        전화 문의 {PHONE}
      </a>
    </div>
  );
}

/* --------------------------------- 페이지 ---------------------------------- */

export default function MockLanding() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-background text-foreground">
        {/* ============ [1] Hero ============ */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <p className="mb-5 text-xs md:text-sm tracking-[0.3em] text-accent uppercase">
              2028학년도 대비 · 홍대 본원
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white break-keep">
              실기에는
              <br />
              모의고사가 없습니다
            </h1>
            <p className="mt-6 text-base md:text-xl text-white/70 break-keep">
              그래서 만들었습니다.
              <br />
              대학 실기고사와 같은 4시간, 끝나면 성적표를 드립니다.
            </p>

            {/* 가로 정보 바 (모바일 2×2) */}
            <div className="mt-10 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
              {HERO_INFO.map((info) => (
                <div
                  key={info.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="text-[11px] tracking-widest text-white/40 uppercase">
                    {info.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-white break-keep">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 w-full">
              <CtaButtons />
            </div>
          </div>
        </section>

        {/* ============ [2] 왜 필요한가 ============ */}
        <section className="border-y border-white/5 bg-[#05050a] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-2xl">
            <SectionHead
              en="The Problem"
              ko={
                <>
                  국어가 3등급인 건 아는데,
                  <br />
                  실기는 모릅니다
                </>
              }
            />
            <motion.div
              {...fadeUp}
              className="space-y-5 text-sm md:text-base leading-relaxed text-white/70 break-keep"
            >
              <p>
                학과는 모의고사를 보면 등급이 나옵니다. 지금 어디쯤인지, 목표
                대학까지 얼마나 남았는지 숫자로 확인할 수 있습니다.
              </p>
              <p>
                실기는 그런 시험이 없습니다. 매주 그림을 그리지만 &ldquo;잘
                하고 있다&rdquo;는 말 외에 근거가 없습니다. 고2 겨울은 방향을
                바꿀 수 있는 마지막 시기인데, 정작 방향을 정할 자료가 없는
                셈입니다.
              </p>
              <p className="font-medium text-white/90">
                실기 모의고사는 그 자료를 만드는 시험입니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ============ [3] 어떻게 진행되나 ============ */}
        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionHead en="How It Works" ko="세 단계로 끝납니다" />
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {STEPS.map((step) => (
                <motion.div
                  key={step.no}
                  {...fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
                >
                  <p className="font-mono text-sm text-accent">{step.no}</p>
                  <h3 className="mt-3 text-xl md:text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-white/60 break-keep">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ [4] 성적표 (핵심 섹션) ============ */}
        <section className="border-y border-white/5 bg-[#05050a] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <SectionHead en="The Report" ko="이런 성적표를 받습니다" />

            {/* 성적표 샘플 이미지 — 파일은 나중에 추가 */}
            <motion.div
              {...fadeUp}
              className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:gap-6"
            >
              {REPORT_IMAGES.map((img) => (
                <ReportImage
                  key={img.src}
                  src={img.src}
                  caption={img.caption}
                  onOpen={() => setLightbox(img)}
                />
              ))}
            </motion.div>

            <motion.p
              {...fadeUp}
              className="mx-auto mt-6 max-w-2xl text-center text-sm md:text-base leading-relaxed text-white/60 break-keep"
            >
              파란 점은 현재 위치, 점선은 목표 대학 합격선입니다. 그 사이 빗금
              구간이 남은 과제입니다.
            </motion.p>

            {/* 채점 항목 6개 */}
            <motion.div
              {...fadeUp}
              className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
            >
              {CRITERIA.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
                >
                  <p className="text-sm md:text-base font-bold text-white break-keep">
                    {c.name}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-white/50 break-keep">
                    {c.desc}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.p
              {...fadeUp}
              className="mt-6 text-center text-xs text-white/35 break-keep"
            >
              합격선은 최근 3개년 합격자 실기 수준을 기준으로 환산한 값입니다.
            </motion.p>
          </div>
          <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
        </section>

        {/* ============ [5] 지참물 ============ */}
        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionHead en="What to Bring" ko="두 가지만 가져오시면 됩니다" />

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                {...fadeUp}
                className="rounded-2xl border border-accent/25 bg-accent/[0.04] p-7 md:p-8"
              >
                <h3 className="text-lg md:text-xl font-bold text-white">
                  모의고사 성적표{" "}
                  <span className="text-sm font-semibold text-accent">필수</span>
                </h3>
                <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-white/60 break-keep">
                  실기만 보면 절반만 보는 것입니다. 학과 성적을 함께 봐야 목표
                  대학에 지원할 수 있는지 판단할 수 있습니다.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
              >
                <h3 className="text-lg md:text-xl font-bold text-white">
                  생활기록부{" "}
                  <span className="text-sm font-semibold text-white/40">
                    선택
                  </span>
                </h3>
                <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-white/60 break-keep">
                  지참하시면 수시 전형까지 포함한 전략 상담이 가능합니다.
                </p>
              </motion.div>
            </div>

            <motion.p
              {...fadeUp}
              className="mt-6 text-center text-sm text-white/50"
            >
              실기 재료는 학원에서 제공합니다.
            </motion.p>
          </div>
        </section>

        {/* ============ [6] 일정 및 응시료 ============ */}
        <section className="border-y border-white/5 bg-[#05050a] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionHead en="Schedule & Fee" ko="주말 두 개 시간대" />

            {/* 시간표 */}
            <motion.div
              {...fadeUp}
              className="overflow-hidden rounded-2xl border border-white/10"
            >
              <table className="w-full text-sm md:text-[15px]">
                <tbody>
                  {[
                    { day: "토요일", slots: ["13:00 – 17:00", "18:00 – 22:00"] },
                    { day: "일요일", slots: ["13:00 – 17:00", "18:00 – 22:00"] },
                  ].map((row) => (
                    <tr
                      key={row.day}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="w-24 px-5 py-4 font-bold text-white">
                        {row.day}
                      </td>
                      {row.slots.map((slot) => (
                        <td
                          key={slot}
                          className="px-3 py-4 font-mono text-white/70"
                        >
                          {slot}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* 응시료 블록 */}
            <motion.div
              {...fadeUp}
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center"
            >
              <p className="text-3xl md:text-4xl font-black text-white">
                47,600원
              </p>
              <p className="mt-3 text-sm md:text-base text-white/60 break-keep">
                4시간 교습비 · 성적표 포함, 별도 비용 없음
              </p>
              <p className="mt-2 text-sm text-white/60 break-keep">
                종목 선택: 기초소묘 / 발상과표현
              </p>
              <Link
                href="/tuition"
                className="mt-6 inline-block text-xs text-white/40 underline underline-offset-4 transition-colors hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                교육청 등록 교습비 고지 보기 (학원등록번호 제02201000109호)
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============ [7] FAQ ============ */}
        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionHead en="FAQ" ko="자주 묻는 질문" />
            <motion.div {...fadeUp} className="border-t border-white/10">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============ [8] 마무리 CTA ============ */}
        <section className="border-t border-white/5 bg-[#05050a] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              {...fadeUp}
              className="text-3xl md:text-5xl font-black text-white tracking-tight leading-snug break-keep"
            >
              이번 주말, 지금 위치부터 확인하세요
            </motion.h2>
            <motion.div {...fadeUp} className="mt-10">
              <CtaButtons />
              <p className="mt-8 text-sm text-white/45">{ADDRESS}</p>
            </motion.div>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
