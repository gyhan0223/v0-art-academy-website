import type { MetadataRoute } from "next";

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
    // /tuition, /guide/hongik-mihwalbo는 noindex 페이지라 사이트맵에서 제외
  ];
}
