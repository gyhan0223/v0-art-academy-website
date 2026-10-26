# 윈터스쿨 클릭·상담 추적

배포 이후부터 수집됩니다. 과거 데이터는 소급 생성되지 않습니다.

| 이벤트 | 의미 |
| --- | --- |
| winter_link_click | 윈터스쿨 개요·상세 페이지로 이동하는 링크 클릭 |
| winter_concern_select | 선택형 상담 고민 선택 (고정된 분류 ID만 전송) |
| winter_contact_click | 상담 폼 이동·네이버 예약·전화·문자·톡톡 클릭 |
| winter_consult_submit | 유효한 폼의 접수 요청 시작 |
| winter_consult_success | 접수 API의 성공 응답 |
| winter_consult_error | 접수 요청 실패 |

공통 매개변수: `page_path`는 출발 페이지, `placement`는 버튼 위치입니다.
링크 이벤트에는 `action`(동선 종류), `target`(고정된 목적지 경로/채널)도 있습니다.
폼 이름·전화번호·희망대학·점수·URL 쿼리·링크 텍스트는 추가 이벤트에 보내지 않습니다.

위치: `jungsi_middle`, `jungsi_bottom`, `diagnosis_result`, `home_banner`,
`nav_desktop`, `nav_mobile`, `winter_hero`, `winter_cta_band`,
`winter_mobile_bar`, `winter_contact_section`, `winter_form`, `retake_hero`, `retake_consult`, `retake_sticky`. 위치 표시가 없으면 `other`입니다.
N수생 안내의 첫 화면·하단 상담·모바일 고정 버튼은 각각 `retake_hero`·`retake_consult`·`retake_sticky`로 구분합니다. 네이버 예약 버튼 클릭을 수집하며, 예약 완료를 뜻하지 않습니다.
2028 수능 개편 안내 뒤 상담 버튼은 `retake_reform`으로 구분합니다. 공식 출처와 수업 설계 예시 펼치기, 같은 페이지 내 이동은 상담 예약 클릭으로 세지 않습니다.
예비 고3 안내(`/winter/grade-12`)는 `grade12_hero`, `grade12_direction`, `grade12_camp`, `grade12_consult`, `grade12_sticky`로 상담 버튼 위치를 구분합니다. 페이지 안의 안내 링크와 시간표 펼치기는 예약 클릭으로 세지 않습니다.
예비 고2 안내(`/winter/grade-11`)는 `grade11_hero`, `grade11_direction`, `grade11_camp`, `grade11_consult`, `grade11_sticky`로 상담 버튼 위치를 구분합니다. 버튼 클릭은 상담 예약 완료를 뜻하지 않습니다.
N수생 안내의 같은 페이지 내 이동(`#causes`, `#camp`, `#routine`, `#consult`)은 윈터스쿨 페이지 이동으로 세지 않습니다.
같은 페이지의 반복 CTA 밴드는 한 종류로 합산됩니다.

기존 `diagnosis_winter_cta_click`, `diagnosis_winter_results_click`은 유지합니다.
진단 결과 버튼 하나를 누르면 기존 이벤트와 새 이벤트가 각각 발생하므로 두 이름의 수치를 합산하지 마세요.
현재 진단은 고2 이하에 윈터스쿨, 고3·N수생에 파이널을 보여줍니다.

## GA4 확인

1. 배포 후 정시 안내에서 윈터스쿨 버튼을 누르고 GA4 실시간의 이벤트 이름별 수에서 `winter_link_click`을 확인합니다.
2. 이벤트를 열어 `placement`, `action`, `target`, `page_path`를 확인합니다.
3. 관리 → 데이터 표시 → 맞춤 정의에서 이벤트 범위의 맞춤 측정기준을 등록합니다: 버튼 위치(`placement`), 동선 종류(`action`), 목적지(`target`). 출발 페이지는 기본 제공 페이지 경로 측정기준을 사용합니다. 등록 전 과거 값은 맞춤 보고서에 소급되지 않습니다.
4. 데이터가 처리된 후 탐색 → 자유 형식에서 행은 이벤트 이름·버튼 위치·출발 페이지, 값은 이벤트 수로 설정하고 `winter_link_click` / `winter_contact_click`을 필터링합니다.
5. `winter_consult_success`는 필요하면 주요 이벤트로 지정합니다. 버튼 클릭은 예약 완료·전화 연결·메시지 발송·학원 등록을 뜻하지 않습니다. 성공 이벤트는 서버 접수 응답이며 담당자의 후속 연락까지 검증하지 않습니다.

개발 모드에서는 전역 클릭 리스너가 설치되지 않습니다. 운영 빌드에서 실제 수집을 검증하세요.
분석 스크립트가 차단되거나 아직 준비되지 않았으면 추가 이벤트는 누락될 수 있으며 방문/접수를 막지 않습니다.

## 과거 Clarity 확인

기간 2026-09-14~2026-10-11, 페이지 `/guide/jungsi-2027`와 `/diagnosis`를 각각 선택합니다.
모바일 클릭 히트맵에서 기존 윈터스쿨 링크 클릭을 확인하고 스크롤 히트맵에서 해당 영역 도달률을 확인합니다.
진단 결과는 학년별로 화면이 달라 일반 히트맵과 결과 화면이 일치하지 않을 수 있습니다. 녹화에서 고2 이하의 결과 화면과 실제 클릭을 함께 확인하세요.
수집되지 않은 기간/페이지는 확인할 수 없습니다.

## 검증

`node --test tests/winter-analytics.test.cjs`

분류, 쿼리/전화번호 제외, 아이콘 클릭, 우클릭 제외/가운데 클릭 포함, 분석 오류 시 기본 동작 유지 확인.
