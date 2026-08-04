"use client";

/**
 * 윈터캠프 상담 신청 폼.
 * 폼은 /winter(개요) 한 곳에만 두고, 하위 페이지의 버튼은
 * /winter#consult-form으로 보내 동선을 하나로 유지한다.
 */

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { CAMP_INFO } from "@/lib/winter-camp";

/** 010-1234-5678 형태로 자동 하이픈 */
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/**
 * 휴대폰 번호 자릿수 검증.
 * 010은 11자리, 그 외 이동통신 국번(011·016·017·018·019)은 10~11자리.
 */
const PHONE_PATTERN = /^(010\d{8}|01[16789]\d{7,8})$/;

function phoneError(value: string): string | null {
  const d = value.replace(/\D/g, "");
  if (d.length === 0) return null; // 입력 전에는 오류를 띄우지 않는다
  if (!d.startsWith("01")) return "휴대폰 번호를 010으로 시작해 입력해 주세요.";
  if (!PHONE_PATTERN.test(d))
    return `번호 자릿수가 맞지 않습니다. (현재 ${d.length}자리 · 010-0000-0000 형식)`;
  return null;
}

const GRADE_OPTIONS = ["예비 고2", "예비 고3", "재수생"] as const;

const INPUT_CLASS =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent";

export default function ConsultForm() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [university, setUniversity] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const phoneMessage = phoneError(phone);
  const phoneValid = phone !== "" && phoneMessage === null;
  /** 입력 중에는 방해하지 않고, 포커스를 벗어난 뒤부터 오류를 보여준다 */
  const showPhoneError = phoneTouched && phoneMessage !== null;

  const canSubmit =
    name.trim().length > 0 &&
    grade !== "" &&
    phoneValid &&
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
            onBlur={() => setPhoneTouched(true)}
            placeholder="010-0000-0000"
            aria-invalid={showPhoneError}
            aria-describedby={showPhoneError ? "consult-phone-error" : undefined}
            className={`${INPUT_CLASS} ${
              showPhoneError ? "border-red-400/70 focus:border-red-400" : ""
            }`}
          />
          {showPhoneError && (
            <p
              id="consult-phone-error"
              role="alert"
              className="mt-2 text-xs text-red-400 break-keep"
            >
              {phoneMessage}
            </p>
          )}
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
              <p>· 동의를 거부할 수 있으나, 거부 시 상담 신청이 제한됩니다.</p>
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
