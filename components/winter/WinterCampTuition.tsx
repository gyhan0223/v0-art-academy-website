import { WINTER_CAMP_TUITION } from "@/lib/winter-camp";

export default function WinterCampTuition() {
  const { winterFirstFourWeeks, discountedFinalFourWeeks } = WINTER_CAMP_TUITION;
  const total = winterFirstFourWeeks + discountedFinalFourWeeks;

  return (
    <div className="rt-camp-tuition">
      <p className="rt-camp-tuition-label">겨울캠프 전용 요금 구성</p>
      <p className="rt-camp-tuition-total">
        <span>8주 일괄 등록 총액</span>
        <strong>{total.toLocaleString("ko-KR")}<span>원</span></strong>
      </p>
      <p className="rt-camp-tuition-includes">학과·실기·기숙·식사·독서실 포함</p>
      <p className="rt-camp-tuition-excludes">수학·서류전형 지도 비용 별도</p>
      <p className="rt-camp-tuition-condition">8주 일괄 등록 시 뒤 4주 할인 적용</p>
      <details className="rt-camp-tuition-details">
        <summary>비용 자세히 보기<span aria-hidden="true">+</span></summary>
        <div className="rt-camp-tuition-breakdown">
          <div className="rt-camp-tuition-period">
            <h4>겨울캠프 8주 비용 구성</h4>
            <ul>
              <li><span>첫 4주 적용금액</span><strong>{winterFirstFourWeeks.toLocaleString("ko-KR")}원</strong></li>
              <li><span>뒤 4주 할인 적용</span><strong>{discountedFinalFourWeeks.toLocaleString("ko-KR")}원</strong></li>
            </ul>
            <p className="rt-camp-tuition-subtotal rt-camp-tuition-payable"><span>8주 총액</span><strong>{total.toLocaleString("ko-KR")}원</strong></p>
          </div>
          <p>겨울캠프는 별도 요금 기준을 적용합니다. 위 금액은 8주 일괄 등록 기준입니다.</p>
          <a href="/tuition">교습비 고지 확인 ↗</a>
        </div>
      </details>
    </div>
  );
}
