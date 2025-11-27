# 기술 스펙 (Technical Specification)

## 프로젝트 개요

**프로젝트명**: plynk arc  
**목적**: AI 기반 자동 정리 지식 관리 도구  
**태그라인**: Draw Your Arcs
**핵심 가치**: 
- ⚡ 빠른 저장 (3초)
- 🤖 자동 AI 정리 (수동 태깅 불필요)
- 📊 Hebbia 스타일 테이블 자동 생성
- 💰 완전 무료 (첫 100 유저)

---

## 기술 스택

### Frontend
```
Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS + DaisyUI
UI Components: shadcn/ui (프로덕션)
State Management: React Context + Zustand (필요시)
Hosting: Vercel (무료 100GB/월)
```

### Backend
```
BaaS: Supabase
- Database: PostgreSQL (500MB 무료)
- Auth: Email + Google OAuth
- Storage: 1GB 무료
- Edge Functions: Deno
- Realtime: PostgreSQL Replication
```

### AI & 데이터 처리
```
AI Model: Gemini Flash 2.0 (1M tokens/분 무료)
Web Scraping: Jina Reader API (무료)
Fallback: Groq (Llama 3.3 70B 무료)
```

### 스케줄링 & 알림
```
Cron: Supabase pg_cron (DB 내장)
Email: Resend (100/일 무료)
```

### 브라우저 확장
```
Chrome Extension: Manifest V3
Mobile: Web Share Target API (PWA)
```

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────┐
│           Client Layer                       │
├─────────────────────────────────────────────┤
│  Next.js App (Vercel)                       │
│  ├─ Dashboard (Server Component)            │
│  ├─ Arc Detail (Server + Client mix)        │
│  └─ Settings (Client Component)             │
│                                              │
│  Chrome Extension                            │
│  └─ Popup → API Call                        │
└─────────────────────────────────────────────┘
                    ↓ HTTPS
┌─────────────────────────────────────────────┐
│           API Layer                          │
├─────────────────────────────────────────────┤
│  Next.js API Routes                         │
│  └─ /api/synthesis (Server Action)          │
│                                              │
│  Supabase Edge Functions                    │
│  ├─ daily-summary                           │
│  └─ extract-content                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Data Layer                         │
├─────────────────────────────────────────────┤
│  Supabase PostgreSQL                        │
│  ├─ arcs (프로젝트)                         │
│  ├─ resources (자료)                         │
│  ├─ tags (태그)                              │
│  ├─ synthesis_history (분석 기록)           │
│  └─ user_profiles (프로필)                   │
│                                              │
│  RLS (Row Level Security)                   │
│  └─ auth.uid() = user_id                    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           External Services                  │
├─────────────────────────────────────────────┤
│  Gemini Flash 2.0 (AI 요약/분석)            │
│  Jina Reader (웹 스크래핑)                   │
│  Resend (이메일 발송)                        │
└─────────────────────────────────────────────┘
```

---

## 데이터 흐름

### 1. 링크 저장 흐름
```
Chrome Extension → POST /api/resources
  ↓
Jina Reader API (내용 추출)
  ↓
Gemini Flash (요약 + 카테고리 추천)
  ↓
Supabase INSERT (resources 테이블)
  ↓
자동 태그 연결 (link_tags)
```

### 2. Daily 요약 흐름
```
pg_cron (매일 설정된 시간)
  ↓
Edge Function: daily-summary
  ↓
어제 추가된 자료 쿼리 (≥3개?)
  ↓
Gemini Flash (요약 생성)
  ↓
Resend (이메일 발송)
  ↓
앱 내 알림 저장
```

### 3. Synthesis 흐름
```
사용자 버튼 클릭 or 자동 트리거
  ↓
Server Action: /api/synthesis
  ↓
Arc의 모든 자료 가져오기
  ↓
Gemini Flash (패턴 분석 + 테이블 생성)
  ↓
