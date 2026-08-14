"use client";

/**
 * 진단 결과 → 상담 연결 블록.
 * 데이터가 부족해 "산정이 어려워요"로 끝나는 경우(중3·성적 없음·입결 미공개
 * 목표 대학)에 막다른 길이 되지 않도록, 사람이 이어받는 창구를 바로 연다.
 * 채널 주소는 lib/contact.ts 단일 소스를 그대로 쓴다.
 */

import { CAMPUSES } from "@/lib/contact";
import { NaverTalkButton } from "@/components/academy/NaverTalk";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";

export default function ConsultCta({
  showMiddleSchoolNote = false,
}: {
  /** 중3 이하 학생에게 "예비 고1부터 지도" 안내를 붙일지 */
  showMiddleSchoolNote?: boolean;
}) {
  return (
    <section
      aria-label="상담 안내"
      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
    >
      <p className="text-[16px] font-bold text-white">
        정확한 준비 방향이 궁금하다면
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-white/60">
        지금 상황에서 어떤 실기 유형과 대학 라인이 가능한지, 무료 상담에서
        원장이 직접 잡아드려요.
        {showMiddleSchoolNote && (
          <> 모다고는 예비 고1(현재 중3)부터 지도해요.</>
        )}
      </p>
      <div className="mt-4 space-y-2">
        {CAMPUSES.map((campus) => (
          <a
            key={campus.label}
            href={campus.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDiagnosis("diagnosis_consult_click")}
            className="block rounded-xl bg-accent px-5 py-3.5 text-center text-[15px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {campus.label} 무료 상담 신청
          </a>
        ))}
        <NaverTalkButton
          className="w-full px-5 py-3.5 text-[15px]"
          label="톡톡으로 가볍게 문의하기"
        />
      </div>
    </section>
  );
}
