import type { Metadata } from "next";
import Link from "next/link";
import GunCardSlots from "@/components/academy/GunCardSlots";
import JungsiExplorer from "@/components/academy/JungsiExplorer";
import JungsiScheduleModal from "@/components/academy/JungsiScheduleModal";
import SilgiGallery from "@/components/academy/SilgiGallery";
import { SILGI_CATEGORY_ORDER, SILGI_META } from "@/lib/jungsi-data";
import { CONSULTING_INFO } from "@/lib/consulting";

export const metadata: Metadata = {
  title: "2027학년도 미대 정시 가나다군 총정리 | 모두다른고양이 미술학원",
  description:
    "서울대·홍익대·국민대 등 주요 26개 미술대학의 정시 모집군·전형방법(수능 반영영역·실기 비율)·실기 종목과 학과별 모집인원·경쟁률까지 한 페이지에 정리했습니다. 가·나·다군 지원 조합 짜기 전에 꼭 확인하세요.",
  keywords: [
    "미대 정시 가나다군",
    "2027 미대 정시",
    "미대 정시 전형방법",
    "미대 정시 경쟁률",
    "기초디자인 대학",
    "발상과 표현",
    "기초소양평가",
    "미대 실기 종목",
    "홍익대 비실기",
    "위시티 미술학원",
    "일산 미술학원",
  ],
  alternates: { canonical: "/guide/jungsi-2027" },
  openGraph: {
    title: "2027학년도 미대 정시 가나다군 총정리",
    description:
      "주요 미대 26곳의 모집군·전형방법·실기 종목과 학과별 모집인원·경쟁률 — 지원 카드 3장을 어떻게 쓸지, 한 페이지로 끝내세요.",
    type: "article",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

/**
 * 입시 전략을 묻는 문맥의 CTA는 유료 1:1 전략 컨설팅 랜딩으로 보낸다.
 * (예전에는 일산 네이버 예약(무료 진단 상담)으로 직접 보냈다 — 일반 캠퍼스
 * 등록 상담은 상단 네비 "상담 신청" 버튼이 그대로 담당한다.)
 */
const CONSULTING_HREF = "/consulting?from=jungsi";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "가군, 나군, 다군이 뭔가요?",
    a: "정시에서는 대학들이 시험 기간에 따라 세 그룹(군)으로 나뉘고, 학생은 군마다 1곳씩 최대 3곳에 지원할 수 있습니다. 같은 군에 두 곳을 쓸 수 없기 때문에, 어느 군에 어떤 대학이 있는지가 지원 전략의 출발점입니다. 군은 대학이 아니라 학과 단위로 정해진다는 점이 핵심입니다 — 건국대처럼 학과별로 가·나·다군에 나뉜 대학은 한 학교에 최대 3번 지원할 수도 있습니다.",
  },
  {
    q: "기초조형·소양평가와 기초디자인은 뭐가 다른가요?",
    a: "기초디자인이 '주어진 사물로 화면을 얼마나 완성도 있게 구성하는가'를 본다면, 기초조형·소양평가는 '대상을 관찰하거나 주제를 보고 아이디어를 어떻게 풀어내는가'를 봅니다. 국민대(기초조형평가)·성균관대(기초실기소양평가)가 대표적이고, 고려대는 별도 종목인 발상과 표현으로 선발합니다. 서울대·서울시립대·이화여대는 대학이 직접 출제하는 통합·자체 실기를 봐서 또 다르게 준비해야 합니다.",
  },
  {
    q: "실기 종목 하나만 준비하면 여러 대학을 쓸 수 있나요?",
    a: "기초디자인은 서울권 상당수 대학이 채택하고 있어, 한 종목으로도 여러 학교를 지원할 수 있습니다. 여기에 삼육대·덕성여대·성신여대·서경대처럼 지정된 여러 종목 중 하나를 골라 응시하는 택1 대학까지 더하면 준비하던 그림을 그대로 살려 지원 폭을 넓힐 수 있습니다. 다만 택1 대학도 지정 종목에 내 종목이 있어야 하고, 서울대·서울시립대·이화여대의 통합·자체실기는 별도의 준비 시간이 필요합니다.",
  },
  {
    q: "홍익대는 왜 실기가 없나요?",
    a: "홍익대 미술계열은 실기고사 대신 학생부, 미술활동보고서, 심층면접으로 선발합니다. 정시에서도 1단계 수능 통과 후 2단계에서 서류평가 40%가 반영되기 때문에, 홍대 지망생은 그림 연습보다 수능과 미술활동보고서 관리가 우선입니다.",
  },
  {
    q: "한예종은 어느 군인가요?",
    a: "한예종은 가나다군 어디에도 속하지 않습니다. 문화체육관광부 소속 특수학교라 자체 일정으로 따로 선발하며, 가·나·다군 3장의 카드와 별개로 지원할 수 있는 추가 기회입니다.",
  },
  {
    q: "고2인데 지금 실기를 시작해도 늦지 않나요?",
    a: (
      <>
        늦지 않았습니다. 기초디자인처럼 채택 대학이 많은 종목은 고2 겨울에
        시작해 정시로 합격하는 사례가 매년 나옵니다. 다만 종목에 따라 필요한
        준비 기간이 크게 달라서 — 서울대·이화여대의 통합·자체실기는 더 오래
        걸립니다 — 지금 시점에는 &lsquo;언제 시작하느냐&rsquo;보다 &lsquo;남은
        기간에 승산 있는 종목을 고르느냐&rsquo;가 관건입니다. 현재 성적과
        성향으로 어떤 종목·대학 조합이 가능한지는{" "}
        <Link
          href={CONSULTING_HREF}
          className="font-medium text-accent underline underline-offset-2 hover:opacity-85"
        >
          1:1 입시 전략 컨설팅
        </Link>
        에서 함께 판단해 드립니다.
      </>
    ),
  },
];

