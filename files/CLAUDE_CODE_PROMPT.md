# plynk arc 프로젝트 개발 시작 - Claude Code 프롬프트

---

## 📋 프로젝트 정보

**프로젝트명**: plynk arc  
**태그라인**: Draw Your Arcs  
**설명**: AI 기반 지식 관리 SaaS - 사용자가 Arc(지식 컨테이너)를 만들고, 자료를 저장하면 AI가 자동으로 정리하고 인사이트를 생성합니다.

**기술 스택**: Next.js 14 + Supabase + Gemini Flash 2.0 + Resend

---

## 📁 프로젝트 구조

**중요: 경로 정보**
```
개발 경로:  C:\Users\iet03\develop\plynk_arc\
문서 위치:  C:\Users\iet03\develop\plynk_arc\files\
로고 파일:  C:\Users\iet03\develop\plynk_arc\logo\plynk logo.png
```

**로고 주의사항**:
- ⚠️ 배경이 흰색입니다
- 다크 모드나 컬러 배경에서는 보이지 않을 수 있습니다
- 필요시 배경 추가 또는 투명 PNG로 변환 고려

---

## 📚 필수 읽기 문서 (순서대로)

### 1️⃣ **PHASE1_SCOPE.md** ⭐ 가장 먼저!
**위치**: `C:\Users\iet03\develop\plynk_arc\files\PHASE1_SCOPE.md`

**내용**:
- ✅ Phase 1 = 완전한 제품 (8주)
- 100+ 기능 목록
- 55개 API 엔드포인트
- 60+ 컴포넌트
- 주차별 상세 일정
- 마일스톤 & 완료 기준

**왜 읽어야 하나**: 전체 개발 범위를 한눈에 파악!

### 2️⃣ **TECH_SPEC.md**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\TECH_SPEC.md`

**내용**:
- 기술 스택 (Next.js 14, Supabase, Gemini Flash 2.0)
- 시스템 아키텍처
- 데이터 흐름
- 비용 구조 (무료 tier)
- 환경 변수 구조

**왜 읽어야 하나**: 기술적 결정 사항 이해

### 3️⃣ **DATABASE_SCHEMA.sql**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\DATABASE_SCHEMA.sql`

**내용**:
- 10개 테이블 정의
- **파일 업로드 지원** (file_url, file_name, mime_type)
- **Full-text Search** (tsvector + GIN 인덱스)
- RLS (Row Level Security)
- Triggers & Functions
- pg_cron 설정

**사용 방법**: Supabase SQL Editor에 직접 붙여넣기

### 4️⃣ **API_ENDPOINTS.md**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\API_ENDPOINTS.md`

**내용**:
- 55개 API 엔드포인트 상세 명세
- Auth, Arcs, Resources (URL + **파일 업로드**)
- Synthesis, Search, Export
- Request/Response 예시

### 5️⃣ **AI_PROMPTS.md**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\AI_PROMPTS.md`

**내용**:
- 6가지 AI 프롬프트 템플릿
- URL 요약, **PDF 텍스트 추출**, **이미지 OCR**
- Daily 요약, Synthesis 분석

### 6️⃣ **COMPONENT_STRUCTURE.md**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\COMPONENT_STRUCTURE.md`

**내용**:
- 60+ React 컴포넌트 구조
- 폴더 구조
- Custom Hooks
- Server Actions

### 7️⃣ **USER_FLOWS.md**
**위치**: `C:\Users\iet03\develop\plynk_arc\files\USER_FLOWS.md`

**내용**:
- 15개 페이지 와이어프레임
- 사용자 플로우
- UI/UX 상세 설명

---

## 🎯 개발 목표

**8주 만에 완전한 제품 출시!**

### 포함된 모든 기능 (Phase 1)

#### ✅ 기본 기능
- 이메일/Google 로그인
- Arc CRUD
- 프로필 관리

#### ✅ 자료 저장 (이중 지원)
- URL 저장 (Jina Reader)
- **PDF 업로드** (최대 10MB)
- **이미지 업로드** (최대 5MB)
- 자동 요약/분류/태깅

#### ✅ 검색 & 필터
- **Full-text Search**
- 카테고리/태그 필터
- 고급 정렬

#### ✅ AI 자동화
- Daily 요약 이메일
- Synthesis 분석
- Hebbia 스타일 테이블

#### ✅ UI/UX
- 반응형 (데스크톱 + 모바일)
- **다크모드**
- 3가지 뷰 모드

#### ✅ 확장 기능
- **Chrome Extension**
- **PWA** (홈 화면 설치)
- **Web Share API**
- Export (PDF/CSV/Notion)

---

## 📅 개발 일정

### Week 1-2: 기본 인프라
```
□ Next.js 14 프로젝트 세팅
□ Supabase 프로젝트 생성
□ DATABASE_SCHEMA.sql 실행
□ Auth 구현 (Email + Google)
□ Middleware (인증 보호)
□ Layout & Navigation
□ 다크모드 구현
□ PWA 기본 설정
```

