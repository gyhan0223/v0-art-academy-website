import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기숙학원 2027년 3월 오픈 | 모두다른고양이 미술학원",
  description:
    "모두다른고양이 미술학원 기숙학원이 2027년 3월 문을 엽니다. 사전 상담 예약을 받고 있습니다.",
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-accent text-xs tracking-[0.3em] mb-4">COMING SOON</p>
        <h1 className="text-3xl font-bold text-white leading-snug">
          기숙학원
          <br />
          2027년 3월 오픈
        </h1>
        <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
          미대 재수, 관리가 전부입니다.
          <br />
          자세한 안내는 준비 중이며, 사전 상담은 지금도 가능합니다.
        </p>
        <a
          href={NAVER_BOOKING}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
        >
          사전 상담 신청
        </a>
      </div>
    </main>
  );
}
