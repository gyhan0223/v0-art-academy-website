import type { Metadata, Viewport } from "next"; // 💡 Viewport 임포트 추가
import { Analytics } from "@vercel/analytics/next";
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
    "모다고 모두다른고양이 미술학원 — 서울대 252명, 홍익대 792명 누적 합격. 홍대 본원 · 일산 캠퍼스 미대입시 전문. 2027 미대 기숙 윈터캠프 모집 중.",
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
      "서울대 252명, 홍익대 792명 누적 합격. 2027 미대 기숙 윈터캠프 모집 중.",
  },
  verification: {
    other: {
      "naver-site-verification": "1f8cf936e99f06be87d0e109d53c43539a6ebc8c",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "모두다른고양이 미술학원(모다고) | 홍대 · 일산 미대입시",
    description:
      "서울대 252명, 홍익대 792명 누적 합격. 2027 미대 기숙 윈터캠프 모집 중.",
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
      <head>
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
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
