import type { MetadataRoute } from "next";
import { IS_PLACEHOLDER as GRADE_CASES_PLACEHOLDER } from "@/lib/grade-cases";

const baseUrl = "https://www.modago.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/winter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide/jungsi-2026`,
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
