# plynk arc - 개발 스펙 문서

## 📋 문서 개요

이 폴더에는 **완전한 기능을 갖춘 plynk arc**를 개발하기 위한 전체 명세가 포함되어 있습니다.

**개발 기간**: 8주  
**Phase 1 = 완전한 제품** (URL + 파일 업로드 + 검색 + PWA + 다크모드 + Export 모두 포함)

Claude Code가 이 문서들을 기반으로 바로 개발을 시작할 수 있도록 설계되었습니다.

---

## 🎯 Quick Start

### 1️⃣ 먼저 읽을 문서
**[PHASE1_SCOPE.md](./PHASE1_SCOPE.md)** ⭐⭐⭐
- 전체 개발 범위 한눈에 파악
- 100+ 기능 목록
- 8주 상세 일정
- 마일스톤

### 2️⃣ 개발 시작
```bash
# 프로젝트 생성
cd C:\Users\iet03\develop\plynk_arc
npx create-next-app@latest . --typescript --tailwind --app

# 패키지 설치
npm install @supabase/supabase-js @supabase/ssr
npm install @google/generative-ai resend zustand daisyui

# 환경 변수 설정
cp files/env.example .env.local
# .env.local 편집

# Supabase 스키마 적용
# → Supabase Dashboard → SQL Editor → files/DATABASE_SCHEMA.sql 붙여넣기

# 개발 서버 실행
npm run dev
```

---

## 📁 문서 목록 (11개)

### ⭐ 0. **PHASE1_SCOPE.md** (32KB) - **가장 먼저 읽기!**
**전체 개발 범위 명세서**
- ✅ 포함된 모든 기능 (100+)
- 📊 55개 API 엔드포인트
- 💻 60+ 컴포넌트
- ⏱️ 8주 상세 일정
- 🎯 주요 마일스톤
- ✅ 완료 기준

**읽어야 하는 이유**: 전체 그림을 한눈에!

---

### 1. **TECH_SPEC.md** (11KB)
**기술 스택 & 아키텍처**
- 프로젝트 개요
- 기술 스택 (Next.js 14, Supabase, Gemini Flash)
- 시스템 아키텍처
- 데이터 흐름
- 비용 구조
- 개발 환경 세팅

**읽어야 하는 이유**: 기술적 결정 이해

---

### 2. **DATABASE_SCHEMA.sql** (17KB)
**실행 가능한 데이터베이스 스키마**
- 10개 테이블 정의
- 파일 업로드 지원 (file_url, file_name, mime_type)
- Full-text Search (tsvector + GIN 인덱스)
- RLS (Row Level Security)
- Triggers & Functions
- pg_cron 설정

**사용 방법**:
```sql
-- Supabase SQL Editor에 직접 붙여넣기
```

**중요 변경사항**:
- resources 테이블: URL 또는 파일 지원
- fts 컬럼: 전문 검색용 tsvector

---

### 3. **API_ENDPOINTS.md** (15KB)
**55개 API 엔드포인트 명세**

**주요 섹션**:
- Auth (5개): 회원가입, 로그인, 소셜 로그인
- Arcs (6개): CRUD + 공유
- Resources (10개): URL + **파일 업로드** + 다운로드
- Tags (4개): 태그 관리
- Synthesis (4개): 분석 실행/결과
- Daily Summary (3개): 요약 설정
- Notifications (4개): 알림 센터
- Export (4개): PDF/CSV/Notion
- Search (3개): **전문 검색** + 필터
- Profile & Settings (4개)

**새로 추가된 API**:
```
POST   /api/arcs/:arcId/resources/upload   -- 파일 업로드 ⭐
GET    /api/resources/:id/file             -- 파일 다운로드
GET    /api/search/global                  -- 전체 검색
```

**읽어야 하는 이유**: API 구현 가이드

---

### 4. **AI_PROMPTS.md** (17KB)
**6가지 AI 프롬프트 템플릿**

1. URL 요약 생성
2. **PDF 텍스트 추출 + 요약** ⭐
3. **이미지 OCR + 설명** ⭐
4. Daily 요약
5. Synthesis - 패턴 분석
6. Synthesis - 테이블 생성

**새로 추가된 프롬프트**:
```javascript
// PDF 처리
input: PDF file (base64)
output: { text, summary, category, tags[] }

// 이미지 처리
input: Image file (base64)
output: { ocr_text, description, category, tags[] }
```

**읽어야 하는 이유**: Gemini API 호출 가이드

---

