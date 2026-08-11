"use client";

/**
 * 일산캠퍼스 광고 랜딩(/ilsan).
 *
 * 광고("일산 미술학원", "일산 입시미술" 등)로 들어온 학생·학부모가
 * ① 일산의 미대입시 실기 전문 캠퍼스라는 것 → ② 평일 저녁 18–22시
 * 4시간 실기 집중이라는 것 → ③ 상담 예약, 의 순서로 읽게 설계했다.
 *
 * 일산은 실기 수업만 진행한다 — 학과 직강·기숙·윈터스쿨(홍대 본원 프로그램)이
 * 일산 것처럼 읽히는 문구를 여기에 추가하면 안 된다.
 *
 * CTA에는 광고 전환 추적용 id/data-cta를 붙여 두었다(클릭 위치 구분용):
 * ilsan_hero_consult · ilsan_mid_consult · ilsan_bottom_consult ·
 * ilsan_mobile_sticky_consult 등.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  CalendarCheck,
  Palette,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { fadeUp, SafeImage } from "@/components/winter/shared";
import { NaverTalkButton } from "@/components/academy/NaverTalk";
import BlogLinks from "@/components/academy/BlogLinks";
import { universityCards, RECENT_YEAR } from "@/lib/admissions-data";
import {
  ILSAN_INFO,
  ILSAN_TIMELINE,
  ILSAN_WHY,
  ILSAN_AUDIENCE,
  ILSAN_WORKS,
  ILSAN_SCENE_PLACEHOLDERS,
} from "@/lib/ilsan";

export default function IlsanLanding() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Insight />
      <TimeBlock />
      <WhyIlsan />
      <MidCta />
      <Works />
      <BrandProof />
      <Audience />
      <BottomCta />
      <Location />
      <PageFooter />
      <StickyCta />
    </main>
  );
}

/* ------------------------------- CTA 버튼 -------------------------------- */

