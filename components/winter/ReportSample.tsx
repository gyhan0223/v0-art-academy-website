import { REPORT_SAMPLE as R } from "@/lib/winter-report";
export default function ReportSample({ className = "" }: { className?: string }) {
  return (
    <div className={"rounded-xl bg-white px-5 py-7 text-neutral-900 shadow-xl md:px-10 md:py-10 " + className}>
      <header className="border-b-2 border-neutral-900 pb-5">
        <p className="text-xs font-semibold text-neutral-600">{R.eyebrow}</p>
        <h3 className="mt-3 text-2xl font-black md:text-3xl">{R.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{R.subtitle}</p>
        <p className="mt-3 rounded-lg bg-neutral-100 p-3 text-xs leading-relaxed text-neutral-700">{R.caption}</p>
      </header>
      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-600"><span>학생: ________</span><span>기록 기간: ________</span><span>담당: ________</span></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {R.sections.map((section, i) => (
          <section key={section.title} className="rounded-lg border border-neutral-200 p-4 md:p-5">
            <h4 className="text-base font-bold">{i + 1}. {section.title}</h4>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-700">
              {section.items.map(item => <li key={item} className="border-b border-neutral-200 pb-2">{item}<span className="mt-1 block text-xs text-neutral-500">기록 내용을 작성합니다.</span></li>)}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-neutral-600">{R.note}</p>
    </div>
  );
}
