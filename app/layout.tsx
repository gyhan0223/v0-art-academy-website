import type { Metadata, Viewport } from "next"; // 💡 Viewport 임포트 추가
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Suspense } from "react";
import GaPageView from "@/components/analytics/GaPageView";
import SiteNav from "@/components/academy/SiteNav";
import NaverTalkFab from "@/components/academy/NaverTalk";
import "./globals.css";

// 💡 1. Next.js 공식 설정으로 Safari 테마 강제 고정
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.modago.me"),
  // title에 template을 쓰지 않음 — 하위 페이지들이 이미 " | 모두다른고양이 미술학원"을 직접 포함
  title: "모두다른고양이 미술학원(모다고) | 홍대 본원 · 일산 캠퍼스 미대입시",
  description:
    "모다고 모두다른고양이 미술학원 — 서울대 252명, 홍익대 792명 누적 합격. 홍대 본원 · 일산 캠퍼스 미대입시 전문. 2027 미대 기숙 윈터스쿨 모집 중.",
  keywords: [
    "모다고",
    "모두다른고양이",
    "모두다른고양이미술학원",
    "모다고미술학원",
    "홍대미술학원",
    "일산미술학원",
    "미대입시",
    "미대입시학원",
    "미대기숙학원",
    "미대정시",
  ],
  // alternates.canonical을 루트에 두지 않음 — 자체 canonical이 없는 모든 하위 페이지에
  // 상속되어 canonical이 홈으로 찍히는 중복 문서 문제가 생김 (도메인 정규화는 308 리다이렉트가 담당)
  openGraph: {
    type: "website",
    url: "https://www.modago.me",
    siteName: "모두다른고양이 미술학원",
    locale: "ko_KR",
    title: "모두다른고양이 미술학원(모다고) | 홍대 · 일산 미대입시",
    description:
      "서울대 252명, 홍익대 792명 누적 합격. 2027 미대 기숙 윈터스쿨 모집 중.",
    // 자체 openGraph가 없는 페이지(/teachers·/gisuk·/tuition 등)가 이 그림을 물려받는다.
    // openGraph를 직접 정의하는 페이지는 통째로 갈아끼우므로 그쪽에도 각자 넣어야 한다.
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
  verification: {
    other: {
      "naver-site-verification": "1f8cf936e99f06be87d0e109d53c43539a6ebc8c",
    },
  },
  // 카드 종류만 루트에서 정하고 제목·설명은 두지 않는다.
  // 하위 페이지는 openGraph만 정의하는데, Next는 openGraph는 페이지 값으로
  // 갈아끼우면서 twitter는 루트 값을 그대로 물려준다. 여기에 제목을 적어 두면
  // 모든 하위 페이지의 공유 카드가 학원 일반 소개로 고정된다.
  // 비워 두면 각 소비자가 그 페이지의 og:title·og:description으로 대체한다.
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head data-clarity-unmask="true">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        <SiteNav />
        {children}
        <NaverTalkFab />
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            {/* Google Analytics 4 (gtag.js) */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-PNVLJBJ8NR"
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-PNVLJBJ8NR');`}
            </Script>
            {/* useSearchParams는 Suspense 경계가 없으면 모든 페이지를
                동적 렌더로 떨어뜨린다 */}
            <Suspense fallback={null}>
              <GaPageView gaId="G-PNVLJBJ8NR" />
            </Suspense>
            {/* Microsoft Clarity — 히트맵·세션 레코딩 */}
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xy4nemyqcp");`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
