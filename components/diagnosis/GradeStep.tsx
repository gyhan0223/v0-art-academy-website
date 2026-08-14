"use client";

import { DIAGNOSIS_GRADES, type DiagnosisGrade } from "@/lib/diagnosis/types";
import { OptionButton, StepLayout, useAutoAdvance } from "./step-ui";

export default function GradeStep({
  value,
  onSelect,
  onNext,
  onBack,
}: {
  value: DiagnosisGrade | null;
  onSelect: (v: DiagnosisGrade) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const advance = useAutoAdvance(onNext);
  return (
    <StepLayout title="현재 몇 학년인가요?" onBack={onBack}>
      <div className="space-y-3">
        {DIAGNOSIS_GRADES.map((g) => (
          <OptionButton
            key={g}
            selected={value === g}
            onClick={() => {
              onSelect(g);
              advance();
            }}
          >
            {g}
          </OptionButton>
        ))}
      </div>
    </StepLayout>
  );
}
