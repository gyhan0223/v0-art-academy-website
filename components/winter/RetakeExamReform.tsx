import { NAVER_BOOKING_WINTER_URL } from "@/lib/contact";

const sources = {
  structure: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=102385&lev=0&m=020402",
  examples: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103113&lev=0&m=020402",
  date: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103512&lev=0",
  participation: "https://www.korea.kr/news/policyNewsView.do?newsId=148943916",
};

const preparationExample = [
  { weeks: "1", title: "새 범위 진단", detail: "공개 예시문항으로 낯선 단원과 문항을 확인합니다.", output: "이어갈 공부 · 새로 채울 내용" },
  { weeks: "2–3", title: "기초를 다시 연결", detail: "이전 학습과 새 범위를 대조하고, 보완할 개념부터 정리합니다.", output: "개념 정리 · 단원별 연습" },
  { weeks: "4–6", title: "문항에 적용", detail: "통합사회·통합과학의 자료 해석과 문제 풀이를 연습합니다.", output: "공개 예시문항 · 오답 점검" },
  { weeks: "7–8", title: "시간 안에 점검", detail: "탐구 과목별 25문항·40분 형식으로 연습하고 다시 점검합니다.", output: "시간 배분 · 다음 학습 계획" },
];

export default function RetakeExamReform() {
  return (
    <section className="rt-section rt-exam-reform" id="exam-2028" aria-labelledby="rt-reform-title">
      <div className="rt-wrap">
        <div className="rt-section-heading">
          <div>
            <p className="rt-kicker">2028 수능 · 바뀐 기준부터 확인</p>
            <h2 id="rt-reform-title">같은 공부를 반복하기 전,<br/><em>무엇이 달라지는지 봅니다.</em></h2>
          </div>
          <p className="rt-intro">이전 공부에서 이어갈 부분과 새로 채울 부분.<br/>바뀐 시험과 희망 미대의 전형을 함께 봐야 합니다.</p>
        </div>

        <div className="rt-reform-changes">
          <article className="rt-reform-card">
            <span className="rt-card-eyebrow">국어 · 수학</span>
            <div className="rt-reform-diagram" aria-label="국어·수학 선택과목 폐지, 공통 출제">
              <span className="rt-reform-before">공통 + 선택</span><span className="rt-reform-arrow" aria-hidden="true">↓</span><strong>공통 출제</strong>
            </div>
            <h3>선택과목 없이,<br/>공통 범위로 출제됩니다.</h3>
            <p>국어·수학의 선택과목이 없어집니다. 이전에 공부한 내용과 새 범위를 비교해 준비할 부분을 정합니다.</p>
          </article>
          <article className="rt-reform-card">
            <span className="rt-card-eyebrow">사회 · 과학탐구</span>
            <div className="rt-reform-diagram" aria-label="사회·과학탐구 선택자는 통합사회와 통합과학 모두 응시">
              <span className="rt-reform-before">선택한 탐구 과목</span><span className="rt-reform-arrow" aria-hidden="true">↓</span><strong className="rt-reform-subjects"><span>통합사회</span><i aria-hidden="true">+</i><span>통합과학</span></strong>
            </div>
            <h3>사회와 과학,<br/>두 과목을 함께.</h3>
            <p>사회·과학탐구를 선택하면 두 과목 모두 응시합니다. 각각 25문항·40분으로 준비해야 합니다.</p>
          </article>
          <article className="rt-reform-card">
            <span className="rt-card-eyebrow">하반기 평가원 모의평가</span>
            <div className="rt-reform-diagram rt-reform-calendar" aria-label="하반기 모의평가가 9월에서 8월로 변경">
              <span className="rt-reform-before">9월</span><span className="rt-reform-arrow" aria-hidden="true">↓</span><strong>8월</strong>
            </div>
            <h3>점검 시점도,<br/>한 달 먼저.</h3>
            <p>하반기 모의평가가 8월로 바뀝니다. 이에 맞춰 개념 정리와 실전 점검의 순서도 다시 잡습니다.</p>
          </article>
        </div>

        <details className="rt-reform-official">
          <summary>공식 변경사항과 출처 확인<span aria-hidden="true">+</span></summary>
          <div>
            <dl>
              <div><dt>시행일</dt><dd>2028학년도 수능은 2027년 11월 18일 시행됩니다. <a href={sources.date} target="_blank" rel="noopener noreferrer">교육부 시행일 안내 ↗</a></dd></div>
              <div><dt>공통 출제 범위</dt><dd>국어: 화법과 언어·독서와 작문·문학<br/>수학: 대수·미적분Ⅰ·확률과 통계</dd></div>
              <div><dt>응시와 대학 반영</dt><dd>한국사 외 응시 영역은 선택할 수 있습니다. 사회·과학탐구 선택자는 통합사회·통합과학에 모두 응시하며, 대학별 성적 반영은 해당 연도 전형·모집단위별로 확인합니다. <a href={sources.participation} target="_blank" rel="noopener noreferrer">응시 영역 선택 기준 ↗</a> · <a href={sources.structure} target="_blank" rel="noopener noreferrer">시험·점수 체제 안내 ↗</a></dd></div>
              <div><dt>예시문항·모의평가</dt><dd>국어·수학·통합사회·통합과학 예시문항이 공개됐으며, 하반기 평가원 모의평가는 9월에서 8월로 변경됩니다. <a href={sources.examples} target="_blank" rel="noopener noreferrer">교육부 예시문항·일정 안내 ↗</a></dd></div>
            </dl>
            <p>교육부 공식 발표 기준 · 2026.10.26 확인</p>
          </div>
        </details>

        <div className="rt-reform-readiness">
          <div className="rt-reform-readiness-heading">
            <div><p className="rt-kicker">모다고가 준비를 연결하는 방식</p><h3>바뀐 기준을 확인하고,<br/><em>수업과 하루의 일과로 연결합니다.</em></h3></div>
            <p>심층 상담으로 현재 상태와 목표를 짚습니다.<br/>수강 후에는 수업·클리닉·점검의 흐름에 준비를 담습니다.</p>
          </div>
          <div className="rt-reform-proof-links" aria-label="모다고의 기존 운영 안내">
            <a href="/winter/teachers"><span>가르치는 사람</span><strong>과목별 강사진·지도 방식 ↗</strong><small>국어 전국연합모의고사 출제위원·사회탐구 교재 저술 경력 공개</small></a>
            <a href="#routine"><span>실행하는 시간</span><strong>학과 수업·클리닉·자습 ↓</strong><small>평일 학과 · 주말 대학 유형 실기</small></a>
            <a href="#report"><span>준비를 살피는 기록</span><strong>격주 학습·생활 리포트 ↓</strong><small>학습 기록 · 담당 강사 해석 · 다음 계획</small></a>
          </div>

          <details className="rt-reform-example" open>
            <summary><span><small>수업 설계 예시</small><strong>2028 대비, 겨울 8주를 이렇게 나눕니다.</strong></span><span className="rt-reform-toggle" aria-hidden="true">+</span></summary>
            <div className="rt-reform-example-body">
              <p className="rt-reform-example-note">개편 대비 흐름을 보여주는 제안 예시입니다. 확정된 수업 편성·강사·교재 안내는 아닙니다.</p>
              <ol className="rt-reform-plan">
                {preparationExample.map(step => <li key={step.weeks}><span className="rt-reform-week"><b>{step.weeks}</b>주</span><h4>{step.title}</h4><p>{step.detail}</p><small>{step.output}</small></li>)}
              </ol>
              <div className="rt-reform-material-example">
                <div><span>자료 구성 예시</span><strong>이전 학습 → 새 출제 범위 → 이번 주 준비</strong><p>국어 · 기존 독서·문학 학습과 새 화법·언어 범위를 대조<br/>탐구 · 통합사회·통합과학의 익숙한 개념과 낯선 단원을 구분<br/>목표 미대 · 응시 영역과 실제 반영 기준을 별도로 확인</p></div>
                <p className="rt-reform-needed">(필요한 자료: 통합사회·통합과학 담당 강사, 확정 주차별 수업계획·교재, 개편형 진단·평가 문항)</p>
              </div>
            </div>
          </details>
          <div className="rt-reform-contact"><p>지난 공부에서 이어갈 것과 새로 준비할 것,<br/><strong>현재 상태에 맞춰 함께 정합니다.</strong></p><a className="rt-textlink" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="retake_reform">2028학년도 준비 상담하기 ↗</a></div>
        </div>
      </div>
    </section>
  );
}
