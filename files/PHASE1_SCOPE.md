# Phase 1 개발 범위 명세서

## 🎯 개요

**목표**: 완전히 작동하는 plynk arc MVP 출시  
**기간**: 8주 (전체 기능 포함)  
**결과물**: 프로덕션 레디 웹 애플리케이션 + Chrome Extension

---

## 📊 전체 기능 범위

### ✅ 포함된 기능 (All-in-One Phase 1)

#### 1. **인증 & 사용자 관리**
- [x] 이메일/비밀번호 회원가입
- [x] Google 소셜 로그인
- [x] 이메일 인증 필수
- [x] 프로필 관리 (이름, 성별, 나이, 직업)
- [x] 비밀번호 재설정
- [x] 로그아웃

#### 2. **Arc 관리 (핵심)**
- [x] Arc 생성 (이름, 목표, 아이콘, 색상)
- [x] Arc 수정 (모든 필드)
- [x] Arc 삭제
- [x] Arc 목록 보기 (Grid/List 뷰)
- [x] Arc 상세 보기 (Dashboard/Timeline/Table 3가지 뷰)
- [x] Arc 공유 (읽기 전용 링크)
- [x] Arc 통계 (자료 수, 카테고리 분포)
- [x] 무료 tier: 2개 Arc 제한

#### 3. **자료 저장 (URL + 파일)** ⭐
- [x] **URL 저장**
  - Jina Reader로 내용 추출
  - Gemini Flash로 자동 요약
  - 자동 카테고리 분류
  - 자동 태그 생성
- [x] **파일 업로드** (NEW!)
  - PDF 파일 업로드 (최대 10MB)
  - 이미지 업로드 (PNG, JPG, 최대 5MB)
  - Supabase Storage에 저장
  - PDF 텍스트 추출 (Gemini Vision)
  - 이미지 OCR (Gemini Vision)
  - 파일 미리보기
  - 파일 다운로드
- [x] 중복 URL 감지 (같은 Arc 내)
- [x] 자료 수정 (제목, 요약, 카테고리, 태그)
- [x] 자료 삭제
- [x] Realtime 동기화 (Supabase Realtime)

#### 4. **AI 자동화**
- [x] **자동 요약**
  - URL: 2-3문장 핵심 요약
  - PDF: 문서 전체 요약
  - 이미지: OCR + 내용 설명
- [x] **자동 카테고리 분류**
  - Article, Video, Tool, Documentation, Research, Tutorial, News, Reference
- [x] **자동 태그 생성**
  - 콘텐츠에서 키워드 추출 (3-6개)
  - 중복 태그 자동 병합
- [x] **Daily 요약**
  - 매일 설정 시간에 발송
  - 전날 추가된 자료 요약
  - 주요 발견사항 (3-5개)
  - 추천 액션 (2-3개)
  - 조건: 자료 3개 이상
- [x] **Synthesis (체계화)**
  - 유의미한 패턴 자동 탐지
  - 규칙 기반 + AI 분석
  - 인사이트 생성
  - Hebbia 스타일 비교 테이블 자동 생성
  - AI가 컬럼 추천 → 사용자 확인
  - 과거 분석 히스토리 저장

#### 5. **검색 & 필터**
- [x] **Full-text Search** (전문 검색)
  - 제목 + 내용 통합 검색
  - PostgreSQL tsvector (GIN 인덱스)
  - 한글/영어 모두 지원
- [x] **고급 필터**
  - 카테고리 필터
  - 태그 필터 (다중 선택)
  - 날짜 범위 필터
  - Arc 필터
- [x] **정렬**
  - 최신순 (기본)
  - 제목 A-Z
  - 추가일 오래된순

#### 6. **UI/UX**
- [x] **반응형 디자인**
  - 데스크톱 최적화
  - 모바일 최적화 (터치 제스처)
  - 태블릿 지원
- [x] **라이트 모드** (기본)
- [x] **다크 모드** ⭐
  - 자동 시스템 감지
  - 수동 전환
- [x] **3가지 뷰 모드**
  - Dashboard: 통계 + 최근 자료
  - Timeline: 날짜별 타임라인
  - Table: Hebbia 스타일 정렬 테이블
