import { Trophy, BookOpen, UserCheck } from "lucide-react"

const features = [
  {
    icon: Trophy,
    title: "최상위권 합격 노하우",
    desc: "서울대, 홍익대, 연세대 등 국내 최고 미대 합격을 이끈 검증된 입시 전략과 노하우를 바탕으로 최고의 결과를 만들어 드립니다.",
    tag: "Proven Results",
  },
  {
    icon: BookOpen,
    title: "체계적인 기초 소양 커리큘럼",
    desc: "단순한 기법 훈련을 넘어, 미적 감각과 조형적 사고력을 키우는 심층적 기초 소양 교육 시스템을 운영합니다.",
    tag: "Curriculum",
  },
  {
    icon: UserCheck,
    title: "1:1 맞춤형 진학 컨설팅",
    desc: "학생 개인의 강점과 성향을 분석해 지원 대학, 전공, 포트폴리오 방향까지 전 과정을 밀착 관리합니다.",
    tag: "Consulting",
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-background py-16 px-5"
      aria-labelledby="features-heading"
    >
      {/* Section header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-px bg-accent" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground font-light uppercase">
            Why Us
          </span>
        </div>
        <h2
          id="features-heading"
          className="text-foreground font-black text-2xl leading-tight tracking-tight text-balance"
        >
          모두다른고양이만의
          <br />
          <span className="text-accent">3가지 강점</span>
        </h2>
      </div>

      {/* Feature cards */}
      <ul className="flex flex-col gap-4" role="list">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <li
              key={idx}
              className="group bg-card border border-border rounded-sm p-6 transition-all hover:border-accent/40 hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Icon circle */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Icon
                    size={20}
                    className="text-accent group-hover:text-accent-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-sm leading-snug">
                      {feature.title}
                    </h3>
                    <span className="flex-shrink-0 text-[9px] tracking-wider text-accent font-medium border border-accent/30 rounded-full px-2 py-0.5">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>

              {/* Index */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[40px] font-black text-muted/80 leading-none select-none">
                  0{idx + 1}
                </span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                  특화 강점
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
