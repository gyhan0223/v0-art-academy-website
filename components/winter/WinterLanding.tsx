"use client";

/**
 * 윈터캠프 개요(/winter) — 결정에 필요한 것만 남긴 짧은 페이지.
 *
 * 섹션 흐름:
 *  1. 히어로: 헤드라인 + 즉시 CTA + 긴급성(D-day·정원)
 *  2. 대상 · 정원 · 기간
 *  3. 겨울 8주의 비중 배분 (평일 학과 · 주말 실기)
 *  4. 1주차 진단 → 8주차 재측정
 *  5. 격주 리포트 샘플 1장
 *  → CTA
 *  6. 하위 페이지 카드 4개 (일과표 · 강사진 · 사진 · 성적 향상 사례)
 *  7. 상담 신청 (폼 · 수강료 · 환불 규정 · 오시는 길)
 *
 * 상세 내용은 각 하위 페이지가 맡는다. 여기에 다시 붙이지 말 것.
 * 상세 근거: docs/winter-cro-redesign.md
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Users,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CalendarClock,
  Images,
  TrendingUp,
  MessageSquare,
  MessageCircle,
  ClipboardCheck,
  Repeat,
  Target,
} from "lucide-react";
import {
  CAMP_INFO,
  REPORT_SAMPLE,
  WINTER_PAGES,
  SMS_HREF,
  KAKAO_CHANNEL_URL,
  getRemainingLabel,
} from "@/lib/winter-camp";
import CtaBand from "@/components/winter/CtaBand";
import GradeSlopeChart from "@/components/winter/GradeSlopeChart";
import ConsultForm from "@/components/winter/ConsultForm";
import MobileActionBar from "@/components/winter/MobileActionBar";
import { NaverTalkButton } from "@/components/academy/NaverTalk";
import {
  fadeUp,
  SectionHead,
  SafeImage,
  CONSULT_HREF,
  goToConsult,
} from "@/components/winter/shared";

/* --------------------------------- 데이터 ---------------------------------- */

/** 1주차 진단 → 8주차 재측정 — 이 캠프가 결과를 확인하는 방식 */
const MEASURE_STEPS = [
  {
    step: "1주차",
    title: "진단고사",
    desc: "입소 첫 주에 국어·영어·탐구 세 과목을 평가원 기출로 응시합니다. 지금 등급이 어디인지 먼저 확정하고, 과목별로 8주 목표를 정합니다.",
    icon: ClipboardCheck,
  },
  {
    step: "2~7주차",
    title: "매주 확인",
    desc: "화요일 영어·금요일 국어 모의고사와 매일 밤 영단어 100개 시험으로 학습량을 숫자로 남깁니다. 격주 리포트로 그 기록을 학부모님께 보내드립니다.",
    icon: Repeat,
  },
  {
    step: "8주차",
    title: "재측정",
    desc: "1주차와 같은 기준으로 다시 응시합니다. 8주 동안 무엇이 얼마나 올랐는지, 무엇이 남았는지 숫자로 확인하고 3월 이후 계획까지 잡아 드립니다.",
    icon: Target,
  },
];

/** 하위 페이지 카드에 붙일 아이콘 */
const PAGE_ICONS: Record<string, typeof CalendarClock> = {
  "/winter/schedule": CalendarClock,
  "/winter/teachers": Users,
  "/winter/gallery": Images,
  "/winter/results": TrendingUp,
};

/* ------------------------------- 하위 컴포넌트 ------------------------------- */

function DdayBadge() {
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    const deadline = new Date(`${CAMP_INFO.deadlineISO}T23:59:59+09:00`);
    setDday(Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));
  }, []);

  if (dday === null) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
      <CalendarDays size={14} />
      {dday > 0
        ? `접수 마감까지 D-${dday}`
        : dday === 0
          ? "오늘 접수 마감"
          : "접수가 마감되었습니다"}
    </span>
  );
}