- [x] **알림 시스템**
  - 앱 내 알림 (벨 아이콘)
  - Synthesis 준비 완료 알림
  - Daily 요약 발송 알림
  - 읽음/안 읽음 표시

#### 7. **Chrome Extension**
- [x] Manifest V3
- [x] 현재 페이지 원클릭 저장
- [x] Arc 선택 드롭다운
- [x] 자동 요약 미리보기
- [x] 카테고리/태그 확인/수정
- [x] 인증 토큰 관리 (chrome.storage)
- [x] 최소 권한 (activeTab)

#### 8. **PWA (Progressive Web App)** ⭐
- [x] 홈 화면에 추가
- [x] 오프라인 캐싱 (기본 페이지)
- [x] App Manifest
- [x] Service Worker
- [x] Web Share Target API (모바일 공유)
- [x] 푸시 알림 (선택적)

#### 9. **Export & 연동**
- [x] **PDF Export**
  - Synthesis 결과 → PDF
  - 로고, 차트, 테이블 포함
- [x] **Notion 연동**
  - Arc 전체 → Notion Database
  - 자료별 페이지 생성
  - 태그, 카테고리 속성 매핑
- [x] **CSV Export**
  - 자료 목록 → CSV 다운로드

#### 10. **설정 & 프로필**
- [x] 프로필 정보 수정
- [x] Daily 요약 설정
  - 발송 시간 선택
  - 최소 자료 개수 설정
  - 포함할 Arc 선택
  - 이메일 형식 (HTML/Plain)
- [x] 알림 설정
  - 이메일 알림 on/off
  - 앱 내 알림 on/off
  - Synthesis 자동 알림 on/off
- [x] 구독 관리
  - 무료 플랜 (2 Arcs)
  - 프로 플랜 (무제한 Arcs) - 준비만

---

## 🗂️ 데이터베이스 스키마

### 주요 테이블 (10개)

```sql
1. user_profiles        -- 사용자 정보
2. arcs                 -- Arc 컨테이너
3. resources            -- 자료 (URL + 파일)
4. tags                 -- 태그 마스터
5. link_tags            -- 자료-태그 연결
6. synthesis_history    -- Synthesis 결과
7. daily_summaries      -- Daily 요약 기록
8. notifications        -- 앱 내 알림
9. user_settings        -- 사용자 설정 (NEW)
10. file_uploads        -- 파일 메타데이터 (NEW)
```

### 핵심 기능

- ✅ **Row Level Security (RLS)**: 모든 테이블
- ✅ **인덱싱**: 시계열, 검색, 태그
- ✅ **Full-text Search**: GIN 인덱스
- ✅ **Triggers**: 자동 카운트, updated_at
- ✅ **pg_cron**: Daily 요약 스케줄링
- ✅ **Realtime**: INSERT/UPDATE 구독

---

## 🔌 API 엔드포인트 (55개)

### 인증 (5개)
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/logout
POST   /api/auth/reset-password
```

### Arc (6개)
```
GET    /api/arcs
POST   /api/arcs
GET    /api/arcs/:id
PATCH  /api/arcs/:id
DELETE /api/arcs/:id
PATCH  /api/arcs/:id/sharing
```

### 자료 (10개)
```
GET    /api/arcs/:arcId/resources
POST   /api/arcs/:arcId/resources          -- URL
POST   /api/arcs/:arcId/resources/upload   -- 파일 ⭐
GET    /api/resources/:id
PATCH  /api/resources/:id
DELETE /api/resources/:id
GET    /api/resources/:id/file             -- 파일 다운로드 ⭐
POST   /api/resources/:resourceId/tags
DELETE /api/resources/:resourceId/tags/:tagId
GET    /api/resources/search               -- 검색 ⭐
```

### 태그 (4개)
```
GET    /api/tags
POST   /api/tags
PATCH  /api/tags/:id
DELETE /api/tags/:id
```

### Synthesis (4개)
```
POST   /api/arcs/:arcId/synthesis
GET    /api/synthesis/:id
GET    /api/arcs/:arcId/synthesis/history
DELETE /api/synthesis/:id
```

### Daily Summary (3개)
```
GET    /api/daily-summary/today
GET    /api/daily-summary
PATCH  /api/daily-summary/settings
```

### 알림 (4개)
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/:id
```

