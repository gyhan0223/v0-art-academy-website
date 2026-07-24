import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2027학년도 미대 입시 정보 준비중 | 모두다른고양이 미술학원",
  description:
    "2027학년도 미대 정시 가·나·다군 총정리를 준비하고 있습니다. 공개 전까지 궁금한 점은 상담으로 문의해 주세요.",
  robots: { index: false, follow: false },
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-accent text-xs tracking-[0.3em] mb-4">COMING SOON</p>
        <h1 className="text-3xl font-bold text-white leading-snug">
          2027학년도 미대 입시 정보
          <br />
          준비중입니다
        </h1>
        <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
          가·나·다군 모집군과 전형방법을 정리하고 있습니다.
          <br />
          공개 전까지 궁금한 점은 상담으로 문의해 주세요.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={NAVER_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            상담 신청
          </a>
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