AI 추천 컬럼 → 사용자 확인/수정
  ↓
synthesis_history 저장
  ↓
PDF Export (optional)
```

---

## 보안 & 인증

### Supabase RLS (Row Level Security)
```sql
-- 모든 테이블에 적용
CREATE POLICY "Users can only access own data"
  ON {table_name}
  FOR ALL
  USING (auth.uid() = user_id);

-- Arc 공유 (읽기 전용)
CREATE POLICY "Users can view shared arcs"
  ON arcs
  FOR SELECT
  USING (
    is_public = true 
    OR user_id = auth.uid()
  );
```

### API 보안
- **인증**: Supabase JWT (httpOnly cookie)
- **CORS**: Vercel 도메인만 허용
- **Rate Limiting**: Vercel Edge Middleware (IP 기반)

---

## 성능 최적화

### 데이터베이스
```sql
-- 시계열 쿼리 인덱스
CREATE INDEX idx_resources_timeline 
  ON resources(arc_id, created_at DESC);

-- 전문 검색 (Phase 2)
CREATE INDEX idx_resources_fts 
  ON resources USING GIN(fts);

-- 태그 검색
CREATE INDEX idx_link_tags_compound 
  ON link_tags(tag_id, link_id);
```

### 프론트엔드
- **Server Components**: 초기 데이터 서버 렌더링
- **Streaming**: React Suspense + loading.tsx
- **이미지**: Next.js Image 컴포넌트 (자동 최적화)
- **Bundle**: Dynamic import로 코드 스플리팅

### AI 호출 최적화
```typescript
// 캐싱 전략
const getCachedSummary = async (url: string) => {
  // 1. 같은 URL이 이미 요약되었는지 확인
  const existing = await supabase
    .from('resources')
    .select('summary')
    .eq('url', url)
    .single();
  
  if (existing.data?.summary) {
    return existing.data.summary;
  }
  
  // 2. 없으면 새로 생성
  return await generateSummary(url);
};
```

---

## 비용 구조 (무료 Tier 한도)

| 서비스 | 무료 한도 | 예상 사용량 (100 유저) | 비용 |
|--------|----------|----------------------|------|
| Vercel | 100GB bandwidth | ~50GB | $0 |
| Supabase | 500MB DB, 1GB storage | ~200MB DB | $0 |
| Gemini Flash | 1M tokens/분 | ~10K tokens/일 | $0 |
| Jina Reader | 관대한 무료 tier | ~500 req/일 | $0 |
| Resend | 100 emails/일 | ~50 emails/일 | $0 |
| **총 비용** | - | - | **$0/월** |

### 유료 전환 시점 (Phase 2)
- **100-1K 유저**: Vercel Pro $20/월
- **1K-10K 유저**: Vercel Pro + Supabase Pro ($25) = $45/월

---

## 개발 범위 (All-in-One Phase 1 - 8주)

### ✅ 포함된 모든 기능

#### Week 1-2: 기본 인프라 & 인증
- [ ] Supabase 프로젝트 생성
- [ ] Next.js 프로젝트 세팅
- [ ] 데이터베이스 스키마 작성
- [ ] Auth 설정 (Email + Google)
- [ ] Middleware 인증 보호
- [ ] Layout & Navigation
- [ ] 다크모드 구현
- [ ] PWA 기본 설정

#### Week 3-4: Arc & Resource (URL + 검색)
- [ ] Arc CRUD
- [ ] Arc 상세 (3가지 뷰)
- [ ] URL 저장 (Jina Reader)
- [ ] Gemini Flash 통합 (요약)
- [ ] 자동 카테고리/태그
- [ ] Realtime 구독
- [ ] Full-text Search 구현
- [ ] 고급 필터 & 정렬

#### Week 5: 파일 업로드
- [ ] Supabase Storage 설정
- [ ] 파일 업로드 UI (드래그앤드롭)
- [ ] PDF 업로드 & 텍스트 추출
- [ ] 이미지 업로드 & OCR
- [ ] 파일 미리보기 (PDF.js)
- [ ] 파일 다운로드
- [ ] 파일 용량 제한

#### Week 6: AI 자동화
- [ ] Daily 요약 (pg_cron)
- [ ] Daily 요약 이메일 (Resend)
- [ ] Synthesis 패턴 탐지
- [ ] Synthesis 테이블 생성
- [ ] 알림 시스템
- [ ] Synthesis 히스토리

#### Week 7: Chrome Extension & PWA
- [ ] Chrome Extension (Manifest V3)
- [ ] Extension 팝업 UI & 인증
- [ ] PWA Manifest
- [ ] Service Worker
- [ ] Web Share Target API
- [ ] 오프라인 캐싱
- [ ] 푸시 알림 (선택)

#### Week 8: Export & 마무리
- [ ] PDF Export
- [ ] CSV Export
- [ ] Notion 연동
- [ ] Arc 공유 기능
- [ ] 전체 테스트
- [ ] 버그 수정
- [ ] 성능 최적화
- [ ] 문서화 & 배포 준비

### 📊 최종 산출물

**웹 애플리케이션:**
- URL: https://plynkarc.com
- 반응형 (데스크톱 + 모바일)
- PWA (홈 화면 설치)
- 다크모드
- 55개 API 엔드포인트
- 60+ 컴포넌트
- 15개 페이지

**Chrome Extension:**
- Chrome Web Store 출시 준비
- Manifest V3
- 원클릭 저장

**완전한 기능:**
- ✅ URL + 파일 업로드
- ✅ AI 자동 요약/분류/태깅
- ✅ Full-text Search
- ✅ Daily 요약 이메일
- ✅ Synthesis 분석
- ✅ Export (PDF/CSV/Notion)
- ✅ 다크모드
- ✅ PWA

**상세 스펙**: [PHASE1_SCOPE.md](./PHASE1_SCOPE.md) 참고

---

## 환경 변수 구조

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI
GEMINI_API_KEY=AIzaSyxxx...

# Web Scraping
JINA_API_KEY=optional

# Email
RESEND_API_KEY=re_xxx...

# App
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

---

## 개발 환경 세팅

```bash
# 1. 프로젝트 클론/생성
npx create-next-app@latest plynk-arc --typescript --tailwind --app

