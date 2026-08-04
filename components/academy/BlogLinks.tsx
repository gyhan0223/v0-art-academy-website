import { BRANCH_BLOGS } from "@/lib/contact";

/**
 * 지점별 네이버 블로그 링크.
 * 사이트 밖으로 내보내는 링크라 헤더가 아니라 푸터·지점 안내처럼
 * "찾는 사람만 찾는" 자리에 둔다.
 */
export default function BlogLinks({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="지점 블로그"
      className={`flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6 ${className}`}
    >
      {BRANCH_BLOGS.map((blog) => (
        <a
          key={blog.href}
          href={blog.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {blog.label}
          {/* 외부 사이트로 이동한다는 신호 — 스크린리더에는 읽히지 않게 둔다 */}
          <span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </nav>
  );
}
