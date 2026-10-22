export default function Grade11WinterTime() {
  return <section className="rt-section g11-winter-time" id="winter-time" aria-labelledby="g11-winter-time-title">
    <div className="rt-wrap">
      <div className="rt-centered">
        <p className="rt-kicker">01 · 눈앞에 펼쳐 보는 겨울의 시간</p>
        <h2 id="g11-winter-time-title">이번 겨울, 이 시간을<br/>무엇으로 채울까요?</h2>
        <p className="rt-intro">방학 일수와 하루 준비 시간을 조절해 보세요.<br/>고2가 되기 전, 어떻게 쓸지 정할 수 있는 시간입니다.</p>
      </div>
      <div className="g11-time-card">
        <div className="g11-time-visual">
          <span className="g11-time-label">계산 예시 · 수업·자습·실기에 쓸 수 있는 시간</span>
          <div className="g11-time-total"><output data-time-total aria-live="polite" aria-atomic="true" htmlFor="g11-preparation-days g11-hours-per-day" aria-label="겨울 동안 준비에 쓸 수 있는 총시간">240</output><span>시간</span></div>
          <p className="g11-time-equation"><span data-time-days-value>40</span>일 <span aria-hidden="true">×</span><span className="sr-only">곱하기</span> 하루 <span data-time-hours-value>6</span>시간</p>
          <div className="g11-time-days" aria-hidden="true">{Array.from({ length: 60 }, (_, index) => <span data-time-day={index + 1} key={index} hidden={index >= 40}>{String(index + 1).padStart(2, "0")}</span>)}</div>
          <p className="g11-time-caption"><span>한 칸은 하루.</span> <span data-time-caption>40일 동안, 하루 6시간씩 준비한다면.</span></p>
        </div>
        <div className="g11-time-controls" role="group" aria-label="겨울 준비 시간 계산">
          <div className="g11-time-control">
            <label className="g11-time-input-label" htmlFor="g11-preparation-days"><span>방학 일수</span><span><output data-time-days-value htmlFor="g11-preparation-days">40</output>일</span></label>
            <input type="range" id="g11-preparation-days" min="14" max="60" step="1" defaultValue="40" aria-describedby="g11-days-help"/>
            <p className="g11-time-range"><span>14일</span><span>60일</span></p>
            <p className="g11-time-note" id="g11-days-help">학교별 방학 일수는 다릅니다. 실제 일정에 맞춰 조절하세요.</p>
          </div>
          <div className="g11-time-control">
            <label className="g11-time-input-label" htmlFor="g11-hours-per-day"><span>하루 준비 시간</span><span><output data-time-hours-value htmlFor="g11-hours-per-day">6</output>시간</span></label>
            <input type="range" id="g11-hours-per-day" min="2" max="8" step="1" defaultValue="6" aria-describedby="g11-hours-help"/>
            <p className="g11-time-range"><span>2시간</span><span>8시간</span></p>
            <p className="g11-time-note" id="g11-hours-help">수업·자습·실기 시간을 합한 값입니다. 수면·식사·휴식 시간은 제외합니다.</p>
          </div>
          <div className="g11-time-control-total"><span>총 준비 시간</span><span><output data-time-total htmlFor="g11-preparation-days g11-hours-per-day">240</output>시간</span></div>
        </div>
      </div>
      <p className="g11-time-note g11-time-disclaimer">초기값은 40일·하루 6시간을 가정한 계산 예시입니다. 학교 방학과 개인 일정에 맞춰 실제로 준비할 수 있는 시간을 살펴보세요.</p>
    </div>
  </section>;
}
