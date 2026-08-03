"use client";

/**
 * 윈터캠프 랜딩 — 전환율(상담 신청) 최우선 구조.
 *
 * 섹션 흐름 (설득 순서):
 *  1. 히어로: 문제 제기 + 즉시 CTA + 긴급성(D-day·정원)
 *  2. 왜 학과인가: 핵심 차별 논리 ("미대는 성적순")
 *  3. 왜 모다고인가: 37년 누적 합격 실적
 *  → CTA
 *  4. 윈터캠프 소개: 기간·대상·정원 + 두 트랙
 *  5. 생활관리: 학부모 걱정 6문 6답 (FAQ보다 먼저 불안 해소)
 *  → CTA
 *  6. 학과관리 / 7. 실기관리 / 8. 하루 일과
 *  9. 시설 / 10. 후기(학생·학부모·합격)
 *  → CTA
 * 11. FAQ / 12. 신청하기(수강료·폼·오시는길)
 *
 * 상세 근거: docs/winter-cro-redesign.md
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MapPin,
  ChevronDown,
  X,
  Users,
  Moon,
  Utensils,
  BookOpen,
  ShieldCheck,
  Stethoscope,
  FileText,
  ArrowRight,
  CalendarDays,
  ImageIcon,
  MessageSquare,
  MessageCircle,
  Loader2,
  CheckCircle2,
  PenLine,
  Palette,
} from "lucide-react";
import { CAMP_INFO, SMS_HREF, KAKAO_CHANNEL_URL } from "@/lib/winter-camp";
import { universityCards } from "@/components/cinematic/Scene2";
import CtaBand from "@/components/winter/CtaBand";
import Testimonials from "@/components/winter/Testimonials";

/* ---------------------------------- 공통 ---------------------------------- */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function SectionHead({
  en,
  ko,
  sub,
}: {
  en: string;
  ko: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="mb-12 md:mb-16 text-center">
      <p className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
        {en}
      </p>
      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-snug break-keep">
        {ko}
      </h2>
      {sub && (
        <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed break-keep">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* --------------------------------- 데이터 ---------------------------------- */

type ScheduleType = "silgi" | "hakgwa" | "life";

type ScheduleRow = { time: string; label: string; type: ScheduleType };

// 2027학년도 시간표 기준
const WEEKDAY_SCHEDULE: ScheduleRow[] = [
  { time: "06:00", label: "기상 · 아침식사 · 0교시 자기주도", type: "life" },
  {
    time: "09:00",
    label: "학과 수업 — 국어 · 영어 · 탐구 (요일별)",
    type: "hakgwa",
  },
  { time: "12:50", label: "점심 시간", type: "life" },
  {
    time: "13:35",
    label: "학과 클리닉 — 국어 · 영어 클리닉 / 탐구",
    type: "hakgwa",
  },
  {
    time: "15:50",
    label: "자기주도 학습 (화 영어 · 금 국어 모의고사)",
    type: "hakgwa",
  },
  { time: "17:25", label: "저녁 시간", type: "life" },
  { time: "18:10", label: "자기주도 학습", type: "hakgwa" },
  { time: "22:20", label: "영어 100단어 시험", type: "hakgwa" },
  { time: "22:40", label: "취침", type: "life" },
];

const WEEKEND_SCHEDULE: ScheduleRow[] = [
  { time: "09:00", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "12:50", label: "점심 시간", type: "life" },
  { time: "13:35", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "17:25", label: "저녁 시간", type: "life" },
  { time: "18:10", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "22:30", label: "취침", type: "life" },
];

const SCHEDULE_STYLE: Record<
  ScheduleType,
  { dot: string; text: string; label: string }
> = {
  silgi: { dot: "bg-accent", text: "text-accent", label: "실기" },
  hakgwa: { dot: "bg-sky-400", text: "text-sky-400", label: "학과" },
  life: { dot: "bg-white/30", text: "text-white/50", label: "생활" },
};

/** 학부모가 상담 전 가장 많이 묻는 질문 — FAQ보다 먼저 본문에서 해소한다 */
const PARENT_CONCERNS = [
  {
    q: "휴대폰은 어떻게 하나요?",
    a: "정해진 시간에 제출합니다. 취침·기상 시간이 고정되어 있어 생활 리듬이 무너지지 않습니다. 학부모님과의 연락은 언제든 가능합니다.",
    icon: Moon,
  },
  {
    q: "식사는 잘 챙겨 먹을까요?",
    a: "매 끼 30찬 뷔페식으로 아침·점심·저녁·야식까지 제공합니다. 한창 클 나이의 8주, 식사만큼은 부족함 없이 챙깁니다.",
    icon: Utensils,
  },
  {
    q: "생활은 안전한가요?",
    a: "남학생과 여학생의 생활관을 분리해 운영하고, 야간에도 관리 인력이 상주합니다.",
    icon: ShieldCheck,
  },
  {
    q: "아프면 어떻게 하나요?",
    a: "건강에 이상이 있으면 관리 인력이 병원에 동행하고, 상황 발생 시 학부모님께 즉시 연락드립니다.",
    icon: Stethoscope,
  },
  {
    q: "공부는 제대로 하나요?",
    a: "매일 밤 영단어 100개 시험(8주간 5,000단어), 주간 국어·영어 모의고사로 매일의 학습을 숫자로 확인합니다.",
    icon: BookOpen,
  },
  {
    q: "아이 소식은 어떻게 듣나요?",
    a: "학습과 생활 상황을 정리한 월간 리포트를 학부모님께 보내드립니다. 궁금하실 땐 언제든 본원으로 전화 주세요.",
    icon: FileText,
  },
];

/** 학과 커리큘럼 — 학과가 먼저, 실기는 별도 섹션 */
const HAKGWA_TABS = [
  {
    key: "국어",
    goal: "[문학·독서 기본 개념을 정리하고 기출 지문 독해 훈련을 진행합니다.]" /* TODO: 원장님 확인 */,
    method: "[매일 지문 학습 + 주간 점검 테스트]" /* TODO: 원장님 확인 */,
  },
  {
    key: "영어",
    goal: "[매일 영단어 100개 암기와 구문 독해로 기본기를 확보합니다.]" /* TODO: 원장님 확인 */,
    method: "[매일 단어 테스트 + 구문 강의 + 오답 관리]" /* TODO: 원장님 확인 */,
  },
  {
    key: "사회탐구",
    goal: "[선택 과목 개념 1회독을 목표로 기본 개념을 정리합니다.]" /* TODO: 원장님 확인 */,
    method: "[개념 강의 + 단원별 문제 풀이]" /* TODO: 원장님 확인 */,
  },
  {
    key: "수학",
    goal: "[취약 단원 진단 후 기본 개념과 유형 연습을 진행합니다.]" /* TODO: 원장님 확인 */,
    method: "[진단 테스트 기반 개별 커리큘럼]" /* TODO: 원장님 확인 */,
  },
];

const SILGI_POINTS = [
  {
    title: "대학교 유형 실기",
    desc: "목표 대학의 출제 유형에 맞춘 실기 훈련을 주말에 집중 진행합니다.",
  },
  {
    title: "레벨 테스트 후 수준별 분반",
    desc: "[기초 소묘·발상과 표현 등 실기 기초를 8주간 집중적으로 다집니다. 레벨 테스트 후 수준별 분반, 담당 강사 개별 피드백 진행]" /* TODO: 원장님 확인 */,
  },
  {
    title: "실기는 끊기지 않을 만큼",
    desc: "겨울은 학과의 골든타임입니다. 실기는 감을 잃지 않도록 주말 집중 방식으로 유지하고, 평일은 학과에 전부 씁니다.",
  },
];

const GALLERY_IMAGES = [
  { src: "/images/winter/dining-buffet.jpg", caption: "매 끼 30찬 뷔페식" },
  { src: "/images/winter/dorm-female.jpg", caption: "여학생 생활관" },
  { src: "/images/winter/dorm-male.jpg", caption: "남학생 생활관" },
  { src: "/images/winter/studio-practice.jpg", caption: "실기실" },
  { src: "/images/winter/classroom.jpg", caption: "학과 강의실" },
  { src: "/images/winter/exterior.jpg", caption: "홍대 본원 전경" },
];

const FAQ_ITEMS = [
  {
    q: "미술을 처음 시작하는데 참여할 수 있나요?",
    a: "[네, 참여 가능합니다. 입소 전 레벨 테스트를 통해 수준에 맞는 반에서 시작합니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "학과 수업 수준은 학생마다 어떻게 맞춰지나요?",
    a: "[입소 시 진단 테스트를 통해 과목별 수준을 파악하고, 수준별 분반과 개별 과제로 운영합니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "핸드폰은 아예 사용할 수 없나요?",
    a: "[정해진 시간에 제출하고 필요 시 지정된 시간에 사용할 수 있습니다. 학부모님과의 연락은 언제든 가능합니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "주말 귀가나 외박이 가능한가요?",
    a: "[주말 귀가 및 외박 규정은 상담 시 안내드립니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "준비물은 무엇인가요?",
    a: "[개인 세면도구와 의류 등 기본 생활용품을 준비하시면 됩니다. 실기 재료는 학원에서 제공합니다. 상세 목록은 등록 후 안내드립니다.]" /* TODO: 원장님 확인 */,
  },
  {
    q: "중도 퇴소 시 환불은 어떻게 되나요?",
    a: "교육청 환불규정(제18조 제3호)에 따라 반환합니다. 총 교습시간의 1/3 경과 전에는 납부한 교습비의 2/3, 1/2 경과 전에는 1/2을 환불하며, 1/2 경과 후에는 반환되지 않습니다. 할인을 받은 경우 환불 시 할인이 취소되며 차액 기준으로 정산됩니다. 상세 내용은 수강료 및 접수의 환불 규정을 확인해 주세요.",
  },
];

/* ------------------------------- 하위 컴포넌트 ------------------------------- */

function DdayBadge() {
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    const deadline = new Date(`${CAMP_INFO.deadlineISO}T23:59:59+09:00`);
    setDday(Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));
  }, []);

  if (dday === null) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
      <CalendarDays size={14} />
      {dday > 0
        ? `접수 마감까지 D-${dday}`
        : dday === 0
          ? "오늘 접수 마감"
          : "접수가 마감되었습니다"}
    </span>
  );
}

