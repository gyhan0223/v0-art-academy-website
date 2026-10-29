import { CAMP_INFO, WINTER_CAMP_TUITION } from "@/lib/winter-camp";
import {
  WEEKDAY_SCHEDULE,
  WEEKEND_SCHEDULE,
  WAKE_TIME,
  SLEEP_TIME,
  type TimeBlock,
} from "@/lib/winter-schedule";

const routineDays = [
  {
    name: "월 — 금",
    caption: "수업과 자습",
    blocks: WEEKDAY_SCHEDULE,
    highlights: ["09:00", "13:35", "15:50", "21:50"],
  },
  {
    name: "토 — 일",
    caption: "대학별 실기 · 수준별 지도",
    blocks: WEEKEND_SCHEDULE,
    highlights: ["09:00", "13:35", "18:10"],
  },
];

const reportContents = [
  { title: "공부 기록", description: "단어시험·모의고사 결과와 과제 수행을 확인합니다." },
  { title: "생활 기록", description: "출결과 자습 참여, 기상·취침 등 하루 일과를 살펴봅니다." },
  { title: "다음 계획", description: "선생님이 잘한 점과 어려운 점을 짚고, 다음 2주의 공부 계획을 안내합니다." },
];

export function Grade11Tuition() {
  const { firstFourWeeks, finalFourWeekItems } = WINTER_CAMP_TUITION;
  const finalFourWeeks = finalFourWeekItems.reduce((sum, item) => sum + item.amount, 0);
  const total = firstFourWeeks + finalFourWeeks;

  return (
    <div className="g11-tuition">
      <p className="g11-tuition-total">
        <span>8주 총</span>
        <strong>{total.toLocaleString("ko-KR")}<span>원</span></strong>
      </p>
      <p className="g11-tuition-includes">학과·실기·기숙·식사·독서실 포함</p>
      <p className="g11-tuition-excludes">수학·서류전형 지도 비용 별도</p>
      <p className="g11-tuition-condition">8주 일괄 등록 기준</p>
      <details className="g11-tuition-details">
        <summary>비용 자세히 보기<span aria-hidden="true">+</span></summary>
        <div className="g11-tuition-breakdown">
          <div className="g11-tuition-period">
            <h4>첫 4주</h4>
            <p className="g11-tuition-subtotal"><span>묶음 금액</span><strong>{firstFourWeeks.toLocaleString("ko-KR")}원</strong></p>
          </div>
          <div className="g11-tuition-period">
            <h4>뒤 4주 · 항목별 내역</h4>
            <ul>
              {finalFourWeekItems.map((item) => (
                <li key={item.label}><span>{item.label}</span><strong>{item.amount.toLocaleString("ko-KR")}원</strong></li>
              ))}
            </ul>
            <p className="g11-tuition-subtotal"><span>뒤 4주 합계</span><strong>{finalFourWeeks.toLocaleString("ko-KR")}원</strong></p>
          </div>
          <div className="g11-tuition-sum">
            <p className="g11-tuition-equation"><span>{firstFourWeeks.toLocaleString("ko-KR")}원</span><span>+</span><span>{finalFourWeeks.toLocaleString("ko-KR")}원</span></p>
            <p className="g11-tuition-subtotal"><span>8주 총액</span><strong>{total.toLocaleString("ko-KR")}원</strong></p>
          </div>
          <p>8주 일괄 등록 시 적용되는 금액입니다.</p>
          <a href="/tuition">교습비 고지 확인 ↗</a>
        </div>
      </details>
    </div>
  );
}

function ScheduleBlock({ block }: { block: TimeBlock }) {
  return (
    <div className={`rt-time rt-time-${block.type}`}>
      <time>
        {block.start}
        <span>— {block.end}</span>
      </time>
      <div>
        <strong>{block.label}</strong>
        {block.note && <small>{block.note}</small>}
      </div>
    </div>
  );
}

export function Grade11Routine() {
  return (
    <section className="rt-section rt-routine" id="routine">
      <div className="rt-wrap">
        <div className="rt-section-heading">
          <div>
            <p className="rt-kicker">05 · 모다고의 한 주</p>
            <h2>
              평일엔 공부,
              <br />
              주말엔 실기.
            </h2>
          </div>
          <p className="rt-intro">
            국어·영어·통합사회·통합과학 수업과 자습,
            <br />
            목표 대학에 맞춘 실기를 함께 준비합니다.
          </p>
        </div>

        <div className="rt-schedule-grid">
          {routineDays.map((day) => (
            <article className="rt-day" key={day.name}>
              <header>
                <h3>{day.name}</h3>
                <p>{day.caption}</p>
              </header>
              <div className="g12-schedule-summary">
                {day.blocks
                  .filter((block) => day.highlights.includes(block.start))
                  .map((block) => (
                    <div key={block.start}>
                      <time>{block.start}</time>
                      <div>
                        <strong>{block.label}</strong>
                        {block.note && <small>{block.note}</small>}
                      </div>
                    </div>
                  ))}
              </div>
              <details className="g12-schedule-toggle">
                <summary>전체 시간표 보기</summary>
                <div className="rt-day-blocks">
                  {day.blocks.map((block) => (
                    <ScheduleBlock key={block.start} block={block} />
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
        <p className="rt-micro rt-centered">
          {CAMP_INFO.period} · {WAKE_TIME} 기상 · {SLEEP_TIME} 취침
          <br />
          예비 고2가 참여하는 기숙 과정입니다. 기초가 필요한 부분과 현재 준비 수준에 맞는 수업 구성은 상담에서 확인합니다.
        </p>
      </div>
    </section>
  );
}

export function Grade11Report() {
  return (
    <section className="rt-section rt-report-section g11-report-guide" id="report" aria-labelledby="g11-report-title">
      <div className="rt-wrap">
        <div className="rt-centered">
          <p className="rt-kicker">06 · 학습·생활 리포트</p>
          <h2 id="g11-report-title">
            공부와 생활,
            <br />
            <em>2주마다 한눈에.</em>
          </h2>
          <p className="rt-intro">
            어떻게 공부하고 생활했는지,
            <br />
            다음엔 무엇을 챙길지 전합니다.
          </p>
        </div>
        <div className="g11-report-grid">
          {reportContents.map((item, index) => (
            <article className="g11-report-card" key={item.title}>
              <span className="g11-report-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <figure className="g11-report-preview">
          <a
            className="g11-report-preview-thumb"
            href="/reports/grade11-learning-report-sample.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="학습·생활 리포트 가상 예시를 PDF로 크게 보기 (새 창)"
          >
            <img
              src="/images/grade11/learning-report-sample.png"
              alt="공부·생활 기록과 다음 계획을 담은 가상 리포트 샘플"
              width={1323}
              height={1871}
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption>
            <h3>리포트 샘플</h3>
            <p>리포트 구성을 보여주기 위한 가상 예시입니다.</p>
            <a
              className="rt-textlink"
              href="/reports/grade11-learning-report-sample.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF로 크게 보기 ↗
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
