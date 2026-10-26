import { CAMP_INFO } from "@/lib/winter-camp";
import { REPORT_SAMPLE } from "@/lib/winter-report";
import { WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE } from "@/lib/winter-schedule";
import { NAVER_BOOKING_WINTER_URL } from "@/lib/contact";
import { RetakeExampleCase, RetakeExampleInterview, RetakeWinterFoundation } from "@/components/winter/RetakeExampleCase";
import WinterAudienceNav from "@/components/winter/WinterAudienceNav";
import Exam2028Preparation from "@/components/winter/Exam2028Preparation";

function Needed({ children, className = "" }: { children: string; className?: string }) {
  return <div className={`rt-needed ${className}`}><span className="rt-needed-label">필요한 자료</span><p>(필요한 자료: {children})</p></div>;
}

const concerns = [
  { id: "study", image: "academic-study", alt: "학습 내용을 살펴보는 학생을 표현한 일러스트", n: "01", title: "학과가 발목을 잡았다면", question: "공부량보다 먼저, 막힌 지점을 봅니다.", body: "과목별 성적과 학습 기록을 함께 보고, 어떤 내용과 문제 유형을 보완할지 정해야 합니다.", material: "이름을 가린 실제 성적표·오답 분석지. 취약 과목과 유형을 짚은 해설 표시", foot: "살펴볼 기록 · 성적표 / 오답 / 학습 시간", visual: "paper" },
  { id: "art", image: "art-practice", alt: "기하 형태의 정물을 그리는 학생을 표현한 일러스트", n: "02", title: "실기 결과가 아쉬웠다면", question: "목표 대학에 맞는 훈련이었는지 봅니다.", body: "준비한 종목과 실제 작품, 제한 시간 안의 수행을 살펴보고 필요한 훈련을 구체화합니다.", material: "같은 학생의 실기작 전후 사진 2장과 원장님 피드백. 제작일·준비 기간 표기", foot: "살펴볼 기록 · 실기작 / 종목 / 피드백", visual: "art" },
  { id: "strategy", image: "admissions-strategy", alt: "여러 준비 방향을 비교하는 학생을 표현한 일러스트", n: "03", title: "지원 전략이 아쉬웠다면", question: "성적·실기·전형을 함께 놓고 봅니다.", body: "지난 지원 조합과 대학별 반영 방식을 비교해, 준비의 문제와 지원 판단의 문제를 구분합니다.", material: "익명 처리한 실제 가·나·다군 지원 검토표와 대학별 판단 근거", foot: "살펴볼 기록 · 지원 조합 / 전형 / 결과", visual: "plan" },
  { id: "routine", image: "study-routine", alt: "학생과 멘토가 학습 계획을 확인하는 일러스트", n: "04", title: "계획을 지키기 어려웠다면", question: "다짐을 지킬 수 있는 일과가 필요합니다.", body: "계획과 실제 하루를 비교하고, 수업·자습·생활에서 반복해서 어려웠던 부분을 찾아봅니다.", material: "학생이 앉아 공부하고 옆에서 선생님이 플래너를 함께 확인하는 일러스트", foot: "살펴볼 기록 · 하루 일과 / 과제 / 출결", visual: "routine" },
];

