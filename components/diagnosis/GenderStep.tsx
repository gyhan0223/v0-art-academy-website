"use client";

import type { DiagnosisGender } from "@/lib/diagnosis/types";
import { OptionButton, StepLayout, useAutoAdvance } from "./step-ui";

export default function GenderStep({
  value,
  onSelect,
  onNext,
  onBack,
}: {
  value: DiagnosisGender | null;
  onSelect: (v: DiagnosisGender) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const advance = useAutoAdvance(onNext);
  return (
    <StepLayout title={"남학생인가요,\n여학생인가요?"} onBack={onBack}>
      <div className="space-y-3">
        <OptionButton
          selected={value === "남학생"}
          onClick={() => {
            onSelect("남학생");
            advance();
          }}
          hint="남학생이면 여대는 추천 대상에서 제외돼요."
        >
          남학생
        </OptionButton>
        <OptionButton
          selected={value === "여학생"}
          onClick={() => {
            onSelect("여학생");
            advance();
          }}
        >
          여학생
        </OptionButton>
      </div>
    </StepLayout>
  );
}
