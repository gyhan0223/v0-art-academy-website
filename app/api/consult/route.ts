import { NextResponse } from "next/server";
import {
  parseConsultationInput,
  consultationPayload,
} from "@/lib/winter-consultation";

/**
 * 윈터스쿨 상담 신청 접수.
 *
 * 접수 내용을 구글 Apps Script 웹훅으로 전송한다.
 * 웹훅이 구글 스프레드시트 기록 + 이메일 알림을 모두 처리한다.
 * 설정 방법: docs/consult-webhook-setup.md
 *
 * 필요한 환경변수 (.env.local / Vercel 환경변수):
 *  - CONSULT_WEBHOOK_URL   : Apps Script 웹 앱 배포 URL
 *  - CONSULT_WEBHOOK_TOKEN : Apps Script 코드의 TOKEN과 동일한 임의 문자열
 */
export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "입력 내용을 확인해 주세요." },
      { status: 400 },
    );
  }
  const input = parseConsultationInput(data);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "이름·학년·연락처와 선택 항목을 확인해 주세요." },
      { status: 400 },
    );
  }
  const payload = consultationPayload(
    input,
    process.env.CONSULT_WEBHOOK_TOKEN ?? "",
  );

  const webhookUrl = process.env.CONSULT_WEBHOOK_URL;

  if (!webhookUrl) {
    // Missing destination must never produce a fake successful consultation.
    console.error("[상담 요청] 접수 시스템 미설정");
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
    // Apps Script may return HTTP 200 with {ok:false}, e.g. token mismatch.
    const acknowledgement = await res.json();
    if (acknowledgement?.ok !== true)
      throw new Error("webhook did not acknowledge consultation");
  } catch (error) {
    console.error("[상담 요청] 웹훅 접수 확인 실패", error);
    return NextResponse.json(
      { ok: false, error: "접수 전송에 실패했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
