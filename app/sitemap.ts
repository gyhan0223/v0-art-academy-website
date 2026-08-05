import type { MetadataRoute } from "next";
import { IS_PLACEHOLDER as GRADE_CASES_PLACEHOLDER } from "@/lib/grade-cases";
import { IS_PLACEHOLDER as TEACHERS_PLACEHOLDER } from "@/lib/teachers";
import { IS_PLACEHOLDER as WINTER_RESULTS_PLACEHOLDER } from "@/lib/winter-results";

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
    // /winter/teachers는 /teachers와 같은 강사진을 윈터스쿨 문맥으로 보여주는
    // 페이지라 canonical을 /teachers로 걸어 두었다. 사이트맵에는 원본만 올린다.
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
