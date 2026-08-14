import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GunCardSlots from "@/components/academy/GunCardSlots";
import JungsiExplorer from "@/components/academy/JungsiExplorer";
import JungsiScheduleModal from "@/components/academy/JungsiScheduleModal";
import SilgiGallery from "@/components/academy/SilgiGallery";
import { SILGI_CATEGORY_ORDER, SILGI_META } from "@/lib/jungsi-data";

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

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

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
        <a
          href={NAVER_BOOKING}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-2 hover:opacity-85"
        >
          무료 진단 상담
        </a>
        에서 바로 확인해 드립니다.
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
    badge: string;
    /* 원본 이미지와 같은 가로/세로 비율 (잘림 방지) */
    aspectClass: string;
    images: { src: string; alt: string }[];
    caption: React.ReactNode;
    moreUrl?: string;
  }
> = {
  기초디자인: {
    badge: "구성·묘사 평가",
    aspectClass: "aspect-[966/725]",
    images: [
      { src: "/images/silgi/gicho-design-1.jpg", alt: "유리구슬·부채·노끈을 얽어 화면을 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-2.jpg", alt: "색유리 구슬과 금속판·나무를 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-3.jpg", alt: "유리구슬과 주름 금속·부채를 역동적으로 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-4.jpg", alt: "부채와 유리구슬을 방사형으로 구성한 기초디자인 예시작" },
      { src: "/images/silgi/gicho-design-5.jpg", alt: "유리구슬·금속판·나무막대를 사선으로 구성한 기초디자인 예시작" },
    ],
    caption: (
      <>
        위 그림처럼 유리구슬·부채·금속 같은{" "}
        <span className="text-white/70">사물이 주어지고</span>, 정해진 조건에 맞춰{" "}
        <span className="text-white/70">화면을 완성도 있게 구성</span>하는 시험입니다.
      </>
    ),
    moreUrl: "https://blog.naver.com/modago-/221152752551",
  },
  "기초조형·소양평가": {
    badge: "관찰·발상 평가",
    aspectClass: "aspect-[966/1288]",
    images: [
      { src: "/images/silgi/gicho-soyang-1.jpg", alt: "기초조형·소양평가 예시작 1" },
      { src: "/images/silgi/gicho-soyang-2.jpg", alt: "기초조형·소양평가 예시작 2" },
      { src: "/images/silgi/gicho-soyang-3.jpg", alt: "기초조형·소양평가 예시작 3" },
      { src: "/images/silgi/gicho-soyang-4.jpg", alt: "기초조형·소양평가 예시작 4" },
      { src: "/images/silgi/gicho-soyang-5.jpg", alt: "기초조형·소양평가 예시작 5" },
    ],
    caption: (
      <>
        제시된 대상·주제를 <span className="text-white/70">관찰하고 발상</span>해, 똑같이 그리기보다{" "}
        <span className="text-white/70">자기만의 화면으로 재구성</span>하는 시험입니다.
      </>
    ),
    moreUrl: "https://blog.naver.com/modago-/221160292640",
  },
};

/* 이미지로 함께 보여줄 나머지 종목(1장씩). src 를 채우면 카드에 예시작이 붙습니다. */
const SILGI_EXAMPLE: Partial<
  Record<(typeof SILGI_CATEGORY_ORDER)[number], { src: string; alt: string }>
> = {
  // 발상과표현: { src: "/images/silgi/balsang-1.jpg", alt: "…" },
  // "수채화·수묵담채": { src: "/images/silgi/hoehwa-1.jpg", alt: "…" },
};

