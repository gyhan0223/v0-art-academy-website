import type { Metadata } from "next";
import TeacherCard from "@/components/academy/TeacherCard";
import ConsultCampusLinks from "@/components/academy/ConsultCampusLinks";
import {
  IS_PLACEHOLDER,
  SUBJECT_DESC,
  SUBJECT_NOTE,
  SUBJECT_ORDER,
  getFacultyCount,
  getTeachersBySubject,
} from "@/lib/teachers";

export const metadata: Metadata = {
  title: "강사진 | 모두다른고양이 미술학원",
  description:
    "국어·영어·사회탐구 학과 강사와 미대 실기 지도를 한 페이지에 정리했습니다. 각 강사가 무엇을 해결하는지, 본원에 상주하는지까지 밝힙니다.",
  alternates: { canonical: "/teachers" },
  // 헤드라인·상주 여부가 확인 전(초안)인 동안은 색인되지 않도록 차단 —
  // lib/teachers.ts의 IS_PLACEHOLDER를 false로 바꾸면 자동으로 색인이 열린다.
  ...(IS_PLACEHOLDER ? { robots: { index: false, follow: true } } : {}),
};

const PHONE_HONGDAE = "02-338-3302";

export default function Page() {
  const count = getFacultyCount();

  return (
    <main className="bg-background text-foreground min-h-dvh px-5 pt-28 pb-20 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <header className="text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">
            Faculty
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white break-keep">
            강사진
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm md:text-base leading-relaxed text-white/60 break-keep">
            어느 학원 출신인지보다, 이 선생님이 우리 아이의 무엇을 해결해 주는지가
            먼저입니다. 그래서 강사마다 한 줄로 먼저 밝히고, 경력은 그 뒤에
            네 줄까지만 적었습니다.
          </p>
        </header>

        {IS_PLACEHOLDER && (
          <p className="mx-auto mt-8 max-w-xl rounded-lg border border-dashed border-accent/40 bg-accent/[0.06] px-4 py-3 text-center text-xs leading-relaxed text-accent break-keep">
            강사별 한 줄 소개와 상주 여부는 확인 중인 초안입니다. 확정되면 이
            안내가 사라집니다.
          </p>
        )}

        {/* 구성 — 학과가 먼저인 학원이지만, 실기를 가르치는 사람이 있다는 사실이
            첫 화면에서 바로 보여야 한다. */}
        <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <h2 className="sr-only">강사진 구성</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                {count.academic}
                <span className="ml-1 text-sm font-bold text-white/40">명</span>
              </p>
              <p className="mt-1 text-xs text-white/50">학과 (국어·영어·사탐)</p>
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                {count.practical}
                <span className="ml-1 text-sm font-bold text-white/40">명</span>
              </p>
              <p className="mt-1 text-xs text-white/50">실기</p>
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                {count.resident}
                <span className="ml-1 text-sm font-bold text-white/40">명</span>
              </p>
              <p className="mt-1 text-xs text-white/50">본원 상주 전임</p>
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                1989
                <span className="ml-1 text-sm font-bold text-white/40">년~</span>
              </p>
              <p className="mt-1 text-xs text-white/50">미대 실기 지도</p>
            </div>
          </div>

          <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60 break-keep">
            수학 강사가 없는 것은 빠진 것이 아니라 뺀 것입니다. 미대 정시는
            대부분 수학을 반영하지 않기 때문에, 국어·영어·탐구 세 과목에 시간을
            몰아줍니다. 실기는 주말마다 이어 가되, 학과 성적으로 지원할 대학이
            좁혀지면 그 대학의 실기 유형에 맞춰 붙습니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 break-keep">
            본원에 상주하는 사람은 실기를 직접 지도하는 대표 한 명이고, 학과
            강사는 전원 담당 수업 시간에 들어오는 출강입니다. 부풀리지 않고
            카드마다 그대로 적었습니다.
          </p>
        </section>

        {/* 과목별 강사 */}
        {SUBJECT_ORDER.map((subject) => {
          const list = getTeachersBySubject(subject);
          if (list.length === 0) return null;

          return (
            <section key={subject} className="mt-14 md:mt-16">
              <div className="border-l-2 border-accent pl-4">
                <h2 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xl font-bold tracking-tight text-white md:text-2xl">
                  {subject}
                  <span className="text-xs font-medium tabular-nums text-white/40">
                    {list.length}명
                  </span>
                  {/* 미대 특화 표시 — 없으면 일반 재수학원 강사진과 구분이 안 된다 */}
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                    {SUBJECT_NOTE[subject]}
                  </span>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 break-keep">
                  {SUBJECT_DESC[subject]}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {list.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            </section>
          );
        })}

        {/* 각주 — 학과 수업 운영 주체 */}
        <p className="mt-12 rounded-lg border border-white/10 bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/45 break-keep">
          학과(국어·영어·사회탐구) 수업은 홍대 본원과 같은 곳(마포구 와우산로23길
          9)에서 운영하는 아름다운학원 강사진이 담당하고, 실기는 모두다른고양이
          미술학원이 직접 지도합니다. 두 이름이 한 건물에서 학과와 실기를 나눠
          맡습니다.
        </p>

        {/* 상담 */}
        <section className="mt-14 rounded-xl border border-white/10 bg-white/[0.03] p-7 text-center md:p-9">
          <h2 className="text-xl font-bold tracking-tight text-white break-keep md:text-2xl">
            어떤 선생님이 우리 아이를 맡는지,
            <br className="sm:hidden" /> 상담에서 직접 확인하세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55 break-keep">
            현재 성적과 목표 대학을 보고, 어느 반에서 어떤 선생님과 시작할지
            정해 드립니다.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ConsultCampusLinks
              action="상담 신청"
              className="w-full rounded-md bg-accent px-6 py-3 text-center text-sm font-semibold text-black transition-opacity hover:opacity-85 sm:w-auto"
            />
            <a
              href={`tel:${PHONE_HONGDAE}`}
              className="w-full rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white sm:w-auto"
            >
              홍대 본원 {PHONE_HONGDAE}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
