/** Fictional illustration requested for the draft, never a student result. */
const exams = [
  { name: "6월 모의평가", grade: 3, x: 90 },
  { name: "9월 모의평가", grade: 2, x: 300 },
  { name: "수능", grade: 4, x: 510 },
];
const y = (grade: number) => 36 + (grade - 1) * 44;

export function RetakeExampleCase() {
  return (
    <article className="rt-feature-case rt-example-case">
      <h3>9월까지 올랐던 성적,<br/><em>수능에서도 이어졌을까요?</em></h3>
      <figure className="rt-example-chart">
        <figcaption><strong>국어 등급 흐름 예시</strong></figcaption>
        <svg viewBox="0 0 600 282" role="img" aria-labelledby="rt-example-chart-title rt-example-chart-desc">
          <title id="rt-example-chart-title">국어 등급의 가상 예시</title>
          <desc id="rt-example-chart-desc">실제 학생 기록이 아닙니다. 6월 모의평가 3등급에서 9월 모의평가 2등급으로 상승한 뒤 수능에서는 4등급으로 하락하는 가상의 흐름입니다. 세로축은 위쪽 1등급부터 아래쪽 5등급까지 표시합니다.</desc>
          {[1,2,3,4,5].map(grade => <g key={grade} className="rt-grade-grid"><line x1="60" x2="554" y1={y(grade)} y2={y(grade)}/><text x="18" y={y(grade)+4}>{grade}</text></g>)}
          <path className="rt-grade-rise" d={`M90 ${y(3)} L300 ${y(2)}`}/>
          <path className="rt-grade-fall" d={`M300 ${y(2)} L510 ${y(4)}`}/>
          {exams.map((exam,i) => <g key={exam.name} className={i===2 ? "rt-grade-point rt-grade-final" : "rt-grade-point"}>
            <line x1={exam.x} x2={exam.x} y1={y(exam.grade)+10} y2="226"/>
            <circle cx={exam.x} cy={y(exam.grade)} r="6"/>
            <text className="rt-grade-value" x={exam.x} y={y(exam.grade)-19} textAnchor="middle">{exam.grade}등급</text>
            <text className="rt-grade-exam" x={exam.x} y="257" textAnchor="middle">{exam.name}</text>
          </g>)}
        </svg>
      </figure>
      <div className="rt-example-story"><span>이 예시에서 가정한 상황</span><p>모의평가 성적은 올랐지만, 수능이 다가올수록 기상·취침 시간이 흔들리고 계획한 공부에 집중하기 어려운 날이 늘어났습니다.</p></div>
      <div className="rt-example-question"><span>다시 준비할 때 살펴볼 것</span><strong>공부할 내용과 함께,<br/>끝까지 이어갈 하루도 준비했을까?</strong></div>
      <p className="rt-example-note">이전 수능 체제의 6월·9월 모의평가 일정을 가정한 가상 사례입니다. 2028학년도부터 하반기 모의평가는 8월에 실시됩니다. 등급 변화만으로 실제 성적 하락의 원인을 판단할 수는 없습니다.</p>
    </article>
  );
}

export function RetakeWinterFoundation() {
  return (
    <div className="rt-winter-foundation">
      <div><p className="rt-kicker">겨울은 1년 준비의 출발점</p><h3>수능 날까지 이어갈 습관,<br/><em>겨울부터 연습합니다.</em></h3></div>
      <div className="rt-foundation-copy"><p>무엇을 보완할지 먼저 정해야, 하루의 공부와 실기 훈련도 구체적이 됩니다. 모다고는 상담으로 준비 방향을 짚고 실제 수업으로 연결합니다.</p><p>윈터스쿨은 그 방향에 맞춰 학습·생활 리듬을 연습하는 시작 단계입니다. 겨울에 익힌 습관을 학기 중에도 이어가며 수능까지 준비하는 것을 목표로 합니다.</p></div>
      <ol className="rt-habit-year" aria-label="겨울부터 수능까지 이어갈 준비의 목표">
        <li><span>겨울</span><strong>방향을 정하고<br/>습관을 연습하기</strong></li>
        <li><span>학기 중</span><strong>정한 습관을<br/>하루하루 이어가기</strong></li>
        <li><span>수능</span><strong>끝까지 이어갈<br/>준비를 목표로</strong></li>
      </ol>
    </div>
  );
}