export default function RetakeLanding() {
  return (
    <main className="rt">
      <WinterAudienceNav current="/winter/retake"/>
      <section className="rt-hero">
        <div className="rt-wrap rt-hero-grid">
          <div className="rt-hero-copy"><p className="rt-kicker">2028학년도 미대입시를 준비하는 N수생에게</p><h1 className="rt-counsel-title">다시 선택한 1년,<br/><em>이번에는 후회 없이.</em></h1><p className="rt-lead">지난 준비의 아쉬움을 짚고,<br/>달라지는 2028 수능에 맞춰 다시 준비합니다.<br/>모다고의 겨울 8주에서, 수능까지 이어갈 공부와 습관을 시작합니다.</p><div className="rt-actions"><a className="rt-button" href="#exam-2028">이번 재도전, 무엇이 달라야 할까요? ↓</a></div><p className="rt-hero-note">2028학년도 수능 · 2027년 11월 18일 시행</p></div>
          <figure className="rt-plan-visual rt-hero-illustration" id="preparation-plan">
            <img src="/images/retake/hero-new-start-glasses.webp" alt="얇은 안경과 오렌지 니트를 착용한 N수생이 스케치북을 살펴보며 다시 준비하는 일러스트" width={1254} height={1254} fetchPriority="high" decoding="async"/>
            <figcaption><span>다시 도전할 1년, 겨울 8주부터.</span></figcaption>
          </figure>
        </div>
      </section>
      <Exam2028Preparation audience="retake"/>
      <section className="rt-section rt-evidence" id="records"><div className="rt-wrap">
        <div className="rt-section-heading"><div><p className="rt-kicker">01 · 다시 준비하기 전, 살펴볼 장면</p><h2>올라간 성적을,<br/>수능까지 이어가려면.</h2></div><p className="rt-intro">성적의 변화와 함께,<br/>준비를 끝까지 이어가는 방식도 살펴봅니다.</p></div>
        <div className="rt-case-layout">
          <RetakeExampleCase/>
          <div className="rt-side-cases"><article className="rt-small-case"><span className="rt-card-eyebrow">실기 준비의 변화</span><div className="rt-art-pair"><div>이전 작품</div><span aria-hidden="true">↗</span><div>이후 작품</div></div><Needed>공개 동의를 받은 N수생 실기작 2장, 제작일과 지도 전후 해설</Needed></article><RetakeExampleInterview/></div>
        </div>
        <RetakeWinterFoundation/>
      </div></section>
      <section className="rt-section rt-causes" id="causes"><div className="rt-wrap">
        <div className="rt-centered"><p className="rt-kicker">02 · 지난 준비를 돌아보는 네 가지 질문</p><h2>아쉬웠던 이유가 다르면,<br/>다음 준비도 달라져야 합니다.</h2><p className="rt-intro">현재 상황에 가까운 항목을 선택해 보세요.<br/>여러 항목이 함께 해당될 수 있습니다.</p></div>
        <div className="rt-concern-grid">{concerns.map(c => <details key={c.id} className={`rt-concern rt-concern-${c.visual}`}><summary><div className="rt-concern-visual"><img src={`/images/retake/${c.image}.webp`} alt={c.alt} width={1200} height={800} loading="lazy" decoding="async"/><span className="rt-large-number" aria-hidden="true">{c.n}</span></div><div className="rt-concern-title"><h3>{c.title}</h3><span className="rt-expand" aria-hidden="true">+</span></div><p className="rt-concern-foot">{c.foot}</p></summary><div className="rt-concern-body"><h4>{c.question}</h4><p>{c.body}</p></div></details>)}</div>
        <p className="rt-bridge">의지가 부족했다고 결론내리기 전에,<br/><strong>어디에서 준비가 어긋났는지</strong> 함께 살펴봅니다.</p>
      </div></section>
      <section className="rt-section rt-method" id="method"><div className="rt-wrap">
        <div className="rt-section-heading"><div><p className="rt-kicker">03 · 방법을 바꾸는 과정</p><h2>“더 열심히”가<br/>구체적인 하루가 되도록.</h2></div><p className="rt-intro">준비 방향을 정할 때 함께 확인할 세 가지.<br/>상태를 보고, 시간을 나누고, 기록을 돌아봅니다.</p></div>
        <div className="rt-method-story"><article className="rt-method-row"><div className="rt-method-copy"><span className="rt-step">A</span><h3>현재 상태를<br/>정확하게 보기.</h3><p>성적표와 실기 준비 기록을 함께 살펴보고, 우선 보완할 지점을 짚습니다.</p><span className="rt-method-caption">점검할 것 · 학과 / 실기 / 목표</span></div><figure className="rt-method-material rt-consult-illustration"><img src="/images/retake/consultation.webp" alt="학생과 지도자가 학습 자료와 실기 포트폴리오를 함께 살펴보는 상담 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>준비 방향을 함께 살펴보는 상담</figcaption></figure></article>
        <article className="rt-method-row rt-method-reverse"><div className="rt-method-copy"><span className="rt-step">B</span><h3>계획을<br/>실행할 시간으로 바꾸기.</h3><p>상담에서 확인한 보완 사항을 학과 공부와 실기 훈련에 반영하고, 실제로 지킬 수 있는 일과에 배치합니다.</p><a className="rt-textlink" href="#routine">모다고의 하루 일과 보기 ↓</a></div><div className="rt-allocation"><div className="rt-allocation-head"><span>일주일의 준비 구조</span><span>2027 윈터스쿨 안내 기준</span></div><div className="rt-week-strip"><div><span>월</span><b>학과</b></div><div><span>화</span><b>학과</b></div><div><span>수</span><b>학과</b></div><div><span>목</span><b>학과</b></div><div><span>금</span><b>학과</b></div><div className="rt-week-art"><span>토</span><b>실기</b></div><div className="rt-week-art"><span>일</span><b>실기</b></div></div><div className="rt-allocation-notes"><p><strong>평일</strong>국어·영어·탐구 수업과 자기주도 학습</p><p><strong>주말</strong>대학교 유형 실기와 피드백</p></div></div></article>
        <article className="rt-method-row"><div className="rt-method-copy"><span className="rt-step">C</span><h3>실행한 기록으로<br/>다음 계획을 정하기.</h3><p>학습 기록과 평가, 피드백을 연결해 유지할 방법과 보완할 방법을 정합니다.</p><span className="rt-method-caption">기록 → 해석 → 다음 과제</span></div><div className="rt-feedback-board"><div><span>학습 기록</span><p>어떤 과제를<br/>수행했는지</p></div><b aria-hidden="true">→</b><div><span>담당 강사의 해석</span><p>어디에서<br/>어려웠는지</p></div><b aria-hidden="true">→</b><div><span>다음 계획</span><p>무엇을<br/>보완할지</p></div><Needed>실제 오답 첨삭·과제 피드백을 익명 처리한 자료</Needed></div></article></div>
      </div></section>
      <section className="rt-section rt-report-section" id="report"><div className="rt-wrap rt-report-layout">
        <div className="rt-report-copy"><p className="rt-kicker">04 · 학부모에게 보이는 준비</p><h2>“잘하고 있어요”보다,<br/><em>확인할 수 있는 기록.</em></h2><p className="rt-intro">모다고 윈터스쿨은 격주 리포트로<br/>학습·생활 기록과 다음 계획을 안내합니다.</p><div className="rt-report-annotations"><p><span>01</span><strong>시험·과제 기록</strong><small>어떤 시험과 과제를 수행했는지</small></p><p><span>02</span><strong>출결·생활 확인</strong><small>일과와 학습 참여를 어떻게 지켰는지</small></p><p><span>03</span><strong>선생님의 판단</strong><small>다음 기간에 무엇을 보완할지</small></p></div><p className="rt-micro">오른쪽은 기존 홈페이지의 운영 양식 예시를 재구성했습니다. 실제 학생 성적이나 발송 사례가 아닙니다.</p></div>
        <div className="rt-report-sheet"><div className="rt-report-sheet-top"><span>MODAGO / LEARNING REPORT</span><span>운영 양식 예시</span></div><h3>{REPORT_SAMPLE.title}</h3><p className="rt-report-sub">이번 2주 기록 → 담당 강사의 해석 → 다음 2주 계획</p><div className="rt-report-fields"><span>학생 __________</span><span>기록 기간 __________</span></div><div className="rt-report-blocks">{REPORT_SAMPLE.sections.map((s,i)=><section key={s.title}><h4><span>{String(i+1).padStart(2,"0")}</span>{s.title}</h4>{s.items.map(item=><div className="rt-report-line" key={item}><p>{item}</p><span aria-hidden="true"/></div>)}</section>)}</div><p className="rt-report-footnote">{REPORT_SAMPLE.note}</p><Needed>개인정보를 가린 실제 발송 리포트 1건 확보 시 교체</Needed></div>
      </div></section>
      <section className="rt-section rt-routine" id="routine"><div className="rt-wrap">
        <div className="rt-section-heading"><div><p className="rt-kicker">05 · 겨울에 실행하고 점검하기</p><h2>평일에는 학과를,<br/>주말에는 실기를.</h2></div><p className="rt-intro">새로운 준비 방식을 8주의 일과 안에서 실천합니다.<br/>아래는 2027 윈터스쿨 안내 시간표입니다.</p></div>
        <div className="rt-schedule-grid">{[{name:"월 — 금",caption:"학과 수업과 자기주도 학습",blocks:WEEKDAY_SCHEDULE},{name:"토 — 일",caption:"대학교 유형 실기",blocks:WEEKEND_SCHEDULE}].map(day=><div className="rt-day" key={day.name}><header><h3>{day.name}</h3><p>{day.caption}</p></header><div className="rt-day-blocks">{day.blocks.map(b=><div className={`rt-time rt-time-${b.type}`} key={b.start}><time>{b.start}<span>— {b.end}</span></time><div><strong>{b.label}</strong>{b.note&&<small>{b.note}</small>}</div></div>)}</div></div>)}</div>
        <div className="rt-eight-weeks"><div><span className="rt-week-node">1</span><h3>1주차 · 진단</h3><p>국어·영어·탐구의<br/>현재 상태 확인</p></div><div><span className="rt-week-node rt-week-long">2 — 7</span><h3>과정 중 · 점검</h3><p>학습 수행과 평가 확인<br/>격주 학부모 리포트</p></div><div><span className="rt-week-node">8</span><h3>8주차 · 재측정</h3><p>변화와 남은 과제를<br/>다음 준비에 연결</p></div></div>
        <p className="rt-micro rt-centered">학생별 변화와 이후 입시 결과는 다릅니다. 주말 실기 구성과 학과 수업이 현재 준비 수준에 맞는지 상담에서 확인합니다.</p>
      </div></section>
      <section className="rt-section rt-spaces" id="spaces"><div className="rt-wrap">
        <div className="rt-section-heading"><div><p className="rt-kicker">06 · 준비를 이어가는 생활</p><h2>잘 공부하는 하루는,<br/>생활에서 이어집니다.</h2></div><p className="rt-intro">공부와 실기, 식사와 휴식이<br/>하나의 일과 안에서 연결됩니다.</p></div>
        <div className="rt-life-composition"><div className="rt-life-clock"><span className="rt-life-eyebrow">하루의 리듬</span><div className="rt-clock-ring"><span>06:00</span><strong>일어나고,<br/>배우고,<br/>회복합니다.</strong><span>22:00</span></div><p>2027 윈터스쿨 안내 시간표 기준<br/>06:00 기상 · 22:00 취침</p></div><div className="rt-life-flow"><article><span>LEARN</span><h3>수업에서 배우고</h3><p>평일 학과 · 주말 대학교 유형 실기</p><div className="rt-life-bars" aria-hidden="true"><i/><i/><i/><i/></div></article><article><span>PRACTICE</span><h3>내 공부로 정리하고</h3><p>학과 클리닉 · 자기주도 학습 · 평가</p><div className="rt-life-paper" aria-hidden="true"><i/><i/><i/></div></article><article><span>RECOVER</span><h3>식사하고, 쉬어갑니다</h3><p>기숙 · 식사 · 일과에 맞춘 생활</p><div className="rt-life-moon" aria-hidden="true"/></article></div></div>
        <p className="rt-micro rt-life-note">생활관 구성, 식사 제공 방식과 생활 운영은 상담에서 함께 확인하실 수 있습니다.</p>
      </div></section>
      <section className="rt-section rt-camp" id="camp"><div className="rt-wrap rt-camp-layout"><div><p className="rt-kicker">07 · 실행을 돕는 선택지</p><h2>2027 모다고<br/><em>윈터스쿨.</em></h2><p className="rt-intro">학과·실기·생활을 함께 준비하는<br/>홍대 본원 8주 기숙 과정입니다.</p><div className="rt-camp-fit"><h3>이런 필요가 있다면 함께 검토해 보세요.</h3><p>학과 공부 시간을 확보하면서 실기를 이어가고 싶은 학생<br/>규칙적인 일과와 학습 점검이 필요한 학생<br/>기숙 생활 방식이 자신에게 맞는지 확인하고 싶은 학생</p></div></div><div className="rt-camp-facts"><dl><div><dt>기간</dt><dd>{CAMP_INFO.period}</dd></div><div><dt>장소</dt><dd>{CAMP_INFO.venueName}</dd></div><div><dt>구성</dt><dd>{CAMP_INFO.tuitionIncludes}</dd></div><div><dt>비용</dt><dd>{CAMP_INFO.tuition}<a href="/tuition">교습비 고지 확인 ↗</a></dd></div></dl><p className="rt-micro">현재 모집 안내의 대상은 ‘{CAMP_INFO.target}’입니다. N수생의 참여 가능 여부와 수업 적합성은 개별 상담에서 확인합니다.</p><div className="rt-detail-links"><a href="/winter/teachers">강사진 보기 ↗</a><a href="/winter">전체 과정 보기 ↗</a></div></div></div></section>
      <section className="rt-section rt-consult" id="consult"><div className="rt-wrap rt-consult-layout"><div><div className="rt-director rt-director-type"><span className="rt-director-seal" aria-hidden="true">모다고</span><div><strong>한동희 원장</strong><span>모두다른고양이 미술학원</span></div></div><p className="rt-kicker">08 · 원장님과 함께 정리할 시간</p><h2>상담에서 짚고,<br/><em>실제 수업에서 보완합니다.</em></h2><p className="rt-intro">원장님과의 심층 상담으로 지난 준비를 살펴봅니다.<br/>수강을 시작하면 상담 내용을 학과 수업과 실기 지도에 반영합니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="retake_consult">원장 심층 상담 예약하기 ↗</a><a className="rt-textlink" href={CAMP_INFO.phoneTel} data-winter-placement="retake_consult">전화 {CAMP_INFO.phone}</a></div><p className="rt-micro">상담 비용은 없으며, 수강료는 별도입니다.<br/>기존 윈터스쿨 네이버 예약으로 연결됩니다.</p></div><div className="rt-consult-prep"><span className="rt-card-eyebrow">상담 전에 준비하면 좋은 자료</span><div><span>01</span><p>최근 성적표</p></div><div><span>02</span><p>목표 대학과 전공</p></div><div><span>03</span><p>실기 종목·준비 기간·작품</p></div><div><span>04</span><p>이전 지원 내역과 궁금한 점</p></div><p className="rt-micro">갖고 있는 자료만 준비해 주세요.<br/>예약 시 N수생 상담임을 알려주시면 됩니다.</p></div></div></section>
      <footer className="rt-footer"><div className="rt-wrap"><strong>모두다른고양이 미술학원</strong><p>{CAMP_INFO.address}<br/>{CAMP_INFO.phone}</p><a href="#">맨 위로 ↑</a></div></footer>
      <div className="rt-mobile-action" data-show-after="method"><a href={NAVER_BOOKING_WINTER_URL} data-winter-placement="retake_sticky">원장 심층 상담 예약하기 ↗</a></div>
    </main>
  );
}
