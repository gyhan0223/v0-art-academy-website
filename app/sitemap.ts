import type { MetadataRoute } from "next";
import { IS_PLACEHOLDER as GRADE_CASES_PLACEHOLDER } from "@/lib/grade-cases";
import { IS_PLACEHOLDER as TEACHERS_PLACEHOLDER } from "@/lib/teachers";
import { IS_PLACEHOLDER as WINTER_RESULTS_PLACEHOLDER } from "@/lib/winter-results";
import { FINAL_IS_RECRUITING, FINAL_PROGRAM } from "@/lib/final-program";

const baseUrl = "https://www.modago.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // 2027 수능 파이널 집중반 랜딩 — 9평 이후~수능 전 모집 기간에는 자주 갱신되므로 weekly
    {
      url: `${baseUrl}${FINAL_PROGRAM.href}`,
      lastModified: new Date(),
      changeFrequency: FINAL_IS_RECRUITING ? "weekly" : "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/winter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // 일산캠퍼스 광고 랜딩 — 지역 키워드(일산 미술학원 등) 검색 유입 도착 페이지
    {
      url: `${baseUrl}/ilsan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/winter/schedule`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/winter/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // 윈터스쿨 강사진 — 강사 카드는 /teachers와 같은 데이터지만 과목별 8주
    // 목표·수업 FAQ가 이 페이지에만 있어 각자 색인되게 둔다(canonical도 자기 자신).
    // 강사 데이터가 초안인 동안에는 /teachers와 함께 빠진다.
    ...(TEACHERS_PLACEHOLDER
      ? []
      : [
          {
            url: `${baseUrl}/winter/teachers`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]),
    // 성적 향상 사례 — 자리표시자 상태에서는 noindex라 사이트맵에서도 제외
    ...(WINTER_RESULTS_PLACEHOLDER
      ? []
      : [
          {
            url: `${baseUrl}/winter/results`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]),
    // 유료 1:1 입시 전략 컨설팅 랜딩 — 검색 유입 도착 페이지
    {
      url: `${baseUrl}/consulting`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide/jungsi-2027`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gisuk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mock`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // 강사진 — 초안(headline·상주 여부 확인 전) 상태에서는 noindex라 사이트맵에서도 제외
    ...(TEACHERS_PLACEHOLDER
      ? []
      : [
          {
            url: `${baseUrl}/teachers`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]),
    // 성적 향상 사례 — 자리표시자 상태에서는 noindex라 사이트맵에서도 제외
    ...(GRADE_CASES_PLACEHOLDER
      ? []
      : [
          {
            url: `${baseUrl}/grade-up`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]),
    // /tuition, /guide/hongik-mihwalbo는 noindex 페이지라 사이트맵에서 제외
  ];
}
