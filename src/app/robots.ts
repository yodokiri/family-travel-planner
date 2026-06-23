import type { MetadataRoute } from "next";

// 旅行ページは共有URL前提。検索エンジンには全面的に出さない。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
