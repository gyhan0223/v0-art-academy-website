import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "홍익대 미술활동보고서 완전 가이드 | 모두다른고양이 미술학원",
  description:
    "홍익대 미대는 실기 없이 생기부·미술활동보고서·면접으로 선발합니다. 2027학년도 기준 미활보 구조, 평가 기준, 나쁜 예와 좋은 예 비교, 학년별 준비 타임라인까지 상담 없이 전부 읽을 수 있는 무료 가이드.",
  keywords: [
    "홍익대 미술활동보고서",
    "미활보 작성법",
    "홍대 미대 입시",
    "홍익대 비실기",
    "미술활동보고서 예시",
  ],
  openGraph: {
    title: "홍익대 미술활동보고서 완전 가이드",
    description:
      "미활보 구조, 평가 기준, 나쁜 예 vs 좋은 예 — 상담 없이도 전부 읽을 수 있습니다.",
    type: "article",
  },
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

const toc = [
  { id: "why", label: "미활보가 왜 홍대 입시의 전부인가" },
  { id: "overview", label: "2027학년도 전형 한눈에 보기" },
  { id: "structure", label: "미활보 구조 해부" },
  { id: "criteria", label: "교수들은 뭘 보는가" },
  { id: "subject", label: "교과활동: 나쁜 예 vs 좋은 예", highlight: true },
  { id: "nonsubject", label: "비교과활동: 나쁜 예 vs 좋은 예", highlight: true },
  { id: "mistakes", label: "가장 많이 하는 실수 5가지" },
  { id: "faq", label: "자주 묻는 질문" },
  { id: "timeline", label: "학년별 준비 타임라인" },
  { id: "interview", label: "면접에서 어떻게 물어보나" },
  { id: "risk", label: "대필·과장이 위험한 이유" },
  { id: "consult", label: "내 생기부로는 뭘 쓸 수 있을까" },
];

function SectionTitle({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-xl md:text-2xl font-bold text-white mb-4"
    >
      <span className="text-accent font-mono text-base mr-3">
        {String(index).padStart(2, "0")}
      </span>
      {children}
    </h2>
  );
}

