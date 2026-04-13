import { MapPin, Clock, Phone, Mail } from "lucide-react"

export default function LocationSection() {
  return (
    <section
      id="location"
      className="bg-background py-16 px-5"
      aria-labelledby="location-heading"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-px bg-accent" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground font-light uppercase">
            Location
          </span>
        </div>
        <h2
          id="location-heading"
          className="text-foreground font-black text-2xl leading-tight tracking-tight text-balance"
        >
          오시는 길 &amp;
          <br />
          <span className="text-accent">운영 안내</span>
        </h2>
      </div>

      {/* Map placeholder */}
      <div className="relative w-full rounded-sm overflow-hidden mb-6 border border-border">
        <div
          className="bg-secondary w-full h-52 flex flex-col items-center justify-center gap-3"
          role="img"
          aria-label="일산점 지도 위치"
        >
          {/* Stylized map mockup */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center bg-background">
              <MapPin size={28} className="text-accent" strokeWidth={1.5} />
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border border-accent/30 scale-125 animate-ping" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-bold text-sm">모두다른고양이 일산점</p>
            <p className="text-muted-foreground text-xs mt-1">
              경기도 고양시 일산동구 ○○로 ○○○
            </p>
          </div>
          <a
            href="https://map.naver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-accent text-xs font-medium border-b border-accent/40 hover:border-accent transition-colors"
          >
            네이버 지도에서 보기 →
          </a>
        </div>
      </div>

      {/* Info cards */}
      <ul className="flex flex-col gap-3" role="list">
        {[
          {
            icon: Clock,
            label: "운영 시간",
            value: "평일 오후 1:00 – 오후 7:00",
            sub: "토·일·공휴일 휴무",
          },
          {
            icon: Phone,
            label: "전화 상담",
            value: "031-000-0000",
            sub: "운영 시간 내 연결 가능",
            href: "tel:031-000-0000",
          },
          {
            icon: Mail,
            label: "이메일",
            value: "info@allcats-art.kr",
            sub: "24시간 접수 가능",
            href: "mailto:info@allcats-art.kr",
          },
          {
            icon: MapPin,
            label: "주소",
            value: "경기도 고양시 일산동구 ○○로 ○○○",
            sub: "○○역 1번 출구 도보 5분",
          },
        ].map((item, idx) => {
          const Icon = item.icon
          const content = (
            <li
              key={idx}
              className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm hover:border-accent/30 transition-colors"
              role="listitem"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon size={16} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase mb-0.5">
                  {item.label}
                </p>
                <p className="text-foreground font-semibold text-sm">{item.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
              </div>
            </li>
          )

          if (item.href) {
            return (
              <a key={idx} href={item.href} className="block">
                {content}
              </a>
            )
          }
          return content
        })}
      </ul>
    </section>
  )
}
