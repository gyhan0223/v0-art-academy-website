import University2028Comparison from "@/components/winter/University2028Comparison";

const sources = {
  structure: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=102385&lev=0&m=020402",
  examples: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103113&lev=0&m=020402",
  date: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103512&lev=0",
};

export default function Grade12Admissions() {
  return (
    <section className="rt-section rt-exam-reform g12-admissions" id="exam-2028" aria-labelledby="g12-admissions-title">
      <div className="rt-wrap">
        <div className="rt-section-heading">
          <div>
            <p className="rt-kicker">2028 미대입시 · 목표 대학부터 확인</p>
            <h2 id="g12-admissions-title">목표 미대는<br/><em>무엇을 볼까요?</em></h2>
          </div>
          <p className="rt-intro">수능·학생부·실기, 대학마다 보는 비중이 다릅니다.<br/>서울대·홍익대·국민대의 정시 전형을 비교해 보세요.</p>
        </div>

        <University2028Comparison showHeading={false} verifiedOn="2026.11.04"/>

        <details className="rt-reform-official g12-exam-reference">
          <summary>2028 수능 기본 정보 확인<span aria-hidden="true">+</span></summary>
          <div>
            <dl>
              <div><dt>시험일</dt><dd>2027년 11월 18일 시행됩니다. <a href={sources.date} target="_blank" rel="noopener noreferrer">교육부 시행일 안내 ↗</a></dd></div>
              <div><dt>국어·수학</dt><dd>선택과목 없이 공통 출제합니다.<br/>국어: 화법과 언어·독서와 작문·문학<br/>수학: 대수·미적분Ⅰ·확률과 통계</dd></div>
              <div><dt>사회·과학탐구</dt><dd>사회·과학탐구 응시자는 통합사회·통합과학에 모두 응시합니다. 과목별 25문항·40분이며, 대학별 성적 반영 방식은 별도로 확인합니다. <a href={sources.structure} target="_blank" rel="noopener noreferrer">교육부 시험 체제 안내 ↗</a></dd></div>
              <div><dt>모의평가·예시문항</dt><dd>하반기 평가원 모의평가는 8월에 실시합니다. 공개 예시문항으로 출제 형식을 확인할 수 있습니다. <a href={sources.examples} target="_blank" rel="noopener noreferrer">교육부 예시문항·일정 안내 ↗</a></dd></div>
            </dl>
          </div>
        </details>

        <div className="g12-admissions-next">
          <p>목표 대학을 확인했다면,<br/><strong>이제 내 성적과 실기를 볼 차례입니다.</strong></p>
          <a className="rt-textlink" href="#priorities">내 성적과 실기 살펴보기 ↓</a>
        </div>
      </div>
    </section>
  );
}
