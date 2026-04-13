"use client"

import { MessageCircle } from "lucide-react"

export default function KakaoFAB() {
  return (
    <a
      href="https://open.kakao.com/o/placeholder"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-5 z-40 flex items-center gap-2 bg-[#FEE500] text-[#3A1D1D] pl-3.5 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
      aria-label="카카오톡으로 상담하기"
    >
      <MessageCircle size={20} strokeWidth={2} fill="#3A1D1D" className="text-[#3A1D1D]" />
      <span className="text-xs font-black tracking-tight whitespace-nowrap">카카오톡 상담</span>
    </a>
  )
}