### 5. **COMPONENT_STRUCTURE.md** (20KB)
**60+ React 컴포넌트 구조**

**폴더 구조**:
```
app/
├── (auth)/login, signup
├── (dashboard)/arcs, profile, notifications, settings
├── search/                              ⭐ NEW
components/
├── arcs/ArcCard, ArcList, ArcDetail
├── resources/ResourceCard, UploadFileModal ⭐, FilePreview ⭐
├── search/SearchBar, FilterPanel       ⭐ NEW
├── ui/Button, Modal, FileUploader ⭐, ThemeToggle ⭐
```

**새로 추가된 컴포넌트**:
- UploadFileModal.tsx - 파일 업로드
- FilePreview.tsx - PDF/이미지 미리보기
- FileUploader.tsx - 드래그앤드롭
- SearchBar.tsx - 통합 검색
- FilterPanel.tsx - 고급 필터
- ThemeToggle.tsx - 다크모드 전환

**Custom Hooks**:
```typescript
useArcs()      // Arc 관리
useResources() // 자료 + 파일 업로드
useSynthesis() // 분석 실행
useSearch()    // 전문 검색 ⭐
useTheme()     // 다크모드 ⭐
```

---

### 6. **USER_FLOWS.md** (50KB)
**15개 페이지 와이어프레임**

**주요 플로우**:
1. 회원가입 → 이메일 인증 → Dashboard
2. Arc 생성 → URL 저장 OR **파일 업로드** ⭐
3. **검색** → 필터 → 결과 ⭐
4. Synthesis 실행 → 테이블 생성 → Export
5. Daily 요약 이메일 수신
6. **Chrome Extension** 사용
7. **PWA 설치** ⭐

**새로 추가된 화면**:
- 파일 업로드 모달
- 파일 미리보기
- 전체 검색 페이지
- 다크모드 UI
- PWA 설치 안내

**읽어야 하는 이유**: UI/UX 구현 가이드

---

### 7. **env.example** (5KB)
**환경 변수 템플릿**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
GEMINI_API_KEY=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=plynk arc
```

---

### 8. **BRANDING_GUIDE.md** (10KB)
**plynk arc 브랜딩 가이드**
- 로고: ⌒⌒⌒ (Arc)
- 태그라인: Draw Your Arcs
- 컬러: Blue (#3B82F6), Purple (#8B5CF6)
- 타이포그래피
- UI 컴포넌트 스타일
- **다크모드 컬러** ⭐

---

### 9. **ARC_UPDATE_NOTES.md** (9KB)
**Box → Arc 변경 히스토리**
- 네이밍 변경 과정
- 철학적 의미
- 데이터베이스 변경

---

### 10. **UPDATE_NOTES.md** (4KB)
**barcs → arc 변경 히스토리**

---

## 🔑 핵심 기능 체크리스트

### ✅ Phase 1에 포함된 모든 기능

#### 기본 기능
- [x] 이메일/Google 로그인
- [x] Arc CRUD
- [x] 프로필 관리

#### 자료 저장 (이중 지원)
- [x] **URL 저장** (Jina Reader)
- [x] **PDF 업로드** (최대 10MB) ⭐
- [x] **이미지 업로드** (최대 5MB) ⭐
- [x] 자동 요약/분류/태깅
- [x] 중복 감지

#### 검색 & 필터
- [x] **Full-text Search** ⭐
- [x] 카테고리/태그 필터
- [x] 날짜 범위 필터
- [x] 고급 정렬

#### AI 자동화
- [x] Daily 요약 이메일
- [x] Synthesis 분석
- [x] Hebbia 스타일 테이블
- [x] 패턴 탐지

#### UI/UX
- [x] 반응형 (데스크톱 + 모바일)
- [x] **다크모드** ⭐
- [x] 3가지 뷰 (Dashboard/Timeline/Table)
- [x] 알림 시스템

#### 확장 기능
- [x] **Chrome Extension** ⭐
- [x] **PWA** (홈 화면 설치) ⭐
- [x] **Web Share API** (모바일 공유) ⭐
- [x] PDF Export
- [x] CSV Export
- [x] Notion 연동

---

## 📊 개발 일정 (8주)

```
Week 1-2: 기본 인프라 + 인증 + 다크모드 + PWA
Week 3-4: Arc + URL 저장 + 검색
Week 5:   파일 업로드 (PDF + 이미지)
Week 6:   AI 자동화 (Daily + Synthesis)
Week 7:   Chrome Extension + PWA 완성
Week 8:   Export + 테스트 + 배포
```

**상세 일정**: [PHASE1_SCOPE.md](./PHASE1_SCOPE.md) 참고

---

## 🎯 마일스톤

### Week 2 ✅
- 로그인/회원가입 작동
- 다크모드 작동
- PWA 설치 가능

### Week 4 ✅
- Arc 관리 가능
- URL 저장 & 검색 작동

### Week 5 ✅
- PDF/이미지 업로드 작동
- 파일 미리보기/다운로드

### Week 6 ✅
- Daily 요약 발송
- Synthesis 실행

### Week 7 ✅
- Chrome Extension 설치
- PWA 완전 작동

### Week 8 ✅
- 전체 기능 완료
- 프로덕션 배포 준비

---

## 💻 개발 시작하기

### 준비사항
```bash
# 1. 폴더 확인
C:\Users\iet03\develop\plynk_arc\        # 개발 경로
C:\Users\iet03\develop\plynk_arc\files\  # 문서 위치
C:\Users\iet03\develop\plynk_arc\logo\plynk logo.png  # 로고 (흰 배경)
```

### Step 1: Next.js 프로젝트 생성
```bash
cd C:\Users\iet03\develop\plynk_arc
npx create-next-app@latest . --typescript --tailwind --app

