const preparations = [
  { id: "study", label: "공부의 기초", title: "배운 내용을 이해하고,", next: "문제에 적용할 힘을 쌓습니다.", now: "개념 이해 · 취약 부분 보완", later: "수능·내신 문제에 적용", body: "주요 개념을 이해하고 문제에 적용하며, 공부의 기초를 차근차근 다집니다. 고2부터 쌓은 기본기가 고3의 수능·내신 준비를 받쳐줍니다." },
  { id: "school", label: "학교생활과 기록", title: "수업과 활동의 과정이,", next: "생기부에 담길 수 있도록.", now: "전공 관심과 연결한 수업·활동", later: "학생부에 쌓인 과정 활용", body: "생기부의 바탕은 실제 학교 수업과 활동입니다. 관심 분야와 학교에서 참여할 수 있는 수업·활동을 함께 살펴, 고2 학교생활의 준비 방향을 잡습니다." },
  { id: "art", label: "실기의 경험", title: "직접 그리고 피드백받으며,", next: "표현의 바탕을 쌓습니다.", now: "관찰 · 표현 · 피드백", later: "목표 대학에 맞춘 훈련", body: "학생마다 실기 경험과 기초 수준은 다릅니다. 현재 수준과 목표 대학을 함께 살펴, 필요한 연습과 보완 과제, 준비 순서를 개별적으로 정합니다." },
];

function PreparationIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 80 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "study" ? <><path d="M10 15Q25 10 40 18Q55 10 70 15V51Q55 46 40 54Q25 46 10 51Z"/><path d="M40 18V54M18 23L31 25M18 32L31 34M49 25L62 23M49 34L62 32"/><path d="M54 4L58 8L66 1" strokeWidth="3"/></> : kind === "school" ? <><path d="M12 55V24L40 7L68 24V55ZM29 55V40H51V55M7 55H73"/><path d="M22 27H27M22 34H27M53 27H58M53 34H58M35 27H45"/><circle cx="40" cy="18" r="4"/></> : <><rect x="12" y="12" width="43" height="44" rx="3"/><path d="M23 43L30 30L41 43ZM50 40L65 10L71 13L56 43L49 48ZM62 17L68 20M48 6H55"/><circle cx="39" cy="24" r="4"/></>}
  </svg>;
}

export default function Grade11PreparationWhy() {
  return <section className="rt-section g11-why" id="why-grade2" aria-labelledby="g11-why-title"><div className="rt-wrap">
    <div className="rt-centered"><p className="rt-kicker">01 · 왜 고2부터 준비해야 할까요?</p><h2 id="g11-why-title">고3에 준비가 한꺼번에 몰리지 않도록,<br/><em>고2부터 하나씩 시작합니다.</em></h2><p className="rt-intro">목표 미대에 따라 공부·실기·학생부의 준비는 달라집니다.<br/>현재 준비 상태와 목표를 함께 보고, 무엇을 언제 준비할지 계획합니다.</p></div>
    <div className="g11-why-grid">{preparations.map(item => <article className="g11-why-card" key={item.id}>
      <div className="g11-why-icon"><PreparationIcon kind={item.id}/><span>{item.label}</span></div>
      <h3>{item.title}<br/><em>{item.next}</em></h3>
      <div className="g11-why-progress"><div><span>고2</span><strong>{item.now}</strong></div><span className="g11-why-arrow" aria-hidden="true">↓</span><div><span>고3</span><strong>{item.later}</strong></div></div>
      <p>{item.body}</p>
    </article>)}</div>
    <details className="g11-why-evidence"><summary>실제 미대 전형에서는 무엇을 볼까요?<span aria-hidden="true">+</span></summary><div>
      <p className="g11-why-source-label">공개된 전형의 예 · 홍익대 서울 미술계열 2028학년도</p>
      <div className="g11-why-evidence-grid"><p><strong>수시 · 미술우수자전형</strong><span>학생부교과 · 서류 · 면접<br/>수능최저학력기준 적용</span></p><p><strong>정시 · 수능우수자전형</strong><span>1단계 수능 → 2단계 수능·서류<br/>서류: 학생부·미술활동보고서</span></p></div>
      <p className="g11-why-source-note">여러 준비가 함께 쓰이는 전형의 예시입니다. 예비 고2가 지원할 2029학년도 세부 전형은 추후 공식 발표를 확인합니다. <a href="https://www.hongik.ac.kr/kr/admission/notice-admission.do?articleNo=151353&attachNo=90076&mode=download" target="_blank" rel="noopener noreferrer">홍익대 공식 시행계획 · 6·11~12·19~20쪽 ↗</a></p>
    </div></details>
    <div className="g11-why-bridge"><p>고3에 기초 보완과 목표 탐색, 실기 준비를 한꺼번에 시작하면<br/><strong>해야 할 일이 겹칠 수 있습니다.</strong></p><p>고2에는 수시·정시의 가능성을 살피면서,<br/>지금부터 쌓아갈 준비의 순서를 잡습니다.</p><a className="rt-textlink" href="#foundations">현재 상태와 목표부터 살펴보기 ↓</a></div>
  </div></section>;
}
