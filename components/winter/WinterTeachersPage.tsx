"use client";

/**
 * /winter/teachers — 윈터스쿨 문맥에서 본 강사진.
 *
 * 강사 데이터와 카드는 /teachers와 같은 것을 쓴다(lib/teachers.ts,
 * components/academy/TeacherCard.tsx). 여기서만 다른 것은 "8주 동안 이 강사들이
 * 무엇을 하는가" — 과목별 운영과 수업 FAQ다. 강사가 바뀌면 lib/teachers.ts만
 * 고치면 두 페이지가 함께 바뀐다.
 *
 * 같은 강사진을 두 URL로 보여주므로 이 페이지의 canonical은 /teachers다
 * (app/winter/teachers/page.tsx 참고).
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  IS_PLACEHOLDER,
  SUBJECT_DESC,
  SUBJECT_NOTE,
  SUBJECT_ORDER,
  MAX_CAREERS,
  getFacultyCount,
  getTeachersBySubject,
} from "@/lib/teachers";
import TeacherCard from "@/components/academy/TeacherCard";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  WinterTabs,
  AccordionItem,
  PlaceholderNotice,
} from "@/components/winter/shared";

/** 과목별로 8주 동안 무엇을 하는지 — 이 페이지에만 있는 윈터스쿨 내용 */
const SUBJECT_PLANS = [
  {
    subject: "국어",
    goal: "문학·독서 기본 개념을 정리하고, 기출 지문으로 독해 훈련을 반복합니다.",
    method: "매일 지문 학습 + 주 2회 모의고사로 점검",
  },
  {
    subject: "영어",
    goal: "매일 영단어 100개 암기와 구문 독해로 기본기를 확보합니다.",
    method: "매일 밤 100단어 시험 + 구문 강의 + 오답 관리",
  },
  {
    subject: "사회탐구",
    goal: "선택 과목 개념 1회독을 목표로 기본 개념을 정리합니다.",
    method: "개념 강의 + 단원별 문제 풀이",
  },
];

/** 수업 운영에 대해 상담 전 가장 많이 받는 질문 */
const CLASS_FAQ = [
  {
    q: "미술을 처음 시작하는데 참여할 수 있나요?",
    a: "네, 참여할 수 있습니다. 입소 전 레벨 테스트로 실기 수준을 확인한 뒤 그에 맞는 반에서 시작하며, 기초가 필요한 학생은 소묘·발상과 표현부터 다집니다.",
  },
  {
    q: "학과 수업 수준은 학생마다 어떻게 맞춰지나요?",
    a: "1주차 진단고사로 과목별 수준을 파악해 수준별로 반을 나누고, 부족한 부분은 개별 과제로 따로 채웁니다. 8주차에 같은 기준으로 다시 측정해 변화를 확인합니다.",
  },
];