function ScheduleTable({
  title,
  rows,
}: {
  title: string;
  rows: ScheduleRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <p className="border-b border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white">
        {title}
      </p>
      <table className="w-full text-sm md:text-[15px]">
        <tbody>
          {rows.map((row) => {
            const style = SCHEDULE_STYLE[row.type];
            return (
              <tr
                key={row.time}
                className="border-b border-white/5 last:border-b-0"
              >
                <td className="w-20 px-4 py-3.5 align-top font-mono text-white/40">
                  {row.time}
                </td>
                <td className="px-2 py-3.5 pr-4">
                  <span className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                    />
                    <span
                      className={`break-keep ${
                        row.type === "life"
                          ? "text-white/50"
                          : "font-medium text-white"
                      }`}
                    >
                      {row.label}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GalleryImage({
  src,
  caption,
  onOpen,
}: {
  src: string;
  caption: string;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${caption} 확대 보기`}
        className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12]"
      >
        {failed ? (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
            <ImageIcon size={28} strokeWidth={1.5} />
            <span className="text-xs">이미지 준비 중</span>
          </span>
        ) : (
          <Image
            src={src}
            alt={caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        )}
      </button>
      <figcaption className="mt-2 text-center text-xs md:text-sm text-white/50">
        {caption}
      </figcaption>
    </figure>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: { src: string; caption: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.caption} 확대 이미지`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-5 right-5 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={26} />
          </button>
          <motion.figure
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#0d0d12]">
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {item.caption}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AccordionItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm md:text-base font-medium text-white/90 break-keep">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-white/60 break-keep">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

function scrollToConsult(e?: React.MouseEvent) {
  e?.preventDefault();
  document
    .getElementById("consult-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function KakaoTalkButton() {
  // TODO: 2026년 9월 카카오톡 채널 개설 후 lib/winter-camp.ts의 KAKAO_CHANNEL_URL만 채우면 노출됨
  if (!KAKAO_CHANNEL_URL) return null;

  return (
    <a
      href={KAKAO_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85"
    >
      <MessageCircle size={15} />
      카카오톡 문의
    </a>
  );
}

/** 010-1234-5678 형태로 자동 하이픈 */
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

const GRADE_OPTIONS = ["예비 고2", "예비 고3", "재수생"] as const;

const INPUT_CLASS =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent";

function ConsultForm() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const canSubmit =
    name.trim().length > 0 &&
    grade !== "" &&
    phone.replace(/\D/g, "").length >= 10 &&
    agreed &&
    status !== "submitting";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          grade,
          phone,
          university: university.trim(),
        }),
      });
      if (!res.ok) throw new Error("consult request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div
        id="consult-form"
        className="scroll-mt-24 rounded-2xl border border-accent/30 bg-accent/[0.05] px-8 py-14 text-center"
      >
        <CheckCircle2 size={40} className="mx-auto text-accent" />
        <p className="mt-5 text-xl md:text-2xl font-bold text-white">
          접수되었습니다.
        </p>
        <p className="mt-2 text-sm md:text-base text-white/60">
          곧 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div
      id="consult-form"
      className="scroll-mt-24 rounded-2xl border border-accent/40 bg-white/[0.03] p-7 md:p-10 text-left"
    >
      <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
        Consult
      </p>
      <h3 className="mt-2 text-xl md:text-2xl font-bold text-white">
        상담 신청
      </h3>
      <p className="mt-2 text-sm text-white/50 break-keep">
        정원 {CAMP_INFO.capacityTotal}명 {CAMP_INFO.capacityNote} · 남겨주시면
        순서대로 연락드립니다.
      </p>

      <div className="mt-7 space-y-5">
        {/* 학생 이름 */}
        <div>
          <label
            htmlFor="consult-name"
            className="mb-2 block text-sm font-medium text-white/70"
          >
            학생 이름 <span className="text-accent">*</span>
          </label>
          <input
            id="consult-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
            className={INPUT_CLASS}
          />
        </div>

        {/* 학년 */}
        <div>
          <p className="mb-2 text-sm font-medium text-white/70">
            학년 <span className="text-accent">*</span>
          </p>
          <div
            role="radiogroup"
            aria-label="학년 선택"
            className="grid grid-cols-3 gap-2"
          >
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={grade === g}
                onClick={() => setGrade(g)}
                className={`rounded-xl border py-3.5 text-sm font-medium transition-colors ${
                  grade === g
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 연락처 */}
        <div>
          <label
            htmlFor="consult-phone"
            className="mb-2 block text-sm font-medium text-white/70"
          >
            연락처 <span className="text-accent">*</span>
          </label>
          <input
            id="consult-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            className={INPUT_CLASS}
          />
        </div>

        {/* 희망 대학 (선택) */}
        <div>
          <label
            htmlFor="consult-univ"
            className="mb-2 block text-sm font-medium text-white/70"
          >
            희망 대학{" "}
            <span className="text-xs font-normal text-white/40">(선택)</span>
          </label>
          <input
            id="consult-univ"
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="예: 홍익대, 국민대"
            className={INPUT_CLASS}
          />
        </div>

        {/* 개인정보 동의 */}
        <div>
          <div className="flex items-start gap-2.5">
            <input
              id="consult-agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
            />
            <label
              htmlFor="consult-agree"
              className="cursor-pointer text-sm text-white/70 break-keep"
            >
              개인정보 수집·이용에 동의합니다{" "}
              <span className="text-accent">(필수)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPrivacy(!showPrivacy)}
              aria-expanded={showPrivacy}
              className="shrink-0 text-xs text-white/40 underline underline-offset-2 hover:text-white/70"
            >
              {showPrivacy ? "접기" : "자세히"}
            </button>
          </div>
          {showPrivacy && (
            <div className="mt-3 space-y-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs leading-relaxed text-white/50">
              <p>· 수집 항목: 학생 이름, 학년, 연락처, 희망 대학(선택)</p>
              <p>
                · 이용 목적: 윈터캠프 상담 회신 (그 외 목적으로 사용하지
                않습니다)
              </p>
              <p>
                · 보유 기간: [상담 완료 후 지체 없이 파기]
                {/* TODO: 원장님 확인 */}
              </p>
              <p>
                · 동의를 거부할 수 있으나, 거부 시 상담 신청이 제한됩니다.
              </p>
            </div>
          )}
        </div>

        {/* 제출 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full rounded-full bg-accent py-4 text-base font-bold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={17} className="animate-spin" />
              접수 중...
            </span>
          ) : (
            "상담 신청하기"
          )}
        </button>

        {status === "error" && (
          <p className="text-center text-sm text-red-400 break-keep">
            일시적인 오류로 접수하지 못했습니다. 잠시 후 다시 시도하시거나
            전화({CAMP_INFO.phone})로 연락해 주세요.
          </p>
        )}

        <p className="text-center text-xs text-white/40 break-keep">
          밤에 남겨주셔도 괜찮습니다. 다음 날 연락드립니다.
        </p>
      </div>
    </div>
  );
}

/** 모바일 전용 하단 고정 바 — 히어로 절반만 지나도 나타나 신청 동선을 항상 유지 */
function MobileActionBar() {
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
          <button
            type="button"
            onClick={() => scrollToConsult()}
            className="flex flex-col items-center gap-1 rounded-xl bg-accent py-2 text-black"
          >
            <PenLine size={17} />
            <span className="text-[11px] font-bold">상담 신청</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- 페이지 ---------------------------------- */

export default function WinterLanding() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(HAKGWA_TABS[0].key);

  const tab = HAKGWA_TABS.find((t) => t.key === activeTab)!;

  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      {/* ============ [1] 히어로 — 문제 제기 + 즉시 CTA ============ */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-12">
        {/* 배경 이미지 + 어두운 오버레이 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/winter/studio-practice.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/75" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-4 text-xs md:text-sm tracking-[0.3em] text-accent uppercase">
            {CAMP_INFO.name} · 홍대 본원 기숙
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white break-keep">
            실기만 잘해서는
            <br />
            합격할 수 없습니다
          </h1>
          <p className="mt-5 text-base md:text-xl text-white/75 break-keep">
            합격하는 학생은 학과도 준비합니다.
            <br className="md:hidden" /> 학과는 강사 직강, 실기는 주말 집중,
            8주 기숙 과정.
          </p>

          {/* 긴급성 — D-day + 정원 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <DdayBadge />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white">
              <Users size={14} className="text-accent" />
              정원 {CAMP_INFO.capacityTotal}명 · {CAMP_INFO.capacityNote}{" "}
              조기마감
            </span>
          </div>

          {/* CTA — 모바일 첫 화면 안에 반드시 노출 */}
          <div className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#consult-form"
              onClick={scrollToConsult}
              className="w-full rounded-full bg-accent px-8 py-4 text-center text-base font-bold text-black transition-opacity hover:opacity-85 sm:w-auto"
            >
              상담 신청하기
            </a>
            <a
              href={CAMP_INFO.phoneTel}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 sm:w-auto"
            >
              <Phone size={17} />
              전화 문의 {CAMP_INFO.phone}
            </a>
          </div>
          <p className="mt-3 text-xs text-white/45">
            신청은 1분 · 밤에 남겨주셔도 다음 날 연락드립니다
          </p>

          {/* 핵심 키워드 칩 — 카드 4개 대신 가볍게, 상세 정보는 [4] 소개 섹션에서 */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs md:text-sm text-white/60">
            {["홍대 본원", "학과 직강", "실기 주말 집중", "기숙"].map(
              (chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/15 px-3.5 py-1.5"
                >
                  {chip}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* ============ [2] 왜 학과인가 — 핵심 차별 논리 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Why Academics"
            ko={
              <>
                실기를 한 장 더 그리는 것보다
                <br />
                수능 한 문제가 합격에 가깝습니다
              </>
            }
          />

          {/* 핵심 논리 — 기존 수강료 섹션에 묻혀 있던 차별점을 최상단으로 */}
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-3xl rounded-2xl border border-accent/40 bg-accent/[0.06] px-7 py-9 md:px-12 md:py-12 text-center"
          >
            <p className="text-xs tracking-[0.25em] text-accent uppercase">
              Why Modago
            </p>
            <p className="mt-4 text-2xl md:text-3xl font-black text-white break-keep">
              미대는 성적순입니다.
            </p>
            <div className="mt-5 space-y-4 text-sm md:text-lg leading-[1.9] text-white/75 break-keep">
              <p>
                실기는 수능이 끝난 뒤에 시작해도 늦지 않습니다.
                <br className="hidden md:block" />
                성적은 그렇지 않습니다.
              </p>
              <p>
                미대는 서울대를 제외하면 수학을 반영하지 않습니다.
                <br className="hidden md:block" />
                일반 기숙학원이 수학에 쓰는 8주를,
                <br className="hidden md:block" />
                저희는 국어·영어·탐구에 전부 씁니다.
              </p>
            </div>
          </motion.div>

          {/* 비교 카드 */}
          <motion.div {...fadeUp} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <p className="text-[11px] tracking-[0.25em] text-white/35 uppercase">
                일반 미술학원의 겨울
              </p>
              <p className="mt-4 text-xl md:text-2xl font-bold text-white/60 leading-snug break-keep">
                실기 특강 13:00~22:00,
                <br />
                학과는 각자 알아서
              </p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 md:p-10">
              <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                모다고 윈터캠프
              </p>
              <p className="mt-4 text-xl md:text-2xl font-bold text-white leading-snug break-keep">
                평일은 학과에 전부,
                <br />
                주말은 실기에 집중
              </p>
            </div>
          </motion.div>

          <motion.p
            {...fadeUp}
            className="mx-auto mt-10 max-w-2xl text-center text-sm md:text-base leading-relaxed text-white/60 break-keep"
          >
            실기 특강이 시작되면 하루의 대부분이 그림에 쓰이고, 학과 공부는
            흐름이 끊기기 쉽습니다. 모다고 윈터캠프는 하루 일과 안에 실기와
            학과를 함께 설계해 8주간의 학과 학습량을 확보합니다. 학과는
            강사가 직접 가르치고, 취침·기상 등 생활 리듬도 정해진 일과로
            운영되어 학생은 공부와 그림에만 집중합니다.
          </motion.p>
        </div>
      </section>

      {/* ============ [3] 왜 모다고인가 — 37년 합격 실적 ============ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Since 1989 · 37년"
            ko="말이 아니라 숫자로 증명합니다"
            sub="모두다른고양이 미술학원의 누적 합격 실적입니다."
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {universityCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 p-6 md:p-8 text-center"
                style={{ backgroundColor: card.color }}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                  <Image
                    src={card.logo}
                    alt=""
                    width={200}
                    height={200}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div className="relative z-10">
                  <p className="text-sm md:text-base font-semibold text-white/80">
                    {card.name}
                  </p>
                  <p className="mt-3 text-4xl md:text-5xl font-black text-white">
                    {card.total}
                    <span className="text-lg font-bold text-white/60">명</span>
                  </p>
                  <p className="mt-1 text-[11px] tracking-widest text-white/50 uppercase">
                    누적 합격
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA #1 — 차별점·실적을 본 직후 ============ */}
      <CtaBand
        headline={
          <>
            학과까지 직강하는 미술학원은
            <br className="md:hidden" /> 흔치 않습니다
          </>
        }
        sub="우리 아이에게 맞는 과정인지, 상담으로 확인해 보세요."
      />

      {/* ============ [4] 윈터캠프 소개 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="The Camp"
            ko="2027 모다고 윈터캠프"
            sub="홍대 본원에서 진행하는 8주 기숙 직강 과정. 학과·실기·숙식을 한 곳에서 해결합니다."
          />

          {/* 핵심 정보 — 히어로에서 내려온 4카드 */}
          <motion.div
            {...fadeUp}
            className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
          >
            {[
              { label: "기간", value: CAMP_INFO.period },
              { label: "대상", value: CAMP_INFO.target },
              {
                label: "정원",
                value: `${CAMP_INFO.capacity} ${CAMP_INFO.capacityNote}`,
              },
              { label: "접수마감", value: CAMP_INFO.deadline },
            ].map((info) => (
              <div
                key={info.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="text-[11px] tracking-widest text-white/40 uppercase">
                  {info.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white break-keep">
                  {info.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* 대상 안내 카드 — 예비 고3 단일 트랙 (재수생은 별도 파주 기숙학원에서 모집) */}
          <motion.div
            {...fadeUp}
            className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              예비 고3 대상 (예비 고2 가능)
            </h3>
            <ul className="mt-6 space-y-3 text-sm md:text-base leading-relaxed text-white/70">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                8주간 실기 기초와 학과를 동시에 다지는 과정입니다.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                캠프 종료 후에는 각자의 학교 생활로 복귀합니다.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                겨울방학 8주로 완결되는, 홍대 본원에서 진행하는 독립된
                과정입니다.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ============ [5] 생활관리 — 학부모 걱정 6문 6답 ============ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Life Management"
            ko={
              <>
                부모님이 가장 먼저
                <br className="md:hidden" /> 물으시는 것들
              </>
            }
            sub="8주를 지탱하는 것은 아이의 의지가 아니라 시스템입니다. 상담 전에 미리 답해 드립니다."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PARENT_CONCERNS.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <item.icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-accent"
                />
                <h3 className="mt-4 text-base md:text-lg font-bold text-white break-keep">
                  {item.q}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/60 break-keep">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA #2 — 학부모 불안 해소 직후 ============ */}
      <CtaBand
        headline={
          <>
            궁금한 점은 상담에서
            <br className="md:hidden" /> 전부 답해 드립니다
          </>
        }
        sub="생활기록부를 지참하시면 수시·정시 전략 상담까지 가능합니다."
      />

      {/* ============ [6] 학과관리 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            en="Academics"
            ko="학과 직강 — 평일 전부"
            sub="평일 하루를 국어·영어·탐구에 전부 씁니다. 매일 시험으로 학습량을 숫자로 확인합니다."
          />

          <motion.div {...fadeUp}>
            {/* 탭 */}
            <div
              role="tablist"
              aria-label="학과 과목"
              className="flex flex-wrap justify-center gap-2"
            >
              {HAKGWA_TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={activeTab === t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === t.key
                      ? "bg-accent text-black"
                      : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {t.key}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            <div
              role="tabpanel"
              className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
            >
              <div>
                <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                  목표
                </p>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80 break-keep">
                  {tab.goal}
                </p>
              </div>
              <div className="mt-7">
                <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                  진행 방식
                </p>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80 break-keep">
                  {tab.method}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ [7] 실기관리 ============ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Art Practice"
            ko="실기 집중 — 주말"
            sub="주말 이틀을 대학교 유형 실기에 온전히 씁니다."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {SILGI_POINTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
              >
                <Palette
                  size={22}
                  strokeWidth={1.5}
                  className="text-accent"
                />
                <h3 className="mt-4 text-base md:text-lg font-bold text-white break-keep">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/60 break-keep">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ [8] 하루 일과표 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <SectionHead
            en="Daily Routine"
            ko="캠프의 하루"
            sub="평일은 학과에만, 주말은 대학교 유형 미술실기에 집중합니다."
          />

          {/* 범례 */}
          <motion.div
            {...fadeUp}
            className="mb-6 flex items-center justify-center gap-6"
          >
            {(Object.keys(SCHEDULE_STYLE) as ScheduleType[]).map((key) => (
              <span
                key={key}
                className="flex items-center gap-2 text-xs md:text-sm text-white/60"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${SCHEDULE_STYLE[key].dot}`}
                />
                {SCHEDULE_STYLE[key].label}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-2">
            <ScheduleTable title="평일 (월–금)" rows={WEEKDAY_SCHEDULE} />
            <ScheduleTable title="주말 (토·일)" rows={WEEKEND_SCHEDULE} />
          </motion.div>

          <motion.p
            {...fadeUp}
            className="mt-5 text-center text-xs text-white/35"
          >
            ※ 수업시간은 효율에 따라 변경될 수 있습니다.
          </motion.p>
        </div>
      </section>

      {/* ============ [9] 시설 — 갤러리 ============ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Living Environment"
            ko="8주를 보낼 공간"
            sub="홍대 본원의 실기실·강의실·생활관을 확인하세요. 사진을 누르면 크게 볼 수 있습니다."
          />

          <motion.div
            {...fadeUp}
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
          >
            {GALLERY_IMAGES.map((img) => (
              <GalleryImage
                key={img.src}
                src={img.src}
                caption={img.caption}
                onOpen={() => setLightbox(img)}
              />
            ))}
          </motion.div>
        </div>
        <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      </section>

      {/* ============ [10] 후기 — 학생·학부모·합격 ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Reviews"
            ko="먼저 보낸 부모님들의 이야기"
            sub="캠프를 경험한 학생과 학부모님의 목소리입니다."
          />
          <motion.div {...fadeUp}>
            <Testimonials />
          </motion.div>
        </div>
      </section>

      {/* ============ CTA #3 — 후기(사회적 증거) 직후 ============ */}
      <CtaBand
        headline={
          <>
            다음 겨울이 아니라,
            <br className="md:hidden" /> 이번 겨울이어야 합니다
          </>
        }
        sub="8주 뒤, 아이의 겨울이 달라져 있습니다."
      />

      {/* ============ [11] FAQ ============ */}
      <section className="border-y border-white/5 bg-[#05050a] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHead en="FAQ" ko="자주 묻는 질문" />

          <motion.div {...fadeUp} className="border-t border-white/10">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ [12] 신청하기 — 수강료·폼·오시는 길 ============ */}
      <section id="contact" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            en="Apply"
            ko="신청하기"
            sub={
              <>
                접수 마감 {CAMP_INFO.deadline} · 정원 {CAMP_INFO.capacity} (
                {CAMP_INFO.capacityNote})
              </>
            }
          />

          {/* 상담 신청 폼 — 신청 섹션의 첫 번째 요소로 배치 */}
          <motion.div {...fadeUp}>
            <ConsultForm />
          </motion.div>

          {/* 수강료 안내 */}
          <motion.div
            {...fadeUp}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center"
          >
            <p className="text-[11px] tracking-[0.25em] text-white/40 uppercase">
              8주 전 과정 수강료
            </p>
            <p className="mt-4 text-3xl md:text-4xl font-black text-white">
              {CAMP_INFO.tuition}
            </p>
            <p className="mt-3 text-sm md:text-base text-white/60 break-keep">
              {CAMP_INFO.tuitionIncludes}
            </p>
            <p className="mt-2 text-sm text-white/45 break-keep">
              수강료는 학생별 과정 구성에 따라 달라져, 상담을 통해 정확히
              안내드립니다.
            </p>

            {/* 일괄 등록 할인 (얼리버드) */}
            <div className="mt-7 rounded-xl border border-accent/30 bg-accent/[0.06] px-6 py-5">
              <p className="text-xs tracking-[0.25em] text-accent uppercase">
                Early Bird
              </p>
              <p className="mt-2 text-base md:text-lg font-bold text-white break-keep">
                {CAMP_INFO.earlyBird}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={CAMP_INFO.phoneTel}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85"
              >
                <Phone size={15} />
                수강료 상담 {CAMP_INFO.phone}
              </a>
              {/* 문자 문의 — 데스크톱은 문자 앱이 없어 모바일에서만 노출 */}
              <a
                href={SMS_HREF}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/50 md:hidden"
              >
                <MessageSquare size={15} />
                문자 문의
              </a>
              <KakaoTalkButton />
            </div>

            <Link
              href="/tuition"
              className="mt-6 inline-block text-xs text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
            >
              교육청 등록 교습비 고지 보기 (학원등록번호 제02201000109호)
            </Link>
          </motion.div>

          {/* 환불 규정 — 교육청 환불규정 제18조 제3호 */}
          <motion.div {...fadeUp} className="mt-8">
            <AccordionItem
              q="환불 규정 안내"
              a={
                <div className="space-y-4">
                  <p>
                    중도 퇴원(퇴소) 시 교육청 환불규정(제18조 제3호)에 따라
                    수강료를 반환합니다.
                  </p>
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ["총 교습시간의 1/3 경과 전", "납부한 교습비의 2/3 환불"],
                          ["총 교습시간의 1/2 경과 전", "납부한 교습비의 1/2 환불"],
                          ["총 교습시간의 1/2 경과 후", "반환하지 않음"],
                        ].map(([when, amount]) => (
                          <tr
                            key={when}
                            className="border-b border-white/5 last:border-b-0"
                          >
                            <td className="px-4 py-3 text-white/70">{when}</td>
                            <td className="px-4 py-3 text-white/90 font-medium">
                              {amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="list-disc space-y-1.5 pl-5 text-white/55">
                    <li>
                      개인 사정으로 인한 지각·결석은 수강료 반환 사유에서
                      제외됩니다.
                    </li>
                    <li>
                      할인을 받은 학생이 환불을 요청할 경우 할인이 취소되며,
                      할인받은 금액을 제외한 차액을 환불합니다.
                    </li>
                  </ul>
                </div>
              }
            />
          </motion.div>

          {/* 오시는 길 */}
          <motion.div {...fadeUp} className="mt-14 text-center">
            <a
              href={CAMP_INFO.phoneTel}
              className="group inline-block"
              aria-label={`홍대 본원 전화 ${CAMP_INFO.phone}`}
            >
              <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
                홍대 본원
              </p>
              <p className="mt-2 text-4xl md:text-6xl font-black tracking-tight text-white transition-colors group-hover:text-accent">
                {CAMP_INFO.phone}
              </p>
            </a>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-white/80">
                <MapPin size={15} className="text-accent" />
                {CAMP_INFO.venueName}
              </p>
              <p className="mt-2 text-sm text-white/55">{CAMP_INFO.address}</p>
              <a
                href={CAMP_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                네이버 지도로 보기
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 모바일 하단 고정 CTA ============ */}
      <MobileActionBar />
    </main>
  );
}
