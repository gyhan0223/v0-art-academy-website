"use client";

/**
 * 준비 중인 실기 — 복수 선택.
 * 병행 준비(예: 기초디자인 + 발상과 표현)가 흔해 여러 개를 고를 수 있다.
 * 복수 선택이라 자동 진행 대신 "다음" 버튼을 쓴다.
 * "아직 잘 모르겠어요"는 다른 선택과 배타 — 누르면 나머지가 해제된다.
 */

import {
  DIAGNOSIS_SILGI_OPTIONS,
  type DiagnosisSilgi,
} from "@/lib/diagnosis/types";
import { OptionButton, PrimaryButton, StepLayout } from "./step-ui";

export default function SilgiStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: DiagnosisSilgi[];
  onChange: (v: DiagnosisSilgi[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (v: DiagnosisSilgi) => {
    if (v === "모름") {
      // 모름은 단독 선택
      onChange(value.includes("모름") ? [] : ["모름"]);
      return;
    }
    const withoutUnknown = value.filter((s) => s !== "모름");
    onChange(
      withoutUnknown.includes(v)
        ? withoutUnknown.filter((s) => s !== v)
        : [...withoutUnknown, v],
    );
  };

  return (
    <StepLayout
      title="지금 어떤 실기를 준비하고 있나요?"
      sub="준비 중인 실기를 모두 골라주세요. 여러 개를 선택할 수 있어요."
      onBack={onBack}
    >
      <div className="space-y-2.5">
        {DIAGNOSIS_SILGI_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.value}
            selected={value.includes(opt.value)}
            onClick={() => toggle(opt.value)}
            hint={opt.hint}
          >
            {opt.label}
          </OptionButton>
        ))}
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={onNext} disabled={value.length === 0}>
          다음
        </PrimaryButton>
      </div>
    </StepLayout>
  );
}