# 2. 패키지 설치
npm install @supabase/supabase-js @supabase/ssr
npm install @google/generative-ai
npm install resend
npm install zustand
npm install daisyui

# 3. 개발 서버 실행
npm run dev

# 4. Supabase 타입 생성
npx supabase gen types typescript --project-id xxx > lib/database.types.ts
```

---

## 배포 전략

### Vercel 자동 배포
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### Supabase Migration
```bash
# 로컬 개발
npx supabase db reset
npx supabase db push

# 프로덕션 배포
npx supabase db push --project-ref xxx
```

---

## 모니터링 & 로깅

- **Vercel Analytics**: 자동 활성화
- **Supabase Logs**: Dashboard에서 확인
- **Sentry**: 에러 트래킹 (Phase 2)
- **PostHog**: 사용자 분석 (Phase 2)

---

## 브라우저 지원

| 브라우저 | 버전 | 지원 |
|---------|------|------|
| Chrome | ≥90 | ✅ 완전 지원 |
| Edge | ≥90 | ✅ 완전 지원 |
| Firefox | ≥88 | ⚠️ Extension 미지원 |
| Safari | ≥14 | ⚠️ Extension 미지원 |
| Mobile (PWA) | Latest | ✅ Phase 2 |

---

## 라이선스

MIT License (오픈소스 고려 중)

---

## 참고 문서

- [Next.js 14 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Jina Reader API](https://jina.ai/reader)
- [Chrome Extension MV3](https://developer.chrome.com/docs/extensions/mv3/)