/* 예시작 갤러리를 크게 보여주는 대표 종목.
   public/images/silgi/ 에 실제 그림을 같은 이름으로 넣으면 그대로 노출됩니다. */
type FeaturedType = "기초디자인" | "기초조형·소양평가";

const FEATURED_EXAMPLES: Record<
  FeaturedType,
  {
    /* 카드 표면에 노출하는 핵심 평가 요소 칩 (2개) */
    keys: [string, string];
    /* 카드 표면에 노출하는 대표 대학 */
    universities: string;
    /* 원본 이미지와 같은 가로/세로 비율 (잘림 방지) */
    aspectClass: string;
    images: { src: string; alt: string }[];
    /* "시험 방식 보기"를 눌렀을 때만 펼쳐지는 설명 — 종목 설명 + 예시작 해설을 합친 1~2문장 */
    howItWorks: string;
    moreUrl?: string;
  }
> = {
  기초디자인: {
    keys: ["구성력", "묘사력"],
    universities: "건국대 · 경희대 · 동덕여대 외",
    aspectClass: "aspect-[966/725]",
    images: [
      { src: "/images/silgi/gicho-design-1.jpg", alt: "유리구슬·부채·노끈을 얽어 화면을 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-2.jpg", alt: "색유리 구슬과 금속판·나무를 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-3.jpg", alt: "유리구슬과 주름 금속·부채를 역동적으로 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-4.jpg", alt: "부채와 유리구슬을 방사형으로 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-5.jpg", alt: "유리구슬·금속판·나무막대를 사선으로 구성한 기초디자인 예시작" },
    ],
    howItWorks:
      "위 그림처럼 유리구슬·부채·금속 같은 사물이 주어지고, 정해진 조건에 맞춰 화면을 완성도 있게 구성하는 시험입니다. 묘사력·구성력·완성도를 보며, 서울권 여러 대학이 채택해 한 종목으로 지원 폭이 넓습니다.",
    moreUrl: "https://blog.naver.com/modago-/221152752551",
  },
  "기초조형·소양평가": {
    keys: ["관찰력", "발상력"],
    universities: "국민대 · 성균관대",
    aspectClass: "aspect-[966/1288]",
    images: [
      { src: "/images/silgi/gicho-soyang-1.jpg", alt: "기초조형·소양평가 예시작 1" },
      { src: "/images/silgi/gicho-soyang-2.jpg", alt: "기초조형·소양평가 예시작 2" },
      { src: "/images/silgi/gicho-soyang-3.jpg", alt: "기초조형·소양평가 예시작 3" },
      { src: "/images/silgi/gicho-soyang-4.jpg", alt: "기초조형·소양평가 예시작 4" },
      { src: "/images/silgi/gicho-soyang-5.jpg", alt: "기초조형·소양평가 예시작 5" },
    ],
    howItWorks:
      "제시된 대상·주제를 관찰하고 발상해, 똑같이 그리기보다 자기만의 화면으로 재구성하는 시험입니다. 국민대(기초조형평가)·성균관대(기초실기소양평가)가 대표적이며, 잘 그리는 손보다 관찰력과 발상을 봅니다.",
    moreUrl: "https://blog.naver.com/modago-/221160292640",
  },
};

