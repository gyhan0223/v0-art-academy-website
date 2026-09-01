"use client";

/**
 * 진단 결과 → 유료 1:1 입시 전략 컨설팅 전환 블록.
 * (구 ConsultCta.tsx — 무료 상담 연결에서 유료 컨설팅 연결로 역할이 바뀌며
 * 이름도 함께 바꿨다.)
 *
 * 모든 결과 분기에서 진단 직후의 가장 강한 다음 단계로 한 번만 노출한다 —
 * 자동 진단이 보여준 "현재 위치"를 사람이 이어받아 실제 전략으로 정리해주는
 * 창구. 데이터가 부족한 분기(중3·성적 없음·입결 미공개 목표 대학)에서도
 * 막다른 길이 되지 않게 하는 역할을 겸한다.
 *
 * 가격·상품명은 lib/consulting.ts 단일 소스를 그대로 쓴다.
 * 개인 성적 원문은 URL·analytics로 보내지 않는다 — from=diagnosis와
 * (jungsi에서 온 진단이면) whitelist된 origin만 붙인다.
 */

import Link from "next/link";
import { CONSULTING_INFO } from "@/lib/consulting";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";

export default function StrategyConsultCta({
  showMiddleSchoolNote = false,
  targetUniversity = null,
  entrySource = null,
}: {
  /** 중3 이하 학생에게 "예비 고1부터 지도" 안내를 붙일지 */
  showMiddleSchoolNote?: boolean;
  /** 목표 대학이 있는 진단이면 카피를 그 대학 중심으로 잇는다 (공개 대학명만) */
  targetUniversity?: string | null;
  /** 진단의 최초 유입 경로(whitelist 통과값, 예: "jungsi") —
      /consulting?origin=으로 이어 붙여 최초 origin이 컨설팅 이벤트까지 남는다 */
  entrySource?: string | null;
}) {
  const params = new URLSearchParams({ from: "diagnosis" });
  if (entrySource) params.set("origin", entrySource);
  const consultingHref = `/consulting?${params.toString()}`;
  return (
    <section
      aria-label="1:1 입시 전략 컨설팅 안내"
      className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-6"
    >
      <h2 className="break-keep text-[22px] font-bold leading-snug text-white">
        {targetUniversity != null ? (
          <>
            {targetUniversity}가 목표라면,
            <br />
            이제 세 장을 어떻게 짜야 할까요?
          </>
        ) : (
          <>
            결과는 나왔는데,
            <br />
            그래서 지금 뭘 해야 할까요?
          </>
        )}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-white/70 break-keep">
        {targetUniversity != null
          ? "자동 진단은 현재 위치를 보여줍니다. 실제 지원 전략은 성적 · 실기 · 다른 군의 대학까지 함께 봐야 합니다."
          : "자동 진단은 현재 위치를 보여줍니다. 실제 전략은 성적 · 실기 · 목표 대학을 함께 봐야 합니다."}
        {showMiddleSchoolNote && (
          <> 모다고는 예비 고1(현재 중3)부터 지도해요.</>
        )}
      </p>

      <div className="mt-5 flex items-baseline gap-3">
        <p className="text-[13px] text-white/65">{CONSULTING_INFO.name}</p>
        <p className="text-xl font-bold text-white">
          {CONSULTING_INFO.priceLabel}
        </p>
      </div>

      <Link
        href={consultingHref}
        onClick={() =>
          trackDiagnosis("diagnosis_consult_click", {
            target_university: targetUniversity ?? undefined,
            entry_source: entrySource ?? undefined,
          })
        }
        className="mt-4 block min-h-[48px] rounded-xl bg-accent px-5 py-3.5 text-center text-[15px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {targetUniversity != null
          ? "내 지원 전략 1:1로 분석받기"
          : "내 결과 1:1로 분석받기"}
      </Link>
    </section>
  );
}
