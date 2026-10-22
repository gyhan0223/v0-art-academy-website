import { CAMP_INFO } from "@/lib/winter-camp";
import { REPORT_SAMPLE } from "@/lib/winter-report";
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
    caption: "학과 수업과 자기주도 학습",
    blocks: WEEKDAY_SCHEDULE,
    highlights: ["09:00", "13:35", "15:50", "21:50"],
  },
  {
    name: "토 — 일",
    caption: "대학교 유형 실기",
    blocks: WEEKEND_SCHEDULE,
    highlights: ["09:00", "13:35", "18:10"],
  },
];

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
            <p className="rt-kicker">05 · 방향을 실행하는 하루의 일과</p>
            <h2>
              평일에는 학과를,
              <br />
              주말에는 실기를.
            </h2>
          </div>
          <p className="rt-intro">
            학과의 빈틈과 실기의 기초를 살펴보고,
            <br />
            학기 중에도 이어갈 공부 습관을 연습합니다.
          </p>
        </div>

        <div className="rt-allocation">
          <div className="rt-allocation-head">
            <span>한 주의 준비 구조</span>
            <span>{CAMP_INFO.name} 안내 기준</span>
          </div>
          <div className="rt-week-strip">
            {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
              <div key={day} className={i > 4 ? "rt-week-art" : undefined}>
                <span>{day}</span>
                <b>{i > 4 ? "실기" : "학과"}</b>
              </div>
            ))}
          </div>
          <div className="rt-allocation-notes">
            <p>
              <strong>평일</strong>국어·영어·탐구 수업 · 클리닉 · 자기주도 학습
            </p>
            <p>
              <strong>주말</strong>목표 대학 유형 실기 · 수준별 지도와 피드백
            </p>
          </div>
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
    <section className="rt-section rt-report-section" id="report">
      <div className="rt-wrap rt-report-layout">
        <div className="rt-report-copy">
          <p className="rt-kicker">06 · 고2의 준비를 살피는 기록</p>
          <h2>
            “잘하고 있어요”보다,
            <br />
            <em>확인할 수 있는 기록.</em>
          </h2>
          <p className="rt-intro">
            모다고 윈터스쿨은 격주 리포트로
            <br />
            학습 습관과 보완할 과제를 함께 안내합니다.
          </p>
          <div className="rt-report-annotations">
            <p>
              <span>01</span>
              <strong>시험·과제 기록</strong>
              <small>어떤 개념과 유형을 어려워하는지</small>
            </p>
            <p>
              <span>02</span>
              <strong>출결·생활 확인</strong>
              <small>공부와 생활의 기본 일과를 지켰는지</small>
            </p>
            <p>
              <span>03</span>
              <strong>선생님의 판단</strong>
              <small>다음 기간에 어떤 기초를 보완할지</small>
            </p>
          </div>
          <p className="rt-micro">
            오른쪽은 기존 홈페이지의 운영 양식을 재구성한 예시입니다.
            실제 학생 성적이나 학부모에게 발송한 리포트가 아닙니다.
          </p>
        </div>

        <div className="rt-report-sheet">
          <div className="rt-report-sheet-top">
            <span>MODAGO / LEARNING REPORT</span>
            <span>운영 양식 예시</span>
          </div>
          <h3>{REPORT_SAMPLE.title}</h3>
          <p className="rt-report-sub">{REPORT_SAMPLE.subtitle}</p>
          <div className="rt-report-fields">
            <span>학생 __________</span>
            <span>기록 기간 __________</span>
          </div>
          <div className="rt-report-blocks">
            {REPORT_SAMPLE.sections.map((section, i) => (
              <section key={section.title}>
                <h4>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h4>
                {section.items.map((item) => (
                  <div className="rt-report-line" key={item}>
                    <p>{item}</p>
                    <span aria-hidden="true" />
                  </div>
                ))}
              </section>
            ))}
          </div>
          <p className="rt-report-footnote">{REPORT_SAMPLE.note}</p>
          <div className="rt-needed g12-report-needed">
            <span className="rt-needed-label">필요한 자료</span>
            <p>(필요한 자료: 개인정보를 가린 실제 발송 리포트 1건)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
