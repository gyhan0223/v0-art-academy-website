/**
 * 격주 학습 리포트 샘플 문서.
 *
 * 이미지가 아니라 실제 문서를 그대로 그린다. 그래야 어느 화면에서도
 * 글자가 뭉개지지 않고, 숫자를 바꿀 때 lib/winter-report.ts만 고치면 된다.
 * 어두운 페이지 위에 놓이는 "종이 한 장"이라 이 안쪽만 밝은 색을 쓴다.
 */

import { Fragment } from "react";
import { REPORT_SAMPLE as R } from "@/lib/winter-report";

/* --------------------------------- 조각들 --------------------------------- */

function SectionTitle({ no, children }: { no: string; children: string }) {
  return (
    <div className="mt-7 flex items-baseline gap-2 border-b-2 border-neutral-900 pb-1.5 first:mt-0">
      <span className="text-[12px] md:text-[13px] font-bold text-neutral-900">
        {no}
      </span>
      <h4 className="bg-neutral-100 px-2 py-0.5 text-[12px] md:text-[13px] font-bold tracking-tight text-neutral-900">
        {children}
      </h4>
    </div>
  );
}

/** 좁은 화면에서 표가 찌그러지지 않도록 가로로 흐르게 둔다 */
function Scroller({
  minWidth,
  children,
}: {
  minWidth: string;
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div style={{ minWidth }}>{children}</div>
    </div>
  );
}

/* -------------------------------- 문서 본문 -------------------------------- */

