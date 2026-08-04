"use client";

/**
 * 모바일 전용 하단 고정 바 — 첫 화면 절반만 지나도 나타나 신청 동선을 항상 유지한다.
 * 윈터캠프 개요와 하위 페이지 모두에서 쓴다. 상담 폼이 없는 하위 페이지에서는
 * "상담 신청"이 /winter#consult-form으로 이동한다.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare, PenLine } from "lucide-react";
import { CAMP_INFO, SMS_HREF } from "@/lib/winter-camp";
import { CONSULT_HREF, goToConsult } from "@/components/winter/shared";

export default function MobileActionBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 gap-2 border-t border-white/10 bg-black/90 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden"
        >
          <a
            href={CAMP_INFO.phoneTel}
            aria-label={`전화 문의 ${CAMP_INFO.phone}`}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/15 py-2 text-white"
          >
            <Phone size={17} />
            <span className="text-[11px] font-medium">전화</span>
          </a>
          <a
            href={SMS_HREF}
            aria-label="문자 문의"
            className="flex flex-col items-center gap-1 rounded-xl border border-white/15 py-2 text-white"
          >
            <MessageSquare size={17} />
            <span className="text-[11px] font-medium">문자</span>
          </a>
          <Link
            href={CONSULT_HREF}
            onClick={goToConsult}
            className="flex flex-col items-center gap-1 rounded-xl bg-accent py-2 text-black"
          >
            <PenLine size={17} />
            <span className="text-[11px] font-bold">상담 신청</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
