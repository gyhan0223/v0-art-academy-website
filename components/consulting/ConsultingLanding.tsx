"use client";

/**
 * 유료 1:1 입시 전략 컨설팅 랜딩 (/consulting).
 *
 * conversion landing이라 일반 SiteNav·톡톡 플로팅 버튼을 숨기고(/diagnosis와
 * 같은 패턴 — SiteNav.tsx·NaverTalk.tsx의 early return) 자체 최소 상단 바만
 * 둔다. 보조 문의 수단은 예약 안내 아래 인라인 톡톡 버튼으로 제공한다.
 *
 * 신청은 자체 폼이 아니라 네이버 예약("1:1 컨설팅 예약하기" 상품)으로 받는다 —
 * 모든 CTA가 NAVER_BOOKING_CONSULTING_URL(클릭 날짜를 붙이는 내부 리다이렉트,
 * app/booking/consulting/route.ts)로 나간다.
 *
 * 가격·상품명·FAQ는 lib/consulting.ts 단일 소스만 쓴다.
 * ?from= 유입 경로는 whitelist(normalizeConsultingSource)를 거쳐
 * 애널리틱스로만 전달한다 — 임의 문자열은 저장되지 않는다.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CONSULTING_FAQS,
  CONSULTING_INFO,
  normalizeConsultingSource,
  trackConsulting,
  type ConsultingSource,
} from "@/lib/consulting";
import { NAVER_BOOKING_CONSULTING_URL } from "@/lib/contact";
import { NaverTalkButton } from "@/components/academy/NaverTalk";

/* ------------------------- 모바일 하단 sticky CTA ------------------------- */

/**
 * 첫 화면을 반쯤 지나면 나타나고, 하단 예약 섹션이 화면에 들어오면 숨는다 —
 * 같은 예약 버튼이 두 개 겹쳐 보이지 않게. winter/MobileActionBar 패턴 참고.
 */
function StickyCta({ onClick }: { onClick: () => void }) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [bookingInView, setBookingInView] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setScrolledEnough(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("booking");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBookingInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visible = scrolledEnough && !bookingInView;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={NAVER_BOOKING_CONSULTING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        className="block min-h-[48px] w-full rounded-xl bg-accent px-5 py-3.5 text-center text-[15px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        1:1 컨설팅 예약 · {CONSULTING_INFO.priceLabel}
      </a>
    </div>
  );
}

/* --------------------------------- 랜딩 ---------------------------------- */

