"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", grade: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="bg-foreground py-16 px-5"
      aria-labelledby="contact-heading"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-px bg-accent" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.3em] text-background/40 font-light uppercase">
            Consultation
          </span>
        </div>
        <h2
          id="contact-heading"
          className="text-background font-black text-2xl leading-tight tracking-tight text-balance"
        >
          입학 상담
          <br />
          <span className="text-accent">예약하기</span>
        </h2>
        <p className="text-background/50 text-sm mt-3 leading-relaxed text-pretty">
          아래 양식을 작성하시면 운영 시간 내 빠르게 연락드립니다.
          카카오톡 상담도 가능합니다.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <CheckCircle size={48} className="text-accent" strokeWidth={1.5} />
          <h3 className="text-background font-bold text-lg">상담 신청 완료!</h3>
          <p className="text-background/50 text-sm leading-relaxed">
            영업일 기준 1일 이내로 연락드리겠습니다.
            <br />
            감사합니다.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-accent text-sm border-b border-accent/40 hover:border-accent transition-colors"
          >
            다시 작성하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-background/50 text-[10px] tracking-widest uppercase mb-2"
            >
              이름 *
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className="w-full bg-background/5 border border-background/10 rounded-sm px-4 py-3.5 text-background text-sm placeholder:text-background/20 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-background/50 text-[10px] tracking-widest uppercase mb-2"
            >
              연락처 *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000"
              className="w-full bg-background/5 border border-background/10 rounded-sm px-4 py-3.5 text-background text-sm placeholder:text-background/20 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Grade */}
          <div>
            <label
              htmlFor="grade"
              className="block text-background/50 text-[10px] tracking-widest uppercase mb-2"
            >
              학년
            </label>
            <select
              id="grade"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="w-full bg-background/5 border border-background/10 rounded-sm px-4 py-3.5 text-background text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              <option value="" className="bg-foreground">선택해주세요</option>
              <option value="middle3" className="bg-foreground">중학교 3학년</option>
              <option value="high1" className="bg-foreground">고등학교 1학년</option>
              <option value="high2" className="bg-foreground">고등학교 2학년</option>
              <option value="high3" className="bg-foreground">고등학교 3학년 (수험생)</option>
              <option value="retry" className="bg-foreground">재수생</option>
              <option value="other" className="bg-foreground">기타</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-background/50 text-[10px] tracking-widest uppercase mb-2"
            >
              문의 사항
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="궁금하신 점을 자유롭게 작성해 주세요."
              className="w-full bg-background/5 border border-background/10 rounded-sm px-4 py-3.5 text-background text-sm placeholder:text-background/20 focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground py-4 px-6 text-sm font-bold tracking-wide rounded-sm mt-2 transition-all active:scale-95 hover:bg-accent/90"
          >
            상담 신청하기
            <ArrowRight size={16} strokeWidth={2} />
          </button>

          <p className="text-background/20 text-[10px] text-center leading-relaxed">
            개인정보는 상담 목적 외 사용되지 않으며,
            <br />
            상담 후 즉시 파기됩니다.
          </p>
        </form>
      )}
    </section>
  )
}
