import { WINTER_AUDIENCE_PAGES } from "@/lib/winter-camp";

export default function WinterAudienceNav({ current }: { current: string }) {
  return (
    <div className="rt-context rt-audience-context">
      <nav className="rt-wrap rt-audience-inner" aria-label="학년별 겨울 준비">
        <a className="rt-audience-title" href="/winter">학년별 겨울 준비</a>
        <div className="rt-audience-tabs">
          {WINTER_AUDIENCE_PAGES.map(page => (
            <a key={page.href} href={page.href} aria-current={current === page.href ? "page" : undefined}>
              {page.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
