import { getGrade11WinterTime } from "@/lib/grade11-winter-time";

function VacationScene({ routine }: { routine: boolean }) {
  return (
    <svg className="g11-comparison-scene" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M16 88H146" opacity=".25"/>
      {routine ? <>
        <circle cx="35" cy="25" r="12" opacity=".6"/>
        <path d="M35 17V25H28"/>
        <path d="M24 65H145M38 65V88M134 65V88"/>
        <path d="M62 49V78H88M68 78V88M86 78V88" opacity=".55"/>
        <circle cx="86" cy="26" r="9" fill="currentColor" fillOpacity=".12"/>
        <path d="M80 39Q91 36 98 51L109 57L104 62L89 56L84 47L83 65H66L70 49Q72 42 80 39Z" fill="currentColor" fillOpacity=".14"/>
        <path d="M70 65L87 75L100 86M83 65L100 72L107 86"/>
        <path d="M108 53L122 56L135 52V63L122 66L108 63Z" fill="currentColor" fillOpacity=".1"/>
        <path d="M122 56V65M107 58L113 50"/>
        <path d="M139 25L144 30M133 34H140" opacity=".4"/>
      </> : <>
        <rect x="21" y="14" width="32" height="28" rx="4" opacity=".35"/>
        <path d="M37 14V42M21 28H53" opacity=".25"/>
        <rect x="24" y="51" width="113" height="25" rx="8" opacity=".4"/>
        <path d="M22 63Q15 63 18 76L21 82H140L144 76V67Q144 60 137 62V74H25V67Q25 63 22 63Z" fill="currentColor" fillOpacity=".08"/>
        <path d="M31 82V88M132 82V88"/>
        <circle cx="103" cy="40" r="9" fill="currentColor" fillOpacity=".12"/>
        <path d="M96 51L78 59L57 49L51 57L74 70L99 61Q107 58 106 52Z" fill="currentColor" fillOpacity=".14"/>
        <path d="M53 55L41 68H29M100 54L116 50L124 41"/>
        <rect x="121" y="27" width="9" height="16" rx="2" transform="rotate(16 121 27)"/>
        <path d="M75 16L80 12H72L77 8" opacity=".35"/>
      </>}
    </svg>
  );
}

const vacationScenarios = [
  { routine: false, label: "집에서 쉬기만 한다면", lead: "공부는", title: "내일부터.", lines: ["해야 할 일을 미루며", "하루가 지나가고"] },
  { routine: true, label: "모다고의 일과로 보낸다면", lead: "오늘 할 준비를", title: "지금부터.", lines: ["정한 시간에 시작해", "해보고, 점검하고"] },
];

export default function Grade11WinterTime() {
  const time = getGrade11WinterTime();
  return (
    <section className="rt-section g11-winter-time" id="winter-time" aria-labelledby="g11-winter-time-title">
      <div className="rt-wrap">
        <div className="rt-centered">
          <p className="rt-kicker">01 · 겨울의 시간으로 만드는 하루의 습관</p>
          <h2 id="g11-winter-time-title">고2의 하루를,<br/>이번 겨울부터 연습합니다.</h2>
          <p className="rt-intro">윈터스쿨 시작일부터 종료일까지, 기상부터 취침 전까지.<br/>공부와 실기, 식사와 휴식까지 같은 일과로 반복합니다.</p>
        </div>
        <div className="g11-time-card">
          <div className="g11-time-visual">
            <span className="g11-time-label">일과표 기준 · 학습과 생활 습관을 함께 연습하는 시간</span>
            <p className="g11-time-total"><strong>{time.totalHours.toLocaleString("ko-KR")}</strong><span>시간</span></p>
            <p className="g11-time-includes">수업·자습·실기·식사·휴식·생활 포함</p>
            <p className="g11-time-equation"><strong>{time.days}일</strong><span aria-hidden="true">×</span><span className="sr-only">곱하기</span>하루 <strong>{time.dailyHours}시간</strong></p>
            <div className="g11-time-comparison" aria-label="쉬기만 하는 방학과 일과에 따라 준비하는 방학의 비교">
              <p className="g11-comparison-heading">같은 {time.days}일, 어떤 하루를 반복할까요?</p>
              <div className="g11-comparison-grid">
                {vacationScenarios.map(scenario => <article className={`g11-comparison-card ${scenario.routine ? "g11-comparison-routine" : "g11-comparison-rest"}`} key={scenario.label}>
                  <span className="g11-comparison-label">{scenario.label}</span>
                  <VacationScene routine={scenario.routine}/>
                  <h3>{scenario.lead}<br/><strong>{scenario.title}</strong></h3>
                  <p>{scenario.lines[0]}<br/>{scenario.lines[1]}</p>
                </article>)}
                <span className="g11-comparison-vs" aria-hidden="true">VS</span>
              </div>
            </div>
          </div>
          <div className="g11-time-detail">
            <div className="g11-time-period">
              <span>윈터스쿨 진행 기간</span>
              <p><time dateTime={time.startDateISO}>{time.startDateISO.replaceAll("-", ".")}</time><span>—</span><time dateTime={time.endDateISO}>{time.endDateISO.replaceAll("-", ".")}</time></p>
            </div>
            <div className="g11-time-window">
              <span>매일의 일과</span>
              <strong><time>{time.dayStart}</time><span>—</span><time>{time.dayEnd}</time></strong>
              <p>기상부터 취침 전까지, 하루 {time.dailyHours}시간</p>
            </div>
            <div className="g11-day-composition">
              <p>하루 24시간의 구성</p>
              <div className="g11-day-bar" role="img" aria-label={`하루 24시간 중 일과 ${time.dailyHours}시간, 수면 ${time.sleepHours}시간`}>
                <span className="g11-day-awake" style={{ flexGrow: time.dailyHours }}>일과 {time.dailyHours}시간</span>
                <span className="g11-day-sleep" style={{ flexGrow: time.sleepHours }}>수면 {time.sleepHours}시간</span>
              </div>
            </div>
            <p className="g11-time-practice">같은 시간에 시작하고,<br/>정한 과제를 해보고,<br/><strong>다음 날에도 이어갈 하루를 연습합니다.</strong></p>
          </div>
        </div>
        <p className="g11-time-note g11-time-disclaimer">시작일·종료일을 포함한 {time.days}일에 매일 {time.dayStart}~{time.dayEnd} 일과를 적용한 안내 기준 합계입니다. 식사·휴식·생활을 포함하며, 입·퇴소일의 실제 운영 시간은 달라질 수 있습니다.</p>
      </div>
    </section>
  );
}
