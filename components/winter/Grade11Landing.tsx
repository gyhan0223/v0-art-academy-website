import { CAMP_INFO } from "@/lib/winter-camp";
import { NAVER_BOOKING_WINTER_URL } from "@/lib/contact";
import { Grade11Routine, Grade11Report } from "@/components/winter/Grade11Program";
import WinterAudienceNav from "@/components/winter/WinterAudienceNav";
import Grade11WinterTime from "@/components/winter/Grade11WinterTime";

const foundations = [
  { key: "study", label: "지금의 공부", image: "academic-study", alt: "워크북을 살펴보는 학생의 AI 일러스트", title: <>내가 막히는 공부는<br/>어디일까?</>, records: "최근 성적표 · 오답 · 공부한 기록", detail: "어떤 개념과 문제에서 막혔는지 기록을 놓고 함께 살펴봅니다. 학생이 보완할 부분과 그 이유를 이해하도록 돕습니다." },
  { key: "art", label: "지금의 실기", image: "art-practice", alt: "기초 소묘를 연습하는 학생의 AI 일러스트", title: <>내 그림에서 먼저<br/>고쳐야 할 부분은?</>, records: "최근 실기작 · 연습 과정 · 받은 피드백", detail: "현재 작품과 연습 과정을 함께 보며 어떤 기초 훈련이 필요한지 짚습니다. 처음 준비한다면 지금까지의 경험과 관심부터 살펴봅니다." },
  { key: "routine", label: "지금의 하루", image: "admissions-strategy", alt: "준비 방향과 할 일을 살펴보는 학생의 AI 일러스트", title: <>계획과 실제 하루는<br/>얼마나 같을까?</>, records: "주간 일과 · 과제 수행 · 연습 시간", detail: "공부와 실기에 실제로 쓰는 시간, 계획한 과제와 수행한 과제를 비교합니다. 준비를 이어가기 위해 바꿔볼 부분을 함께 찾습니다." },
];

const faqs = [
  { question: "희망 대학이나 전공을 아직 정하지 못했어도 상담할 수 있나요?", answer: "현재 관심과 준비 상황부터 함께 살펴봅니다. 대학·전공을 미리 확정하기보다, 성적과 실기 경험을 바탕으로 지금 보완할 부분과 앞으로 살펴볼 방향을 이야기합니다." },
  { question: "실기를 처음 시작하거나 기초가 부족해도 괜찮나요?", answer: "현재 경험과 실기 준비 상태를 상담에서 먼저 확인합니다. 준비 종목과 수준에 맞는 수업 구성, 참여 가능 여부는 원장님과 상담해 주세요." },
  { question: "상담은 무료인가요? 별도 결과지를 주나요?", answer: "원장님의 심층 입학 상담은 무료입니다. 상담에서 준비 방향을 구두로 안내하며 별도 결과지나 분석 보고서는 제공하지 않습니다. 수강을 시작하면 상담에서 확인한 보완 사항을 실제 수업에 반영합니다. 수강료는 별도입니다." },
];

