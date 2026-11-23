import Link from "next/link";

export default function PostExamLinks({ pickIds = [] }: { pickIds?: string[] }) {
  const query = pickIds.length ? "?" + new URLSearchParams({ pick: pickIds.join(",") }) : "";

  return (
    <nav aria-label="수능 이후 준비" className="mt-5 flex flex-col gap-2">
      <Link
        href={`/guide/jungsi-2027${query}#explorer`}
        className="rounded-xl bg-accent px-5 py-3.5 text-center text-[15px] font-bold text-black hover:opacity-85 focus-visible:outline-2 focus-visible:outline-accent"
      >
        {pickIds.length ? "내 가·나·다군 지원 조합 살펴보기" : "가·나·다군 대학과 학과 살펴보기"}
      </Link>
      <Link
        href="/winter/retake"
        className="rounded-lg px-2 py-3 text-center text-sm text-white/75 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
      >
        재도전을 고민한다면 · N수생 겨울 준비
      </Link>
    </nav>
  );
}
