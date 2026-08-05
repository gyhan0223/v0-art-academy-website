/**
 * 캠퍼스별 상담 예약 링크.
 *
 * 네이버 예약 상품이 캠퍼스마다 따로라, 버튼 하나만 두면 반대편 캠퍼스를
 * 원하는 사람도 엉뚱한 곳으로 접수된다. 두 캠퍼스를 모두 안내하는 자리라면
 * 이걸 쓴다(윈터스쿨처럼 한 캠퍼스에서만 진행하는 과정은 예외 —
 * lib/contact.ts의 NAVER_BOOKING_URL을 바로 쓸 것).
 *
 * 정렬·간격은 페이지마다 달라서 컨테이너는 밖에 맡기고 <a>만 내보낸다.
 * 기존 버튼 두 개가 놓이던 flex 컨테이너 안에 그대로 넣으면 된다.
 */
import { Fragment, type ReactNode } from "react";
import { CAMPUSES } from "@/lib/contact";

export default function ConsultCampusLinks({
  action = "상담 신청",
  className = "",
  separator,
}: {
  /** 캠퍼스 이름 뒤에 붙는 문구. 빈 문자열이면 캠퍼스 이름만 나온다. */
  action?: string;
  /** 링크 하나에 적용할 클래스 — 페이지의 기존 버튼 스타일을 그대로 넘긴다. */
  className?: string;
  /** 링크 사이에 끼울 것. 본문 안에 인라인으로 놓을 때 " · " 같은 걸 넘긴다. */
  separator?: ReactNode;
}) {
  return (
    <>
      {CAMPUSES.map((campus, i) => (
        <Fragment key={campus.label}>
          {i > 0 && separator}
          <a
            href={campus.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {action ? `${campus.label} ${action}` : campus.label}
          </a>
        </Fragment>
      ))}
    </>
  );
}
