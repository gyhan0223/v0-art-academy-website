import { CAMP_INFO } from "@/lib/winter-camp";
import { NAVER_BOOKING_WINTER_URL } from "@/lib/contact";
import { Grade11Routine, Grade11Report } from "@/components/winter/Grade11Program";
import WinterAudienceNav from "@/components/winter/WinterAudienceNav";
import Grade11WinterTime from "@/components/winter/Grade11WinterTime";

const foundations = [
  { key: "study", label: "현재 학업 상태", image: "academic-study", alt: "워크북을 살펴보는 학생의 AI 일러스트", title: <>내신과 모의고사,<br/>지금 어디쯤일까?</>, records: "고1 내신 · 모의고사 성적 · 과목별 강약점", detail: "현재 내신과 모의고사 성적을 함께 살펴봅니다. 앞으로의 내신 관리에 필요한 과제와 수능 공부에서 먼저 보완할 기초를 짚습니다." },
  { key: "goal", label: "희망 대학·학과", image: "admissions-strategy", alt: "준비 방향과 할 일을 살펴보는 학생의 AI 일러스트", title: <>희망 대학·학과에는<br/>어떤 준비가 필요할까?</>, records: "관심 대학·학과 · 준비 중인 입시 방향", detail: "관심 대학·학과와 현재 준비 상태를 함께 놓고 봅니다. 내신·수능·실기에서 무엇을 준비해야 할지, 지금부터 확인할 선택지와 과제를 정리합니다. 목표가 정해지지 않았다면 관심부터 이야기합니다." },
  { key: "routine", label: "학교생활·공부 습관", image: "study-routine", alt: "학습 계획과 수행 기록을 함께 확인하는 학생과 지도자의 AI 일러스트", title: <>정한 방향을,<br/>학교생활로 이어가려면?</>, records: "공부 시간 · 과제 수행 · 평소 생활 일과", detail: "고2 학교생활에서 실천할 과제를 정합니다. 내신 시험 준비와 수능 공부, 실기 연습을 어떻게 나누고 이어갈지 평소 일과와 함께 살펴봅니다." },
];

const faqs = [
  { question: "희망 대학이나 전공을 아직 정하지 못했어도 상담할 수 있나요?", answer: "현재 관심과 내신·모의고사 성적부터 함께 살펴봅니다. 대학·학과를 미리 확정하기보다 앞으로의 학교생활과 공부에서 무엇을 준비할지, 어떤 방향을 살펴볼지 이야기합니다." },
  { question: "내신이 기대보다 낮다면 수능 준비에 집중해야 하나요?", answer: "현재 내신만으로 준비 방향을 단정하지 않습니다. 남은 학기, 모의고사 성적, 희망 대학·학과를 함께 보며 내신 관리와 수능 준비에 어떤 우선순위를 둘지 상담합니다." },
  { question: "실기를 처음 시작하거나 기초가 부족해도 괜찮나요?", answer: "현재 경험과 실기 준비 상태를 상담에서 먼저 확인합니다. 준비 종목과 수준에 맞는 수업 구성, 참여 가능 여부는 원장님과 상담해 주세요." },
  { question: "상담은 무료인가요? 별도 결과지를 주나요?", answer: "원장님의 심층 입학 상담은 무료입니다. 상담에서 준비 방향을 구두로 안내하며 별도 결과지나 분석 보고서는 제공하지 않습니다. 수강을 시작하면 상담에서 확인한 보완 사항을 실제 수업에 반영합니다. 수강료는 별도입니다." },
];

