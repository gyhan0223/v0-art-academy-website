# 1:1 입시 전략 컨설팅 신청 → 구글 스프레드시트 + 이메일 알림 연동 가이드

유료 컨설팅 신청 폼(`/api/consulting`)의 접수 내용을
**구글 스프레드시트에 자동 기록**하고, 동시에 **이메일로 알림**을 받는 설정입니다.

> **윈터스쿨 상담(`/api/consult`)과 반드시 분리하세요.**
> 유료 컨설팅 신청이 윈터스쿨 상담 시트에 섞이면 응대가 꼬입니다.
> 그래서 코드도 기존 `CONSULT_WEBHOOK_URL`로 fallback하지 않으며,
> 아래 새 환경변수(`CONSULTING_WEBHOOK_URL`)가 설정되기 전에는
> 운영 환경에서 접수가 실패 처리됩니다(조용한 데이터 유실 방지).
> 스프레드시트·Apps Script를 새로 하나 더 만들면 됩니다. (약 10분)

전체 절차는 [consult-webhook-setup.md](./consult-webhook-setup.md)와 같고,
아래 두 가지만 다릅니다.

## 1. 새 스프레드시트 + Apps Script

시트 이름은 `컨설팅 신청` 등으로 만들고, Apps Script에는 아래 코드를 붙여넣으세요.
(윈터스쿨용과 달리 **고민 내용·유입 경로** 열이 추가됩니다)

```javascript
// ====== 설정 (이 두 줄만 수정하세요) ======
const NOTIFY_EMAIL = "여기에알림받을이메일@gmail.com"; // 알림 받을 이메일
const TOKEN = "여기에-아무-비밀문자열"; // .env의 CONSULTING_WEBHOOK_TOKEN과 동일하게
// ==========================================

const SHEET_NAME = "컨설팅신청";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  // 토큰이 다르면 기록하지 않음 (외부인의 무단 전송 차단)
  if (data.token !== TOKEN) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: "unauthorized" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 1) 시트에 한 줄 추가
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "접수시각", "이름", "학년", "연락처", "희망대학", "고민내용", "유입경로",
    ]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    new Date(),
    data.name,
    data.grade,
    data.phone,
    data.university,
    data.concern,
    data.source,
  ]);

  // 2) 이메일 알림
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `[1:1 컨설팅 신청] ${data.name} (${data.grade})`,
    body: [
      "새 1:1 입시 전략 컨설팅 신청이 접수되었습니다.",
      "※ 유료 컨설팅입니다 — 상담 가능한 일정과 결제 방법을 안내해 주세요.",
      "",
      `이름: ${data.name}`,
      `학년: ${data.grade}`,
      `연락처: ${data.phone}`,
      `희망 대학: ${data.university}`,
      `고민 내용: ${data.concern}`,
      `유입 경로: ${data.source}`,
      "",
      `시트 바로가기: ${ss.getUrl()}`,
    ].join("\n"),
  });

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

배포(웹 앱 · 액세스 권한 "모든 사용자")는 기존 가이드 3단계와 동일합니다.

## 2. 환경변수 등록

`.env.local`과 **Vercel 환경변수** 양쪽에:

```
CONSULTING_WEBHOOK_URL=새로_발급받은_웹앱_URL
CONSULTING_WEBHOOK_TOKEN=위_스크립트의_TOKEN과_동일한_문자열
```

기존 `CONSULT_WEBHOOK_URL` / `CONSULT_WEBHOOK_TOKEN`(윈터스쿨용)은
그대로 두면 됩니다 — 서로 영향이 없습니다.

## 동작 확인

1. 개발 서버 재시작 후 `/consulting`에서 테스트 신청 제출
2. 새 스프레드시트에 줄이 추가되고 알림 메일이 오는지 확인
3. `/winter` 상담 폼도 여전히 기존 시트로 들어가는지 함께 확인