### Export (4개)
```
POST   /api/arcs/:arcId/export/pdf
POST   /api/arcs/:arcId/export/csv
POST   /api/arcs/:arcId/export/notion
GET    /api/arcs/:arcId/export/status
```

### 프로필 & 설정 (4개)
```
GET    /api/profile
PATCH  /api/profile
GET    /api/settings
PATCH  /api/settings
```

### 공유 (2개)
```
GET    /shared/:shareToken                 -- 인증 불필요
GET    /api/shared/:shareToken/resources
```

### 검색 (3개)
```
GET    /api/search/global                  -- 전체 검색 ⭐
GET    /api/search/arcs/:arcId             -- Arc 내 검색
GET    /api/search/suggestions             -- 자동완성
```

### 통계 (3개)
```
GET    /api/stats/overview
GET    /api/stats/arcs/:arcId
GET    /api/stats/timeline
```

---

## 🤖 AI 프롬프트 (6개)

### 1. URL 요약 생성
```
입력: title, url, content
출력: { summary, category, tags[] }
```

### 2. PDF 텍스트 추출 + 요약 ⭐
```
입력: PDF 파일 (base64)
출력: { text, summary, category, tags[] }
```

### 3. 이미지 OCR + 설명 ⭐
```
입력: 이미지 파일 (base64)
출력: { ocr_text, description, category, tags[] }
```

### 4. Daily 요약
```
입력: arc_name, goal, resources[], date
출력: { summary, key_findings[], recommended_actions[] }
```

### 5. Synthesis - 패턴 분석
```
입력: resources[], arc_goal, date_range
출력: { insights[], patterns{}, recommended_actions[] }
```

### 6. Synthesis - 테이블 생성
```
입력: resources[]
출력: { recommended_columns[], table_data[] }
```

---

## 💻 컴포넌트 구조 (60+ 컴포넌트)

### Layout (5개)
```tsx
Header.tsx                 -- 로고, 검색, 알림, 프로필
Sidebar.tsx                -- 데스크톱 사이드바
MobileNav.tsx              -- 모바일 하단 네비게이션
Footer.tsx
ProtectedRoute.tsx
```

### Auth (4개)
```tsx
LoginForm.tsx
SignupForm.tsx
GoogleLoginButton.tsx
ResetPasswordForm.tsx
```

### Arc (8개)
```tsx
ArcCard.tsx                -- Arc 카드 (Grid용)
ArcList.tsx                -- Arc 리스트
ArcDetail.tsx              -- Arc 상세 (3 뷰 통합)
ArcDashboard.tsx           -- Dashboard 뷰
ArcTimeline.tsx            -- Timeline 뷰
ArcTable.tsx               -- Table 뷰
CreateArcModal.tsx
EditArcModal.tsx
```

### Resource (10개)
```tsx
ResourceCard.tsx           -- 자료 카드 (Timeline용)
ResourceRow.tsx            -- 자료 행 (Table용)
AddResourceModal.tsx       -- URL 추가
UploadFileModal.tsx        -- 파일 업로드 ⭐
FilePreview.tsx            -- PDF/이미지 미리보기 ⭐
ResourceDetail.tsx         -- 자료 상세 모달
EditResourceModal.tsx
TagSelector.tsx
CategoryBadge.tsx
DuplicateAlert.tsx
```

### Synthesis (5개)
```tsx
SynthesisButton.tsx        -- Synthesis 트리거
SynthesisProgress.tsx      -- 진행 상태
SynthesisResult.tsx        -- 결과 표시
ComparisonTable.tsx        -- Hebbia 테이블
InsightCard.tsx
```

### Search (4개) ⭐
```tsx
SearchBar.tsx              -- 통합 검색바
SearchResults.tsx
FilterPanel.tsx
SearchSuggestions.tsx
```

### Settings (6개)
```tsx
ProfileSettings.tsx
DailySummarySettings.tsx
NotificationSettings.tsx
ThemeToggle.tsx            -- 다크모드 전환 ⭐
SubscriptionCard.tsx
DeleteAccountModal.tsx
```

