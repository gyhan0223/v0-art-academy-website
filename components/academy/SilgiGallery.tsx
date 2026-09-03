"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryImage = { src: string; alt: string };

/** 예시작 썸네일 그리드 — 클릭하면 원본 크기 라이트박스로 확대 */
export default function SilgiGallery({
  images,
  aspectClass,
  mobileScrollable = false,
}: {
  images: GalleryImage[];
  aspectClass: string;
  /**
   * true면 모바일(sm 미만)에서 2열 그리드 대신 가로 스와이프(scroll-snap) 갤러리로
   * 보여준다 — 한 장이 크게, 다음 장이 살짝 보이는 구성. sm 이상은 기존 그리드 그대로.
   * 부모 카드의 좌우 padding(p-5)만큼 -mx-5 로 빼서 카드 끝까지 스크롤 영역을 쓴다.
   */
  mobileScrollable?: boolean;
}) {
  const [idx, setIdx] = useState<number | null>(null);

  const listClass = mobileScrollable
    ? "scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
    : "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5";
  const itemClass = mobileScrollable
    ? "w-[74%] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none"
    : "";
  const sizes = mobileScrollable
    ? "(max-width: 640px) 74vw, (max-width: 1024px) 30vw, 170px"
    : "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 170px";

  useEffect(() => {
    if (idx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowLeft")
        setIdx((i) => (i! + images.length - 1) % images.length);
      if (e.key === "ArrowRight") setIdx((i) => (i! + 1) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, images.length]);

  const current = idx == null ? null : images[idx];

  return (
    <>
      <div className={listClass}>
        {images.map((ex, i) => (
          <button
            key={ex.src}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`${ex.alt} 크게 보기`}
            className={`group relative ${aspectClass} ${itemClass} cursor-zoom-in overflow-hidden rounded-md border border-white/10 bg-black transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
          >
            <Image
              src={ex.src}
              alt={ex.alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
        >
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setIdx(null)}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setIdx(null)}
            aria-label="닫기"
            className="absolute right-4 top-4 z-10 rounded p-2 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg
              aria-hidden
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setIdx((i) => (i! + images.length - 1) % images.length)
            }
            aria-label="이전 이미지"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent md:left-6"
          >
            <svg
              aria-hidden
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i! + 1) % images.length)}
            aria-label="다음 이미지"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent md:right-6"
          >
            <svg
              aria-hidden
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element -- 라이트박스는 원본 비율 그대로 노출 (이미지 최적화 미사용 프로젝트) */}
          <img
            src={current.src}
            alt={current.alt}
            className="relative max-h-[82vh] max-w-[92vw] rounded-md object-contain shadow-2xl"
          />
          <p className="relative mt-3 max-w-xl px-8 text-center text-[12px] leading-relaxed text-white/60">
            {current.alt}
            <span className="ml-2 font-mono text-white/40">
              {idx! + 1} / {images.length}
            </span>
          </p>
        </div>
      )}
    </>
  );
}
