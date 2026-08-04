import Image from "next/image";
import {
  RESIDENCY_LABEL,
  getCareers,
  type Teacher,
} from "@/lib/teachers";

/**
 * 사진 규격 — 원본이 288×288(정방형·흑백)이라 표시 크기를 88~112px로 잡는다.
 * 200px짜리 원본을 176px 박스에 넣으면 고해상도(2배) 화면에서 뭉갠다.
 * 원본을 키울 수 없을 때의 정답은 "늘려서 뭉개기"가 아니라 "작게 또렷하게"다.
 * (모바일 88px = 3.3배, 데스크톱 112px = 2.6배 밀도)
 */
const PHOTO_SRC_PX = 288;

/** 사진이 아직 없는 강사 — 이름 첫 글자로 자리를 지킨다(캐리커처·임시 이미지 금지). */
function PhotoFallback({ name }: { name: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white/[0.06] text-2xl font-semibold text-white/25"
      aria-hidden
    >
      {name.charAt(0)}
    </div>
  );
}

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const careers = getCareers(teacher);
  const residencyLabel =
    teacher.residency === "unconfirmed"
      ? null
      : RESIDENCY_LABEL[teacher.residency];

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 md:p-6">
      <div className="flex gap-4 md:gap-6">
        {/* 사진 — 아홉 명을 나란히 놓았을 때 한 세트로 보이도록 흑백·정방형으로 통일 */}
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 md:h-28 md:w-28">
          {teacher.photoSrc ? (
            <Image
              src={teacher.photoSrc}
              alt={`${teacher.name} 선생님 프로필 사진`}
              width={PHOTO_SRC_PX}
              height={PHOTO_SRC_PX}
              sizes="112px"
              className="h-full w-full object-cover"
            />
          ) : (
            <PhotoFallback name={teacher.name} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* 이름 · 직함 · 소속 형태 */}
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="text-lg font-bold tracking-tight text-white md:text-xl">
              {teacher.name}
            </h3>
            <span className="text-xs text-white/45">
              {teacher.role ? `${teacher.role} · ` : ""}
              {teacher.subject}
            </span>
            {residencyLabel && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                {residencyLabel}
                {teacher.residencyNote ? ` · ${teacher.residencyNote}` : ""}
              </span>
            )}
          </div>

          {/* 카드에서 유일하게 기억에 남는 줄 — 가장 크게, 가장 먼저 */}
          <p className="mt-2.5 text-[15px] font-semibold leading-relaxed text-white/90 break-keep md:text-base">
            {teacher.headline}
          </p>

          {/* 미대 특화 한 줄 — 일반 재수학원 강사진과 갈리는 지점 */}
          {teacher.mihakNote && (
            <p className="mt-2.5 inline-flex rounded-md bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/60">
              {teacher.mihakNote}
            </p>
          )}

          {/* 경력 — 최대 4줄. 훑고 지나가는 자리라 작게. */}
          <ul className="mt-3.5 space-y-1 border-t border-white/10 pt-3.5 text-[13px] leading-relaxed text-white/50">
            {careers.map((career) => (
              <li key={career} className="flex gap-2 break-keep">
                <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-white/30" />
                <span className="min-w-0">{career}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