function KakaoTalkButton() {
  // TODO: 2026년 9월 카카오톡 채널 개설 후 lib/winter-camp.ts의 KAKAO_CHANNEL_URL만 채우면 노출됨
  if (!KAKAO_CHANNEL_URL) return null;

  return (
    <a
      href={KAKAO_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85"
    >
      <MessageCircle size={15} />
      카카오톡 문의
    </a>
  );
}

/* --------------------------------- 페이지 ---------------------------------- */

export default function WinterLanding() {
  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      {/* ============ [1] 히어로 ============ */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/winter/hero.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/75" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-2.5 text-xs md:text-sm tracking-[0.3em] text-accent uppercase">
            최상위권 미대 전문
          </p>
          <p className="mb-4 text-[11px] md:text-sm tracking-[0.2em] text-white/50">
            {CAMP_INFO.name} · 홍대 본원 기숙
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white break-keep">
            고3 1년을
            <br />
            시작할 상태로 돌려보냅니다
          </h1>
          <p className="mt-5 text-base md:text-xl text-white/75 break-keep">
            예비 고3의 겨울 8주. 평일은 학과 직강,
            <br className="md:hidden" /> 주말은 대학교 유형 실기.
          </p>

          {/* 긴급성 — D-day + 정원 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <DdayBadge />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white">
              <Users size={14} className="text-accent" />
              정원 {CAMP_INFO.capacityTotal}명 · {getRemainingLabel()}
            </span>
          </div>

          {/* CTA — 모바일 첫 화면 안에 반드시 노출 */}
          <div className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={CONSULT_HREF}
              onClick={goToConsult}
              className="w-full rounded-full bg-accent px-8 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 sm:w-auto"
            >
              상담 신청하기
            </Link>
            <a
              href={CAMP_INFO.phoneTel}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 sm:w-auto"
            >
              <Phone size={17} />
              전화 문의 {CAMP_INFO.phone}
            </a>
            {/* 전화도 신청도 아직인 분들 — 톡톡으로 먼저 묻게 열어 둔다 */}
            <NaverTalkButton className="w-full px-8 py-4 text-base sm:w-auto" />
          </div>
          <p className="mt-3 text-xs text-white/45">
            신청은 1분 · 밤에 남겨주셔도 다음 날 연락드립니다
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs md:text-sm text-white/60">
            {["홍대 본원", "학과 직강", "실기 주말 집중", "기숙"].map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/15 px-3.5 py-1.5"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ [2] 대상 · 정원 · 기간 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            {...fadeUp}
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {[
              { label: "대상", value: CAMP_INFO.target },
              {
                label: "정원",
                value: `${CAMP_INFO.capacity} (${CAMP_INFO.capacityNote})`,
              },
              { label: "기간", value: CAMP_INFO.period },
              { label: "접수마감", value: CAMP_INFO.deadline },
            ].map((info) => (
              <div
                key={info.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-5"
              >
                <p className="text-[11px] tracking-widest text-white/40 uppercase">
                  {info.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white break-keep">
                  {info.value}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.p
            {...fadeUp}
            className="mt-6 text-center text-sm text-white/50 break-keep"
          >
            {CAMP_INFO.venueName}에서 진행하는 8주 기숙 과정입니다. 캠프가 끝나면
            각자의 학교 생활로 복귀합니다.
          </motion.p>
        </div>
      </section>

      {/* ============ [3] 왜 학과가 먼저인가 ============ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Why Balance"
            ko={
              <>
                실기는 그대로 가져가고,
                <br />
                학과를 끌어올리는 8주
              </>
            }
          />

          <motion.div
            {...fadeUp}
            className="mx-auto max-w-3xl rounded-2xl border border-accent/40 bg-accent/[0.06] px-7 py-9 md:px-12 md:py-12 text-center"
          >
            <p className="text-xs tracking-[0.25em] text-accent uppercase">
              Why Modago
            </p>
            <p className="mt-4 text-2xl md:text-3xl font-black text-white break-keep">
              겨울 8주는 비중의 문제입니다.
            </p>
            <div className="mt-5 space-y-4 text-sm md:text-lg leading-[1.9] text-white/75 break-keep">
              <p>
                실기도 학과도 놓을 수 없습니다.{" "}
                <br className="hidden md:block" />
                이 겨울에 무엇을 더 많이 두느냐가 다를 뿐입니다.
              </p>
              <p>
                두 달을 실기로만 채우면 그림은 늘지만{" "}
                <br className="hidden md:block" />
                학과 성적은 그 자리에 멈춥니다.{" "}
                <br className="hidden md:block" />
                저희는 평일을 학과에 두고, 주말마다 실기를 이어 갑니다.
              </p>
              <p>
                미대 정시는 대부분 수학을 반영하지 않습니다.{" "}
                <br className="hidden md:block" />
                일반 기숙학원이 수학에 쓰는 8주를,{" "}
                <br className="hidden md:block" />
                저희는 국어·영어·탐구에 전부 씁니다.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-white/45">
                수학이 필수인 곳은 서울대 디자인과처럼 일부이고, 이화여대·홍익대처럼
                반영하는 대학도 국·수·탐 중 택2라 수학 없이 지원할 수 있습니다.
                지망 대학에 수학이 필요하다면 상담 때 함께 확인합니다.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <p className="text-[11px] tracking-[0.25em] text-white/35 uppercase">
                일반 미술학원의 겨울
              </p>
              <p className="mt-4 text-xl md:text-2xl font-bold text-white/60 leading-snug break-keep">
                두 달 내내 실기 특강,
                <br />
                학과는 각자 알아서
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/40 break-keep">
                13:00~22:00을 그림에 씁니다. 그림은 늘지만 학과는 겨울 전보다
                내려앉은 채 3월을 맞습니다.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 md:p-10">
              <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                모다고 윈터캠프
              </p>
              <p className="mt-4 text-xl md:text-2xl font-bold text-white leading-snug break-keep">
                평일은 학과에 전부,
                <br />
                주말은 실기에 집중
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/55 break-keep">
                주말 이틀로 손과 감각은 8주 내내 이어 갑니다. 늘어난 평일
                시간은 국어·영어·탐구에 씁니다.
              </p>
            </div>
          </motion.div>

          {/* 두 카드의 차이를 숫자로 — 같은 등급에서 갈라지는 8주 */}
          <GradeSlopeChart />

          <motion.p
            {...fadeUp}
            className="mx-auto mt-8 max-w-2xl text-center text-sm md:text-base leading-relaxed text-white/60 break-keep"
          >
            겨울을 실기 특강으로만 채우면 하루의 대부분이 그림에 쓰여 학과
            공부는 흐름이 끊깁니다. 반대로 실기를 두 달 놓아 버리면 3월에 손을
            되찾는 데만 몇 주가 듭니다. 그래서 주말 실기는 8주 내내 그대로 두고,
            평일을 학과에 씁니다. 학과는 강사가 직접 가르치고, 취침·기상까지
            정해진 일과로 운영되어 학생은 공부와 그림에만 집중합니다.{" "}
            <Link
              href="/winter/schedule"
              className="text-accent underline underline-offset-4 hover:text-white"
            >
              하루 일과표 보기
            </Link>
          </motion.p>

          {/* "강사 직강"이라고만 쓰면 확인할 방법이 없다 — 강사진 페이지로 보낸다 */}
          <motion.div {...fadeUp} className="mt-6 text-center">
            <Link
              href="/winter/teachers"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-75"
            >
              누가 가르치는지 보기
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ [4] 1주차 진단 → 8주차 재측정 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Diagnose & Retest"
            ko="1주차에 재고, 8주차에 다시 잽니다"
            sub="느낌이 아니라 같은 기준의 시험으로 8주의 변화를 확인합니다."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {MEASURE_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={20} strokeWidth={1.5} className="text-accent" />
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-accent">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/60 break-keep">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ---- 격주 리포트 샘플 1장 ---- */}
          <motion.div
            {...fadeUp}
            className="mt-12 grid items-center gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:grid-cols-2 md:p-10"
          >
            <figure>
              <SafeImage
                src={REPORT_SAMPLE.src}
                alt={REPORT_SAMPLE.caption}
                aspectClass="aspect-[3/4]"
              />
              <figcaption className="mt-3 text-center text-xs text-white/40 break-keep">
                {REPORT_SAMPLE.caption}
              </figcaption>
            </figure>

            <div>
              <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                Report
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white break-keep">
                2주에 한 번, 숫자로 보내드립니다
              </h3>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-white/60 break-keep">
                모의고사 점수와 단어 시험 결과, 자기주도 학습 시간과 생활 상황을
                정리해 격주로 학부모님께 발송합니다. 8주가 끝난 뒤에 결과를
                받아보는 것이 아니라, 진행되는 동안 계속 확인하실 수 있습니다.
              </p>
              <Link
                href="/winter/results"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                실제 성적 향상 사례 보기
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <CtaBand
        headline={
          <>
            학과까지 직강하는 미술학원은
            <br className="md:hidden" /> 흔치 않습니다
          </>
        }
        sub="우리 아이에게 맞는 과정인지, 상담으로 확인해 보세요."
      />

      {/* ============ [5] 하위 페이지 카드 4개 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="More"
            ko="더 자세히 보기"
            sub="일과·강사진·공간·결과는 각 페이지에서 확인하실 수 있습니다."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {WINTER_PAGES.map((page, i) => {
              const Icon = PAGE_ICONS[page.href];
              return (
                <motion.div
                  key={page.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    href={page.href}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-accent/40 hover:bg-accent/[0.04]"
                  >
                    {Icon && (
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-accent"
                      />
                    )}
                    <span className="flex-1">
                      <span className="block text-[11px] tracking-[0.25em] text-white/35 uppercase">
                        {page.en}
                      </span>
                      <span className="mt-1.5 flex items-center gap-1.5 text-lg md:text-xl font-bold text-white">
                        {page.label}
                        <ArrowUpRight
                          size={17}
                          className="text-white/30 transition-colors group-hover:text-accent"
                        />
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-white/55 break-keep">
                        {page.desc}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ [6] 상담 신청 ============ */}
      <section id="contact" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            en="Apply"
            ko="상담 신청"
            sub={
              <>
                접수 마감 {CAMP_INFO.deadline} · 정원 {CAMP_INFO.capacity} (
                {CAMP_INFO.capacityNote})
              </>
            }
          />

          <motion.div {...fadeUp}>
            <ConsultForm />
          </motion.div>

          {/* 수강료 안내 */}
          <motion.div
            {...fadeUp}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center"
          >
            <p className="text-[11px] tracking-[0.25em] text-white/40 uppercase">
              8주 전 과정 수강료
            </p>
            <p className="mt-4 text-3xl md:text-4xl font-black text-white">
              {CAMP_INFO.tuition}
            </p>
            <p className="mt-3 text-sm md:text-base text-white/60 break-keep">
              {CAMP_INFO.tuitionIncludes}
            </p>
            <p className="mt-2 text-sm text-white/45 break-keep">
              수강료는 학생별 과정 구성에 따라 달라져, 상담을 통해 정확히
              안내드립니다.
            </p>

            {/* 일괄 등록 할인 (얼리버드) */}
            <div className="mt-7 rounded-xl border border-accent/30 bg-accent/[0.06] px-6 py-5">
              <p className="text-xs tracking-[0.25em] text-accent uppercase">
                Early Bird
              </p>
              <p className="mt-2 text-base md:text-lg font-bold text-white break-keep">
                {CAMP_INFO.earlyBird}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={CAMP_INFO.phoneTel}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85"
              >
                <Phone size={15} />
                수강료 상담 {CAMP_INFO.phone}
              </a>
              {/* 문자 문의 — 데스크톱은 문자 앱이 없어 모바일에서만 노출 */}
              <a
                href={SMS_HREF}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/50 md:hidden"
              >
                <MessageSquare size={15} />
                문자 문의
              </a>
              {/* 금액이 걸린 자리 — "식비는 포함인가요" 같은 질문을 받아 줄 창구 */}
              <NaverTalkButton className="px-7 py-3.5 text-sm" />
              <KakaoTalkButton />
            </div>

            <Link
              href="/tuition"
              className="mt-6 inline-block text-xs text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
            >
              교육청 등록 교습비 고지 보기 (학원등록번호 제02201000109호)
            </Link>
          </motion.div>

          {/* 환불 규정 — 교육청 환불규정 제18조 제3호 (접지 않고 항상 펼쳐 노출) */}
          <motion.div
            {...fadeUp}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-9"
          >
            <h3 className="text-base md:text-lg font-bold text-white">
              환불 규정 안내
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/60 break-keep">
              <p>
                중도 퇴원(퇴소) 시 교육청 환불규정(제18조 제3호)에 따라 수강료를
                반환합니다.
              </p>
              <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["총 교습시간의 1/3 경과 전", "납부한 교습비의 2/3 환불"],
                      ["총 교습시간의 1/2 경과 전", "납부한 교습비의 1/2 환불"],
                      ["총 교습시간의 1/2 경과 후", "반환하지 않음"],
                    ].map(([when, amount]) => (
                      <tr
                        key={when}
                        className="border-b border-white/5 last:border-b-0"
                      >
                        <td className="px-4 py-3 text-white/70">{when}</td>
                        <td className="px-4 py-3 text-white/90 font-medium">
                          {amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="list-disc space-y-1.5 pl-5 text-white/55">
                <li>
                  개인 사정으로 인한 지각·결석은 수강료 반환 사유에서
                  제외됩니다.
                </li>
                <li>
                  할인을 받은 학생이 환불을 요청할 경우 할인이 취소되며,
                  할인받은 금액을 제외한 차액을 환불합니다.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* 오시는 길 */}
          <motion.div {...fadeUp} className="mt-14 text-center">
            <a
              href={CAMP_INFO.phoneTel}
              className="group inline-block"
              aria-label={`홍대 본원 전화 ${CAMP_INFO.phone}`}
            >
              <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
                홍대 본원
              </p>
              <p className="mt-2 text-4xl md:text-6xl font-black tracking-tight text-white transition-colors group-hover:text-accent">
                {CAMP_INFO.phone}
              </p>
            </a>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-white/80">
                <MapPin size={15} className="text-accent" />
                {CAMP_INFO.venueName}
              </p>
              <p className="mt-2 text-sm text-white/55">{CAMP_INFO.address}</p>
              <a
                href={CAMP_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                네이버 지도로 보기
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 모바일 하단 고정 CTA ============ */}
      <MobileActionBar />
    </main>
  );
}