/* 접이식 행의 화살표 — 부모 <details>의 named group(open) 상태에 따라 회전 */
function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform ${className}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* 대표 유형 카드 — 종목명 · 핵심 칩 2개 · 예시작 5장 · 대표 대학 · (접힌)시험 방식 · 더보기 링크.
   긴 설명은 카드 하단 <details> 안에만 두어 기본 상태에서는 작품이 먼저 보이게 한다. */
function FeaturedTypeCard({ type }: { type: FeaturedType }) {
  const cfg = FEATURED_EXAMPLES[type];
  return (
    <div className="mb-4 rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-base font-bold text-white">{SILGI_META[type].label}</h3>
        <ul className="flex gap-1.5" aria-label="핵심 평가 요소">
          {cfg.keys.map((k) => (
            <li
              key={k}
              className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent"
            >
              {k}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3.5">
        <SilgiGallery
          images={cfg.images}
          aspectClass={cfg.aspectClass}
          mobileScrollable
        />
      </div>

      <p className="mt-3 text-[13px] text-white/50">
        대표 대학
        <span className="ml-2 text-white/80">{cfg.universities}</span>
      </p>

      {/* flex-wrap: 닫힌 상태엔 한 줄(왼쪽 시험 방식 · 오른쪽 더보기), 펼치면 설명이
          한 줄을 통째로 차지하고 더보기 링크는 아래로 내려간다. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-white/[0.07] pt-3">
        <details className="group/how min-w-0 max-w-full">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
            <span className="group-open/how:hidden">시험 방식 보기</span>
            <span className="hidden group-open/how:inline">시험 방식 접기</span>
            <Chevron className="group-open/how:rotate-180" />
          </summary>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            {cfg.howItWorks}
          </p>
        </details>
        {cfg.moreUrl && (
          <a
            href={cfg.moreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-[13px] font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            예시작 더 보기
            <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* 최상위권 통합·자체실기 — 표면엔 대학·핵심 키워드만, 상세는 "자세히 보기" 안 */
const OWN_SILGI_ROWS: { university: string; key: string; detail: string }[] = [
  {
    university: "서울대학교",
    key: "발상·재료 해석",
    detail:
      "주어진 주제를 제시된 재료로 표현 — 사물 구성보다 발상과 재료 해석이 관건",
  },
  {
    university: "서울시립대학교",
    key: "두 문제 연계",
    detail:
      "한 장에 두 문제를 연계해 해결 — 문제를 읽고 풀어내는 방식 자체가 다름",
  },
  {
    university: "이화여자대학교",
    key: "2절 화면·5시간",
    detail: "대상·주제를 다양한 재료로 표현 — 2절 화면을 5시간 동안 운용",
  },
];

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-5 pt-28 pb-20">
        {/* Hero */}
        <header className="mb-16 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-accent">입시정보</p>
          <h1 className="text-3xl font-bold leading-snug text-white md:text-4xl">
            2027학년도 미대 정시
            <br />
            가나다군 총정리
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-white/45">
            2027학년도 대학별 정시 모집요강(가·나·다군) 기준 · 2026년 9월
            갱신
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            정시는 군마다 1곳, 총 3장의 카드로 승부합니다.
            <br className="hidden md:block" /> 주요 미대 26곳의 핵심 정보를 한
            페이지에 담았습니다.
          </p>
          <ul className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
            {["모집군", "전형방법", "수능 반영영역", "실기 종목", "통합·자체실기 대학", "학과별 모집인원", "경쟁률"].map(
              (item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-white/65"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
          <GunCardSlots />
          <JungsiScheduleModal />

          {/* 두 가지 탐색 경로 — 직접 둘러보기 · 성적으로 찾기 */}
          <div className="mx-auto mt-10 flex max-w-md flex-col justify-center gap-2.5 sm:flex-row">
            <a
              href="#explorer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              가나다군 대학 둘러보기
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#score-finder"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-accent/50 bg-accent/[0.08] px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/[0.15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              내 성적으로 지원 가능 대학 찾기
              <span aria-hidden>↓</span>
            </a>
          </div>

          {/* 윈터스쿨 slim CTA — 정보 탐색 단계이므로 /winter 내부 링크로 연결 */}
          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
            <div>
              <p className="text-sm font-medium leading-relaxed text-white/85">
                2027 미대 정시, 겨울에 어디까지 준비하느냐가 달라집니다.
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                수능 · 실기 · 생활관리를 한 번에 잡는 미대 기숙 집중 과정
              </p>
            </div>
            <Link
              href="/winter"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-accent/50 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              2027 기숙 윈터스쿨 보기
              <span aria-hidden>→</span>
            </Link>
          </div>
        </header>

        {/* 실기 종목 설명 */}
        <section className="mb-14" aria-label="실기 종목 안내">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-1 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                <span className="mr-3 font-mono text-base text-accent">01</span>
                실기 종목부터 이해하기
              </h2>
              <span className="flex shrink-0 items-center gap-2 text-[13px] text-white/60">
                <span className="hidden group-open:inline">접기</span>
                <span className="group-open:hidden">펼쳐서 예시작 보기</span>
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-open:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>

            <div className="pt-3">
          <p className="mb-4 text-[13px] leading-relaxed text-white/50">
            대학별 실기 종목을 실제 작품으로 비교해보세요.
          </p>
          {/* 대표 종목 — 예시작 갤러리 카드 */}
          {/* 기초조형(학원 강점 종목)을 기초디자인보다 먼저 노출한다 */}
          <FeaturedTypeCard type="기초조형·소양평가" />
          <FeaturedTypeCard type="기초디자인" />

          {/* 나머지 종목 — 예시작이 없으므로 종목명만 보이는 작은 접이식 목록.
              각 <details>가 독립이라 여러 종목을 동시에 펼칠 수 있다. */}
          <div className="grid gap-2 md:grid-cols-2 md:items-start">
            {SILGI_CATEGORY_ORDER.filter(
              (type) => type !== "기초디자인" && type !== "기초조형·소양평가",
            ).map((type) => (
              <details
                key={type}
                className="group/item rounded-md border border-white/10 bg-[#0a0a0a]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                  {SILGI_META[type].label}
                  <Chevron className="text-white/50 group-open/item:rotate-180" />
                </summary>
                <p className="px-4 pb-3.5 text-[13px] leading-relaxed text-white/65">
                  {SILGI_META[type].description}
                </p>
              </details>
            ))}
          </div>

          {/* 최상위권 통합·자체실기 안내 — 표면엔 대학·핵심 키워드만, 대학별 상세는 "자세히 보기" 안 */}
          <div className="mt-4 rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
            <p className="text-xs tracking-[0.25em] text-accent">통합·자체실기</p>
            <h3 className="mt-2 text-base font-bold leading-snug text-white">
              최상위권 미대는 &lsquo;같은 실기&rsquo;로 준비하지 않습니다
            </h3>
            <ul className="mt-3.5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {OWN_SILGI_ROWS.map((row) => (
                <li
                  key={row.university}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="text-sm font-bold text-white">
                    {row.university}
                  </span>
                  <span className="shrink-0 text-[13px] text-accent/90">
                    {row.key}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3.5 text-sm leading-relaxed text-white/70">
              대학별 출제 방식에 맞춘 별도 훈련이 필요합니다.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
              <details className="group/own min-w-0 max-w-full">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                  <span className="group-open/own:hidden">자세히 보기</span>
                  <span className="hidden group-open/own:inline">접기</span>
                  <Chevron className="group-open/own:rotate-180" />
                </summary>
                <div className="mt-2.5 space-y-2.5 text-[13px] leading-relaxed text-white/65">
                  <p>
                    서울대·서울시립대·이화여대 등 일부 최상위권 미대는
                    기초디자인이 아니라 대학이 직접 출제하는 통합·자체실기로
                    선발합니다. 문제 유형과 평가 방식이 달라, 기초디자인
                    준비만으로는 대응하기 어렵습니다.
                  </p>
                  <ul className="space-y-1.5">
                    {OWN_SILGI_ROWS.map((row) => (
                      <li key={row.university}>
                        <span className="font-medium text-white/85">
                          {row.university}
                        </span>{" "}
                        <span className="text-accent/90">통합실기</span> ·{" "}
                        {row.detail}
                      </li>
                    ))}
                  </ul>
                  <p>
                    목표 대학이 정해져 있다면 대학별 출제 방식에 맞춘 별도
                    훈련이 필요합니다. 모두다른고양이는 일반 미대 실기뿐 아니라
                    최상위권 미대 통합·자체실기를 학교별로 따로 준비합니다.
                  </p>
                </div>
              </details>
              <Link
                href="/winter"
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                최상위권 미대 준비 방식 보기
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* 실기 종목 섹션 CTA — 종목 선택은 전략 판단이라 1:1 컨설팅으로 연결 */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:p-6 md:text-left">
            <p className="text-[15px] leading-relaxed text-white/75">
              <span className="font-bold text-white">
                우리 아이는 어떤 종목이 맞을까요?
              </span>
              <br className="hidden md:block" /> 성적·성향에 맞는 실기 종목과
              지원 전략을 1:1로 정리합니다 ·{" "}
              <span className="text-accent">{CONSULTING_INFO.priceLabel}</span>
            </p>
            <Link
              href={CONSULTING_HREF}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              실기 종목 전략 상담받기
              <span aria-hidden>→</span>
            </Link>
          </div>
            </div>
          </details>
        </section>

        {/* 성적 기반 추천 */}
        <section
          id="score-finder"
          className="mb-14 scroll-mt-24"
          aria-label="내 성적으로 조합 찾기"
        >
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">02</span>
            내 성적으로 유리한 조합 찾기
          </h2>
          <p className="mb-5 text-[15px] leading-relaxed text-white/70">
            미대 정시는 대학마다 반영 과목이 달라, 같은 백분위라도 유리한 학교가
            제각각입니다. 학년·준비 중인 실기·최근 성적을 넣으면 약 1분 만에
            가·나·다군 지원 조합과, 성적이 한 등급 오르면 어디까지 넓어지는지까지
            비교해 드립니다.
          </p>

          {/* 온보딩 진단(/diagnosis)으로 이어주는 CTA — 기존 인라인 계산기
              (ScoreRecommender)는 /diagnosis와 입력 UI가 중복돼 페이지에서 내렸다.
              컴포넌트 파일은 남아 있으니 필요하면 다시 걸면 된다. */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:p-6 md:text-left">
            <p className="text-[15px] leading-relaxed text-white/75">
              <span className="font-bold text-white">
                내 성적으로 어디까지 가능할까요?
              </span>
              <br className="hidden md:block" /> 대학마다 다른 수능 반영방식과
              현재 준비 중인 실기를 함께 비교해보세요.
            </p>
            <Link
              href="/diagnosis"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              내 성적으로 미대 찾아보기
              <span aria-hidden>→</span>
            </Link>
            <p className="text-[13px] text-white/50 md:hidden">
              약 1분 · 회원가입 없음
            </p>
          </div>

          {/* 윈터스쿨 메인 CTA — 지원 가능 대학 확인 직후가 핵심 전환 지점 */}
          <div className="mt-8 rounded-lg border border-accent/40 bg-gradient-to-br from-accent/[0.12] via-accent/[0.05] to-transparent p-6 md:p-8">
            <p className="text-xs tracking-[0.25em] text-accent">
              2027 미대 기숙 윈터스쿨
            </p>
            <h3 className="mt-3 text-lg font-bold leading-snug text-white md:text-xl">
              갈 수 있는 대학을 알았다면,
              <br className="md:hidden" /> 이제 만드는 일만 남았습니다.
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
              정시는 지원 전략만으로 끝나지 않습니다. 겨울 동안 수능 성적, 실기
              완성도, 하루 루틴을 얼마나 끌어올리느냐에 따라 실제 지원 가능한
              대학이 달라집니다.
            </p>
            <p className="mt-2.5 text-sm text-white/55">
              수능 + 실기 + 생활관리 집중 과정
            </p>
            <Link
              href="/winter"
              className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
            >
              윈터스쿨 커리큘럼 보기
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* 대학 탐색기 */}
        <section id="explorer" className="scroll-mt-24" aria-label="대학별 정시 정보">
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">03</span>
            군별 대학 한눈에 보기
          </h2>
          <p className="mb-5 text-[15px] leading-relaxed text-white/70">
            군 탭과 실기 종목 필터로 대학·학과를 한눈에 보고, 궁금한 항목을
            눌러 전형방법·반영비율·실기·모집인원·경쟁률을 확인하세요. 여러
            대학을 동시에 펼쳐 비교할 수 있습니다. 마음에 드는 대학은{" "}
            <span className="text-accent">담기</span>로 골라 나만의 원서 3장을
            구성해 보세요. 비율 바는 실기 반영 단계 기준입니다.
          </p>
          <JungsiExplorer ctaHref={CONSULTING_HREF} />
        </section>

        {/* 대학 정보를 충분히 본 직후 — "그래서 나는 어디를 써야 하지?" 지점의
            1:1 전략 컨설팅 CTA. 무료 진단은 전 단계로 함께 안내한다. */}
        <section
          className="mt-16 rounded-lg border border-accent/40 bg-accent/[0.06] p-6 md:p-8"
          aria-label="1:1 입시 전략 컨설팅 안내"
        >
          <p className="text-xs tracking-[0.25em] text-accent">
            {CONSULTING_INFO.name}
          </p>
          <h2 className="mt-3 text-lg font-bold leading-snug text-white md:text-xl">
            대학 정보는 알겠는데,
            <br className="md:hidden" /> 내 세 장은 어떻게 써야 할까요?
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75 break-keep">
            현재 성적 · 실기 · 희망 대학을 함께 보고 가·나·다군 지원 방향을
            1:1로 정리합니다.
          </p>
          <p className="mt-2.5 text-sm text-white/55">
            {CONSULTING_INFO.name} · {CONSULTING_INFO.priceLabel}
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={CONSULTING_HREF}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              내 지원 전략 상담받기
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3.5 text-sm font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              무료 성적 진단 먼저 해보기
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16" aria-label="자주 묻는 질문">
          <h2 className="mb-6 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">04</span>
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-lg border border-white/10 bg-[#0a0a0a] px-5 py-4 md:px-6 md:py-5"
              >
                <summary className="cursor-pointer list-none text-[15px] font-medium leading-relaxed text-white/90 transition-colors group-open:text-accent">
                  {faq.q}
                </summary>
                <p className="mt-4 text-[15px] leading-[1.75] text-white/75">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 유의사항 */}
        <section className="mt-14 rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <p className="text-xs font-medium tracking-wide text-white/50">
            이 페이지의 정보에 대해
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-white/60">
            <li>
              가·나·다군 전 대학(서울대·이화여대·한예종 포함)의 학과별
              모집인원·수능 반영영역·실기내용·화지규격은 2026년 8월 28일~9월
              초 게시된 2027학년도 정시 모집요강 원본을 대조해 반영했습니다.
              경쟁률(수시이월 반영 최종 마감)·합격선은 2026학년도 정시
              입시결과 기준입니다. 수시 이월을 반영한 최종 모집인원은 각 대학이
              12월 말 다시 공지합니다.
            </li>
            <li>
              모집군·수능 반영영역·반영비율·실기 출제형식 등은 대학·학과마다
              해마다 달라질 수 있으므로, 실제 지원 전에는 반드시 해당 대학
              모집요강을 확인하세요. 특히 동덕여대·서울여대처럼 전공별로 군이
              이동한 경우와, 같은 대학 안에서 실기전형·비실기전형이 갈리는 경우를
              유의하세요.
            </li>
            <li>
              2026 요강에서 표기가 충돌했던 삼육대 한국사·탐구 대체 여부와
              서경대 디자인학부 반영총점은 2027 요강에서 해소됐습니다. 건국대
              영상학과는 2027학년도부터 영상디자인학과로 이름을 바꾸고 다군으로
              옮겼으며, 성신여대 미술대학은 동양화·서양화·조소(가군)와
              공예과(나군) 정시로 돌아왔습니다. 나군에서는 세종대 회화·패션이
              수시 실기전형 폐지분을 흡수해 인원이 두 배 이상 늘고 실기
              비중·종목이 바뀌었고(패션은 인체색채소묘 회귀), 세종대
              창의소프트학부는 다군으로 옮겼습니다. 서울과기대는 1단계가
              6배수로 넓어지고 조형예술학과 실기가 수채화로 바뀌었으며, 덕성여대는
              수묵담채화·인체수채화 정시 선발을 없앴습니다. 다군에서는 추계예대
              미술창작학부가 33명에서 20명으로 줄었고, 서경대 무대패션은 다군
              10명·2단계 실기 80%로 확정됐습니다. 한국예술종합학교는 2027
              예술사 모집요강 기준입니다.
            </li>
          </ul>
        </section>

        {/* 만든 사람 */}
        <section
          className="mt-14 rounded-lg border border-white/10 bg-[#0a0a0a] p-6"
          aria-label="이 자료를 만든 사람"
        >
          <p className="text-xs font-medium tracking-wide text-white/50">
            이 자료를 만든 사람
          </p>
          <p className="mt-3 text-[15px] font-bold text-white">
            모두다른고양이 미술학원 원장
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-white/70">
            이 페이지의 26개 대학 모집요강 대조와 환산식 정리는 원장이 직접
            했습니다. 모두다른고양이는 원장이 수업과 입시 상담을 직접 맡는
            소수정예 학원으로, 학생마다 성적과 성향에 맞춰 실기 종목과
            가·나·다군 조합을 함께 설계합니다. 1:1 입시 전략 컨설팅도 원장이
            직접 진행합니다.
          </p>
        </section>

        {/* 최종 CTA — Primary: 윈터스쿨(/winter) · Secondary: 1:1 전략 컨설팅(/consulting) */}
        <section className="mt-16 text-center">
          <p className="text-xs tracking-[0.25em] text-accent">
            2027 미대 기숙 윈터스쿨
          </p>
          <h2 className="mt-3 text-xl font-bold leading-snug text-white md:text-2xl">
            3장의 카드를 바꾸는 겨울
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            지금 성적으로 지원 대학을 정하는 데서 끝내지 마세요. 겨울 동안
            성적과 실기를 끌어올려 지원 가능한 대학 자체를 바꾸는 것이 모다고
            윈터스쿨의 목표입니다.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/winter"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-8 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              윈터스쿨 자세히 보기
              <span aria-hidden>→</span>
            </Link>
            <Link
              href={CONSULTING_HREF}
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-8 py-3.5 text-sm font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              1:1 입시 전략 컨설팅 · {CONSULTING_INFO.priceLabel}
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
