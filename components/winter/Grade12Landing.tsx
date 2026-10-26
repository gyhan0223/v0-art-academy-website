import { CAMP_INFO } from "@/lib/winter-camp";
import { NAVER_BOOKING_WINTER_URL } from "@/lib/contact";
import { Grade12Routine, Grade12Report } from "@/components/winter/Grade12Program";
import WinterAudienceNav from "@/components/winter/WinterAudienceNav";
import Exam2028Preparation from "@/components/winter/Exam2028Preparation";

const priorities = [
  { key: "study", label: "학과", image: "academic-study", alt: "워크북을 살펴보는 미대입시 준비생의 일러스트", title: <>지금 성적에서,<br/>무엇부터 보완할까?</>, records: "최근 성적표 · 오답 · 학습 기록", detail: "과목별 성적과 공부한 내용을 함께 살펴보고, 먼저 보완할 과목과 문제 유형을 짚습니다." },
  { key: "art", label: "실기", image: "art-practice", alt: "정물 소묘를 연습하는 미대입시 준비생의 일러스트", title: <>희망 대학에 맞는<br/>실기 훈련일까?</>, records: "최근 실기작 · 준비 종목 · 목표 전공", detail: "현재 작품과 실기 준비 기간, 희망 대학·전공을 함께 놓고 필요한 훈련 방향을 살펴봅니다." },
  { key: "balance", label: "준비의 균형", image: "admissions-strategy", alt: "여러 준비 방향을 비교하는 미대입시 준비생의 일러스트", title: <>학과와 실기,<br/>시간은 어떻게 나눌까?</>, records: "주간 일과 · 과제 수행 · 공부 시간", detail: "수업과 연습, 자습에 쓰는 시간을 돌아보고 정한 과제를 꾸준히 이어갈 일과를 정리합니다." },
];

const faqs = [
  { question: "상담 비용이 있나요?", answer: "원장 심층 상담 비용은 없습니다. 현재 성적과 실기 준비 상태를 바탕으로 보완할 방향을 구두로 안내합니다. 별도 상담 결과지나 분석 보고서는 제공하지 않으며, 수강료는 별도로 안내합니다." },
  { question: "상담 전에 무엇을 준비하면 되나요?", answer: "최근 성적표, 실기작, 희망 대학과 전공, 현재의 학습·실기 일과 등 가지고 있는 자료를 준비해 주세요. 아직 희망 대학이 정해지지 않았다면 현재 생각과 준비 상황부터 함께 살펴봅니다." },
  { question: "학과 수업과 실기는 어떻게 진행하나요?", answer: "현재 윈터스쿨 안내 기준으로 평일에는 국어·영어·탐구 수업과 자기주도 학습, 주말에는 대학교 유형 실기를 진행합니다. 현재 수준과 희망 실기 종목에 맞는 수업 구성은 상담에서 확인합니다." },
];