export default function ReportSample({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white text-neutral-900 shadow-2xl shadow-black/40 ${className}`}
    >
      <div className="px-5 py-8 md:px-12 md:py-12">
        {/* ---- 머리말 ---- */}
        <header className="text-center">
          <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.45em] text-neutral-500">
            {R.eyebrow}
          </p>
          <h3 className="mt-3 text-2xl md:text-4xl font-black tracking-tight text-neutral-900">
            {R.title}
          </h3>
          <p className="mt-2 text-[11px] md:text-xs text-neutral-500 break-keep">
            {R.subtitle}
          </p>
        </header>

        <div className="mt-6 border-t-2 border-neutral-900" />

        {/* ---- 이름 · 기간 ---- */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 py-4 sm:grid-cols-2">
          {[
            { label: "이 름", value: R.student },
            { label: "기 간", value: R.period },
          ].map((f) => (
            <div key={f.label} className="flex items-baseline gap-4">
              <span className="shrink-0 text-[11px] md:text-xs font-bold tracking-[0.2em] text-neutral-900">
                {f.label}
              </span>
              <span className="flex-1 border-b border-neutral-300 pb-1 text-center text-xs md:text-sm text-neutral-800">
                {f.value}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-900" />

        {/* 좁은 화면에서는 표가 잘려 보이므로 한 번만 알려 준다 */}
        <p className="mt-3 text-[10px] text-neutral-400 md:hidden">
          ※ 표는 좌우로 밀어서 보실 수 있습니다.
        </p>

        {/* ---- I. 이번 2주 한눈에 보기 ---- */}
        <SectionTitle no="I">이번 2주 한눈에 보기</SectionTitle>

        <div className="mt-3 grid grid-cols-1 divide-y divide-neutral-200 border border-neutral-200 bg-neutral-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {R.summary.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <p className="text-[10px] md:text-[11px] text-neutral-500">
                {s.label}
              </p>
              <p className="mt-1.5 text-lg md:text-2xl font-black tracking-tight text-neutral-900">
                {s.value}
              </p>
              <p className="mt-1.5 text-[10px] md:text-[11px] text-neutral-400 break-keep">
                {s.note}
              </p>
            </div>
          ))}
        </div>

        {/* ---- II. 단어시험 성적표 ---- */}
        <SectionTitle no="II">단어시험 성적표</SectionTitle>

        <Scroller minWidth="560px">
          <table className="mt-3 w-full table-fixed border-collapse text-center">
            <caption className="sr-only">
              날짜별 단어시험 점수 (100점 만점)
            </caption>
            <tbody className="text-[11px] md:text-xs">
              <tr>
                <th
                  rowSpan={2}
                  scope="rowgroup"
                  className="w-[15%] border border-neutral-300 bg-neutral-100 px-2 py-2 font-bold leading-tight text-neutral-900"
                >
                  {R.vocab.caption}
                  <span className="block text-[9px] md:text-[10px] font-normal text-neutral-500">
                    {R.vocab.unit}
                  </span>
                </th>
                <th
                  scope="row"
                  className="w-[9%] border border-neutral-700 bg-neutral-700 px-1 py-1.5 font-semibold text-white"
                >
                  날짜
                </th>
                {R.vocab.days.map((d) => (
                  <td
                    key={d.date}
                    className="border border-neutral-300 px-1 py-1.5 text-neutral-600"
                  >
                    {d.date}
                  </td>
                ))}
              </tr>
              <tr>
                <th
                  scope="row"
                  className="border border-neutral-700 bg-neutral-700 px-1 py-1.5 font-semibold text-white"
                >
                  점수
                </th>
                {R.vocab.days.map((d) => (
                  <td
                    key={d.date}
                    className={`border border-neutral-300 px-1 py-1.5 font-semibold ${
                      d.score === 100 ? "text-[#c0392b]" : "text-neutral-800"
                    }`}
                  >
                    {d.score}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Scroller>

        <p className="mt-2 text-[10px] md:text-[11px] text-neutral-400 break-keep">
          ※ {R.vocab.note}
        </p>

        {/* ---- III. 모의고사 성적표 ---- */}
        <SectionTitle no="III">모의고사 성적표</SectionTitle>

        <Scroller minWidth="520px">
          <table className="mt-3 w-full border-collapse text-center text-[11px] md:text-xs">
            <caption className="sr-only">
              시험별 국어 · 영어 등급과 원점수
            </caption>
            <thead>
              <tr className="bg-neutral-900 text-white">
                <th colSpan={2} scope="col" className="px-3 py-2 font-semibold">
                  모의고사 정보
                </th>
                {R.mock.exams.map((e) => (
                  <th key={e} scope="col" className="px-3 py-2 font-semibold">
                    {e}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th
                  colSpan={2}
                  scope="row"
                  className="border border-neutral-300 bg-neutral-700 px-3 py-1.5 font-semibold text-white"
                >
                  날짜
                </th>
                {R.mock.dates.map((d) => (
                  <td
                    key={d}
                    className="border border-neutral-300 px-3 py-1.5 text-neutral-600"
                  >
                    {d}
                  </td>
                ))}
              </tr>

              {R.mock.subjects.map((subject) => (
                <Fragment key={subject.name}>
                  <tr>
                    <th
                      rowSpan={2}
                      scope="rowgroup"
                      className="w-[18%] border border-neutral-300 bg-neutral-50 px-2 py-1.5 font-bold text-neutral-900"
                    >
                      {subject.name}
                    </th>
                    <th
                      scope="row"
                      className="w-[12%] border border-neutral-300 bg-neutral-200 px-2 py-1.5 font-semibold text-neutral-700"
                    >
                      등급
                    </th>
                    {subject.grades.map((g, i) => (
                      <td
                        key={`${subject.name}-g-${i}`}
                        className={`border border-neutral-300 px-3 py-1.5 font-bold ${
                          g.up ? "text-[#c0392b]" : "text-neutral-900"
                        }`}
                      >
                        {g.value}
                        {g.up && (
                          <span className="ml-1 text-[10px] align-middle">
                            ▲
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="border border-neutral-300 bg-neutral-200 px-2 py-1.5 font-semibold text-neutral-700"
                    >
                      원점수
                    </th>
                    {subject.raw.map((v, i) => (
                      <td
                        key={`${subject.name}-r-${i}`}
                        className="border border-neutral-300 px-3 py-1.5 text-neutral-500"
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </Scroller>

        <p className="mt-2 text-[10px] md:text-[11px] text-neutral-400 break-keep">
          ※ {R.mock.note}
        </p>

        {/* ---- IV. 출결 · 생활 ---- */}
        <SectionTitle no="IV">출결 · 생활</SectionTitle>

        <Scroller minWidth="480px">
          <table className="mt-3 w-full border-collapse text-center text-[11px] md:text-xs">
            <caption className="sr-only">출결과 생활 지표</caption>
            <thead>
              <tr className="bg-neutral-900 text-white">
                {R.life.items.map((it) => (
                  <th
                    key={it.label}
                    scope="col"
                    className="px-3 py-2 font-semibold"
                  >
                    {it.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {R.life.items.map((it) => (
                  <td
                    key={it.label}
                    className="border border-neutral-300 px-3 py-3 text-sm font-bold text-neutral-900"
                  >
                    {it.value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Scroller>

        <p className="mt-2 text-[10px] md:text-[11px] text-neutral-400 break-keep">
          ※ {R.life.note}
        </p>

        {/* ---- V. 강사 코멘트 · 다음 2주 목표 ---- */}
        <SectionTitle no="V">강사 코멘트 · 다음 2주 목표</SectionTitle>

        <div className="mt-3 border border-neutral-200 px-4 py-5 md:px-6">
          <p className="text-[10px] md:text-[11px] text-neutral-400">
            강사 코멘트
          </p>
          <p className="mt-2 text-[11px] md:text-[13px] leading-relaxed text-neutral-800 break-keep">
            {R.comment}
          </p>

          <p className="mt-5 text-[10px] md:text-[11px] text-neutral-400">
            다음 2주 목표
          </p>
          <ol className="mt-2 flex flex-col gap-1 text-[11px] md:text-[13px] leading-relaxed text-neutral-800 md:flex-row md:flex-wrap md:gap-x-6">
            {R.goals.map((g, i) => (
              <li key={g}>
                <span className="mr-1 font-semibold text-neutral-900">
                  {["①", "②", "③", "④", "⑤"][i]}
                </span>
                {g}
              </li>
            ))}
          </ol>
        </div>

        {/* ---- 발신 ---- */}
        <p className="mt-7 text-right text-[10px] md:text-[11px] text-neutral-500 break-keep">
          {R.issuedAt}
          <span className="ml-3">{R.issuer}</span>
        </p>
      </div>
    </div>
  );
}