export default function ConsultingLanding() {
  // ?from= 은 화면 렌더에 쓰이지 않고 이벤트·신청 payload에만 들어가므로
  // useSearchParams 대신 마운트 후 location에서 읽는다 — useSearchParams를
  // 쓰면 Suspense 경계가 필요해지고, 경계 안 콘텐츠는 selective hydration으로
  // 늦게 하이드레이션돼 첫 인터랙션이 밀릴 수 있다.
  const [source, setSource] = useState<ConsultingSource>("consulting");

  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    const s = normalizeConsultingSource(
      new URLSearchParams(window.location.search).get("from"),
    );
    setSource(s);
    trackConsulting("consulting_view", { source: s });
  }, []);

  // CTA는 전부 네이버 예약으로 바로 나가므로 여기서는 이벤트만 남긴다
  const handlePrimaryCta = () => {
    trackConsulting("consulting_primary_cta_click", { source });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {/* 단순 상단 바 — 일반 사이트 크롬 없이 로고와 무료 진단 링크만 */}
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-[15px] font-black tracking-tight text-white"
          aria-label="모두다른고양이 홈으로"
        >
          모두다른고양이
        </Link>
        <Link
          href="/diagnosis"
          onClick={() => trackConsulting("consulting_diagnosis_click", { source })}
          className="rounded-md px-2 py-1.5 text-[14px] text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          무료 성적 진단
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 pb-28">
        {/* ------------------------------ Hero ------------------------------ */}
        <section aria-label="컨설팅 소개" className="mx-auto max-w-md pt-10 md:max-w-2xl md:pt-16">
          <p className="text-[12px] tracking-wider text-accent">
            2027 미대 입시 1:1 전략 컨설팅
          </p>
          <h1 className="mt-4 text-[32px] font-bold leading-snug text-white md:text-[42px]">
            설명회 말고,
            <br />내 성적으로 봅니다.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/55 break-keep md:text-base">
            현재 성적 · 준비 중인 실기 · 희망 대학을 함께 보고
            <br className="hidden md:block" /> 지금 어디를 노릴 수 있는지,
            무엇부터 올려야 하는지 1:1로 정리합니다.
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <p className="text-[14px] text-white/60">{CONSULTING_INFO.name}</p>
            <p className="text-2xl font-bold text-white">
              {CONSULTING_INFO.priceLabel}
            </p>
          </div>

          <div className="mt-6 max-w-md space-y-3">
            <a
              href={NAVER_BOOKING_CONSULTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePrimaryCta}
              className="block min-h-[52px] w-full rounded-xl bg-accent px-6 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              1:1 컨설팅 예약하기
            </a>
            <Link
              href="/diagnosis"
              onClick={() =>
                trackConsulting("consulting_diagnosis_click", { source })
              }
              className="block min-h-[44px] w-full rounded-xl border border-white/15 px-6 py-3.5 text-center text-[15px] font-medium text-white/80 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              무료 성적 진단 먼저 해보기 →
            </Link>
          </div>
        </section>

        {/* ---------------------- 설명회와 다른 이유 ---------------------- */}
        <section aria-label="설명회와 다른 이유" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <h2 className="text-[24px] font-bold leading-snug text-white break-keep md:text-[28px]">
            모두에게 같은 설명보다
            <br />내 상황에 맞는 한 번의 판단이 필요합니다.
          </h2>
          <div className="mt-8 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[13px] text-white/45">설명회는</p>
              <ul className="mt-3 space-y-2 text-[15px] text-white/70">
                <li>전체 입시 변화</li>
                <li>대학별 일반적인 특징</li>
                <li>모두에게 같은 공통 전략</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
              <p className="text-[13px] text-accent">1:1 컨설팅은</p>
              <ul className="mt-3 space-y-2 text-[15px] font-medium text-white">
                <li>현재 내 성적</li>
                <li>준비 중인 실기</li>
                <li>희망 대학</li>
                <li>남은 기간</li>
              </ul>
              <p className="mt-3 text-[13px] leading-relaxed text-white/55 break-keep">
                이 네 가지를 기준으로 지금 내게 맞는 판단을 내립니다.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------- 컨설팅에서 보는 것 ---------------------- */}
        <section aria-label="컨설팅에서 보는 것" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <h2 className="text-[24px] font-bold leading-snug text-white md:text-[28px]">
            컨설팅에서
            <br />이 다섯 가지를 정리합니다.
          </h2>
          <ol className="mt-8 space-y-3">
            {[
              {
                title: "현재 성적으로 가능한 대학",
                desc: "지금 성적에서 현실적으로 검토할 수 있는 지원권",
              },
              {
                title: "희망 대학까지의 거리",
                desc: "현재 위치와 목표 대학 사이에서 무엇이 부족한지",
              },
              {
                title: "성적 vs 실기 우선순위",
                desc: "남은 기간 동안 무엇에 시간을 더 써야 하는지",
              },
              {
                title: "가·나·다군 지원 방향",
                desc: "정시에서 세 장의 카드를 어떤 방향으로 구성할지",
              },
              {
                title: "앞으로의 준비 전략",
                desc: "다음 모의고사와 겨울방학까지 무엇을 해야 하는지",
              },
            ].map((item, i) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <span className="font-mono text-[13px] font-bold text-accent">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/55 break-keep">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[12px] leading-relaxed text-white/35 break-keep">
            컨설팅은 합격을 보장하거나 합격 확률을 계산해주는 서비스가 아니라,
            현재 상황에서 가장 승산 있는 준비 방향을 함께 정하는 과정입니다.
          </p>
        </section>

        {/* ------------------ 무료 진단 vs 유료 컨설팅 ------------------ */}
        <section aria-label="무료 진단과의 차이" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <h2 className="text-[24px] font-bold leading-snug text-white break-keep md:text-[28px]">
            무료 진단을 이미 해봤다면,
            <br />그 다음 단계입니다.
          </h2>
          <div className="mt-8 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[15px] font-bold text-white">무료 성적 진단</p>
              <ul className="mt-3 flex-1 space-y-2 text-[14px] text-white/65">
                <li>현재 성적 입력</li>
                <li>공개된 대학 데이터 기준</li>
                <li>가능한 대학 조합 자동 분석</li>
                <li>약 1분</li>
              </ul>
              <Link
                href="/diagnosis"
                onClick={() =>
                  trackConsulting("consulting_diagnosis_click", { source })
                }
                className="mt-5 block min-h-[44px] rounded-xl border border-white/15 px-4 py-3 text-center text-[14px] font-medium text-white/80 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                먼저 무료로 진단해보기 →
              </Link>
            </div>
            <div className="flex flex-col rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
              <p className="text-[15px] font-bold text-white">
                {CONSULTING_INFO.name}
              </p>
              <ul className="mt-3 flex-1 space-y-2 text-[14px] text-white/75">
                <li>자동 계산 결과를 넘어 실제 학생 상황 확인</li>
                <li>성적 + 실기 + 목표 대학을 함께 판단</li>
                <li>어떤 과목과 실기를 우선해야 할지 결정</li>
                <li>지원 전략과 앞으로의 준비 방향 상담</li>
              </ul>
              <a
                href={NAVER_BOOKING_CONSULTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePrimaryCta}
                className="mt-5 block min-h-[44px] w-full rounded-xl bg-accent px-4 py-3 text-center text-[14px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                이미 진단했다면 1:1 분석받기
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------- 판매 압박 불안 제거 ---------------------- */}
        <section aria-label="컨설팅만 받아도 괜찮습니다" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[18px] font-bold text-white">
              컨설팅만 받아도 괜찮습니다.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/60 break-keep">
              컨설팅은 학원 등록을 전제로 한 무료 상담이 아니라 학생의 현재
              입시 상황을 분석하는 별도의 서비스입니다. 상담 결과 모다고의
              수업이나 윈터스쿨이 적합한 경우에는 선택지 중 하나로 안내할 수
              있지만, 등록은 필수가 아닙니다.
            </p>
          </div>
        </section>

        {/* -------------------------- 예약 프로세스 -------------------------- */}
        <section aria-label="예약 프로세스" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <h2 className="text-[24px] font-bold leading-snug text-white md:text-[28px]">
            예약은 이렇게 진행됩니다.
          </h2>
          <ol className="mt-8 space-y-0 md:grid md:grid-cols-3 md:gap-4">
            {[
              {
                step: "01 예약",
                desc: "네이버 예약에서 원하는 날짜와 시간 선택",
              },
              {
                step: "02 확정 안내",
                desc: "예약 확인과 결제 방법 안내",
              },
              {
                step: "03 1:1 컨설팅",
                desc: "성적 · 실기 · 희망 대학을 함께 분석",
              },
            ].map((item, i) => (
              <li key={item.step} className="relative pb-6 md:pb-0">
                {/* 모바일 세로 연결선 */}
                {i < 2 && (
                  <span
                    aria-hidden
                    className="absolute left-[9px] top-8 h-[calc(100%-2rem)] w-px bg-white/10 md:hidden"
                  />
                )}
                <div className="flex items-start gap-4 md:block">
                  <span
                    aria-hidden
                    className="mt-1 block h-[19px] w-[19px] shrink-0 rounded-full border-2 border-accent/70 bg-background md:mt-0"
                  />
                  <div className="md:mt-3">
                    <p className="font-mono text-[14px] font-bold text-accent">
                      {item.step}
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-white/60 break-keep">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------ 예약 ------------------------------ */}
        {/* StickyCta가 이 섹션(id="booking")이 보이는 동안 숨는다 */}
        <section
          id="booking"
          aria-label="컨설팅 예약"
          className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl"
        >
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-6">
            <h2 className="text-[24px] font-bold leading-snug text-white md:text-[28px]">
              1:1 컨설팅 예약
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/60 break-keep">
              네이버 예약에서 상담 가능한 날짜와 시간을 직접 고르시면 됩니다.
            </p>
            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-[13px] text-white/60">{CONSULTING_INFO.name}</p>
              <p className="text-xl font-bold text-white">
                {CONSULTING_INFO.priceLabel} / {CONSULTING_INFO.priceUnit}
              </p>
            </div>
            <a
              href={NAVER_BOOKING_CONSULTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePrimaryCta}
              className="mt-4 block min-h-[52px] rounded-xl bg-accent px-6 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              1:1 컨설팅 예약하기
            </a>
          </div>
          {/* 플로팅 톡톡 버튼을 숨긴 페이지라 보조 문의 수단을 예약 아래에 둔다 */}
          <div className="mt-4 text-center">
            <p className="text-[13px] text-white/45">
              예약 전에 궁금한 점이 있다면
            </p>
            <NaverTalkButton
              className="mt-2.5 px-5 py-2.5 text-[14px]"
              label="톡톡으로 가볍게 문의하기"
            />
          </div>
        </section>

        {/* -------------------------------- FAQ ------------------------------- */}
        <section aria-label="자주 묻는 질문" className="mx-auto mt-20 max-w-md md:mt-28 md:max-w-2xl">
          <h2 className="text-[24px] font-bold leading-snug text-white md:text-[28px]">
            자주 묻는 질문
          </h2>
          <div className="mt-6 space-y-3">
            {CONSULTING_FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-[15px] font-medium text-white/90 transition-colors group-open:text-accent">
                  {faq.q}
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-white/60 break-keep">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------- 윈터스쿨 — 하단 작은 연결만 ------------------- */}
        <section aria-label="윈터스쿨 안내" className="mx-auto mt-20 max-w-md md:max-w-2xl">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[15px] font-bold text-white">
              겨울방학 전체 계획까지 필요하다면
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55 break-keep">
              컨설팅 결과 집중적인 학과·실기 관리가 필요하다고 판단되는 학생은
              모다고 윈터스쿨도 함께 검토할 수 있습니다.
            </p>
            <Link
              href="/winter"
              onClick={() =>
                trackConsulting("consulting_winter_click", { source })
              }
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              윈터스쿨 보기 <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <StickyCta onClick={handlePrimaryCta} />
    </div>
  );
}
