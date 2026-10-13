import Image from "next/image";
import Link from "next/link";
export default function ManagementOverview() {
  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["01", "학과를 매일 이어갑니다", "평일 국어·영어·탐구 수업과 클리닉, 자기주도 학습을 한 일과로 연결합니다.", "/winter/schedule", "하루 일과 확인"],
          ["02", "실기는 주말에 집중합니다", "입소 전 실기 수준을 확인하고, 주말에는 목표 대학의 출제 유형에 맞춰 지도합니다.", "/winter/teachers", "담당 강사진 확인"],
          ["03", "부모님도 과정을 확인합니다", "시험 기록과 출결·생활, 담당 강사의 해석과 다음 과제를 격주 리포트로 안내합니다.", "#report-preview", "리포트 양식 확인"],
        ].map(([no, title, desc, href, label]) => (
          <div key={no} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <p className="font-mono text-sm text-accent">{no}</p>
            <h3 className="mt-4 text-xl font-bold text-white break-keep">{title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75 break-keep">{desc}</p>
            <Link href={href} className="mt-5 inline-block text-sm font-semibold text-accent underline underline-offset-4">{label}</Link>
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["/images/winter/dorm-room.jpg", "생활관 4인실", "생활관과 학습 공간을 먼저 확인하세요"],
          ["/images/winter/classroom-desks.jpg", "자기주도 학습 공간", "수업 이후 공부가 이어지는 자리"],
        ].map(([src, alt, title]) => (
          <figure key={src} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="relative aspect-[4/3]"><Image src={src} alt={alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>
            <figcaption className="p-5"><p className="font-semibold text-white">{title}</p><p className="mt-1 text-sm text-white/65">{alt}</p></figcaption>
          </figure>
        ))}
      </div>
      <div className="rounded-2xl border border-accent/25 bg-accent/[0.04] p-6 md:p-8">
        <h3 className="text-xl font-bold text-white">생활과 연락 방식도 상담에서 확인하세요</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/75 break-keep">남녀 생활관 분리, 야간 관리, 휴대폰 운영과 학부모 연락 방법을 안내합니다. 방문 상담에서 생활관과 실기실을 둘러보고 아이에게 맞는 환경인지 확인하실 수 있습니다.</p>
        <Link href="/winter/gallery" className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4">공간 사진과 생활 안내 보기</Link>
      </div>
    </div>
  );
}
