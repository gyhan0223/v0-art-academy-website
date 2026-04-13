"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  velocity: number
  size: number
}

export default function Scene4() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isExploding, setIsExploding] = useState(false)

  const handleCTAClick = useCallback(() => {
    if (isExploding) return

    setIsExploding(true)

    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i / 24) * 360,
      velocity: 100 + Math.random() * 150,
      size: 4 + Math.random() * 8,
    }))

    setParticles(newParticles)

    // Open Kakao channel
    window.open("https://pf.kakao.com/_xkxkPN", "_blank")

    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
      setIsExploding(false)
    }, 1000)
  }, [isExploding])

  return (
    <section className="relative min-h-screen bg-background py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* CTA Section */}
        <div className="text-center mb-20">
          <motion.p
            className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Start Your Journey
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-balance">
              지금{" "}
              <span
                className="text-primary"
                style={{
                  textShadow:
                    "0 0 40px rgba(245, 136, 70, 0.4), 0 0 80px rgba(245, 136, 70, 0.2)",
                }}
              >
                상담
              </span>
              을 시작하세요
            </span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            카카오톡으로 간편하게 상담 예약하세요. 
            개인별 맞춤 커리큘럼을 안내해 드립니다.
          </motion.p>

          {/* CTA Button with particle effect */}
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={handleCTAClick}
              className="relative px-10 py-5 bg-primary text-primary-foreground font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                boxShadow:
                  "0 0 40px rgba(245, 136, 70, 0.4), 0 0 80px rgba(245, 136, 70, 0.2)",
              }}
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                카카오톡 상담하기
              </span>
            </button>

            {/* Particles */}
            <AnimatePresence>
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute left-1/2 top-1/2 rounded-full bg-primary pointer-events-none"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    x: Math.cos((particle.angle * Math.PI) / 180) * particle.velocity,
                    y: Math.sin((particle.angle * Math.PI) / 180) * particle.velocity,
                    opacity: 0,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    width: particle.size,
                    height: particle.size,
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ContactCard
            icon={<Phone className="w-5 h-5" />}
            title="전화 상담"
            content="010-1234-5678"
            href="tel:010-1234-5678"
          />
          <ContactCard
            icon={<MapPin className="w-5 h-5" />}
            title="위치"
            content="경기 고양시 일산동구 중앙로"
            href="https://naver.me/example"
          />
          <ContactCard
            icon={<Clock className="w-5 h-5" />}
            title="운영 시간"
            content="평일 14:00 - 22:00"
          />
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-20 pt-10 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm">
            모두다른고양이 미술학원 일산점
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.footer>
      </div>
    </section>
  )
}

function ContactCard({
  icon,
  title,
  content,
  href,
}: {
  icon: React.ReactNode
  title: string
  content: string
  href?: string
}) {
  const Wrapper = href ? "a" : "div"
  const wrapperProps = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="block p-6 rounded-xl border transition-all duration-300 hover:border-primary/30 group"
      style={{
        backgroundColor: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary">{icon}</div>
        <span className="text-muted-foreground text-sm">{title}</span>
      </div>
      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
        {content}
      </p>
    </Wrapper>
  )
}