/* 대표 유형 카드 — 라벨·배지·설명·예시작 5장·해설·(선택)더보기 링크 */
function FeaturedTypeCard({ type }: { type: FeaturedType }) {
  const cfg = FEATURED_EXAMPLES[type];
  return (
    <div className="mb-4 rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-base font-bold text-white">{SILGI_META[type].label}</p>
        <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
          {cfg.badge}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-white/60">
        {SILGI_META[type].description}
      </p>
      <figure className="mt-4">
        <SilgiGallery images={cfg.images} aspectClass={cfg.aspectClass} />
        <figcaption className="mt-2.5 text-[12px] leading-relaxed text-white/45">
          {cfg.caption}
        </figcaption>
      </figure>
      {cfg.moreUrl && (
        <a
          href={cfg.moreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {SILGI_META[type].label} 예시작 더 보기
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}

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
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            2027학년도 대입전형 시행계획 및 대학별 모집요강 기준 · 2026년 8월
            갱신
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            정시는 군마다 1곳, 총 3장의 카드로 승부합니다.
            <br className="hidden md:block" /> 주요 미대 26곳의 핵심 정보를 한
            페이지에 담았습니다.
          </p>
          <ul className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
            {["모집군", "전형방법", "수능 반영영역", "실기 종목", "통합·자체실기 대학", "학과별 모집인원", "경쟁률"].map(
              (item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-white/60"
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
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-5 py-2.5 text-[13px] font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              가나다군 대학 둘러보기
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#score-finder"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-accent/50 bg-accent/[0.08] px-5 py-2.5 text-[13px] font-medium text-accent transition-colors hover:border-accent hover:bg-accent/[0.15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              내 성적으로 지원 가능 대학 찾기
              <span aria-hidden>↓</span>
            </a>
          </div>

          {/* 윈터스쿨 slim CTA — 정보 탐색 단계이므로 /winter 내부 링크로 연결 */}
          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
            <div>
              <p className="text-[13px] font-medium leading-relaxed text-white/80">
                2027 미대 정시, 겨울에 어디까지 준비하느냐가 달라집니다.
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/45">
                수능 · 실기 · 생활관리를 한 번에 잡는 미대 기숙 집중 과정
              </p>
            </div>
            <Link
              href="/winter"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-accent/50 px-4 py-2.5 text-[13px] font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
              <span className="flex shrink-0 items-center gap-2 text-[12px] text-white/45">
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

            <div className="pt-2">
          <p className="mb-6 text-sm leading-relaxed text-white/60">
어느 대학에 갈 수 있는지는 결국 성적이 정하지만, 어느 대학을 노려볼 수 있는지는 준비한 실기 종목이 먼저 가릅니다. 종목이 다르면 준비 방식이 완전히 달라 중간에 갈아타기 어렵습니다. 실제 시험 종목 기준으로 정리했으니, 대표 종목 두 가지를 예시작과 함께 보고 나머지 종목까지 확인한 뒤 군별 대학 표를 보면 지원 전략이 훨씬 선명해집니다.{" "}
            <span className="text-white/80">
              모다고는 창의력을 중심으로 실기를 훈련합니다.
            </span>
          </p>
          {/* 대표 종목 — 예시작 갤러리 카드 */}
          {/* 기초조형(학원 강점 종목)을 기초디자인보다 먼저 노출한다 */}
          <FeaturedTypeCard type="기초조형·소양평가" />
          <FeaturedTypeCard type="기초디자인" />

          {/* 나머지 종목 */}
          <div className="grid gap-4 md:grid-cols-2">
            {SILGI_CATEGORY_ORDER.filter(
              (type) => type !== "기초디자인" && type !== "기초조형·소양평가",
            ).map((type) => {
              const ex = SILGI_EXAMPLE[type];
              return (
                <div
                  key={type}
                  className="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]"
                >
                  {ex && (
                    <div className="relative aspect-[16/9] border-b border-white/10 bg-black">
                      <Image
                        src={ex.src}
                        alt={ex.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm font-bold text-white">
                      {SILGI_META[type].label}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                      {SILGI_META[type].description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 실기 종목 섹션 CTA */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:p-6 md:text-left">
            <p className="text-sm leading-relaxed text-white/70">
              <span className="font-bold text-white">
                우리 아이는 어떤 종목이 맞을까요?
              </span>
              <br className="hidden md:block" /> 성적·성향에 맞는 실기 종목과
              지원 전략을 <span className="text-accent">무료</span>로 진단해
              드립니다.
            </p>
            <a
              href={NAVER_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              무료 진단 신청
              <span aria-hidden>→</span>
            </a>
          </div>
            </div>
          </details>

          {/* 최상위권 통합·자체실기 안내 — 문제 인식 단계, 대학별 상세는 아래 탐색기에 위임 */}
          <div className="mt-8 rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
            <p className="text-xs tracking-[0.25em] text-accent">통합·자체실기</p>
            <h3 className="mt-2 text-base font-bold leading-snug text-white md:text-lg">
              최상위권 미대는 &lsquo;같은 실기&rsquo;로 준비하지 않습니다
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/60">
              서울대·서울시립대·이화여대 등 일부 최상위권 미대는 기초디자인이
              아니라 대학이 직접 출제하는 통합·자체실기로 선발합니다. 문제
              유형과 평가 방식이 달라, 기초디자인 준비만으로는 대응하기
              어렵습니다.
            </p>
            <ul className="mt-4 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {[
                {
                  university: "서울대학교",
                  type: "통합실기",
                  diff: "주어진 주제를 제시된 재료로 표현 — 사물 구성보다 발상과 재료 해석이 관건",
                },
                {
                  university: "서울시립대학교",
                  type: "통합실기",
                  diff: "한 장에 두 문제를 연계해 해결 — 문제를 읽고 풀어내는 방식 자체가 다름",
                },
                {
                  university: "이화여자대학교",
                  type: "통합실기",
                  diff: "대상·주제를 다양한 재료로 표현 — 2절 화면을 5시간 동안 운용",
                },
              ].map((row) => (
                <li
                  key={row.university}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <span className="flex shrink-0 items-baseline gap-2 sm:w-40">
                    <span className="text-[13px] font-bold text-white">
                      {row.university}
                    </span>
                    <span className="text-[11px] text-accent/80">{row.type}</span>
                  </span>
                  <span className="text-[12px] leading-relaxed text-white/55">
                    {row.diff}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-white/60">
              목표 대학이 정해져 있다면 대학별 출제 방식에 맞춘 별도 훈련이
              필요합니다. 모두다른고양이는 일반 미대 실기뿐 아니라 최상위권
              미대 통합·자체실기를 학교별로 따로 준비합니다.
            </p>
            <Link
              href="/winter"
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              최상위권 미대 준비 방식 보기
              <span aria-hidden>→</span>
            </Link>
          </div>
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
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            미대 정시는 대학마다 반영 과목이 달라, 같은 백분위라도 유리한 학교가
            제각각입니다. 학년·준비 중인 실기·최근 성적을 넣으면 약 1분 만에
            가·나·다군 지원 조합과, 성적이 한 등급 오르면 어디까지 넓어지는지까지
            비교해 드립니다.
          </p>

          {/* 온보딩 진단(/diagnosis)으로 이어주는 CTA — 기존 인라인 계산기
              (ScoreRecommender)는 /diagnosis와 입력 UI가 중복돼 페이지에서 내렸다.
              컴포넌트 파일은 남아 있으니 필요하면 다시 걸면 된다. */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:p-6 md:text-left">
            <p className="text-sm leading-relaxed text-white/70">
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
            <p className="text-[12px] text-white/40 md:hidden">
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
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              정시는 지원 전략만으로 끝나지 않습니다. 겨울 동안 수능 성적, 실기
              완성도, 하루 루틴을 얼마나 끌어올리느냐에 따라 실제 지원 가능한
              대학이 달라집니다.
            </p>
            <p className="mt-2 text-[13px] text-white/45">
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
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            군 탭과 실기 종목 필터로 탐색하고, 마음에 드는 대학을{" "}
            <span className="text-accent">담기</span>로 골라 나만의 원서 3장을
            시뮬레이션해 보세요. 카드의 <span className="text-accent">학과별
            모집 상세</span>를 펼치면 전공별 모집인원과 경쟁률까지 볼 수
            있습니다. 비율 바는 실기 반영 단계 기준입니다.
          </p>
          <JungsiExplorer ctaHref={NAVER_BOOKING} />
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
                className="group rounded-lg border border-white/10 bg-[#0a0a0a] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-white/90 transition-colors group-open:text-accent">
                  {faq.q}
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-white/60">
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
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/55">
            <li>
              주요 26개 대학의 학과별 모집인원·수능 반영영역·실기내용·화지규격은
              2026학년도 정시 모집요강 원본(가·나·다 세 군)을 대조해 정리했고,
              경쟁률(수시이월 반영 최종 마감)·합격선은 2026학년도 정시
              입시결과 기준입니다. 2027학년도 최종
              모집요강은 2026년 9월경 발표되며, 발표 즉시 이 페이지도
              업데이트합니다.
            </li>
            <li>
              모집군·수능 반영영역·반영비율·실기 출제형식 등은 대학·학과마다
              해마다 달라질 수 있으므로, 실제 지원 전에는 반드시 해당 대학
              모집요강을 확인하세요. 특히 동덕여대·서울여대처럼 전공별로 군이
              이동한 경우와, 같은 대학 안에서 실기전형·비실기전형이 갈리는 경우를
              유의하세요.
            </li>
            <li>
              국민대 입체미술 반영총점, 삼육대 한국사·탐구 대체 여부, 서경대
              디자인학부 반영총점 등 일부 항목은 요강 간 표기가 충돌해 입학처
              재확인이 필요합니다. 한국예술종합학교는 시행계획 기준 개략
              정보로 실었습니다.
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
          <p className="mt-3 text-sm font-bold text-white">
            모두다른고양이 미술학원 원장
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/60">
            이 페이지의 26개 대학 모집요강 대조와 환산식 정리는 원장이 직접
            했습니다. 모두다른고양이는 원장이 수업과 입시 상담을 직접 맡는
            소수정예 학원으로, 학생마다 성적과 성향에 맞춰 실기 종목과
            가·나·다군 조합을 함께 설계합니다. 아래 무료 진단 상담도 원장이
            직접 진행합니다.
          </p>
        </section>

        {/* 최종 CTA — Primary: 윈터스쿨(/winter) · Secondary: 무료 진단(네이버 예약) */}
        <section className="mt-16 text-center">
          <p className="text-xs tracking-[0.25em] text-accent">
            2027 미대 기숙 윈터스쿨
          </p>
          <h2 className="mt-3 text-xl font-bold leading-snug text-white md:text-2xl">
            3장의 카드를 바꾸는 겨울
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
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
            <a
              href={NAVER_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-8 py-3.5 text-sm font-medium text-white/85 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              정시 조합 무료 진단
            </a>
          </div>
          <p className="mt-3 text-xs text-white/35">
            무료 진단은 네이버 예약으로 연결됩니다 · 031-916-8885
          </p>
        </section>
      </article>
    </main>
  );
}