export default function WinterTeachersPage() {
  const count = getFacultyCount();

  const stats = [
    { value: count.academic, unit: "명", label: "학과 (국어·영어·사탐)" },
    { value: count.practical, unit: "명", label: "실기" },
    { value: count.resident, unit: "명", label: "본원 상주 전임" },
  ];

  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <SubPageHeader
            en="Teachers"
            title="강사진"
            sub="윈터스쿨 학과(국어·영어·사회탐구)는 강사가 직접 가르치고, 주말 실기는 지원 대학 유형에 맞춰 붙습니다. 강사마다 한 줄로 먼저 밝히고, 경력은 네 줄까지만 적었습니다."
          />

          {IS_PLACEHOLDER && (
            <div className="mt-8">
              <PlaceholderNotice>
                강사별 한 줄 소개와 상주 여부는 확인 중인 초안입니다. 확정되면 이
                안내가 사라집니다.
              </PlaceholderNotice>
            </div>
          )}

          <WinterTabs className="mt-8" />

          {/* 구성 — 기숙 과정에서 가장 먼저 읽혀야 하는 숫자는 "상주 몇 명"이다 */}
          <motion.section
            {...fadeUp}
            className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
          >
            <h2 className="sr-only">강사진 구성</h2>
            <div className="grid grid-cols-3 gap-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                    {stat.value}
                    <span className="ml-1 text-sm font-bold text-white/40">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-white/50 break-keep">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60 break-keep">
              수학 강사가 없는 것은 빠진 것이 아니라 뺀 것입니다. 미대 정시는
              대부분 수학을 반영하지 않기 때문에, 겨울 8주를 국어·영어·탐구 세
              과목에 몰아줍니다. 본원에 상주하는 사람은 실기를 직접 지도하는 대표
              한 명이고, 학과 강사는 전원 담당 수업 시간에 들어오는 출강입니다.
            </p>
          </motion.section>
        </div>
      </section>

      {/* ---- 과목별 강사 ---- */}
      <section className="px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          {SUBJECT_ORDER.map((subject) => {
            const list = getTeachersBySubject(subject);
            if (list.length === 0) return null;

            return (
              <div key={subject} className="mt-14 first:mt-0 md:mt-16">
                <motion.div {...fadeUp} className="border-l-2 border-accent pl-4">
                  <h2 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xl font-bold tracking-tight text-white md:text-2xl">
                    {subject}
                    <span className="text-xs font-medium tabular-nums text-white/40">
                      {list.length}명
                    </span>
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                      {SUBJECT_NOTE[subject]}
                    </span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 break-keep">
                    {SUBJECT_DESC[subject]}
                  </p>
                </motion.div>

                <div className="mt-6 space-y-4">
                  {list.map((teacher, i) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: i * 0.04 }}
                    >
                      <TeacherCard teacher={teacher} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="mt-8 text-center text-xs text-white/35 break-keep">
            ※ 경력은 강사당 {MAX_CAREERS}줄까지만 표기합니다.
          </p>

          {/* 학과 수업 운영 주체 — /teachers와 같은 사실을 여기서도 밝힌다 */}
          <p className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/45 break-keep">
            학과(국어·영어·사회탐구) 수업은 홍대 본원과 같은 곳(마포구 와우산로23길
            9)에서 운영하는 아름다운학원 강사진이 담당하고, 실기는 모두다른고양이
            미술학원이 직접 지도합니다. 두 이름이 한 건물에서 학과와 실기를 나눠
            맡습니다.
          </p>

          <p className="mt-6 text-center text-sm">
            <Link
              href="/teachers"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              학원 전체 강사진 페이지 보기
              <ArrowRight size={15} />
            </Link>
          </p>
        </div>
      </section>

      {/* ---- 과목별 8주 운영 ---- */}
      <section className="border-y border-white/5 bg-[#05050a] px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHead
            en="Curriculum"
            ko="과목별로 8주 동안 하는 것"
            sub="미대가 반영하는 국어·영어·탐구 세 과목에 8주를 전부 씁니다."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {SUBJECT_PLANS.map((plan, i) => (
              <motion.div
                key={plan.subject}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-lg font-bold text-white">{plan.subject}</h3>
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                    목표
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 break-keep">
                    {plan.goal}
                  </p>
                </div>
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                    진행 방식
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 break-keep">
                    {plan.method}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 수업 관련 FAQ ---- */}
      <section className="px-5 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHead en="FAQ" ko="수업에 대해 자주 묻는 질문" />
          <motion.div {...fadeUp} className="border-t border-white/10">
            {CLASS_FAQ.map((item) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
      </section>

      <CtaBand
        headline={
          <>
            어떤 선생님과 시작할지
            <br className="md:hidden" /> 상담에서 정해 드립니다
          </>
        }
        sub="현재 성적과 목표 대학을 보고 어느 반에서 시작할지 함께 잡아드립니다."
      />

      <MobileActionBar />
    </main>
  );
}
