"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { NAVER_TALK_URL, CAMPUSES } from "@/lib/contact";
import BlogLinks from "@/components/academy/BlogLinks";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
}

export default function Scene4() {
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
            네이버 예약으로 간편하게 상담 예약하세요. 개인별 맞춤 커리큘럼을
            안내해 드립니다.
          </motion.p>

          {/* 예약 상품이 캠퍼스마다 달라 버튼도 캠퍼스별로 둔다 —
              주소는 lib/contact.ts의 CAMPUSES 하나만 고치면 된다. */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {CAMPUSES.map((campus) => (
              <BookingButton
                key={campus.label}
                label={`${campus.label} 네이버 예약`}
                href={campus.bookingUrl}
              />
            ))}
          </motion.div>

          {/* 예약이 생겨도 전화로 물어보는 편이 편한 분들이 있다 —
              번호는 그대로 눌러서 걸 수 있게 남겨 둔다. */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p className="text-muted-foreground text-sm">
              전화 상담도 그대로 받습니다.
            </p>
            <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {CAMPUSES.map((campus) => (
                <a
                  key={campus.label}
                  href={`tel:${campus.phone}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Phone className="w-4 h-4" />
                  {campus.label} {campus.phone}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ContactCard
            icon={<Phone className="w-5 h-5" />}
            title="홍대 본원 전화"
            content="02-338-3302"
            href="tel:02-338-3302"
          />
          <ContactCard
            icon={<Phone className="w-5 h-5" />}
            title="일산 캠퍼스 전화"
            content="031-916-8885"
            href="tel:031-916-8885"
          />
          {/* 전화가 부담스러운 시간대에도 남길 수 있는 창구 */}
          <ContactCard
            icon={<MessageCircle className="w-5 h-5" />}
            title="네이버 톡톡"
            content="메시지로 간편 문의"
            href={NAVER_TALK_URL}
            className="md:col-span-2"
          />
          <ContactCard
            icon={<MapPin className="w-5 h-5" />}
            title="홍대 본원"
            content="서울특별시 마포구 와우산로23길 9 칼리오페 5층"
            href="https://naver.me/5wWq5AUs"
          />
          <ContactCard
            icon={<MapPin className="w-5 h-5" />}
            title="일산 캠퍼스"
            content="경기 고양시 일산동구 원중1길 56 8층"
            href="https://naver.me/FpPBS3sw"
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
            모두다른고양이 미술학원
          </p>

          {/* 지점 블로그 — 외부로 나가는 링크라 헤더가 아닌 푸터에 둔다 */}
          <BlogLinks className="mt-5" />

          <p className="text-muted-foreground/60 text-xs mt-6">
            학원등록번호 제02201000109호 ·{" "}
            <Link
              href="/tuition"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              교습비 고지
            </Link>
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.footer>
      </div>
    </section>
  );
}

/**
 * 예약 버튼 — 누르면 입자가 터지고 새 탭으로 네이버 예약이 열린다.
 * 입자 상태를 버튼마다 따로 들고 있어야 한 쪽을 눌렀을 때
 * 다른 캠퍼스 버튼에서도 같이 터지지 않는다.
 */
function BookingButton({ label, href }: { label: string; href: string }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  const handleClick = useCallback(() => {
    if (isExploding) return;

    setIsExploding(true);

    const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i / 24) * 360,
      velocity: 100 + Math.random() * 150,
      size: 4 + Math.random() * 8,
    }));

    setParticles(newParticles);
    window.open(href, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setParticles([]);
      setIsExploding(false);
    }, 1000);
  }, [href, isExploding]);

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="relative whitespace-nowrap rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 md:text-lg"
        style={{
          boxShadow:
            "0 0 40px rgba(245, 136, 70, 0.4), 0 0 80px rgba(245, 136, 70, 0.2)",
        }}
      >
        <span className="flex items-center justify-center gap-3">
          <MessageCircle className="w-5 h-5" />
          {label}
        </span>
      </button>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 rounded-full bg-primary pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((particle.angle * Math.PI) / 180) * particle.velocity,
              y: Math.sin((particle.angle * Math.PI) / 180) * particle.velocity,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: particle.size, height: particle.size }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  content,
  href,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
  className?: string;
}) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: href.startsWith("http") ? "_blank" : undefined,
        rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block p-6 rounded-xl border transition-all duration-300 hover:border-primary/30 group ${className}`}
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
  );
}
