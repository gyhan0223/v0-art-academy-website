"use client";

import { motion } from "framer-motion";
// lucide-react에서 고급스러운 Fill 아이콘으로 교체
import {
  BookOpen,
  Box,
  PenTool,
  Lightbulb,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";

const curriculumItems = [
  {
    title: "기초 수업",
    description:
      "관찰의 시작부터 선의 운용까지, 최상위권 입시를 위한 가장 단단한 뿌리를 내립니다.",
    // filled 아이콘으로 교체
    icon: <PenTool className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/design_basics.pdf",
    isSecret: false,
  },
  {
    title: "기초 투시",
    description:
      "공간의 논리를 통해 어떤 난해한 형태도 완벽하게 구현하는 설계를 익힙니다.",
    icon: <Box className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/perspective_basics.pdf",
    isSecret: false,
  },
  {
    title: "재료 탐구",
    description:
      "다양한 매체의 특성을 마스터하여 표현의 한계를 넘고, 압도적 차이를 만듭니다.",
    icon: <BookOpen className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/material_exploration.pdf",
    isSecret: false,
  },
  {
    title: "기초 소양",
    description:
      "최상위권 대학이 요구하는 인문학적 통찰과 창의적 문제 해결력을 기릅니다.",
    icon: <Lightbulb className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "#",
    isSecret: true,
  },
];

export default function Scene3() {
  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(
      "🔒 기초 소양 커리큘럼은 학원 내부 보안 규정으로 인해 온라인으로 공개하지 않습니다.\n\n자세한 내용은 본원에 방문하여 상담해 주시기 바랍니다.",
    );
  };

  return (
    // 💡 배경: 매우 깊은 네이비/퍼플톤으로 깊이감 추가
    <section className="relative min-h-screen bg-[#05050a] py-32 md:py-48 px-6 overflow-hidden">
      {/* 💡 시네마틱 배경 빛 장식 (퍼플 & 오렌지 조합) */}
      <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-24 md:mb-32 text-center"
        >
          {/* 💡 타이틀 뒤 드라마틱한 오렌지 후광 효과 */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

          <span className="relative inline-block text-orange-400 font-bold tracking-widest text-sm md:text-base uppercase mb-4 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5">
            The Curriculum
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mt-4 tracking-tighter leading-none break-keep drop-shadow-lg">
            생각의 힘을 설계하는
            <br />
            핵심 교육 과정
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {curriculumItems.map((item, index) => {
            const CardComponent = item.isSecret ? motion.div : motion.a;

            return (
              <CardComponent
                key={index}
                href={item.isSecret ? undefined : item.pdfUrl}
                target={item.isSecret ? undefined : "_blank"}
                rel={item.isSecret ? undefined : "noopener noreferrer"}
                onClick={item.isSecret ? handleSecretClick : undefined}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, amount: 0.1 }}
                // 💡 호버 시: 카드 자체는 앰버톤으로 밝아지고, 테두리가 빛남
                whileHover={{
                  y: -15,
                  borderColor: item.isSecret
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(251, 191, 36, 0.6)",
                  background:
                    "linear-gradient(135deg, rgba(251, 191, 36, 0.08), transparent)",
                }}
                className={`group relative p-10 md:p-14 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden h-auto flex flex-col justify-between transition-all duration-500 ease-out ${item.isSecret ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {/* 카드 상단: 아이콘 & 보안 플래그 */}
                <div className="flex items-start justify-between mb-16 relative z-10">
                  <div className="text-orange-400 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-500">
                    {item.icon}
                  </div>
                  {item.isSecret && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 border border-red-500/30 rounded-full bg-red-950/20">
                      <Lock className="w-3.5 h-3.5" />
                      내부 보안 규정
                    </span>
                  )}
                </div>

                {/* 카드 중앙: 타이틀 & 설명 */}
                <div className="relative z-10 flex-grow mb-12">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight break-keep group-hover:text-amber-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed text-base md:text-lg tracking-wide break-keep max-w-[400px]">
                    {item.description}
                  </p>
                </div>

                {/* 카드 하단: PDF 안내 & 번호 */}
                <div className="relative z-10 flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                  <div
                    className={`flex items-center gap-3 ${item.isSecret ? "text-white/40" : "text-white/70 group-hover:text-amber-200"}`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide">
                      {item.isSecret
                        ? "방문 상담 시 안내 가능"
                        : "커리큘럼 PDF 열기"}
                    </span>
                    {!item.isSecret && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    )}
                  </div>
                  <span className="text-6xl md:text-7xl font-black text-white/[0.04] pointer-events-none group-hover:text-white/[0.08] transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* 💡 호버 시 은은한 배경 오렌지 빛 추가 */}
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </CardComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