### UI 공통 (18개)
```tsx
Button.tsx
Input.tsx
Modal.tsx
Card.tsx
Badge.tsx
Avatar.tsx
DropdownMenu.tsx
Tabs.tsx
Toast.tsx
Loading.tsx
EmptyState.tsx
ErrorBoundary.tsx
FileUploader.tsx           -- 드래그앤드롭 ⭐
ProgressBar.tsx
Tooltip.tsx
Skeleton.tsx
Pagination.tsx
BottomSheet.tsx            -- 모바일용
```

---

## 📱 화면 구조 (15개 페이지)

### 비로그인
```
1. /                        -- Landing Page
2. /login                   -- 로그인
3. /signup                  -- 회원가입
4. /reset-password          -- 비밀번호 재설정
5. /shared/:token           -- 공유된 Arc (인증 불필요)
```

### 로그인 후
```
6. /dashboard               -- 메인 대시보드
7. /arcs                    -- Arc 목록
8. /arcs/:id                -- Arc 상세 (3가지 뷰)
9. /arcs/:id/synthesis      -- Synthesis 실행/결과
10. /search                 -- 전체 검색 ⭐
11. /notifications          -- 알림 센터
12. /profile                -- 프로필 수정
13. /settings               -- 설정
14. /settings/subscription  -- 구독 관리
15. /help                   -- 도움말
```

---

## ⏱️ 개발 일정 (8주)

### **Week 1-2: 기본 인프라 & 인증**
```
□ Next.js 14 프로젝트 세팅
□ Supabase 프로젝트 생성
□ DATABASE_SCHEMA.sql 실행
□ Auth 구현 (Email + Google)
□ Middleware (인증 보호)
□ Layout & Navigation
□ 다크모드 구현 ⭐
□ PWA 기본 설정 ⭐
```

### **Week 3-4: Arc & Resource (URL)**
```
□ Arc CRUD
□ Arc 상세 (3가지 뷰)
□ URL 저장 (Jina Reader)
□ Gemini Flash 통합 (요약)
□ 자동 카테고리/태그
□ Realtime 구독
□ Full-text Search 구현 ⭐
□ 고급 필터 ⭐
```

### **Week 5: 파일 업로드** ⭐
```
□ Supabase Storage 설정
□ 파일 업로드 UI (드래그앤드롭)
□ PDF 업로드 & 텍스트 추출
□ 이미지 업로드 & OCR
□ 파일 미리보기 (PDF.js)
□ 파일 다운로드
□ 파일 용량 제한 (10MB PDF, 5MB 이미지)
```

### **Week 6: AI 자동화**
```
□ Daily 요약 (pg_cron)
□ Daily 요약 이메일 (Resend)
□ Synthesis 패턴 탐지
□ Synthesis 테이블 생성
□ 알림 시스템
□ Synthesis 히스토리
```

### **Week 7: Chrome Extension & PWA** ⭐
```
□ Chrome Extension (Manifest V3)
□ Extension 팝업 UI
□ Extension 인증
□ PWA Manifest
□ Service Worker
□ Web Share Target API
□ 오프라인 캐싱
□ 푸시 알림 (선택)
```

### **Week 8: Export & 마무리**
```
□ PDF Export
□ CSV Export
□ Notion 연동
□ Arc 공유 기능
□ 전체 테스트
□ 버그 수정
□ 성능 최적화
□ 문서화
□ 배포 준비
```

---

## 🎯 주요 마일스톤

### Week 2 완료 시
```
✅ 사용자 회원가입/로그인 가능
✅ 다크모드 작동
✅ PWA로 설치 가능
```

### Week 4 완료 시
```
✅ Arc 생성/관리 가능
✅ URL 저장 & AI 요약 작동
✅ 검색 기능 작동
✅ 3가지 뷰 모드 전환
```

### Week 5 완료 시
```
✅ PDF 파일 업로드 가능
✅ 이미지 업로드 & OCR 작동
✅ 파일 미리보기/다운로드 가능
```

### Week 6 완료 시
```
✅ Daily 요약 이메일 수신
✅ Synthesis 실행 & 테이블 생성
✅ 알림 시스템 작동
```

