"use client";

/**
 * /winter/teachers — 강사진.
 * 카드 형식은 하나로 고정한다: 상주 배지 · 담당 · 이름 · 한 줄 헤드라인 · 경력 4줄.
 * 강사 데이터는 lib/winter-teachers.ts에만 있다.
 */

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Clock } from "lucide-react";
import {
  TEACHERS,
  TEACHER_TRACKS,
  IS_PLACEHOLDER,
  MAX_CAREER_LINES,
  getCareers,
  getTeachersByTrack,
  getResidentLabel,
  type Teacher,
  type TeacherTrack,
} from "@/lib/winter-teachers";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  SubPageTabs,
  AccordionItem,
  PlaceholderNotice,
} from "@/components/winter/shared";

/** 과목별로 8주 동안 무엇을 하는지 — 강사 소개와 같은 페이지에 둔다 */
const SUBJECT_PLANS = [
  {
    subject: "국어",
    goal: "[문학·독서 기본 개념을 정리하고 기출 지문 독해 훈련을 진행합니다.]" /* TODO: 원장님 확인 */,
    method: "[매일 지문 학습 + 주간 점검 테스트]" /* TODO: 원장님 확인 */,
  },
  {
    subject: "영어",
    goal: "[매일 영단어 100개 암기와 구문 독해로 기본기를 확보합니다.]" /* TODO: 원장님 확인 */,
    method: "[매일 단어 테스트 + 구문 강의 + 오답 관리]" /* TODO: 원장님 확인 */,
  },
  {
    subject: "탐구",
    goal: "[선택 과목 개념 1회독을 목표로 기본 개념을 정리합니다.]" /* TODO: 원장님 확인 */,
    method: "[개념 강의 + 단원별 문제 풀이]" /* TODO: 원장님 확인 */,
  },
];

/** 수업 운영에 대해 상담 전 가장 많이 받는 질문 */
const CLASS_FAQ = [
  {
    q: "미술을 처음 시작하는데 참여할 수 있나요?",
    a: "[네, 참여 가능합니다. 입소 전 레벨 테스트를 통해 수준에 맞는 반에서 시작합니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "학과 수업 수준은 학생마다 어떻게 맞춰지나요?",
    a: "[입소 시 진단 테스트를 통해 과목별 수준을 파악하고, 수준별 분반과 개별 과제로 운영합니다.]" /* TODO: 원장님 확인 */,
  },
];

const TRACK_DESC: Record<TeacherTrack, string> = {
  학과: "평일 국어·영어·탐구를 직접 가르치는 강사입니다.",
  실기: "주말 대학교 유형 실기를 맡는 강사입니다.",
};

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const careers = getCareers(teacher);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7">
      {/* 담당 + 상주 여부 배지 */}
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/70">
          {teacher.subject}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            teacher.resident
              ? "border border-accent/40 bg-accent/10 text-accent"
              : "border border-white/15 text-white/50"
          }`}
        >
          {teacher.resident ? <BadgeCheck size={12} /> : <Clock size={12} />}
          {getResidentLabel(teacher)}
        </span>
      </div>

      {/* 이름 */}
      <div className="mt-5 flex items-center gap-3">
        {teacher.photo ? (
          <Image
            src={teacher.photo}
            alt={teacher.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white/50"
          >
            {teacher.subject.slice(0, 2)}
          </span>
        )}
        <p className="text-lg font-bold text-white break-keep">{teacher.name}</p>
      </div>

      {/* 한 줄 헤드라인 — 이 카드에서 가장 먼저 읽혀야 하는 문장 */}
      <p className="mt-4 text-base md:text-lg font-semibold leading-snug text-white break-keep">
        {teacher.headline}
      </p>

      {/* 경력 — 4줄 컷 */}
      <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-white/55">
        {careers.map((line) => (
          <li key={line} className="flex gap-2.5 break-keep">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WinterTeachersPage() {
  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <SubPageHeader
            en="Teachers"
            title="강사진"
            sub="학과(국어·영어·탐구)는 강사가 직접 가르치고, 주말 실기는 유형별 담당 강사가 맡습니다."
          />

          {IS_PLACEHOLDER && (
            <div className="mt-8">
              <PlaceholderNotice>
                강사진 정보는 준비 중입니다. 확정된 강사만 순차적으로 공개합니다.
              </PlaceholderNotice>
            </div>
          )}

          <div className="mt-8">
            <SubPageTabs />
          </div>
        </div>
      </section>

      {/* ---- 트랙별 강사 ---- */}
      {TEACHER_TRACKS.map((track, idx) => {
        const teachers = getTeachersByTrack(track);
        if (teachers.length === 0) return null;

        return (
          <section
            key={track}
            className={`px-5 py-16 md:px-6 md:py-24 ${
              idx % 2 === 0
                ? ""
                : "border-y border-white/5 bg-[#05050a]"
            }`}
          >
            <div className="mx-auto max-w-5xl">
              <SectionHead
                en={track === "학과" ? "Academics" : "Art Practice"}
                ko={`${track} 강사`}
                sub={TRACK_DESC[track]}
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher, i) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <TeacherCard teacher={teacher} />
                  </motion.div>
                ))}
              </div>

              {track === "학과" && (
                <p className="mt-6 text-center text-xs text-white/35 break-keep">
                  ※ 경력은 각 강사당 {MAX_CAREER_LINES}줄까지만 표기합니다.
                  상주 배지는 캠프 기간 중 상주 여부를 뜻합니다.
                </p>
              )}
            </div>
          </section>
        );
      })}

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
            어떤 강사에게 배우는지
            <br className="md:hidden" /> 상담에서 알려드립니다
          </>
        }
        sub="아이의 현재 등급에 맞춰 어느 반에서 시작할지 함께 잡아드립니다."
      />

      <MobileActionBar />
    </main>
  );
}
