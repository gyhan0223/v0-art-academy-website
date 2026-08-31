import type { Metadata } from "next";
import DiagnosisFlow from "@/components/diagnosis/DiagnosisFlow";
import {
  normalizeDiagnosisEntrySource,
  normalizeDiagnosisTarget,
} from "@/lib/diagnosis/entry-params";

export const metadata: Metadata = {
  title: "내 성적으로 갈 수 있는 미대 진단 | 모두다른고양이 미술학원",
  description:
    "현재 수능·모의고사 성적과 준비 중인 실기를 기준으로 지원 가능한 미대 조합을 진단하고, 한 등급 상승 시 지원 전략이 어떻게 넓어지는지 비교해보세요. 약 1분, 회원가입 없음.",
  alternates: { canonical: "/diagnosis" },
  openGraph: {
    title: "내 성적으로 갈 수 있는 미대, 지금 바로 확인해보세요",
    description:
      "성적과 실기 기준 미대 지원 전략 진단 — 약 1분, 회원가입 없음.",
    type: "website",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

/**
 * ?from=jungsi&target=건국대학교 형태로 들어오면 target 대학 기준으로
 * 첫 화면·결과를 개인화한다. target은 실존 대학명일 때만 통과시키고
 * (entry-params.ts), 아니면 기존 일반 진단 그대로다.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  return (
    <DiagnosisFlow
      initialTarget={normalizeDiagnosisTarget(first(params.target))}
      entrySource={normalizeDiagnosisEntrySource(first(params.from))}
    />
  );
}