### Week 7 완료 시
```
✅ Chrome Extension 설치 & 사용
✅ PWA 완전 작동
✅ 모바일에서 공유 기능 작동
```

### Week 8 완료 시
```
✅ PDF/CSV Export 가능
✅ Notion 연동 작동
✅ 전체 기능 테스트 완료
✅ 프로덕션 배포 준비 완료
```

---

## 📦 최종 산출물

### 1. 웹 애플리케이션
```
✅ URL: https://plynkarc.com
✅ 반응형 (데스크톱 + 모바일)
✅ PWA (홈 화면 설치)
✅ 다크모드
✅ 55개 API 엔드포인트
✅ 60+ React 컴포넌트
✅ 15개 페이지
```

### 2. Chrome Extension
```
✅ Chrome Web Store 출시 준비
✅ Manifest V3
✅ 원클릭 저장
✅ 인증 통합
```

### 3. 데이터베이스
```
✅ 10개 테이블
✅ RLS 적용
✅ 인덱싱 최적화
✅ Full-text Search
✅ Realtime 구독
```

### 4. AI 통합
```
✅ Gemini Flash 2.0
✅ 6가지 AI 프롬프트
✅ 자동 요약/분류/태깅
✅ Synthesis 분석
```

### 5. 문서
```
✅ README.md
✅ API 문서
✅ 컴포넌트 가이드
✅ 배포 가이드
✅ 사용자 매뉴얼
```

---

## 💰 예상 비용 (100 유저 기준)

| 서비스 | 무료 한도 | 사용량 | 비용 |
|--------|----------|--------|------|
| Vercel | 100GB | ~60GB | $0 |
| Supabase | 500MB DB, 1GB Storage | ~300MB DB, 500MB Storage | $0 |
| Gemini Flash | 1M tokens/분 | ~15K tokens/일 | $0 |
| Jina Reader | 관대함 | ~1K req/일 | $0 |
| Resend | 100/일 | ~80/일 | $0 |
| **Total** | - | - | **$0/월** |

### 1K 유저 시
```
Vercel Pro: $20/월
Supabase Pro: $25/월
Total: $45/월
```

---

## 🚀 기술 스택 요약

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (상태 관리)

### Backend
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Edge Functions (Deno)
- pg_cron (스케줄링)

### AI
- Gemini Flash 2.0 (요약, 분석, OCR)
- Jina Reader (웹 스크래핑)

### 기타
- Resend (이메일)
- Chrome Extension (Manifest V3)
- PWA (Service Worker)
- PDF.js (PDF 렌더링)

---

## ✅ Phase 1 완료 기준

### 필수 기능
```
□ 사용자 가입/로그인 작동
□ Arc CRUD 작동
□ URL + 파일 업로드 작동
□ AI 요약/분류/태깅 작동
□ Daily 요약 이메일 발송
□ Synthesis 실행 & 테이블 생성
□ 검색 기능 작동
□ Chrome Extension 작동
□ PWA 설치 가능
□ 다크모드 작동
□ Export (PDF/CSV/Notion) 작동
□ 모바일 반응형
□ 버그 없음
□ 성능 최적화 완료
```

### 문서
```
□ API 문서 완성
□ 사용자 가이드 작성
□ 개발자 문서 작성
□ 배포 가이드 작성
```

### 배포
```
□ Vercel 프로덕션 배포
□ 도메인 연결 (plynkarc.com)
□ SSL 인증서
□ Chrome Extension 제출
□ 모니터링 설정
```

---

## 🎉 결론

**Phase 1 = 완전한 제품**

- ✅ URL + 파일 모두 지원
- ✅ 검색 + 필터 완비
- ✅ PWA + Chrome Extension
- ✅ 다크모드
- ✅ Export 기능
- ✅ AI 자동화 완전

**8주 후 = 바로 출시 가능!** 🚀

---

**Version:** 1.0 (All-in-One Phase 1)  
**Updated:** 2025-11-25  
**Total Features:** 100+  
**Total APIs:** 55  
**Total Components:** 60+  
**Total Pages:** 15  
**Development Time:** 8 weeks
