# Plynk Arc Chrome Extension

현재 페이지를 Plynk Arc에 빠르게 저장하는 브라우저 확장 프로그램입니다.

## 설치 방법

### 1. 아이콘 파일 준비
다음 크기의 PNG 아이콘 파일이 필요합니다:
- `icon16.png` (16x16 픽셀)
- `icon48.png` (48x48 픽셀)
- `icon128.png` (128x128 픽셀)

[Favicon Generator](https://favicon.io/) 같은 도구로 만들 수 있습니다.

### 2. Chrome에 설치
1. Chrome에서 `chrome://extensions/` 열기
2. 우측 상단 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `chrome-extension` 폴더 선택

### 3. 사용 방법
1. 저장하고 싶은 웹 페이지에서 확장 프로그램 아이콘 클릭
2. Arc 선택 (마지막 선택한 Arc가 기억됨)
3. 필요시 커스텀 제목 입력
4. "저장하기" 클릭

## 개발 시 설정

`popup.js`의 `API_BASE_URL`을 환경에 맞게 변경:
- 개발: `http://localhost:3000`
- 프로덕션: `https://your-domain.com`

## 기능
- 현재 페이지 URL 자동 감지
- Arc 선택 (마지막 선택 기억)
- 커스텀 제목 입력 (선택사항)
- 로그인 상태 확인