export default function Grade11Landing() {
  return <main className="rt g12 g11">
    <WinterAudienceNav current="/winter/grade-11"/>

    <section className="rt-hero"><div className="rt-wrap rt-hero-grid">
      <div className="rt-hero-copy"><p className="rt-kicker">2029학년도 미대입시를 준비하는 예비 고2에게</p><h1 className="g11-hero-title">고2의 첫 단추,<br/><em>희망 대학을 향한<br/>방향부터 잡습니다.</em></h1><p className="rt-lead">내신·모의고사 성적과 희망 대학·학과를 함께 살펴보고,<br/>내신과 수능, 지금 무엇에 힘을 쏟을지 정합니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_hero">무료 심층 상담 예약하기 ↗</a><a className="rt-textlink" href="#winter-time">겨울에 쓸 수 있는 시간 보기 ↓</a></div><p className="rt-hero-note">무료 원장 상담 · 수강 시작 시 상담 내용을 실제 수업에 반영</p></div>
      <figure className="rt-plan-visual rt-hero-illustration g12-hero-illustration"><img src="/images/grade11/grade11-hero.webp" alt="기초 소묘를 연습하며 공부와 실기 준비의 바탕을 쌓는 예비 고2 학생의 일러스트" width={1254} height={1254} fetchPriority="high" decoding="async"/><figcaption><span>고2의 준비, 방향을 정하는 것부터.</span><small>AI 일러스트</small></figcaption></figure>
    </div></section>

    <Grade11WinterTime/>

    <section className="rt-section rt-causes g12-priorities" id="foundations"><div className="rt-wrap">
      <div className="rt-centered"><p className="rt-kicker">02 · 방향을 정하기 위한 세 가지 질문</p><h2>어디를 향해 준비할지,<br/>현재 성적과 목표부터 봅니다.</h2><p className="rt-intro">현재 내신·모의고사 성적과 희망 대학·학과를 함께 봅니다.<br/>남은 고등학교 생활에서 무엇에 힘을 쏟을지 찾습니다.</p></div>
      <div className="rt-concern-grid g12-priority-grid">{foundations.map(item => <details className="rt-concern g12-priority-card" key={item.key}><summary><div className="rt-concern-visual"><img src={`/images/retake/${item.image}.webp`} alt={item.alt} width={1200} height={800} loading="lazy" decoding="async"/></div><div className="g12-priority-label">{item.label}</div><div className="rt-concern-title"><h3>{item.title}</h3><span className="rt-expand" aria-hidden="true">+</span></div><p className="rt-concern-foot">{item.records}</p></summary><div className="rt-concern-body"><p>{item.detail}</p></div></details>)}</div><p className="rt-illustration-caption">이해를 돕기 위한 AI 일러스트입니다.</p>
    </div></section>

    <section className="rt-section rt-method g12-direction" id="direction"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">03 · 하루라도 일찍 정할 준비의 방향</p><h2>방향을 일찍 잡을수록,<br/><em>오늘 해야 할 일이 선명해집니다.</em></h2></div><p className="rt-intro">고2의 내신을 어떻게 챙길지, 수능 공부는 어디서 시작할지.<br/>현재 성적과 목표에 맞춰 준비의 우선순위를 정합니다.</p></div>
      <div className="rt-method-row g12-direction-row"><figure className="rt-method-material rt-consult-illustration"><img src="/images/retake/consultation.webp" alt="학생과 지도자가 성적과 준비 기록을 함께 살펴보는 AI 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>현재 준비 상태와 필요한 과제를 함께 살펴보는 장면 · AI 일러스트</figcaption></figure><div className="rt-method-copy"><h3>내신 관리부터 수능 준비까지,<br/>지금 필요한 전략을.</h3><p>무료 원장 심층 상담에서 내신·모의고사 성적과 희망 대학·학과를 함께 살펴봅니다. 앞으로의 학교생활에서 챙길 과제와 수능 준비의 시작점을 짚습니다.</p><p>내신 보완이 필요하다면 남은 학기의 관리 계획을, 수능 공부가 부족하다면 과목별 준비 순서를 함께 살펴봅니다. 성적 한 번으로 방향을 단정하지 않고 현재 상황과 목표를 함께 봅니다.</p><p>학생도 왜 이 준비가 필요한지 이해하도록 설명합니다. 수강을 시작하면 상담에서 정한 우선 과제를 학과 수업과 실기 훈련에 반영합니다.</p><a className="rt-textlink" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_direction">내신·수능 준비 방향 무료 상담하기 ↗</a></div></div>
      <ol className="g12-preparation-path"><li><span>현재 위치를 확인하고</span><strong>내신·모의고사·희망 대학 함께 보기</strong></li><li><span>준비 방향을 정하고</span><strong>학교생활·내신·수능의 우선순위 잡기</strong></li><li><span>수강을 시작하면</span><strong>겨울 일과에서 실천하고 점검하기</strong></li></ol>
    </div></section>

    <section className="rt-section rt-spaces g12-habits" id="habits"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">04 · 이해한 방향을 실제 행동으로</p><h2>고2의 1년을 향한 방향,<br/>겨울의 하루부터 연습합니다.</h2></div><p className="rt-intro">정한 방향을 실제 행동으로 옮겨보고,<br/>새 학기에도 이어갈 준비 방식을 익힙니다.</p></div>
      <div className="g12-habit-layout"><figure className="g12-habit-illustration"><img src="/images/retake/study-routine.webp" alt="학생과 지도자가 수행한 과제와 다음 계획을 확인하는 AI 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>학습 계획과 수행한 과제를 함께 살펴보는 장면 · AI 일러스트</figcaption></figure><div className="g12-habit-list"><div><span>UNDERSTAND</span><h3>내가 할 과제를 알고</h3><p>정한 준비 방향에 맞춰 오늘 해야 할 공부와 실기 연습, 그 과제가 필요한 이유를 확인합니다.</p></div><div><span>PRACTICE</span><h3>정한 시간에 직접 해보고</h3><p>필요한 과제를 수업·자습·실기 일과에 담아 실행합니다.</p></div><div><span>CHECK</span><h3>한 일과 남은 일을 확인합니다</h3><p>수행 기록과 피드백을 돌아보고 다음에 보완할 과제를 정합니다.</p></div></div></div>
      <div className="g11-continuity" aria-label="겨울에서 고2의 1년으로 이어갈 준비"><div className="g11-continuity-heading"><span>고2의 1년을 향한 첫 단추</span><p>지금 필요한 준비를 이해하고,<br/><strong>새 학기에도 이어갈 습관을 연습합니다.</strong></p></div><ol><li><span>현재 상태</span><strong>목표에 맞는 방향을 정하고</strong><p>내신·모의고사·희망 대학 함께 보기</p></li><li><span>겨울의 하루</span><strong>정한 방향을 실행하고</strong><p>수업·자습·실기 일과에서 직접 연습</p></li><li><span>고2의 1년</span><strong>일상으로 이어가기</strong><p>익힌 준비 방식을 새 학기에도 이어가는 것이 목표</p></li></ol></div>
    </div></section>

    <Grade11Routine/>
    <Grade11Report/>

    <section className="rt-section rt-camp g12-camp" id="camp"><div className="rt-wrap">
      <div className="rt-camp-layout"><div><p className="rt-kicker">07 · 이해한 방향을 실행할 8주</p><h2>2027 모다고<br/><em>윈터스쿨.</em></h2><p className="rt-intro">2029학년도 미대입시를 준비하는 예비 고2가 참여하는<br/>홍대 본원 기숙 과정입니다.</p><div className="rt-camp-fit"><h3>이런 준비가 필요하다면 함께 살펴보세요.</h3><p>내신 관리와 수능 준비의 우선순위를 정하고 싶은 경우<br/>희망 대학·학과를 향한 준비 방향이 필요한 경우<br/>정한 계획을 실제 공부 습관으로 이어가고 싶은 경우</p></div><a className="rt-textlink g12-camp-contact" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_camp">현재 준비에 맞는지 무료 상담하기 ↗</a></div><div className="rt-camp-facts"><dl><div><dt>기간</dt><dd>{CAMP_INFO.period}</dd></div><div><dt>장소</dt><dd>{CAMP_INFO.venueName}</dd></div><div><dt>대상</dt><dd>{CAMP_INFO.target}</dd></div><div><dt>구성</dt><dd>{CAMP_INFO.tuitionIncludes}</dd></div><div><dt>비용</dt><dd>{CAMP_INFO.tuition}<a href="/tuition">교습비 고지 확인 ↗</a></dd></div></dl><p className="rt-micro">현재 성적과 실기 경험에 맞는 수업 구성은 상담에서 확인합니다.</p><div className="rt-detail-links"><a href="/winter/teachers">강사진 보기 ↗</a><a href="/winter">전체 과정 보기 ↗</a></div></div></div>
      <div className="g12-faq"><h3>예비 고2 상담 전에 궁금한 점</h3>{faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    </div></section>

    <section className="rt-section rt-consult" id="consult"><div className="rt-wrap rt-consult-layout"><div><div className="rt-director rt-director-type"><span className="rt-director-seal" aria-hidden="true">모다고</span><div><strong>한동희 원장</strong><span>모두다른고양이 미술학원</span></div></div><p className="rt-kicker">08 · 예비 고2 무료 원장 상담</p><h2>고2의 첫 단추,<br/><em>목표에 맞는 방향부터.</em></h2><p className="rt-intro">현재 성적과 희망 대학·학과를 바탕으로,<br/>앞으로의 학교생활과 입시 준비 방향을 함께 정합니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_consult">무료 심층 상담 예약하기 ↗</a><a className="rt-textlink" href={CAMP_INFO.phoneTel} data-winter-placement="grade11_consult">전화 {CAMP_INFO.phone}</a></div><p className="rt-micro">상담에서 짚고, 수강 후 실제 수업에서 보완합니다.<br/>상담은 무료이며 수강료는 별도입니다.</p></div><div className="rt-consult-prep"><span className="rt-card-eyebrow">상담 전에 준비하면 좋은 자료</span><div><span>01</span><p>최근 내신·모의고사 성적표</p></div><div><span>02</span><p>실기 준비 경험 · 있다면 연습한 그림</p></div><div><span>03</span><p>관심 있는 대학·학과와 궁금한 점</p></div><div><span>04</span><p>평소 공부·실기·생활 일과</p></div><p className="rt-micro">목표가 정해지지 않았어도, 갖고 있는 자료부터 살펴봅니다.<br/>예약 시 예비 고2 상담임을 알려주세요.</p></div></div></section>

    <footer className="rt-footer"><div className="rt-wrap"><strong>모두다른고양이 미술학원</strong><p>{CAMP_INFO.address}<br/>{CAMP_INFO.phone}</p><a href="/winter/grade-12">예비 고3 겨울 준비 ↗</a><a href="/winter/retake">N수생 겨울 준비 ↗</a><a href="#">맨 위로 ↑</a></div></footer>
    <div className="rt-mobile-action"><a href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_sticky">무료 심층 상담 예약하기 ↗</a></div>
  </main>;
}
