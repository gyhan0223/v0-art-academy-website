const universitySources = {
  snu: "https://admission.snu.ac.kr/undergraduate/notice?bbsidx=168854&md=v",
  hongik: "https://www.hongik.ac.kr/kr/admission/notice-admission.do?articleNo=151353&mode=view",
  kookmin: "https://admission.kookmin.ac.kr/helper/notice.php?category=all&ctype=view&no=1064",
};

export default function University2028Comparison() {
  return (
    <div className="rt-university-comparison" id="university-2028" aria-labelledby="rt-university-title">
      <header className="rt-university-heading">
        <p className="rt-kicker">대학이 발표한 실제 반영 기준</p>
        <h3 id="rt-university-title">같은 2028 수능,<br/><em>목표 미대에 따라 준비가 달라집니다.</em></h3>
        <p>서울대·홍익대·국민대의 정시 일반전형을 비교해 보세요.</p>
      </header>
      <div className="rt-university-grid">
        <article className="rt-university-card">
          <header><span>미술대학 · 정시 일반전형</span><h4>서울대학교</h4></header>
          <p className="rt-university-key">수학과 두 탐구까지,<br/><strong>모두 반영합니다.</strong></p>
          <div className="rt-university-ratio" aria-label="2단계 수능 상대 반영비율 국어 100, 수학 100, 사회 50, 과학 50">
            <span>국어<b>100</b></span><span>수학<b>100</b></span><span>사회<b>50</b></span><span>과학<b>50</b></span>
          </div>
          <p className="rt-university-caption">2단계 수능의 상대 반영비율 · 백분위 활용</p>
          <p className="rt-university-detail">1단계는 국어·수학·영어·한국사·탐구 등급을 환산합니다. 탐구는 사회·과학 환산점수의 평균을 사용합니다.</p>
          <details><summary>단계별 전형과 영어 반영<span aria-hidden="true">+</span></summary><div><p>1단계: 수능 100%로 5배수 선발</p><p>2단계: 수능 40점 + 실기 30점 + 면접 30점</p><p>영어는 2단계에서 1등급 감점이 없고, 2등급부터 차등 감점합니다.</p><p>대상: 동양화·서양화·조소·공예·디자인과</p></div></details>
          <a className="rt-university-source" href={universitySources.snu} target="_blank" rel="noopener noreferrer">시행계획 원문 · 책자 19·33쪽 ↗</a>
        </article>
        <article className="rt-university-card">
          <header><span>서울캠퍼스 미술계열 · 수능우수자전형</span><h4>홍익대학교</h4></header>
          <p className="rt-university-key">국어·수학·탐구 중<br/><strong>두 영역을 반영합니다.</strong></p>
          <div className="rt-university-ratio rt-university-ratio-three" aria-label="국어 수학 탐구 중 두 영역 각각 40퍼센트, 영어 20퍼센트">
            <span>선택 영역 1<b>40<small>%</small></b></span><span>선택 영역 2<b>40<small>%</small></b></span><span>영어<b>20<small>%</small></b></span>
          </div>
          <p className="rt-university-caption">국어·수학·탐구 중 택2 + 영어</p>
          <p className="rt-university-detail">탐구를 반영하면 통합사회·통합과학 두 과목의 표준점수를 합산합니다. 영어는 등급별 환산점수를 적용합니다.</p>
          <details><summary>단계별 전형과 한국사 반영<span aria-hidden="true">+</span></summary><div><p>1단계: 수능 100%로 3배수 선발</p><p>2단계: 1단계 성적 60% + 서류 40%</p><p>서류는 학교생활기록부와 미술활동보고서입니다. 한국사는 1~3등급 10점 가산, 4등급부터 차등 가산합니다.</p></div></details>
          <a className="rt-university-source" href={universitySources.hongik} target="_blank" rel="noopener noreferrer">시행계획 원문 · 책자 19~20쪽 ↗</a>
        </article>
        <article className="rt-university-card">
          <header><span>조형대학 · 정시 일반전형</span><h4>국민대학교</h4></header>
          <p className="rt-university-key">국어·영어는 필수,<br/><strong>수학·탐구 중 상위 영역.</strong></p>
          <div className="rt-university-ratio rt-university-ratio-three" aria-label="국어 33.3퍼센트, 영어 33.3퍼센트, 수학과 탐구 중 상위 영역 33.3퍼센트">
            <span>국어<b>33.3<small>%</small></b></span><span>영어<b>33.3<small>%</small></b></span><span>수학 / 탐구<b>33.3<small>%</small></b></span>
          </div>
          <p className="rt-university-caption">수학·탐구 중 표준점수 상위 영역 선택</p>
          <p className="rt-university-detail">탐구는 통합사회·통합과학 중 상위 한 과목의 표준점수를 반영합니다. 영어는 등급별 환산점수를 적용합니다.</p>
          <details><summary>학과별 전형과 한국사 반영<span aria-hidden="true">+</span></summary><div><p>공업·공간디자인: 수능 60% + 실기 40% 일괄합산</p><p>그 외 조형대학 학과: 1단계 수능 60% + 실기 40%로 5배수 선발, 2단계 1단계 성적 80% + 면접 20%</p><p>한국사는 4등급까지 만점, 5등급부터 등급당 0.2점 감점합니다. 미술학부 회화·입체미술전공의 전형은 이 카드의 비교 대상에서 제외했습니다.</p></div></details>
          <a className="rt-university-source" href={universitySources.kookmin} target="_blank" rel="noopener noreferrer">전형계획 원문 · 책자 39~41쪽 ↗</a>
        </article>
      </div>
      <div className="rt-university-takeaway"><strong>탐구를 모두 응시하는 것과,<br/>대학이 두 과목을 모두 반영하는 것은 다릅니다.</strong><p>목표 대학의 반영 방식부터 확인해야, 이번 겨울에 힘을 쏟을 과목도 구체적으로 정할 수 있습니다.</p></div>
      <p className="rt-university-note">2026.10.26 확인 · 2028학년도 대학별 시행계획 기준(홍익대 2026.07.09 수정본). 표시한 모집단위·전형에 한한 비교입니다. 최종 지원 전 해당 학년도 모집요강을 다시 확인하세요.</p>
    </div>
  );
}