export default function Grade12Landing() {
  return <main className="rt g12">
    <WinterAudienceNav current="/winter/grade-12"/>

    <section className="rt-hero">
      <div className="rt-wrap rt-hero-grid">
        <div className="rt-hero-copy"><p className="rt-kicker">2028학년도 미대입시를 준비하는 예비 고3에게</p><h1 className="g12-hero-title g12-reform-hero-title">2028 개편 수능,<br/><em>목표 미대에 맞춰<br/>준비합니다.</em></h1><p className="rt-lead">바뀐 출제 범위와 목표 미대의 반영 기준을 함께 보고,<br/>겨울의 학과 수업·실기·학습 점검으로 연결합니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade12_hero">원장 심층 상담 예약하기 ↗</a><a className="rt-textlink" href="#exam-2028">2028 개편 대비 살펴보기 ↓</a></div><p className="rt-hero-note">새 출제 범위 확인 · 학과·실기 연계 · 격주 학습 점검</p></div>
        <figure className="rt-plan-visual rt-hero-illustration g12-hero-illustration"><img src="/images/grade12/grade12-hero.webp" alt="워크북과 실기 스케치북을 함께 살펴보며 다음 준비를 생각하는 예비 고3 학생의 일러스트" width={1254} height={1254} fetchPriority="high" decoding="async"/><figcaption><span>새로운 수능의 기준으로 준비하는 고3.</span></figcaption></figure>
      </div>
    </section>

    <Exam2028Preparation audience="grade12"/>

    <section className="rt-section rt-causes g12-priorities" id="priorities"><div className="rt-wrap">
      <div className="rt-centered"><p className="rt-kicker">01 · 지금 준비에서 먼저 볼 것</p><h2>해야 할 일은 많은데,<br/>무엇이 먼저일까요?</h2><p className="rt-intro">잘하고 있는 부분과 먼저 보완할 부분을 구분합니다.<br/>각 항목을 눌러 함께 살펴볼 기록을 확인해 보세요.</p></div>
      <div className="rt-concern-grid g12-priority-grid">{priorities.map(item => <details className="rt-concern g12-priority-card" key={item.key}><summary><div className="rt-concern-visual"><img src={`/images/retake/${item.image}.webp`} alt={item.alt} width={1200} height={800} loading="lazy" decoding="async"/></div><div className="g12-priority-label">{item.label}</div><div className="rt-concern-title"><h3>{item.title}</h3><span className="rt-expand" aria-hidden="true">+</span></div><p className="rt-concern-foot">{item.records}</p></summary><div className="rt-concern-body"><p>{item.detail}</p></div></details>)}</div>
    </div></section>

    <section className="rt-section rt-method g12-direction" id="direction"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">02 · 상담에서 수업까지</p><h2>성적과 실기,<br/><em>함께 보고 방향을 정합니다.</em></h2></div><p className="rt-intro">현재 상태와 희망 대학을 함께 놓고,<br/>겨울에 우선 보완할 과제를 짚습니다.</p></div>
      <div className="rt-method-row g12-direction-row"><figure className="rt-method-material rt-consult-illustration"><img src="/images/retake/consultation.webp" alt="학생과 지도자가 성적과 실기 자료를 함께 살펴보는 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>준비 방향을 함께 살펴보는 장면</figcaption></figure><div className="rt-method-copy"><h3>정한 방향이<br/>실제 준비로 이어지도록.</h3><p>원장님과의 심층 상담으로 현재 성적과 실기 준비, 희망 대학과 전공을 살펴봅니다.</p><p>수강을 시작하면 상담에서 확인한 보완 사항을 학과 수업과 실기 훈련에 반영합니다.</p><a className="rt-textlink" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade12_direction">상담으로 준비 방향 찾기 ↗</a></div></div>
      <ol className="g12-preparation-path"><li><span>상담에서</span><strong>우선 보완할 과제 정리</strong></li><li><span>수강을 시작하면</span><strong>학습·실기 훈련에 반영</strong></li><li><span>실행한 뒤</span><strong>수행 기록으로 다음 준비 점검</strong></li></ol>
    </div></section>

    <section className="rt-section rt-spaces g12-habits" id="habits"><div className="rt-wrap">
      <div className="rt-section-heading"><div><p className="rt-kicker">03 · 겨울부터 연습할 하루</p><h2>겨울에 연습한 하루가,<br/>고3의 준비로 이어지도록.</h2></div><p className="rt-intro">윈터스쿨은 앞으로 이어갈 준비 방식과<br/>학습·생활 습관을 미리 연습하는 단계입니다.</p></div>
      <div className="g12-habit-layout"><figure className="g12-habit-illustration"><img src="/images/retake/study-routine.webp" alt="학생과 지도자가 일과와 학습 계획을 확인하는 일러스트" width={1200} height={800} loading="lazy" decoding="async"/><figcaption>학습 계획을 함께 살펴보는 장면</figcaption></figure><div className="g12-habit-list"><div><span>START</span><h3>정해진 시간에 시작하고</h3><p>의욕이 생길 때를 기다리기보다, 공부를 시작할 시간을 일과에 둡니다.</p></div><div><span>CONTINUE</span><h3>학과와 실기를 함께 이어가고</h3><p>필요한 공부와 연습을 주간 일정에 나누어 배치합니다.</p></div><div><span>CHECK</span><h3>실행한 과제를 돌아봅니다</h3><p>계획과 실제 수행을 비교하며 다음에 보완할 부분을 찾습니다.</p></div></div></div>
      <div className="g12-year-note"><strong>고3이 되어서도 이어갈 준비를,<br/>겨울부터 익힙니다.</strong><p>겨울 동안 연습한 습관을 새 학기에도 이어가는 것이 목표입니다.</p></div>
    </div></section>

    <Grade12Routine/>
    <Grade12Report/>

    <section className="rt-section rt-camp g12-camp" id="camp"><div className="rt-wrap">
      <div className="rt-camp-layout"><div><p className="rt-kicker">06 · 준비를 실행할 8주</p><h2>2027 모다고<br/><em>윈터스쿨.</em></h2><p className="rt-intro">2028학년도 미대입시를 준비하는 예비 고3을 위한<br/>홍대 본원 기숙 과정입니다.</p><div className="rt-camp-fit"><h3>이런 준비가 필요하다면 함께 살펴보세요.</h3><p>학과 공부 시간을 확보하며 실기를 이어가고 싶은 경우<br/>고3이 되기 전 준비의 우선순위를 정하고 싶은 경우<br/>규칙적인 일과와 학습 점검을 연습하고 싶은 경우</p></div><a className="rt-textlink g12-camp-contact" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade12_camp">현재 준비에 맞는지 상담하기 ↗</a></div><div className="rt-camp-facts"><dl><div><dt>기간</dt><dd>{CAMP_INFO.period}</dd></div><div><dt>장소</dt><dd>{CAMP_INFO.venueName}</dd></div><div><dt>대상</dt><dd>{CAMP_INFO.target}</dd></div><div><dt>구성</dt><dd>{CAMP_INFO.tuitionIncludes}</dd></div><div><dt>비용</dt><dd>{CAMP_INFO.tuition}<a href="/tuition">교습비 고지 확인 ↗</a></dd></div></dl><p className="rt-micro">현재 성적과 실기 종목에 맞는 수업 구성은 상담에서 확인합니다.</p><div className="rt-detail-links"><a href="/winter/teachers">강사진 보기 ↗</a><a href="/winter">전체 과정 보기 ↗</a></div></div></div>
      <div className="g12-faq"><h3>상담 전에 궁금한 점</h3>{faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    </div></section>

    <section className="rt-section rt-consult g12-consult" id="consult"><div className="rt-wrap rt-consult-layout"><div><div className="rt-director rt-director-type"><span className="rt-director-seal" aria-hidden="true">모다고</span><div><strong>한동희 원장</strong><span>모두다른고양이 미술학원</span></div></div><p className="rt-kicker">07 · 예비 고3 원장 심층 상담</p><h2>무엇부터 준비할지,<br/><em>함께 짚어보세요.</em></h2><p className="rt-intro">현재 성적과 실기 준비, 희망 대학을 바탕으로<br/>이번 겨울에 먼저 보완할 과제부터 살펴봅니다.</p><div className="rt-actions"><a className="rt-button" href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade12_consult">원장 심층 상담 예약하기 ↗</a><a className="rt-textlink" href={CAMP_INFO.phoneTel} data-winter-placement="grade12_consult">전화 {CAMP_INFO.phone}</a></div><p className="rt-micro">상담에서 짚고, 수강 후 실제 수업에서 보완합니다.</p></div><div className="rt-consult-prep"><span className="rt-card-eyebrow">상담 전에 준비하면 좋은 자료</span><div><span>01</span><p>최근 내신·모의고사 성적표</p></div><div><span>02</span><p>최근 실기작과 준비 종목</p></div><div><span>03</span><p>희망 대학·전공과 궁금한 점</p></div><div><span>04</span><p>현재 학과·실기 주간 일과</p></div><p className="rt-micro">갖고 있는 자료를 중심으로 상담합니다.<br/>예약 시 예비 고3 상담임을 알려주세요.</p></div></div></section>

    <footer className="rt-footer"><div className="rt-wrap"><strong>모두다른고양이 미술학원</strong><p>{CAMP_INFO.address}<br/>{CAMP_INFO.phone}</p><a href="/winter/retake">N수생 겨울 준비 ↗</a><a href="#">맨 위로 ↑</a></div></footer>
    <div className="rt-mobile-action"><a href={NAVER_BOOKING_WINTER_URL} data-winter-placement="grade12_sticky">원장 심층 상담 예약하기 ↗</a></div>
  </main>;
}
