"use client";
import ManagementOverview from "@/components/winter/ManagementOverview";
import ReportSample from "@/components/winter/ReportSample";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import { SubPageHeader, WinterTabs, SectionHead } from "@/components/winter/shared";
/** Keep the shared URL usable while replacing unverified performance claims. */
export default function WinterResultsPage() {
  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-36 pb-14 md:px-6 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <SubPageHeader en="Learning & Care" title="학습·생활 관리" sub="수업을 듣는 시간부터 부모님께 기록을 전하는 순간까지, 8주의 운영 방식을 확인하세요." />
          <WinterTabs className="mt-8" /><ManagementOverview />
        </div>
      </section>
      <section id="report-preview" className="scroll-mt-36 border-y border-white/10 px-5 py-16 md:px-6">
        <div className="mx-auto max-w-4xl">
          <SectionHead en="Parent Report" ko="기록에 해석과 다음 계획을 더합니다" sub="2027 윈터스쿨에서 사용할 격주 리포트의 운영 양식 예시입니다." /><ReportSample />
        </div>
      </section>
      <CtaBand headline="우리 아이에게 필요한 관리부터 확인하세요" sub="현재 성적·실기 준비·생활 고민을 듣고 수업과 기숙 방식이 맞는지 함께 살펴봅니다." />
      <MobileActionBar />
    </main>
  );
}
