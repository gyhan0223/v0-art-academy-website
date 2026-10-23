import { getGrade11WinterTime } from "@/lib/grade11-winter-time";

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
            <div className="g11-time-days" aria-hidden="true">
              {Array.from({ length: time.days }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}
            </div>
            <p className="g11-time-caption"><span>한 칸은 하루.</span> 시작일부터 종료일까지 {time.days}일의 반복입니다.</p>
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