# 패키지 설치
npm install @supabase/supabase-js @supabase/ssr
npm install @google/generative-ai
npm install resend
npm install zustand
npm install daisyui
npm install react-dropzone  # 파일 업로드
npm install pdfjs-dist      # PDF 렌더링
```

### Step 2: Supabase 설정
```bash
1. https://supabase.com 에서 프로젝트 생성
2. SQL Editor에서 files/DATABASE_SCHEMA.sql 실행
3. Storage에서 'files' 버킷 생성 (public)
4. .env.local에 API Keys 입력
```

### Step 3: 환경 변수
```bash
cp files/env.example .env.local
# .env.local 편집:
# - Supabase URL & Keys
# - Gemini API Key
# - Resend API Key
```

### Step 4: 개발 서버 실행
```bash
npm run dev
```

---

## 📦 로고 사용 안내

**위치**: `C:\Users\iet03\develop\plynk_arc\logo\plynk logo.png`

**주의사항**:
- ⚠️ **배경이 흰색**입니다
- 다크모드나 컬러 배경에서는 보이지 않을 수 있습니다

**해결 방법**:
1. 로고 파일을 투명 PNG로 변환
2. 또는 다크모드에서는 다른 로고 사용
3. 또는 배경색 추가

**사용 예시**:
```tsx
// Light Mode
<Image src="/logo/plynk logo.png" alt="plynk arc" />

// Dark Mode (배경 추가)
<div className="bg-white dark:bg-gray-800 p-2 rounded">
  <Image src="/logo/plynk logo.png" alt="plynk arc" />
</div>
```

---

## 🎉 준비 완료!

**Claude Code에게 요청하세요**:

```
이 문서들을 기반으로 plynk arc 프로젝트를 개발해줘.

프로젝트 경로: C:\Users\iet03\develop\plynk_arc\
문서 위치: C:\Users\iet03\develop\plynk_arc\files\
로고: C:\Users\iet03\develop\plynk_arc\logo\plynk logo.png (흰 배경)

먼저 PHASE1_SCOPE.md를 읽고, Week 1-2부터 시작해줘!
```

---

## 📚 문서 의존성

```
PHASE1_SCOPE.md  ← 가장 먼저 읽기
    ↓
TECH_SPEC.md     ← 기술 스택 이해
    ↓
DATABASE_SCHEMA.sql + API_ENDPOINTS.md  ← 구현 시작
    ↓
AI_PROMPTS.md + COMPONENT_STRUCTURE.md + USER_FLOWS.md
    ↓
개발 시작!
```

---

## 🚀 개발 목표

**8주 후 = 완전한 제품!**

- ✅ URL + 파일 업로드 모두 지원
- ✅ 전문 검색 + 고급 필터
- ✅ Chrome Extension + PWA
- ✅ 다크모드
- ✅ Daily 요약 + Synthesis
- ✅ Export (PDF/CSV/Notion)
- ✅ 프로덕션 레디

**바로 출시 가능!** 🎉

---

**Version:** 2.0 (All-in-One Phase 1)  
**Updated:** 2025-11-25  
**Total Documents:** 11개  
**Total Features:** 100+  
**Development Time:** 8 weeks  
**Phase 2:** 없음 (모든 기능 Phase 1에 포함)