function ExampleCards({
  bad,
  good,
  badNote,
  goodNote,
}: {
  bad: string;
  good: string;
  badNote: string;
  goodNote: string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-6">
      <div className="rounded-lg border border-red-900/60 bg-red-950/20 p-5">
        <p className="text-red-400 text-xs font-medium tracking-wide mb-3">
          ✕ 나쁜 예 — {badNote}
        </p>
        <p className="text-red-100/70 text-sm leading-relaxed">{bad}</p>
      </div>
      <div className="rounded-lg border border-green-900/60 bg-green-950/20 p-5">
        <p className="text-green-400 text-xs font-medium tracking-wide mb-3">
          ✓ 좋은 예 — {goodNote}
        </p>
        <p className="text-green-100/80 text-sm leading-relaxed">{good}</p>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "미술 학원에서 한 활동도 쓸 수 있나요?",
    a: "미활보는 고교 재학 기간의 활동을 중심으로 작성합니다. 학원 수업 자체를 나열하는 것보다, 그 경험이 학교 활동이나 개인 작업에서 어떻게 이어졌는지를 본인의 언어로 풀어내는 것이 중요합니다. 자세한 기준은 매년 홍익대 공식 안내를 확인해야 합니다.",
  },
  {
    q: "교과·비교과 칸을 전부 채워야 하나요?",
    a: "개수를 채우는 것보다 활동 하나하나의 깊이가 중요합니다. 12칸을 얕게 채운 보고서보다, 생각 과정이 뚜렷한 활동 몇 개가 더 좋은 평가를 받습니다.",
  },
  {
    q: "우리 학교에는 미술 교과가 거의 없는데 불리한가요?",
    a: "교과활동은 미술 외 과목에서의 미술 관련 활동도 인정됩니다. 국어 시간의 시각화 과제, 수학 시간의 도형 탐구처럼 다른 과목에서 미적 사고를 발휘한 경험도 재료가 될 수 있습니다.",
  },
  {
    q: "수능 최저는 어느 정도 맞춰야 하나요?",
    a: "서울캠퍼스는 국어·수학·영어·탐구 중 3개 영역 등급 합 9 이내와 한국사 4등급 이내가 기준입니다(2027학년도). 세종캠퍼스 미술우수자전형은 수능 최저가 없습니다.",
  },
];

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-5 pt-28 pb-20">
        {/* Hero */}
        <header className="text-center mb-14">
          <p className="text-accent text-xs tracking-[0.3em] mb-4">입시정보</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug text-white">
            홍익대 미술활동보고서
            <br />
            완전 가이드
          </h1>
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
            2027학년도 공식 가이드북 기준 · 원장 직접 작성
            <br />
            상담 없이도 전부 읽을 수 있습니다
          </p>
        </header>

        {/* TOC */}
        <nav
          aria-label="목차"
          className="rounded-xl border border-white/10 bg-card p-6 mb-16"
        >
          <p className="text-accent text-sm mb-4">목차</p>
          <ol className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`transition-colors hover:text-white ${
                    item.highlight ? "text-accent" : "text-white/70"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-16 text-[15px] leading-relaxed text-white/80">
          {/* 01 */}
          <section>
            <SectionTitle id="why" index={1}>
              미활보가 왜 홍대 입시의 전부인가
            </SectionTitle>
            <p>
              홍익대학교 미술계열은 실기시험이 없습니다. 2013학년도부터 실기를
              전면 폐지하고, 그 자리를 학교생활기록부와
              미술활동보고서(미활보), 심층면접이 대신하고 있습니다. 그림
              실력을 시험장에서 보여줄 기회가 없으니, 미활보가 지원자의 미술적
              소양을 보여주는 사실상 유일한 통로입니다.
            </p>
            <p className="mt-3">
              쉽게 말해 이렇습니다. 다른 대학이 &ldquo;그림을 그려보세요&rdquo;라고
              한다면, 홍대는 &ldquo;당신이 미술을 어떻게 생각해왔는지 글로
              보여주세요&rdquo;라고 묻는 것입니다.
            </p>
          </section>

          {/* 02 */}
          <section>
            <SectionTitle id="overview" index={2}>
              2027학년도 전형 한눈에 보기
            </SectionTitle>
            <ul className="space-y-2 list-none">
              <li className="rounded-lg bg-secondary px-4 py-3">
                모집 규모 — 서울캠퍼스 미술대학과 세종캠퍼스 조형대학을 합쳐
                수시 471명, 정시 161명
              </li>
              <li className="rounded-lg bg-secondary px-4 py-3">
                평가 방식 — 실기 없이 학생부 + 미술활동보고서 + 심층면접
              </li>
              <li className="rounded-lg bg-secondary px-4 py-3">
                수능 최저 — 서울캠퍼스는 3개 영역 등급 합 9 이내, 한국사
                4등급 이내 / 세종캠퍼스 미술우수자전형은 최저 없음
              </li>
            </ul>
            <p className="text-white/40 text-xs mt-3">
              출처: 홍익대학교 2027학년도 미술계열 가이드북. 지원 전 반드시
              당해 연도 모집요강을 확인하세요.
            </p>
          </section>

          {/* 03 */}
          <section>
            <SectionTitle id="structure" index={3}>
              미활보 구조 해부
            </SectionTitle>
            <p>
              미활보는 크게 교과활동과 비교과활동으로 나뉩니다. 교과활동은 최대
              7개, 비교과활동은 최대 8개까지 입력할 수 있고, 활동마다 내용과
              자기평가 의견을 600자 안에 담아야 합니다.
            </p>
            <p className="mt-3">
              제출은 전용 홈페이지에서 온라인으로만 이뤄지며, 입력 기간을
              놓치면 서류 미제출로 처리되어 결격됩니다. 마감 직전에 몰아 쓰는
              것이 가장 위험한 이유입니다.
            </p>
          </section>

          {/* 04 */}
          <section>
            <SectionTitle id="criteria" index={4}>
              교수들은 뭘 보는가
            </SectionTitle>
            <p>
              많은 학생이 &ldquo;무엇을 그렸고 어떤 재료를 썼는지&rdquo;를
              나열합니다. 하지만 평가자가 보고 싶은 것은 결과물이 아니라 과정
              속의 생각입니다. 왜 그 주제를 골랐는지, 어떤 문제에 부딪혔고
              어떻게 풀었는지, 그 경험이 다음 작업을 어떻게 바꿨는지 — 이
              흐름이 드러나는 보고서가 좋은 평가를 받습니다.
            </p>
            <p className="mt-3">
              이 가이드 전체를 한 문장으로 줄이면 이렇습니다.{" "}
              <strong className="text-white">
                결과를 자랑하지 말고, 생각의 과정을 보여줘라.
              </strong>
            </p>
          </section>

          {/* 05 */}
          <section>
            <SectionTitle id="subject" index={5}>
              교과활동 작성법: 나쁜 예 vs 좋은 예
            </SectionTitle>
            <p>
              같은 수업, 같은 과제도 쓰는 방식에 따라 완전히 다르게 읽힙니다.
            </p>
            <ExampleCards
              badNote="결과 나열"
              bad="미술 시간에 수채화로 정물화를 그렸습니다. 붓과 물감을 사용해 사과와 유리병을 표현했고, 선생님께 좋은 평가를 받았습니다."
              goodNote="생각 과정"
              good="유리병의 투명함을 종이 위에 어떻게 옮길지가 가장 큰 고민이었습니다. 병을 직접 칠하는 대신 배경을 먼저 칠하고 빛이 통과하는 부분을 남기는 방식을 실험했고, 이 경험으로 '그리지 않음으로써 그리는' 표현이 있다는 것을 배웠습니다."
            />
            <p className="text-white/50 text-sm">
              두 글의 차이는 그림 실력이 아니라 생각을 언어로 정리하는
              능력입니다. 그리고 이것이 정확히 미활보가 평가하려는 능력입니다.
            </p>
          </section>

          {/* 06 */}
          <section>
            <SectionTitle id="nonsubject" index={6}>
              비교과활동 작성법: 나쁜 예 vs 좋은 예
            </SectionTitle>
            <p>
              전시 관람, 공모전, 개인 작업이 여기에 해당합니다. 비교과에서 가장
              흔한 실수는 &ldquo;다녀왔다&rdquo;에서 끝나는 것입니다.
            </p>
            <ExampleCards
              badNote="관람 인증"
              bad="국립현대미술관에서 열린 전시를 관람했습니다. 다양한 현대미술 작품을 보며 시야를 넓힐 수 있었고 매우 인상 깊었습니다."
              goodNote="질문과 연결"
              good="전시에서 한 설치 작품이 관객의 움직임에 따라 달라지는 것을 보고, '작품은 어디까지가 작가의 것인가'라는 질문이 생겼습니다. 이후 학교 동아리 작업에서 보는 사람의 위치에 따라 다르게 읽히는 포스터를 시도해봤습니다."
            />
            <p className="text-white/50 text-sm">
              좋은 예의 핵심은 관람이 질문으로, 질문이 다음 작업으로 이어졌다는
              연결 고리입니다.
            </p>
          </section>

          {/* 07 */}
          <section>
            <SectionTitle id="mistakes" index={7}>
              가장 많이 하는 실수 5가지
            </SectionTitle>
            <ol className="space-y-3 list-none">
              {[
                "재료와 기법 나열 — 무엇으로 그렸는지는 중요하지 않습니다. 왜 그렇게 그렸는지가 중요합니다.",
                "칸 채우기 강박 — 얕은 활동 12개보다 깊은 활동 6개가 낫습니다.",
                "모든 활동이 같은 톤 — 전부 '열심히 했고 많이 배웠습니다'로 끝나면 하나도 기억에 남지 않습니다.",
                "수상 실적 자랑 — 상 자체는 학생부에 이미 있습니다. 미활보에서는 그 과정에서의 시행착오를 쓰세요.",
                "마감 직전 작성 — 온라인 입력 기간을 놓치면 결격입니다. 3년의 활동을 며칠 만에 정리할 수는 없습니다.",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent font-mono text-sm shrink-0">
                    {i + 1}.
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 08 */}
          <section>
            <SectionTitle id="faq" index={8}>
              자주 묻는 질문
            </SectionTitle>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-lg border border-white/10 bg-card px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-white font-medium text-sm flex justify-between items-center">
                    {f.q}
                    <span className="text-accent transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* 09 */}
          <section>
            <SectionTitle id="timeline" index={9}>
              학년별 준비 타임라인
            </SectionTitle>
            <div className="space-y-4">
              {[
                {
                  grade: "예비고1 · 고1",
                  text: "활동을 '만드는' 시기입니다. 미술 교과 수행평가를 성실히 하고, 전시 관람이나 개인 작업을 할 때마다 무엇이 궁금했고 무엇을 시도했는지 짧게라도 기록해두세요. 3년 뒤 이 메모가 미활보의 원석이 됩니다.",
                },
                {
                  grade: "고2",
                  text: "활동을 '연결하는' 시기입니다. 흩어진 경험 사이에서 나만의 관심사 줄기를 찾고, 그 줄기를 심화하는 활동을 의도적으로 채워 넣으세요. 세종캠퍼스와 서울캠퍼스 중 목표에 따라 수능 최저 대비 여부도 이때 정해야 합니다.",
                },
                {
                  grade: "고3",
                  text: "활동을 '정리하는' 시기입니다. 새 활동을 벌이기보다 기존 활동을 600자 안에 생각의 과정 중심으로 다듬는 데 집중하세요. 온라인 입력 기간을 달력에 표시하고 최소 한 달 전에 초안을 완성하세요.",
                },
              ].map((t) => (
                <div
                  key={t.grade}
                  className="rounded-lg border-l-2 border-accent bg-secondary px-5 py-4"
                >
                  <p className="text-accent text-sm font-medium mb-1">
                    {t.grade}
                  </p>
                  <p className="text-sm">{t.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 10 */}
          <section>
            <SectionTitle id="interview" index={10}>
              면접에서 어떻게 물어보나
            </SectionTitle>
            <p>
              미활보는 제출로 끝나지 않습니다. 심층면접에서 면접관은 보고서에
              적힌 활동을 파고들어 질문합니다. &ldquo;이 작업에서 가장 어려웠던
              점은 무엇이었나요?&rdquo;, &ldquo;왜 그 방식을 선택했나요?&rdquo;
              같은 질문에 보고서와 같은 깊이로 답할 수 있어야 합니다.
            </p>
            <p className="mt-3">
              그래서 미활보는 면접의 대본이기도 합니다. 본인이 직접 겪고 직접
              쓴 내용이라면 면접은 자연스러운 대화가 되지만, 그렇지 않다면
              면접장에서 무너집니다.
            </p>
          </section>

          {/* 11 */}
          <section>
            <SectionTitle id="risk" index={11}>
              대필·과장이 위험한 이유
            </SectionTitle>
            <p>
              홍익대는 제출된 보고서의 진정성을 검증하는 것으로 알려져
              있습니다. 활동 내용의 진위를 확인하기 위해 관련 기관에 직접
              자료를 요청한 사례도 회자됩니다. 면접이라는 2차 검증까지
              있으니, 남이 대신 써준 보고서는 어딘가에서 반드시 티가 납니다.
            </p>
            <p className="mt-3">
              결론은 단순합니다. 지름길은 없고, 본인의 경험을 잘 정리하는 것이
              유일한 정답입니다. 이 가이드가 그 정리를 돕기 위해 존재합니다.
            </p>
          </section>

          {/* 12 — CTA */}
          <section>
            <SectionTitle id="consult" index={12}>
              내 생기부로는 뭘 쓸 수 있을까
            </SectionTitle>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-7">
              <p className="text-white font-medium mb-2">
                작성법은 여기 다 있습니다
              </p>
              <p className="text-sm text-white/70 mb-6 leading-relaxed">
                방법을 아는 것과 내 생기부에 적용하는 것은 다른 문제입니다.
                지금까지의 활동으로 어떤 미활보를 만들 수 있을지 궁금하다면,
                무료 진단 상담에서 원장이 직접 함께 봐드립니다.
              </p>
              <a
                href={NAVER_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
              >
                무료 진단 상담 신청
              </a>
            </div>
          </section>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-6 text-xs text-white/40 leading-relaxed">
          본 가이드는 홍익대학교가 공개한 2027학년도 안내 자료를 바탕으로
          작성되었으며, 전형 내용은 해마다 바뀔 수 있습니다. 지원 전 반드시
          당해 연도 공식 모집요강을 확인하세요. ·{" "}
          <Link href="/" className="underline hover:text-white">
            모두다른고양이 미술학원
          </Link>
        </footer>
      </article>
    </main>
  );
}