export default function Grade11Landing() {
  return <main className="rt g12 g11">
    <WinterAudienceNav current="/winter/grade-11"/>

    <section className="rt-hero"><div className="rt-wrap rt-hero-grid">
      <div className="rt-hero-copy"><p className="rt-kicker">2029학년도 미대입시를 준비하는 예비 고2에게</p><h1 className="g11-hero-title">고2의 첫 단추,<br/><em>스스로 준비할<br/>이유를 아는 것부터.</em></h1><p className="rt-lead">현재 성적과 작품, 하루의 준비를 함께 살펴보고,<br/>왜 지금 무엇을 바꿔야 하는지 납득하도록 돕습니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_hero">무료 심층 상담 예약하기 ↗</a><a className="rt-textlink" href="#winter-time">겨울에 쓸 수 있는 시간 보기 ↓</a></div><p className="rt-hero-note">무료 원장 상담 · 수강 시작 시 상담 내용을 실제 수업에 반영</p></div>
      <figure className="rt-plan-visual rt-hero-illustration g12-hero-illustration"><img src="/images/grade11/grade11-hero.webp" alt="기초 소묘를 연습하며 공부와 실기 준비의 바탕을 쌓는 예비 고2 학생의 일러스트" width={1254} height={1254} fetchPriority="high" decoding="async"/><figcaption><span>준비할 이유를 이해하고, 한 걸음부터.</span><small>AI 일러스트</small></figcaption></figure>
    </div></section>

    <Grade11WinterTime/>

    <section className="rt-section rt-causes g12-priorities" id="foundations"><div className="rt-wrap">
      <div className="rt-centered"><p className="rt-kicker">02 · 스스로 이해하는 현재의 준비</p><h2>스스로 준비하려면,<br/>지금의 상태부터 알아야 합니다.</h2><p className="rt-intro">성적표와 작품, 평소 일과를 함께 놓고 봅니다.<br/>무엇을 왜 보완할지, 학생이 자신의 준비를 이해하는 것부터 시작합니다.</p></div>
      <div className="rt-concern-grid g12-priority-grid">{foundations.map(item => <details className="rt-concern g12-priority-card" key={item.key}><summary><div className="rt-concern-visual"><img src={`/images/retake/${item.image}.webp`} alt={item.alt} width={1200} height={800} loading="lazy" decoding="async"/></div><div className="g12-priority-label">{item.label}</div><div className="rt-concern-title"><h3>{item.title}</h3><span className="rt-expand" aria-hidden="true">+</span></div><p className="rt-concern-foot">{item.records}</p></summary><div className="rt-concern-body"><p>{item.detail}</p></div></details>)}</div><p className="rt-illustration-caption">이해를 돕기 위한 AI 일러스트입니다.</p>
    </div></section>

    <section className="rt-section rt-method g12-direction" id="direction"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">03 · 고2의 1년을 향한 방향</p><h2>지금 할 일을 이해하고,<br/><em>준비의 방향을 정합니다.</em></h2></div><p className="rt-intro">관심 전공과 현재 준비 상태를 함께 놓고,<br/>이번 겨울에 필요한 과제와 그 이유를 짚습니다.</p></div>
      <div className="rt-method-row g12-direction-row"><figure className="rt-method-material rt-consult-illustration"><img src="/images/retake/consultation.webp" alt="학생과 지도자가 현재 성적과 작품을 함께 살펴보는 AI 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>현재 준비 상태와 필요한 과제를 함께 살펴보는 장면 · AI 일러스트</figcaption></figure><div className="rt-method-copy"><h3>왜 필요한지 이해한 과제를,<br/>오늘 할 일로.</h3><p>무료 원장 심층 상담에서 현재 성적과 작품, 공부·실기 준비 과정을 살펴봅니다. 학생이 자신의 준비 상태와 보완할 이유를 이해하고 참여하도록 돕습니다.</p><p>수강을 시작하면 상담에서 확인한 과제를 학과 수업과 실기 훈련에 반영합니다. 목표 대학이 정해지지 않았다면 현재 관심부터 함께 이야기합니다.</p><a className="rt-textlink" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_direction">현재 준비와 방향부터 무료 상담하기 ↗</a></div></div>
      <ol className="g12-preparation-path"><li><span>현재 상태를 확인하고</span><strong>성적·작품·일과 함께 보기</strong></li><li><span>필요한 이유를 이해하고</span><strong>보완할 과제와 우선순위 정하기</strong></li><li><span>수강을 시작하면</span><strong>수업·연습·점검으로 이어가기</strong></li></ol>
    </div></section>

    <section className="rt-section rt-spaces g12-habits" id="habits"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">04 · 이해한 방향을 실제 행동으로</p><h2>고2의 1년을 향한 방향,<br/>겨울의 하루부터 연습합니다.</h2></div><p className="rt-intro">정한 방향을 실제 행동으로 옮겨보고,<br/>새 학기에도 이어갈 준비 방식을 익힙니다.</p></div>
      <div className="g12-habit-layout"><figure className="g12-habit-illustration"><img src="/images/retake/study-routine.webp" alt="학생과 지도자가 수행한 과제와 다음 계획을 확인하는 AI 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>학습 계획과 수행한 과제를 함께 살펴보는 장면 · AI 일러스트</figcaption></figure><div className="g12-habit-list"><div><span>UNDERSTAND</span><h3>내가 할 과제를 알고</h3><p>오늘 해야 할 학과 공부와 실기 연습, 그 과제가 필요한 이유를 확인합니다.</p></div><div><span>PRACTICE</span><h3>정한 시간에 직접 해보고</h3><p>필요한 과제를 수업·자습·실기 일과에 담아 실행합니다.</p></div><div><span>CHECK</span><h3>한 일과 남은 일을 확인합니다</h3><p>수행 기록과 피드백을 돌아보고 다음에 보완할 과제를 정합니다.</p></div></div></div>
      <div className="g11-continuity" aria-label="겨울에서 고2의 1년으로 이어갈 준비"><div className="g11-continuity-heading"><span>고2의 1년을 향한 첫 단추</span><p>지금 필요한 준비를 이해하고,<br/><strong>새 학기에도 이어갈 습관을 연습합니다.</strong></p></div><ol><li><span>현재 상태</span><strong>준비할 이유를 이해하고</strong><p>성적·작품·일과로 지금의 상태 확인</p></li><li><span>겨울의 하루</span><strong>정한 방향을 실행하고</strong><p>수업·자습·실기 일과에서 직접 연습</p></li><li><span>고2의 1년</span><strong>일상으로 이어가기</strong><p>익힌 준비 방식을 새 학기에도 이어가는 것이 목표</p></li></ol></div>
    </div></section>

    <Grade11Routine/>
    <Grade11Report/>

    <section className="rt-section rt-camp g12-camp" id="camp"><div className="rt-wrap">
      <div className="rt-camp-layout"><div><p className="rt-kicker">07 · 이해한 방향을 실행할 8주</p><h2>2027 모다고<br/><em>윈터스쿨.</em></h2><p className="rt-intro">2029학년도 미대입시를 준비하는 예비 고2가 참여하는<br/>홍대 본원 기숙 과정입니다.</p><div className="rt-camp-fit"><h3>이런 준비가 필요하다면 함께 살펴보세요.</h3><p>학생 스스로 현재 준비 상태를 이해했으면 하는 경우<br/>고2에 무엇부터 보완할지 방향을 정하고 싶은 경우<br/>공부와 실기를 실제 일과로 이어가고 싶은 경우</p></div><a className="rt-textlink g12-camp-contact" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_camp">현재 준비에 맞는지 무료 상담하기 ↗</a></div><div className="rt-camp-facts"><dl><div><dt>기간</dt><dd>{CAMP_INFO.period}</dd></div><div><dt>장소</dt><dd>{CAMP_INFO.venueName}</dd></div><div><dt>대상</dt><dd>{CAMP_INFO.target}</dd></div><div><dt>구성</dt><dd>{CAMP_INFO.tuitionIncludes}</dd></div><div><dt>비용</dt><dd>{CAMP_INFO.tuition}<a href="/tuition">교습비 고지 확인 ↗</a></dd></div></dl><p className="rt-micro">현재 성적과 실기 경험에 맞는 수업 구성은 상담에서 확인합니다.</p><div className="rt-detail-links"><a href="/winter/teachers">강사진 보기 ↗</a><a href="/winter">전체 과정 보기 ↗</a></div></div></div>
      <div className="g12-faq"><h3>예비 고2 상담 전에 궁금한 점</h3>{faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    </div></section>

    <section className="rt-section rt-consult" id="consult"><div className="rt-wrap rt-consult-layout"><div><div className="rt-director rt-director-type"><span className="rt-director-seal" aria-hidden="true">모다고</span><div><strong>한동희 원장</strong><span>모두다른고양이 미술학원</span></div></div><p className="rt-kicker">08 · 예비 고2 무료 원장 상담</p><h2>고2의 첫 단추,<br/><em>현재 준비를 함께 살펴보는 것부터.</em></h2><p className="rt-intro">학생이 지금의 상태와 준비할 이유를 이해하도록,<br/>무엇을 보완하고 어떻게 시작할지 함께 짚습니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_consult">무료 심층 상담 예약하기 ↗</a><a className="rt-textlink" href={CAMP_INFO.phoneTel} data-winter-placement="grade11_consult">전화 {CAMP_INFO.phone}</a></div><p className="rt-micro">상담에서 짚고, 수강 후 실제 수업에서 보완합니다.<br/>상담은 무료이며 수강료는 별도입니다.</p></div><div className="rt-consult-prep"><span className="rt-card-eyebrow">상담 전에 준비하면 좋은 자료</span><div><span>01</span><p>최근 내신·모의고사 성적표</p></div><div><span>02</span><p>최근 그림과 실기 준비 경험</p></div><div><span>03</span><p>관심 있는 전공·대학과 궁금한 점</p></div><div><span>04</span><p>평소 공부·실기·생활 일과</p></div><p className="rt-micro">목표가 정해지지 않았어도, 갖고 있는 자료부터 살펴봅니다.<br/>예약 시 예비 고2 상담임을 알려주세요.</p></div></div></section>

    <footer className="rt-footer"><div className="rt-wrap"><strong>모두다른고양이 미술학원</strong><p>{CAMP_INFO.address}<br/>{CAMP_INFO.phone}</p><a href="/winter/grade-12">예비 고3 겨울 준비 ↗</a><a href="/winter/retake">N수생 겨울 준비 ↗</a><a href="#">맨 위로 ↑</a></div></footer>
    <div className="rt-mobile-action"><a href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade11_sticky">무료 심층 상담 예약하기 ↗</a></div>
  </main>;
}