### Week 3-4: Arc & Resource (URL)
```
□ Arc CRUD
□ Arc 상세 (3가지 뷰)
□ URL 저장 (Jina Reader)
□ Gemini Flash 통합
□ 자동 카테고리/태그
□ Realtime 구독
□ Full-text Search
□ 고급 필터
```

### Week 5: 파일 업로드
```
□ Supabase Storage 설정
□ 파일 업로드 UI
□ PDF 업로드 & 텍스트 추출
□ 이미지 업로드 & OCR
□ 파일 미리보기
□ 파일 다운로드
```

### Week 6: AI 자동화
```
□ Daily 요약 (pg_cron)
□ Daily 요약 이메일
□ Synthesis 패턴 탐지
□ Synthesis 테이블 생성
□ 알림 시스템
```

### Week 7: Chrome Extension & PWA
```
□ Chrome Extension
□ PWA Manifest
□ Service Worker
□ Web Share API
□ 오프라인 캐싱
```

### Week 8: Export & 마무리
```
□ PDF Export
□ CSV Export
□ Notion 연동
□ 전체 테스트
□ 버그 수정
□ 배포 준비
```

---

## 🚀 시작하기

### Step 1: 프로젝트 세팅
```bash
cd C:\Users\iet03\develop\plynk_arc

# Next.js 프로젝트 생성
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
2. SQL Editor에서 C:\Users\iet03\develop\plynk_arc\files\DATABASE_SCHEMA.sql 실행
3. Storage에서 'files' 버킷 생성 (public)
```

### Step 3: 환경 변수
```bash
# files/env.example을 .env.local로 복사
cp files/env.example .env.local

# .env.local 편집:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GEMINI_API_KEY=AIzaSyxxx...
RESEND_API_KEY=re_xxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=plynk arc
```

### Step 4: 로고 설정
```bash
# 로고 파일 위치 확인
logo/plynk logo.png  (흰 배경)

# public/logo/ 폴더로 복사
mkdir -p public/logo
cp logo/plynk\ logo.png public/logo/

# 필요시 투명 PNG로 변환 또는 배경 추가
```

### Step 5: 개발 시작
```bash
npm run dev
```

---

## 📋 개발 체크리스트

### 시작 전 확인사항
- [ ] PHASE1_SCOPE.md 읽음
- [ ] TECH_SPEC.md 읽음
- [ ] DATABASE_SCHEMA.sql 읽음
- [ ] Supabase 프로젝트 생성 완료
- [ ] DATABASE_SCHEMA.sql 실행 완료
- [ ] 환경 변수 설정 완료
- [ ] 로고 파일 위치 확인

### Week 1-2 체크리스트
- [ ] Next.js 프로젝트 생성
- [ ] Supabase 연동
- [ ] Auth 구현
- [ ] Middleware 설정
- [ ] 다크모드 구현
- [ ] PWA 기본 설정

---

## 💡 개발 시 주의사항

### 1. 파일 구조
```
C:\Users\iet03\develop\plynk_arc\
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
├── lib/                    # 유틸리티
├── public/
│   └── logo/
│       └── plynk logo.png  # 로고 (흰 배경)
├── files/                  # 개발 문서
├── .env.local              # 환경 변수
└── package.json
```

### 2. 로고 사용
```tsx
// 라이트 모드
<Image 
  src="/logo/plynk logo.png" 
  alt="plynk arc" 
  width={200}
  height={50}
/>

// 다크 모드 (배경 추가)
<div className="bg-white dark:bg-gray-800 p-2 rounded">
  <Image 
    src="/logo/plynk logo.png" 
    alt="plynk arc" 
    width={200}
    height={50}
  />
</div>
```

### 3. 개발 우선순위
1. **먼저**: PHASE1_SCOPE.md 읽고 전체 파악
2. **그다음**: Week 1-2부터 순서대로 개발
3. **중요**: 각 Week 완료 시 마일스톤 확인

### 4. 문서 참조
- 구현 중 막히면 해당 문서 다시 읽기
- API 구현: API_ENDPOINTS.md 참고
- AI 통합: AI_PROMPTS.md 참고
- 컴포넌트: COMPONENT_STRUCTURE.md 참고

---

## 🎯 최종 목표

**8주 후 달성할 것**:
- ✅ 완전히 작동하는 웹 애플리케이션
- ✅ Chrome Extension 출시 준비
- ✅ PWA 홈 화면 설치 가능
- ✅ URL + 파일 업로드 모두 지원
- ✅ 전문 검색 작동
- ✅ Daily 요약 이메일 발송
- ✅ Synthesis 분석 작동
- ✅ 다크모드
- ✅ Export 기능
- ✅ 프로덕션 배포 준비 완료

**바로 출시 가능한 제품!** 🚀

---

## 📞 도움이 필요하면

1. **PHASE1_SCOPE.md** - 전체 범위
2. **해당 기능 문서** - 상세 스펙
3. **예제 코드** - 문서 내 코드 참고

---

**Version**: 1.0  
**Created**: 2025-11-25  
**프로젝트**: plynk arc  
**목표**: 8주 만에 완전한 제품 출시
