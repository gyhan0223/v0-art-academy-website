"use client";

/**
 * /winter/gallery — 캠프 사진.
 * 기숙사 · 강의실 · 실기실 · 식사. 사진 비율은 전부 4:3으로 통일한다
 * (가로/세로가 섞이면 격자가 무너진다 — lib/winter-gallery.ts의 GALLERY_ASPECT).
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ImageIcon,
  Moon,
  Utensils,
  ShieldCheck,
  Stethoscope,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_ASPECT,
  CATEGORY_DESC,
  getPhotosByCategory,
  type GalleryPhoto,
} from "@/lib/winter-gallery";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  SubPageTabs,
  AccordionItem,
} from "@/components/winter/shared";

/** 학부모가 상담 전 가장 많이 묻는 질문 — 공간 사진 옆에서 함께 답한다 */
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
    a: "학습과 생활 상황을 정리한 리포트를 격주로 학부모님께 보내드립니다. 궁금하실 땐 언제든 본원으로 전화 주세요.",
    icon: FileText,
  },
];

/** 생활 관련 FAQ */
const LIFE_FAQ = [
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
];

function GalleryTile({
  photo,
  onOpen,
}: {
  photo: GalleryPhoto;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${photo.caption} 확대 보기`}
        className={`group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] ${GALLERY_ASPECT}`}
      >
        {failed ? (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
            <ImageIcon size={28} strokeWidth={1.5} />
            <span className="text-xs">이미지 준비 중</span>
          </span>
        ) : (
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        )}
      </button>
      <figcaption className="mt-2 text-center text-xs md:text-sm text-white/50 break-keep">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: GalleryPhoto | null;
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
            <div
              className={`relative w-full overflow-hidden rounded-xl bg-[#0d0d12] ${GALLERY_ASPECT}`}
            >
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

export default function WinterGalleryPage() {
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <SubPageHeader
            en="Gallery"
            title="캠프 사진"
            sub="8주를 보낼 공간입니다. 사진을 누르면 크게 볼 수 있습니다."
          />
          <div className="mt-8">
            <SubPageTabs />
          </div>
        </div>
      </section>

      {/* ---- 카테고리별 사진 ---- */}
      {GALLERY_CATEGORIES.map((category, idx) => {
        const photos = getPhotosByCategory(category);
        if (photos.length === 0) return null;

        return (
          <section
            key={category}
            className={`px-5 py-14 md:px-6 md:py-20 ${
              idx % 2 === 1 ? "border-y border-white/5 bg-[#05050a]" : ""
            }`}
          >
            <div className="mx-auto max-w-5xl">
              <motion.div {...fadeUp} className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {category}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-white/55 break-keep">
                  {CATEGORY_DESC[category]}
                </p>
              </motion.div>

              <motion.div
                {...fadeUp}
                className="grid grid-cols-2 gap-4 md:grid-cols-3"
              >
                {photos.map((photo) => (
                  <GalleryTile
                    key={photo.src}
                    photo={photo}
                    onOpen={() => setLightbox(photo)}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />

      {/* ---- 생활 관리 ---- */}
      <section className="border-y border-white/5 bg-[#05050a] px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Life Management"
            ko={
              <>
                부모님이 가장 먼저
                <br className="md:hidden" /> 물으시는 것들
              </>
            }
            sub="8주를 지탱하는 것은 아이의 의지가 아니라 시스템입니다."
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
                <item.icon size={22} strokeWidth={1.5} className="text-accent" />
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

      {/* ---- 생활 FAQ ---- */}
      <section className="px-5 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHead en="FAQ" ko="생활에 대해 자주 묻는 질문" />
          <motion.div {...fadeUp} className="border-t border-white/10">
            {LIFE_FAQ.map((item) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
      </section>

      <CtaBand
        headline={
          <>
            직접 보고 결정하셔도
            <br className="md:hidden" /> 됩니다
          </>
        }
        sub="상담 예약 후 방문하시면 생활관과 실기실을 함께 둘러보실 수 있습니다."
      />

      <MobileActionBar />
    </main>
  );
}
