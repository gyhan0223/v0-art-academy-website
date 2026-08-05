/**
 * 윈터스쿨 사진 데이터 단일 소스.
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

// 본원(beutiful-academy) 시설 촬영본을 4:3으로 잘라 가져온 사진들.
//
// TODO: 원장님 확인 — 아래 컷은 본원 자료에 없어 아직 비어 있다. 촬영본이
//       생기면 같은 규칙(4:3, 1600×1200, 500KB 이하)으로 추가한다.
//       · 여학생 / 남학생 생활관을 구분해 보여줄 사진
//       · 식당 전경과 30찬 뷔페 배식대 (지금 있는 식사 사진은 배식 도시락이라
//         "매 끼 30찬 뷔페식"이라는 설명과 그림이 맞지 않는다)
//       · 개인 이젤·작업 자리가 보이는 실기실 컷
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/images/winter/dorm-room.jpg",
    caption: "생활관 4인실",
    category: "기숙사",
  },
  {
    src: "/images/winter/dorm-study.jpg",
    caption: "생활관 독서실",
    category: "기숙사",
  },
  {
    src: "/images/winter/classroom-lecture.jpg",
    caption: "학과 수업",
    category: "강의실",
  },
  {
    src: "/images/winter/classroom-front.jpg",
    caption: "학과 강의실",
    category: "강의실",
  },
  {
    src: "/images/winter/classroom-desks.jpg",
    caption: "자기주도 학습 자리",
    category: "강의실",
  },
  {
    src: "/images/winter/studio-01.jpg",
    caption: "실기실",
    category: "실기실",
  },
  {
    src: "/images/winter/studio-02.jpg",
    caption: "실기실",
    category: "실기실",
  },
  {
    src: "/images/winter/dining-meal.jpg",
    caption: "제공 식단",
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
