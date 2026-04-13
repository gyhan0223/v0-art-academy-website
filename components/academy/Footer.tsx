export default function Footer() {
  return (
    <footer className="bg-foreground border-t border-background/10 px-5 py-10" role="contentinfo">
      <div className="flex flex-col gap-6">
        {/* Logo & tagline */}
        <div>
          <p className="text-background/30 text-[9px] tracking-[0.25em] uppercase mb-1">
            Fine Arts Academy
          </p>
          <p className="text-background font-black text-base tracking-tight">
            모두다른고양이
          </p>
          <p className="text-background/40 text-xs mt-1">일산점</p>
        </div>

        {/* Quick links */}
        <nav aria-label="푸터 내비게이션">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {["홈", "학원 소개", "합격 갤러리", "오시는 길", "입학 상담"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-background/40 text-xs hover:text-background/70 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="h-px bg-background/10" role="separator" />

        {/* Contact & hours */}
        <div className="flex flex-col gap-1.5">
          <p className="text-background/50 text-xs">
            <span className="text-background/30 mr-2">TEL</span>
            <a href="tel:031-000-0000" className="hover:text-background transition-colors">
              031-000-0000
            </a>
          </p>
          <p className="text-background/50 text-xs">
            <span className="text-background/30 mr-2">EMAIL</span>
            <a href="mailto:info@allcats-art.kr" className="hover:text-background transition-colors">
              info@allcats-art.kr
            </a>
          </p>
          <p className="text-background/50 text-xs">
            <span className="text-background/30 mr-2">HOURS</span>
            평일 13:00 – 19:00 (토·일·공휴일 휴무)
          </p>
          <p className="text-background/50 text-xs">
            <span className="text-background/30 mr-2">ADDR</span>
            경기도 고양시 일산동구 ○○로 ○○○
          </p>
        </div>

        {/* Copyright */}
        <p className="text-background/20 text-[10px]">
          © 2024 모두다른고양이 미술학원 일산점. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
