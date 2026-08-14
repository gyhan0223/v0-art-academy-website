"use client";

/** 분석 전 입력 요약 — 각 행에서 바로 수정으로 돌아갈 수 있다 */

import type {
  DetailedStudentScore,
  DiagnosisGender,
  DiagnosisGrade,
  DiagnosisSilgi,
  ScoreValue,
} from "@/lib/diagnosis/types";
import { DIAGNOSIS_SILGI_OPTIONS } from "@/lib/diagnosis/types";
import { hasAnyScore } from "@/lib/diagnosis/score-engine";
import { PrimaryButton, StepLayout } from "./step-ui";

function scoreText(v: ScoreValue): string {
  const parts: string[] = [];
  if (v.grade != null) parts.push(`${v.grade}등급`);
  if (v.standardScore != null) parts.push(`표준점수 ${v.standardScore}`);
  if (v.percentile != null) parts.push(`백분위 ${v.percentile}`);
  return parts.length > 0 ? parts.join(" · ") : "입력 없음";
}

function Row({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-white/8 py-3.5 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[13px] text-white/45">{label}</p>
        <p className="mt-0.5 text-[15px] text-white/90">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 rounded-md border border-white/15 px-3 py-2 text-[13px] text-white/60 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        수정
      </button>
    </li>
  );
}

export default function ConfirmStep({
  grade,
  gender,
  silgi,
  score,
  onEditProfile,
  onEditSilgi,
  onEditScore,
  onNext,
  onBack,
}: {
  grade: DiagnosisGrade;
  gender: DiagnosisGender;
  silgi: DiagnosisSilgi[];
  score: DetailedStudentScore;
  onEditProfile: () => void;
  onEditSilgi: () => void;
  onEditScore: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const silgiLabel = silgi
    .map((s) => DIAGNOSIS_SILGI_OPTIONS.find((o) => o.value === s)?.label ?? s)
    .join(" · ");

  return (
    <StepLayout title="입력한 정보를 확인해주세요" onBack={onBack}>
      <ul className="rounded-xl border border-white/10 bg-white/[0.02] px-5">
        <Row
          label="학년 · 성별"
          value={`${grade} · ${gender}`}
          onEdit={onEditProfile}
        />
        <Row label="준비 중인 실기" value={silgiLabel} onEdit={onEditSilgi} />
        {!hasAnyScore(score) ? (
          <Row
            label="성적"
            value="아직 모의고사 성적이 없어요"
            onEdit={onEditScore}
          />
        ) : (
          <>
        <Row label="국어" value={scoreText(score.korean)} onEdit={onEditScore} />
        <Row
          label="영어"
          value={
            score.english.grade != null
              ? `${score.english.grade}등급`
              : "입력 없음"
          }
          onEdit={onEditScore}
        />
        {score.inquiry1.notTaken ? (
          <Row label="탐구" value="미응시" onEdit={onEditScore} />
        ) : (
          <>
            <Row
              label={
                score.inquiry1.subject
                  ? `탐구1 · ${score.inquiry1.subject}`
                  : "탐구1"
              }
              value={scoreText(score.inquiry1)}
              onEdit={onEditScore}
            />
            <Row
              label={
                score.inquiry2.subject
                  ? `탐구2 · ${score.inquiry2.subject}`
                  : "탐구2"
              }
              value={
                score.inquiry2.notTaken ? "미응시" : scoreText(score.inquiry2)
              }
              onEdit={onEditScore}
            />
          </>
        )}
        <Row
          label={
            score.math.subject && !score.math.notTaken
              ? `수학 · ${score.math.subject}`
              : "수학"
          }
          value={score.math.notTaken ? "미응시" : scoreText(score.math)}
          onEdit={onEditScore}
        />
        <Row
          label="한국사"
          value={
            score.koreanHistory.grade != null
              ? `${score.koreanHistory.grade}등급`
              : "입력 없음"
          }
          onEdit={onEditScore}
        />
          </>
        )}
      </ul>

      <div className="mt-8">
        <PrimaryButton onClick={onNext}>
          {hasAnyScore(score) ? "이 성적으로 분석하기" : "입력한 정보로 진단하기"}
        </PrimaryButton>
      </div>
    </StepLayout>
  );
}
