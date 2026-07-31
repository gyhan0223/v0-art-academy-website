# 상담 신청 → 구글 스프레드시트 + 이메일 알림 연동 가이드

윈터캠프 상담 폼(`/api/consult`)의 접수 내용을
**구글 스프레드시트에 자동 기록**하고, 동시에 **이메일로 알림**을 받는 설정입니다.
비용은 들지 않으며, 구글 계정만 있으면 됩니다. (소요 시간 약 10분)

## 1. 스프레드시트 만들기

1. https://sheets.new 접속 (구글 로그인 필요)
2. 시트 이름을 `윈터캠프 상담 신청` 등으로 변경

## 2. Apps Script 붙여넣기

1. 시트 상단 메뉴 **확장 프로그램 → Apps Script** 클릭
2. 편집기에 기본으로 있는 코드를 전부 지우고 아래 코드를 붙여넣기
3. 상단의 `NOTIFY_EMAIL`과 `TOKEN` 두 값을 수정

```javascript
// ====== 설정 (이 두 줄만 수정하세요) ======
const NOTIFY_EMAIL = "여기에알림받을이메일@gmail.com"; // 알림 받을 이메일
const TOKEN = "여기에-아무-비밀문자열"; // .env의 CONSULT_WEBHOOK_TOKEN과 동일하게
// ==========================================

const SHEET_NAME = "상담신청";

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
    sheet.appendRow(["접수시각", "이름", "학년", "연락처", "희망대학"]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date(), data.name, data.grade, data.phone, data.university]);

  // 2) 이메일 알림
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `[윈터캠프 상담 신청] ${data.name} (${data.grade})`,
    body: [
      "새 상담 신청이 접수되었습니다.",
      "",
      `이름: ${data.name}`,
      `학년: ${data.grade}`,
      `연락처: ${data.phone}`,
      `희망 대학: ${data.university}`,
      "",
      `시트 바로가기: ${ss.getUrl()}`,
    ].join("\n"),
  });

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. 💾 저장 (Ctrl+S)

## 3. 웹 앱으로 배포

1. 편집기 오른쪽 위 **배포 → 새 배포** 클릭
2. 톱니바퀴(⚙) → **웹 앱** 선택
3. 설정:
   - 설명: `상담 신청 웹훅` (아무거나)
   - 다음 사용자 인증 정보로 실행: **나**
   - 액세스 권한이 있는 사용자: **모든 사용자** ← 중요! (토큰으로 이미 보호됨)
4. **배포** 클릭 → 권한 승인 창이 뜨면 본인 계정으로 승인
   ("확인되지 않은 앱" 경고가 떠도 본인이 만든 스크립트이므로
   **고급 → 이동(안전하지 않음)** 으로 진행하면 됩니다)
5. 발급된 **웹 앱 URL** 복사 (`https://script.google.com/macros/s/…/exec` 형태)

## 4. 프로젝트에 URL 등록

프로젝트 루트의 `.env.local` 파일에 (없으면 새로 만들기):

```
CONSULT_WEBHOOK_URL=복사한_웹앱_URL
CONSULT_WEBHOOK_TOKEN=2단계에서_정한_TOKEN과_동일한_문자열
```

**배포(Vercel 등)에도 동일한 환경변수 2개를 등록**해야 실서비스에서 동작합니다.
(Vercel: Settings → Environment Variables → 두 값 추가 → 재배포)

## 5. 동작 확인

1. 개발 서버 재시작 (`npm run dev` — .env 변경은 재시작해야 반영)
2. `/winter` 페이지에서 테스트 신청 제출
3. 확인할 것:
   - 스프레드시트에 줄이 추가됐는지
   - `NOTIFY_EMAIL`로 알림 메일이 왔는지

## 동작 방식 / 장애 시 동작

- 웹훅 전송에 실패하면 사용자 화면에 "전화로 연락해 주세요" 안내가 표시되고,
  서버 로그에 신청 내용이 남아 수동 복구가 가능합니다.
- 운영 환경에서 `CONSULT_WEBHOOK_URL`이 비어 있으면 접수가 실패 처리됩니다
  (조용히 데이터가 유실되는 것을 막기 위한 의도된 동작).
- 휴대폰 푸시 알림을 받으려면 알림 이메일 계정을 스마트폰 Gmail 앱에 등록해 두세요.

## 자주 묻는 문제

| 증상 | 원인/해결 |
| --- | --- |
| 신청해도 시트에 안 쌓임 | 웹 앱 액세스 권한이 "모든 사용자"인지 확인. 코드 수정 후에는 **배포 → 배포 관리 → 새 버전**으로 재배포해야 반영됨 |
| 메일이 안 옴 | Apps Script는 하루 100통 제한(개인 계정). 스팸함도 확인 |
| 401/unauthorized | `.env.local`의 TOKEN과 스크립트의 TOKEN이 다름 |
