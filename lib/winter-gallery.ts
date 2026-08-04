/**
 * 윈터캠프 사진 데이터 단일 소스.
 * /winter/gallery 페이지가 이 파일만 참조한다.
 *
 * ── 사진 넣을 때 지킬 것 ──────────────────────────────────────
 * · 비율을 섞지 않는다. 전부 가로 4:3으로 잘라서 올린다.
 *   (세로 사진을 그대로 올리면 격자가 무너진다 — GALLERY_ASPECT 참고)
 * · 권장 크기 1600×1200px 내외, 파일당 500KB 이하.
 * · 학생 얼굴이 식별되는 사진은 본인·학부모 동의를 받은 것만 올린다.
 * · 파일은 public/images/winter/ 아래에 두고 여기 경로만 적는다.
 *   아직 파일이 없으면 화면에는 "이미지 준비 중"으로 표시된다.
 * ─────────────────────────────────────────────────────────────
 */

/** 갤러리 전체가 공유하는 단일 비율 — 가로/세로를 섞지 않기 위한 값 */
export const GALLERY_ASPECT = "aspect-[4/3]";

export type GalleryCategory = "기숙사" | "강의실" | "실기실" | "식사";

/** 화면에 나가는 순서 */
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "기숙사",
  "강의실",
  "실기실",
  "식사",
];

export const CATEGORY_DESC: Record<GalleryCategory, string> = {
  기숙사: "남녀 생활관을 분리해 운영하고, 야간에도 관리 인력이 상주합니다.",
  강의실: "평일 학과 수업과 자기주도 학습이 이뤄지는 공간입니다.",
  실기실: "주말 대학교 유형 실기가 진행되는 공간입니다.",
  식사: "매 끼 30찬 뷔페식으로 아침·점심·저녁·야식을 제공합니다.",
};

export interface GalleryPhoto {
  src: string;
  caption: string;
  category: GalleryCategory;
}

// TODO: 원장님 확인 — 실제 촬영본으로 교체. 파일이 없는 항목은
//       화면에 "이미지 준비 중"으로 표시되고 격자는 그대로 유지된다.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/images/winter/dorm-female.jpg",
    caption: "여학생 생활관",
    category: "기숙사",
  },
  {
    src: "/images/winter/dorm-male.jpg",
    caption: "남학생 생활관",
    category: "기숙사",
  },
  {
    src: "/images/winter/dorm-study.jpg",
    caption: "[생활관 독서실]",
    category: "기숙사",
  },
  {
    src: "/images/winter/classroom.jpg",
    caption: "학과 강의실",
    category: "강의실",
  },
  {
    src: "/images/winter/classroom-clinic.jpg",
    caption: "[클리닉 강의실]",
    category: "강의실",
  },
  {
    src: "/images/winter/studio-practice.jpg",
    caption: "실기실",
    category: "실기실",
  },
  {
    src: "/images/winter/studio-desk.jpg",
    caption: "[개인 이젤·작업 자리]",
    category: "실기실",
  },
  {
    src: "/images/winter/dining-buffet.jpg",
    caption: "매 끼 30찬 뷔페식",
    category: "식사",
  },
  {
    src: "/images/winter/dining-hall.jpg",
    caption: "[식당]",
    category: "식사",
  },
];

/** 카테고리별로 묶은 사진 — 빈 카테고리는 화면에 나가지 않는다 */
export function getPhotosByCategory(
  category: GalleryCategory,
  photos: GalleryPhoto[] = GALLERY_PHOTOS,
): GalleryPhoto[] {
  return photos.filter((p) => p.category === category);
}