/** 채워진 주 버튼 — 네이버 예약으로 이동. 위치별 id/data-cta로 클릭을 구분한다. */
function ConsultButton({
  ctaId,
  label = "일산캠퍼스 1:1 상담 예약",
  className = "",
}: {
  ctaId: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      id={ctaId}
      data-cta={ctaId}
      data-campus="ilsan"
      href={ILSAN_INFO.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 active:scale-95 ${className}`}
      style={{ boxShadow: "0 0 32px rgba(245, 136, 70, 0.35)" }}
    >
      <CalendarCheck size={18} />
      {label}
    </a>
  );
}

/** 전화 보조 버튼 — 테두리만. 주 버튼(예약)이 채워진 색을 독점한다. */
function CallButton({
  ctaId,
  className = "",
}: {
  ctaId: string;
  className?: string;
}) {
  return (
    <a
      id={ctaId}
      data-cta={ctaId}
      data-campus="ilsan"
      href={ILSAN_INFO.phoneTel}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <Phone size={17} />
      전화 상담 {ILSAN_INFO.phone}
    </a>
  );
}

/* --------------------------------- HERO ---------------------------------- */

function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 pb-24 pt-32 md:px-6">
      {/* 은은한 브랜드 컬러 글로우 — 사진이 준비되기 전까지 타이포 중심 히어로 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />
      {/* TODO: 일산캠퍼스 실제 수업·작품 사진이 준비되면 배경 이미지로 교체
          (예: public/images/ilsan/hero.jpg + 어두운 오버레이) */}

      <div className="mx-auto w-full max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-xs tracking-[0.3em] text-accent uppercase md:text-sm"
        >
          모두다른고양이 일산캠퍼스
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-[2.6rem] font-black leading-[1.15] tracking-tight text-white break-keep md:text-7xl"
        >
          학교 끝나고,
          <br />
          실기에만 집중하는{" "}
          <span
            className="text-accent"
            style={{ textShadow: "0 0 40px rgba(245, 136, 70, 0.4)" }}
          >
            4시간.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="mt-7 text-base leading-relaxed text-white/65 break-keep md:text-lg"
        >
          평일 오후 6시부터 10시까지.
          <br />
          학교와 학과 공부가 끝난 저녁, 목표 대학과 전형에 맞춰
          <br className="hidden md:block" /> 미대입시 실기를 준비합니다.
        </motion.p>

        {/* 첫 화면에서 캠퍼스 성격을 확정해 주는 세 가지 사실 */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {[
            { icon: Palette, label: "미대입시 실기 전문" },
            { icon: Clock, label: "평일 18:00 – 22:00" },
            { icon: MapPin, label: "고양시 일산동구" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 md:text-sm"
            >
              <Icon size={13} className="text-accent" />
              {label}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <ConsultButton ctaId="ilsan_hero_consult" />
          <CallButton ctaId="ilsan_hero_call" />
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------- PROBLEM / INSIGHT ---------------------------- */

function Insight() {
  return (
    <section className="px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            After School
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            미대입시는
            <br />
            학교가 끝난 뒤부터 시작됩니다.
          </h2>
        </motion.div>

        <motion.p
          {...fadeUp}
          className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 break-keep md:text-lg"
        >
          낮에는 학교 수업과 학과 공부를 해야 하고, 입시 실기를 준비할 수 있는
          시간은 결국 저녁입니다. 한정된 시간일수록 중요한 것은 하나입니다.
        </motion.p>

        <motion.p
          {...fadeUp}
          className="mt-10 border-l-2 border-accent pl-6 text-xl font-bold leading-relaxed text-white break-keep md:pl-8 md:text-3xl"
        >
          얼마나 오래 그리는지가 아니라,
          <br />
          <span className="text-accent">어떻게 연습하는지.</span>
        </motion.p>
      </div>
    </section>
  );
}

/* --------------------------- 18:00 → 22:00 ------------------------------- */

function TimeBlock() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp} className="text-center">
          <p className="mb-6 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Focus Hours
          </p>
          {/* 페이지의 시그니처 — 시간대가 곧 이 캠퍼스의 정체성이다 */}
          <p className="font-black tracking-tight text-white [font-size:clamp(3rem,10vw,7rem)] leading-none">
            18:00{" "}
            <span aria-hidden="true" className="text-accent">
              —
            </span>{" "}
            22:00
          </p>
          <h2 className="mt-8 text-2xl font-black tracking-tight text-white break-keep md:text-4xl">
            하루 4시간, 실기만 생각합니다.
          </h2>
        </motion.div>

        {/* 시간의 흐름 — 카드 나열 대신 세로 타임라인.
            세부 프로세스는 확정 전이라 일반적인 실기 수업 흐름으로만 적었다(lib/ilsan.ts 참고). */}
        <ol className="relative mx-auto mt-16 max-w-xl">
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-white/20 to-accent"
          />
          {ILSAN_TIMELINE.map((step, i) => (
            <motion.li
              key={step.label}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className="relative flex gap-6 pb-10 pl-10 last:pb-0"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 ${
                  step.time
                    ? "border-accent bg-accent shadow-[0_0_16px_rgba(245,136,70,0.6)]"
                    : "border-white/30 bg-[#0a0a0a]"
                }`}
              />
              <div>
                {step.time && (
                  <p className="mb-1 font-mono text-sm font-bold text-accent">
                    {step.time}
                  </p>
                )}
                <p className="text-lg font-bold text-white md:text-xl">
                  {step.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/50 break-keep md:text-base">
                  {step.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------- WHY MODAGO ILSAN ---------------------------- */

function WhyIlsan() {
  return (
    <section className="px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Why Modago Ilsan
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            같은 4시간이라도,
            <br />
            준비 방식은 달라야 하니까.
          </h2>
        </motion.div>

        {/* 카드 반복 대신 번호 붙은 리스트 — 정보 위계를 타이포로만 세운다 */}
        <div className="mt-14 grid gap-x-12 md:grid-cols-2">
          {ILSAN_WHY.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              className="border-t border-white/10 py-8"
            >
              <p className="mb-3 font-mono text-xs text-accent">
                0{i + 1}
              </p>
              <h3 className="text-lg font-bold text-white md:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55 break-keep md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 캠퍼스 성격을 분명히 — 학과·기숙·윈터스쿨(홍대 본원)과 혼동 방지 */}
        <motion.p
          {...fadeUp}
          className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-white/55 break-keep"
        >
          일산캠퍼스는 <strong className="text-white">입시미술 실기 수업 전문</strong>{" "}
          캠퍼스입니다. 학과 수업 없이, 저녁 시간을 온전히 실기에 씁니다.
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------- 중간 CTA -------------------------------- */

function MidCta() {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] px-5 py-14 md:px-6 md:py-16">
      <motion.div
        {...fadeUp}
        className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"
      >
        <div>
          <p className="text-xl font-black tracking-tight text-white break-keep md:text-2xl">
            우리 아이에게 맞는 수업인지 궁금하다면
          </p>
          <p className="mt-1.5 text-sm text-white/50 md:text-base">
            네이버 예약으로 편한 시간에 1:1 상담을 잡을 수 있습니다.
          </p>
        </div>
        <ConsultButton
          ctaId="ilsan_mid_consult"
          label="상담 예약하기"
          className="shrink-0 px-7 py-3.5 text-sm md:text-base"
        />
      </motion.div>
    </section>
  );
}

/* ------------------------- STUDENT WORK / SCENE --------------------------- */

function Works() {
  return (
    <section className="px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Works &amp; Class
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            결과보다 먼저,
            <br />
            수업을 보여드립니다.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 break-keep md:text-base">
            말로 설명하는 대신, 어떤 그림을 어떻게 그려 가는지를 보여드립니다.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {ILSAN_WORKS.map((work) => (
            <figure key={work.src}>
              <SafeImage src={work.src} alt={work.alt} />
              <figcaption className="mt-2 text-xs text-white/40">
                {work.caption}
              </figcaption>
            </figure>
          ))}
          {/* 일산캠퍼스 현장 사진 자리 — 파일이 준비되면 lib/ilsan.ts에서 src만 채우면 된다 */}
          {ILSAN_SCENE_PLACEHOLDERS.map((scene) => (
            <figure key={scene.caption}>
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#0d0d12] text-white/25">
                <ImageIcon size={26} strokeWidth={1.5} />
                <span className="px-3 text-center text-xs break-keep">
                  {scene.alt}
                </span>
              </div>
              <figcaption className="mt-2 text-xs text-white/40">
                {scene.caption}
              </figcaption>
            </figure>
          ))}
        </motion.div>

        <motion.p {...fadeUp} className="mt-6 text-xs text-white/35">
          작품 이미지는 모두다른고양이의 실기 예시작입니다.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------- BRAND PROOF -------------------------------- */

function BrandProof() {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp} className="text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Results
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            모두다른고양이
            <br className="md:hidden" /> 전체 누적 합격 실적
          </h2>
          {/* 일산 단독 실적으로 오해되지 않도록 기준을 명시한다 */}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 break-keep md:text-base">
            홍대 본원을 포함한 모두다른고양이 전체 누적 기준입니다.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {universityCards.map((card, i) => (
            <motion.div
              key={card.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center last:col-span-2 md:last:col-span-1"
            >
              <p className="text-sm font-medium text-white/60">{card.name}</p>
              <p className="mt-2 text-3xl font-black text-white md:text-4xl">
                <span className="text-accent">{card.total}</span>
                <span className="ml-0.5 text-base font-bold text-white/70">
                  명
                </span>
              </p>
              <p className="mt-1.5 text-[11px] text-white/40">
                {RECENT_YEAR} {card.recent}명 합격
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ WHO IS THIS FOR --------------------------- */

function Audience() {
  return (
    <section className="px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Who Is This For
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            이런 학생에게 맞습니다.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-3 md:grid-cols-2 md:gap-4">
          {ILSAN_AUDIENCE.map((item) => (
            <motion.div
              key={item.grade}
              {...fadeUp}
              className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-5"
            >
              <span className="shrink-0 rounded-full bg-accent/10 px-4 py-2 text-sm font-black text-accent">
                {item.grade}
              </span>
              <p className="text-sm leading-relaxed text-white/70 break-keep md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ COUNSELING CTA ---------------------------- */

function BottomCta() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-6 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[24rem] w-[28rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          {...fadeUp}
          className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl"
        >
          지금 준비 방향이 맞는지,
          <br />
          한번 점검해보세요.
        </motion.h2>
        <motion.p
          {...fadeUp}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 break-keep md:text-base"
        >
          현재 실기 수준과 목표 대학을 바탕으로 일산캠퍼스 수업이 맞는지
          1:1로 안내해 드립니다. 네이버 예약으로 편한 시간을 고르면 됩니다.
        </motion.p>
        <motion.div
          {...fadeUp}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <ConsultButton ctaId="ilsan_bottom_consult" />
          <CallButton ctaId="ilsan_bottom_call" />
        </motion.div>
        <motion.div {...fadeUp} className="mt-4">
          <NaverTalkButton className="px-6 py-3 text-sm" />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- LOCATION -------------------------------- */

function Location() {
  const rows = [
    { icon: MapPin, label: "주소", value: ILSAN_INFO.address },
    { icon: Clock, label: "수업 시간", value: ILSAN_INFO.hours },
    {
      icon: Phone,
      label: "전화",
      value: ILSAN_INFO.phone,
      href: ILSAN_INFO.phoneTel,
    },
  ];

  return (
    <section id="location" className="px-5 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase md:text-sm">
            Location
          </p>
          <h2 className="text-3xl font-black leading-snug tracking-tight text-white break-keep md:text-5xl">
            {ILSAN_INFO.name}
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-10 grid gap-3 md:grid-cols-3 md:gap-4"
        >
          {rows.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <div className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-accent/30">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Icon size={16} className="text-accent" />
                </span>
                <span>
                  <span className="block text-[11px] tracking-widest text-white/40 uppercase">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-white break-keep md:text-base">
                    {value}
                  </span>
                </span>
              </div>
            );
            return href ? (
              <a key={label} href={href} className="block">
                {body}
              </a>
            ) : (
              <div key={label}>{body}</div>
            );
          })}
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href={ILSAN_INFO.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            <ExternalLink size={15} />
            네이버 지도에서 보기
          </a>
          <ConsultButton
            ctaId="ilsan_location_consult"
            label="상담 예약하기"
            className="px-7 py-3.5 text-sm"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- FOOTER --------------------------------- */

function PageFooter() {
  return (
    <footer className="border-t border-white/10 px-5 pb-32 pt-12 text-center md:px-6 md:pb-16">
      <p className="text-sm text-white/50">모두다른고양이 미술학원</p>
      <BlogLinks className="mt-5" />
      <p className="mt-6 text-xs text-white/30">
        학원등록번호 제02201000109호 ·{" "}
        <Link
          href="/tuition"
          className="underline underline-offset-2 transition-colors hover:text-white/60"
        >
          교습비 고지
        </Link>
      </p>
      <p className="mt-2 text-xs text-white/30">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}

/* ---------------------------- 모바일 Sticky CTA ---------------------------- */

/**
 * 모바일 하단 고정 바 — 첫 화면을 절반쯤 지나면 나타난다.
 * 광고 유입은 모바일 비중이 크므로 상담 동선을 화면에서 놓치지 않게 한다.
 * (이 바가 있는 동안 톡톡 플로팅 버튼은 모바일에서 숨긴다 — NaverTalk.tsx 참고)
 */
function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-white/10 bg-black/90 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden"
        >
          <a
            id="ilsan_mobile_sticky_call"
            data-cta="ilsan_mobile_sticky_call"
            data-campus="ilsan"
            href={ILSAN_INFO.phoneTel}
            aria-label={`전화 상담 ${ILSAN_INFO.phone}`}
            className="flex shrink-0 items-center justify-center rounded-xl border border-white/20 px-4 py-3 text-white"
          >
            <Phone size={18} />
          </a>
          <a
            id="ilsan_mobile_sticky_consult"
            data-cta="ilsan_mobile_sticky_consult"
            data-campus="ilsan"
            href={ILSAN_INFO.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-black"
          >
            <CalendarCheck size={17} />
            일산캠퍼스 상담 예약하기
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
