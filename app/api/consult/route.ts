import { NextResponse } from "next/server";

/**
 * 윈터캠프 상담 신청 접수.
 *
 * 접수 내용을 구글 Apps Script 웹훅으로 전송한다.
 * 웹훅이 구글 스프레드시트 기록 + 이메일 알림을 모두 처리한다.
 * 설정 방법: docs/consult-webhook-setup.md
 *
 * 필요한 환경변수 (.env.local / Vercel 환경변수):
 *  - CONSULT_WEBHOOK_URL   : Apps Script 웹 앱 배포 URL
 *  - CONSULT_WEBHOOK_TOKEN : Apps Script 코드의 TOKEN과 동일한 임의 문자열
 */
/** 휴대폰 번호 자릿수 검증 — 010은 11자리, 그 외 이동통신 국번은 10~11자리 */
const PHONE_PATTERN = /^(010\d{8}|01[16789]\d{7,8})$/;

export async function POST(request: Request) {
  const data = await request.json();

  const { name, grade, phone, university } = data ?? {};
  if (!name || !grade || !phone) {
    return NextResponse.json(
      { ok: false, error: "필수 항목이 누락되었습니다." },
      { status: 400 },
    );
  }

  // 클라이언트 검증을 우회한 잘못된 번호가 시트에 쌓이지 않도록 서버에서도 확인한다.
  if (!PHONE_PATTERN.test(String(phone).replace(/\D/g, ""))) {
    return NextResponse.json(
      { ok: false, error: "연락처 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const payload = {
    token: process.env.CONSULT_WEBHOOK_TOKEN ?? "",
    name: String(name).slice(0, 50),
    grade: String(grade).slice(0, 20),
    phone: String(phone).slice(0, 20),
    university: String(university || "").slice(0, 100) || "(미입력)",
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.CONSULT_WEBHOOK_URL;

  if (!webhookUrl) {
    // 웹훅 미설정 — 데이터가 유실되므로 개발 환경에서만 통과시킨다.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[상담 신청] CONSULT_WEBHOOK_URL 미설정 — 콘솔에만 출력합니다.",
        payload,
      );
      return NextResponse.json({ ok: true });
    }
    console.error("[상담 신청] CONSULT_WEBHOOK_URL 미설정 — 접수 실패", payload);
    return NextResponse.json(
      { ok: false, error: "접수 시스템 설정 오류" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script는 302 리다이렉트로 응답하는 경우가 있어 follow 필수 (fetch 기본값)
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch (error) {
    // 전송 실패 시 최소한 서버 로그에 남겨 수동 복구가 가능하게 한다.
    console.error("[상담 신청] 웹훅 전송 실패 — 수동 확인 필요", payload, error);
    return NextResponse.json(
      { ok: false, error: "접수 전송에 실패했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
