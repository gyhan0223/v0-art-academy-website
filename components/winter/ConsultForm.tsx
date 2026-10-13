"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trackWinter } from "@/lib/winter-analytics";
import { CAMP_INFO, SMS_HREF } from "@/lib/winter-camp";
import {
  CONSULT_CONCERNS,
  CONTACT_TIMES,
  CONSULT_GRADES,
  PHONE_PATTERN,
  WINTER_CONSULT_LABEL,
  WINTER_CONSULT_DESCRIPTION,
} from "@/lib/winter-consultation";
import { NaverTalkButton } from "@/components/academy/NaverTalk";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  const split = digits.length < 11 ? 6 : 7;
  return `${digits.slice(0, 3)}-${digits.slice(3, split)}-${digits.slice(split)}`;
}
const INPUT_CLASS =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-white/40 outline-none focus:border-accent";

export default function ConsultForm() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [university, setUniversity] = useState("");
  const [concern, setConcern] = useState("");
  const [contactTime, setContactTime] = useState("any");
  const [agreed, setAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const submitting = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const selected = CONSULT_CONCERNS.find((c) => c.id === concern);
  const phoneValid = PHONE_PATTERN.test(phone.replace(/\D/g, ""));
  const canSubmit =
    name.trim().length > 0 &&
    grade !== "" &&
    phoneValid &&
    agreed &&
    status !== "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    setStatus("submitting");
    trackWinter("winter_consult_submit", { placement: "winter_form" });
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          grade,
          phone,
          university: university.trim(),
          concern,
          contactTime,
        }),
      });
      const result = await res.json();
      if (!res.ok || result.ok !== true)
        throw new Error("consult request failed");
      setStatus("done");
      trackWinter("winter_consult_success", { placement: "winter_form" });
    } catch {
      setStatus("error");
      trackWinter("winter_consult_error", { placement: "winter_form" });
    } finally {
      submitting.current = false;
    }
  }

  if (status === "done")
    return (
      <div
        id="consult-form"
        role="status"
        className="scroll-mt-24 rounded-2xl border border-accent/30 bg-accent/[0.05] px-7 py-12 text-center"
      >
        <CheckCircle2 size={40} className="mx-auto text-accent" />
        <h3 className="mt-5 text-xl font-bold text-white">
          상담 요청을 받았습니다.
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/75">
          윈터스쿨 상담 담당자가 남겨주신 번호로 전화드립니다.
          <br />
          선택하신 고민과 연락 희망 시간을 참고해 순서대로 연락드립니다.
        </p>
        <p className="mt-3 text-sm text-white/60">
          밤에 남겨주신 요청은 다음 날 연락드립니다.
          <br />
          희망 시간은 확정 예약이 아닙니다.
        </p>
        {selected && (
          <p className="mt-5 text-sm text-accent">
            상담에서 먼저 확인할 내용: {selected.label}
          </p>
        )}
        <p className="mt-5 text-sm text-white/70">
          먼저 문의하실 내용이 있다면{" "}
          <a href={CAMP_INFO.phoneTel} className="underline underline-offset-4">
            {CAMP_INFO.phone}
          </a>
          로 연락해 주세요.
        </p>
      </div>
    );

  return (
    <section
      id="consult-form"
      aria-labelledby="consult-title"
      className="scroll-mt-24 rounded-2xl border border-accent/40 bg-white/[0.03] p-6 text-left md:p-10"
    >
      <h3
        id="consult-title"
        tabIndex={-1}
        className="text-xl font-bold text-white outline-none md:text-2xl"
      >
        {WINTER_CONSULT_LABEL}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-white/75 break-keep">
        {WINTER_CONSULT_DESCRIPTION}
      </p>
      <p className="mt-2 text-sm text-white/55">
        학부모님이 남겨주시면 됩니다. 학생도 직접 문의할 수 있습니다.
      </p>
      <fieldset className="mt-7" disabled={status === "submitting"}>
        <legend className="text-sm font-semibold text-white">
          가장 궁금한 점{" "}
          <span className="font-normal text-white/50">(선택)</span>
        </legend>
        <p className="mt-2 text-sm text-white/60">
          하나를 고르면 관련 안내를 먼저 볼 수 있습니다. 선택하지 않고 바로
          요청하셔도 됩니다.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {CONSULT_CONCERNS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={concern === item.id}
              onClick={() => {
                const next = concern === item.id ? "" : item.id;
                setConcern(next);
                if (next)
                  trackWinter("winter_concern_select", {
                    placement: "winter_form",
                    concern: next,
                  });
              }}
              className={`min-h-12 rounded-xl border px-3 py-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${concern === item.id ? "border-accent bg-accent/10 text-accent" : "border-white/20 text-white/80 hover:border-white/40"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          {selected && (
            <div className="mt-4 rounded-xl border border-accent/25 bg-accent/[0.05] p-4">
              <p className="text-[15px] leading-relaxed text-white/80">
                {selected.description}
              </p>
              <Link
                href={selected.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-accent underline underline-offset-4"
              >
                {selected.linkLabel} <span className="text-xs">(새 창)</span>
              </Link>
              <p className="mt-3 text-xs text-white/55">
                선택하신 내용을 상담 담당자에게 함께 전달합니다.
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setConcern("");
            nameInput.current?.focus();
          }}
          className="mt-4 text-sm text-white/75 underline underline-offset-4"
        >
          안내 선택 없이 바로 상담 요청하기
        </button>
      </fieldset>
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="consult-name"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            문의자 이름 <span className="text-accent">*</span>
          </label>
          <input
            ref={nameInput}
            id="consult-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="연락받으실 분의 이름"
            className={INPUT_CLASS}
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-white/80">
            자녀 학년 <span className="text-accent">*</span>
          </legend>
          <p className="mb-3 text-xs text-white/50">
            2027년 과정 입소 기준입니다. 학생이 직접 문의하면 본인 학년을 선택해
            주세요.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CONSULT_GRADES.map((g) => (
              <label
                key={g}
                className={`flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-1 py-3 text-sm ${grade === g ? "border-accent bg-accent/10 text-accent" : "border-white/20 text-white/75"}`}
              >
                <input
                  type="radio"
                  name="grade"
                  required
                  value={g}
                  checked={grade === g}
                  onChange={() => setGrade(g)}
                  className="accent-accent"
                />
                {g}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="consult-phone"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            회신 연락처 <span className="text-accent">*</span>
          </label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onBlur={() => setPhoneTouched(true)}
            placeholder="010-0000-0000"
            aria-invalid={phoneTouched && !phoneValid}
            aria-describedby="consult-phone-note"
            className={INPUT_CLASS}
          />
          <p
            id="consult-phone-note"
            className={`mt-2 text-xs ${phoneTouched && !phoneValid ? "text-red-400" : "text-white/55"}`}
          >
            {phoneTouched && !phoneValid
              ? "연락 가능한 휴대폰 번호를 확인해 주세요."
              : "담당자가 이 번호로 전화드립니다."}
          </p>
        </div>
        <div>
          <label
            htmlFor="consult-time"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            연락 희망 시간{" "}
            <span className="font-normal text-white/50">(선택)</span>
          </label>
          <select
            id="consult-time"
            name="contactTime"
            value={contactTime}
            onChange={(e) => setContactTime(e.target.value)}
            className={`${INPUT_CLASS} [&>option]:bg-black`}
          >
            {CONTACT_TIMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-white/55">
            가능한 시간대를 참고해 연락드립니다. 확정 예약은 아닙니다.
          </p>
        </div>
        <div>
          <label
            htmlFor="consult-univ"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            희망 대학 <span className="font-normal text-white/50">(선택)</span>
          </label>
          <input
            id="consult-univ"
            name="university"
            type="text"
            maxLength={100}
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="아직 정하지 않으셨다면 비워 두세요"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <div className="flex items-start gap-2.5">
            <input
              id="consult-agree"
              name="agreed"
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-accent"
            />
            <label
              htmlFor="consult-agree"
              className="flex-1 text-sm text-white/80"
            >
              개인정보 수집·이용에 동의합니다{" "}
              <span className="text-accent">(필수)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPrivacy(!showPrivacy)}
              aria-expanded={showPrivacy}
              aria-controls="consult-privacy"
              className="shrink-0 text-xs text-white/60 underline underline-offset-2"
            >
              {showPrivacy ? "접기" : "자세히"}
            </button>
          </div>
          {showPrivacy && (
            <div
              id="consult-privacy"
              className="mt-3 space-y-2 rounded-lg border border-white/10 p-4 text-xs leading-relaxed text-white/65"
            >
              <p>
                수집 항목: 문의자 이름, 자녀 학년, 회신 연락처, 희망 대학·상담
                고민·연락 희망 시간(선택)
              </p>
              <p>이용 목적: 윈터스쿨 상담 준비와 회신</p>
              <p>보유 기간: 상담 완료 후 지체 없이 파기</p>
              <p>
                동의를 거부할 수 있으나, 연락처를 남기는 상담 요청은 제한됩니다.
                전화·톡톡 문의는 이용하실 수 있습니다.
              </p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-accent px-4 py-4 text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={17} className="animate-spin" />
              요청 중...
            </span>
          ) : (
            "이 내용으로 상담 요청하기"
          )}
        </button>
        {status === "error" && (
          <p role="alert" className="text-center text-sm text-red-400">
            접수하지 못했습니다. 입력 내용은 유지되어 있습니다. 다시
            요청하시거나{" "}
            <a href={CAMP_INFO.phoneTel} className="underline">
              {CAMP_INFO.phone}
            </a>
            로 연락해 주세요.
          </p>
        )}
        <p className="text-center text-xs leading-relaxed text-white/55">
          윈터스쿨 상담 담당자가 전화드립니다.
          <br />
          밤에 남겨주셔도 괜찮습니다. 다음 날 연락드립니다.
        </p>
      </form>
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="mb-3 text-sm text-white/60">짧게 물어보고 싶다면</p>
        <div className="flex flex-wrap gap-3">
          <NaverTalkButton
            label="톡톡으로 물어보기"
            className="px-4 py-3 text-sm"
          />
          <a
            href={SMS_HREF}
            className="rounded-full border border-white/20 px-4 py-3 text-sm text-white/75 md:hidden"
          >
            문자로 물어보기
          </a>
        </div>
      </div>
    </section>
  );
}
