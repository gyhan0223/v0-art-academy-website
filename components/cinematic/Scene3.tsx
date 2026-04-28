"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Box,
  PenTool,
  Lightbulb,
  FileText,
  ArrowRight,
} from "lucide-react";

const curriculumItems = [
  {
    title: "기초 수업",
    description:
      "관찰의 시작부터 선의 운용까지, 최상위권 입시를 위한 가장 단단한 뿌리를 내립니다.",
    icon: <PenTool className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/design_basics.pdf",
    isClickable: true, // 클릭 가능 여부
  },
  {
    title: "기초 투시",
    description:
      "공간의 논리를 통해 어떤 난해한 형태도 완벽하게 구현하는 설계를 익힙니다.",
    icon: <Box className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/perspective_basics.pdf",
    isClickable: true,
  },
  {
    title: "재료 탐구",
    description:
      "다양한 매체의 특성을 마스터하여 표현의 한계를 넘고, 압도적 차이를 만듭니다.",
    icon: <BookOpen className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "/curriculum/material_exploration.pdf",
    isClickable: true,
  },
  {
    title: "기초 소양",
    description:
      "최상위권 대학이 요구하는 인문학적 통찰과 창의적 문제 해결력을 기릅니다.",
    icon: <Lightbulb className="w-10 h-10 fill-orange-500/20" />,
    pdfUrl: "#",
    isClickable: false, // 💡 4번째 카드는 클릭 불가 설정
  },
];

export default function Scene3() {
  return (
    <section className="relative min-h-screen bg-[#05050a] py-32 md:py-48 px-6 overflow-hidden">
      {/* 시네마틱 배경 빛 장식 */}
      <div className="absolute top-0 left-1/4 w-250 h-250 bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-200 h-200amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-24 md:mb-32 text-center"
        >
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
            // 클릭 가능 여부에 따라 컴포넌트 태그 결정 (a 또는 div)
            const CardComponent = item.isClickable ? motion.a : motion.div;

            return (
              <CardComponent
                key={index}
                href={item.isClickable ? item.pdfUrl : undefined}
                target={item.isClickable ? "_blank" : undefined}
                rel={item.isClickable ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={
                  item.isClickable
                    ? {
                        y: -15,
                        borderColor: "rgba(251, 191, 36, 0.6)",
                        background:
                          "linear-gradient(135deg, rgba(251, 191, 36, 0.08), transparent)",
                      }
                    : { y: -5 }
                } // 클릭 안되는 카드는 살짝만 올라가는 효과
                className={`group relative p-10 md:p-14 rounded-4xl border border-white/10 bg-white/3 backdrop-blur-xl overflow-hidden h-auto flex flex-col justify-between transition-all duration-500 ease-out ${item.isClickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {/* 카드 상단: 아이콘 */}
                <div className="flex items-start justify-between mb-16 relative z-10">
                  <div className="text-orange-400 group-hover:text-amber-300 transition-all duration-500">
                    {item.icon}
                  </div>
                </div>

                {/* 카드 중앙: 타이틀 & 설명 */}
                <div className="relative z-10 grow mb-12">
                  <h3
                    className={`text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight break-keep ${item.isClickable ? "group-hover:text-amber-100" : ""} transition-colors`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed text-base md:text-lg tracking-wide break-keep max-w-100">
                    {item.description}
                  </p>
                </div>

                {/* 카드 하단: 안내 문구 및 번호 */}
                <div className="relative z-10 flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                  <div
                    className={`flex items-center gap-3 ${item.isClickable ? "text-white/70 group-hover:text-amber-200" : "text-white/30"}`}
                  >
                    {item.isClickable ? (
                      <>
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">
                          커리큘럼 PDF 열기
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    ) : (
                      <span className="text-sm font-medium tracking-wide italic">
                        상담을 통해 확인 가능합니다
                      </span>
                    )}
                  </div>
                  <span className="text-6xl md:text-7xl font-black text-white/4 pointer-events-none group-hover:text-white/8 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* 호버 시 은은한 배경 광원 (클릭 가능할 때만) */}
                {item.isClickable && (
                  <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                )}
              </CardComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
