"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * App Router의 클라이언트 네비게이션은 문서를 새로 불러오지 않으므로
 * gtag('config')가 쏘는 최초 1회 말고는 페이지뷰가 잡히지 않는다.
 * 라우트가 바뀔 때마다 page_view를 직접 쏴서 하위 페이지 조회수를 채운다.
 *
 * 최초 렌더는 건너뛴다 — gtag.js가 afterInteractive라 이 시점엔 아직
 * window.gtag이 없을 수 있고, 첫 페이지뷰는 gtag('config')가 이미 담당한다.
 * 여기서 또 쏘면 진입 페이지만 두 번 집계된다.
 */
export default function GaPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;

    const qs = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: qs ? `${pathname}?${qs}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}
