import type { Metadata } from "next";
import Image from "next/image";
import JungsiExplorer from "@/components/academy/JungsiExplorer";
import ScoreRecommender from "@/components/academy/ScoreRecommender";
import { SILGI_META } from "@/lib/jungsi-data";

export const metadata: Metadata = {
  title: "2026 미대 정시 가나다군 총정리 | 모두다른고양이 미술학원",
  description:
    "서울대·홍익대·국민대 등 주요 26개 미술대학의 정시 모집군·전형방법(수능 반영영역·실기 비율)·실기유형과 학과별 모집인원·경쟁률까지 한 페이지에 정리했습니다. 가·나·다군 지원 조합 짜기 전에 꼭 확인하세요.",
  keywords: [
    "미대 정시 가나다군",
    "2026 미대 정시",
    "미대 정시 전형방법",
    "미대 정시 경쟁률",
    "기초디자인 대학",
    "기초소양평가",
    "홍익대 비실기",
    "위시티 미술학원",
    "일산 미술학원",
  ],
  alternates: { canonical: "/guide/jungsi-2026" },
  openGraph: {
    title: "2026 미대 정시 가나다군 총정리",
    description:
      "주요 미대 26곳의 모집군·전형방법·실기유형과 학과별 모집인원·경쟁률 — 지원 카드 3장을 어떻게 쓸지, 한 페이지로 끝내세요.",
    type: "article",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

/* 히어로: "지원 카드 3장 + 보너스 1장" 시그니처 */
function CardSlots() {
  const slots = [
    { label: "가군", sub: "1.5 – 1.12" },
    { label: "나군", sub: "1.13 – 1.20" },
    { label: "다군", sub: "1.21 – 1.28" },
  ];
  return (
    <div className="mt-10 flex flex-col items-center">
    <span className="mb-3 text-[11px] tracking-wider text-white/40">
      전형기간 (2026학년도 기준)
    </span>
    <div className="flex items-stretch justify-center gap-3">
      {slots.map((slot, i) => (
        <div
          key={slot.label}
          className="flex w-24 flex-col items-center justify-center rounded-lg border border-white/15 bg-[#0a0a0a] py-5 md:w-28"
          style={{ transform: `rotate(${(i - 1) * 2}deg)` }}
        >
          <span className="font-mono text-lg font-bold text-accent">
            {slot.label}
          </span>
          <span className="mt-1 text-[10px] tracking-wider text-white/40">
            {slot.sub}
          </span>
        </div>
      ))}
      <div
        className="flex w-24 flex-col items-center justify-center rounded-lg border border-dashed border-accent/50 py-5 md:w-28"
        style={{ transform: "rotate(4deg)" }}
      >
        <span className="font-mono text-lg font-bold text-accent/90">+</span>
        <span className="mt-1 text-[10px] tracking-wider text-accent/70">
          한예종 별도
        </span>
      </div>
    </div>
    </div>
  );
}

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "가군, 나군, 다군이 뭔가요?",
    a: "정시에서는 대학들이 시험 기간에 따라 세 그룹(군)으로 나뉘고, 학생은 군마다 1곳씩 최대 3곳에 지원할 수 있습니다. 같은 군에 두 곳을 쓸 수 없기 때문에, 어느 군에 어떤 대학이 있는지가 지원 전략의 출발점입니다. 군은 대학이 아니라 학과 단위로 정해진다는 점이 핵심입니다 — 건국대처럼 학과별로 가·나·다군에 나뉜 대학은 한 학교에 최대 3번 지원할 수도 있습니다.",
  },
  {
    q: "기초소양평가와 기초디자인은 뭐가 다른가요?",
    a: "기초디자인이 '주어진 사물로 화면을 얼마나 완성도 있게 구성하는가'를 본다면, 기초소양·기초조형 계열은 '대상을 관찰하거나 주제를 보고 아이디어를 어떻게 풀어내는가'를 봅니다. 국민대(기초조형평가), 성균관대(기초실기소양평가), 고려대가 대표적입니다. 서울대·서울시립대·이화여대는 대학이 직접 출제하는 통합·자체 실기를 봐서 또 다르게 준비해야 합니다.",
  },
  {
    q: "실기유형 하나만 준비하면 여러 대학을 쓸 수 있나요?",
    a: "기초디자인은 서울권 상당수 대학이 채택하고 있어, 한 유형으로도 여러 학교를 지원할 수 있습니다. 여기에 삼육대·덕성여대·성신여대처럼 '기초디자인·기초소양 등 중 택1'을 받는 선택실기 대학까지 더하면 준비하던 그림을 그대로 살려 지원 폭을 넓힐 수 있습니다. 다만 서울대·서울시립대·이화여대의 자체·통합실기는 별도의 준비 시간이 필요합니다.",
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
        늦지 않았습니다. 기초디자인처럼 채택 대학이 많은 유형은 고2 겨울에
        시작해 정시로 합격하는 사례가 매년 나옵니다. 다만 유형에 따라 필요한
        준비 기간이 크게 달라서 — 서울대·이화여대의 자체·통합실기는 더 오래
        걸립니다 — 지금 시점에는 &lsquo;언제 시작하느냐&rsquo;보다 &lsquo;남은
        기간에 승산 있는 유형을 고르느냐&rsquo;가 관건입니다. 현재 성적과
        성향으로 어떤 유형·대학 조합이 가능한지는{" "}
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

const SILGI_ORDER = ["기초디자인", "기초소양", "선택실기", "자체실기", "비실기"] as const;

/* 예시작 갤러리를 크게 보여주는 대표 유형.
   public/images/silgi/ 에 실제 그림을 같은 이름으로 넣으면 그대로 노출됩니다. */
type FeaturedType = "기초디자인" | "기초소양";

const FEATURED_EXAMPLES: Record<
  FeaturedType,
  {
    badge: string;
    images: { src: string; alt: string }[];
    caption: React.ReactNode;
    moreUrl?: string;
  }
> = {
  기초디자인: {
    badge: "가장 많은 대학이 채택",
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
  기초소양: {
    badge: "관찰·발상 평가",
    images: [
      { src: "/images/silgi/gicho-soyang-1.jpg", alt: "기초소양·기초조형 예시작 1" },
      { src: "/images/silgi/gicho-soyang-2.jpg", alt: "기초소양·기초조형 예시작 2" },
      { src: "/images/silgi/gicho-soyang-3.jpg", alt: "기초소양·기초조형 예시작 3" },
      { src: "/images/silgi/gicho-soyang-4.jpg", alt: "기초소양·기초조형 예시작 4" },
      { src: "/images/silgi/gicho-soyang-5.jpg", alt: "기초소양·기초조형 예시작 5" },
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

/* 이미지로 함께 보여줄 나머지 유형(1장씩). src 를 채우면 카드에 예시작이 붙습니다. */
const SILGI_EXAMPLE: Partial<Record<(typeof SILGI_ORDER)[number], { src: string; alt: string }>> = {
  // 선택실기: { src: "/images/silgi/select-1.jpg", alt: "…" },
  // 자체실기: { src: "/images/silgi/jache-1.jpg", alt: "…" },
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {cfg.images.map((ex) => (
            <div
              key={ex.src}
              className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-black"
            >
              <Image
                src={ex.src}
                alt={ex.alt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 170px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
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
            2026 미대 정시
            <br />
            가나다군 총정리
          </h1>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            2026학년도 모집요강 원본 대조 기준 · 2026년 7월 갱신
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            정시는 군마다 1곳, 총 3장의 카드로 승부합니다.
            <br className="hidden md:block" /> 주요 미대 26곳의 모집군 ·
            전형방법 · 수능 반영영역 · 실기유형과 학과별 모집인원 · 경쟁률을 한
            페이지에 담았습니다.
          </p>
          <CardSlots />
        </header>

        {/* 실기유형 설명 */}
        <section className="mb-14" aria-label="실기유형 안내">
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">01</span>
            실기유형부터 이해하기
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-white/60">
어느 대학에 갈 수 있는지는 결국 성적이 정하지만, 어느 대학을 노려볼 수 있는지는 준비한 실기유형이 먼저 가릅니다. 유형이 다르면 준비 방식이 완전히 달라 중간에 갈아타기 어렵습니다. 아래 다섯 가지 유형부터 확인하고, 군별 대학 표를 보면 지원 전략이 훨씬 선명해집니다.
          </p>
          {/* 대표 유형 — 예시작 갤러리 카드 */}
          <FeaturedTypeCard type="기초디자인" />
          <FeaturedTypeCard type="기초소양" />

          {/* 나머지 유형 */}
          <div className="grid gap-4 md:grid-cols-2">
            {SILGI_ORDER.filter(
              (type) => type !== "기초디자인" && type !== "기초소양",
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

          {/* 실기유형 섹션 CTA */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:p-6 md:text-left">
            <p className="text-sm leading-relaxed text-white/70">
              <span className="font-bold text-white">
                우리 아이는 어떤 유형이 맞을까요?
              </span>
              <br className="hidden md:block" /> 성적·성향에 맞는 실기유형과
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
        </section>

        {/* 성적 기반 추천 */}
        <section className="mb-14" aria-label="내 성적으로 조합 찾기">
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">02</span>
            내 성적으로 유리한 조합 찾기
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            미대 정시는 대학마다 반영 과목이 달라, 같은 백분위라도 유리한 학교가
            제각각입니다. 모의고사·수능 백분위를 넣으면 각 대학 반영식으로 환산해
            가·나·다군에서 유리한 순으로 정렬해 드립니다.
          </p>
          <ScoreRecommender ctaHref={NAVER_BOOKING} />
        </section>

        {/* 대학 탐색기 */}
        <section aria-label="대학별 정시 정보">
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            <span className="mr-3 font-mono text-base text-accent">03</span>
            군별 대학 한눈에 보기
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            군 탭과 실기유형 필터로 탐색하고, 마음에 드는 대학을{" "}
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
            소수정예 학원으로, 학생마다 성적과 성향에 맞춰 실기유형과
            가·나·다군 조합을 함께 설계합니다. 아래 무료 진단 상담도 원장이
            직접 진행합니다.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <h2 className="text-xl font-bold leading-snug text-white md:text-2xl">
            우리 아이는 어떤 조합으로
            <br />
            3장의 카드를 써야 할까요?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            성적대와 실기 스타일에 따라 최적의 가·나·다군 조합은 전부 다릅니다.
            현재 성적 기준으로 지원 가능한 조합을 무료로 진단해 드립니다.
          </p>
          <a
            href={NAVER_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-md bg-accent px-8 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            정시 조합 무료 진단 신청
          </a>
          <p className="mt-3 text-xs text-white/35">
            네이버 예약으로 연결됩니다 · 031-916-8885
          </p>
        </section>
      </article>
    </main>
  );
}
