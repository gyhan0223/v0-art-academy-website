import { NextResponse } from "next/server";

/**
 * 윈터캠프 상담 신청 접수.
 * TODO: 실제 전송 연동 (알림톡 / 이메일 / 스프레드시트 등) — 현재는 콘솔 출력만 한다.
 */
export async function POST(request: Request) {
  const data = await request.json();

  const { name, grade, phone, university } = data ?? {};
  if (!name || !grade || !phone) {
    return NextResponse.json(
      { ok: false, error: "필수 항목이 누락되었습니다." },
      { status: 400 },
    );
  }

  console.log("[윈터캠프 상담 신청]", {
    name,
    grade,
    phone,
    university: university || "(미입력)",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
