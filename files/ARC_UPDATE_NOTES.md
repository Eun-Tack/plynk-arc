# 🎉 Box → Arc 변경 완료!

## plynk arc - Draw Your Arcs

모든 문서가 Arc 개념으로 일관성있게 업데이트되었습니다!

---

## ✅ 주요 변경 사항

### 1. 시스템 이름
- ~~plynk barcs~~ → **plynk arc**
- 도메인: **plynkarc.com**
- 이메일: **daily@plynkarc.com**

### 2. 태그라인
- ~~Box Your Arcs~~ → **Draw Your Arcs**
- 의미: "당신의 지식 궤적을 그려보세요"

### 3. 컨테이너 개념
- ~~Box (박스)~~ → **Arc (궤적)**
- Arc = 프로젝트/주제별 지식 컨테이너
- 사용자가 "Arc를 생성"합니다

### 4. 아이콘
- ~~📦 (박스)~~ → **⌒ (아크)**

---

## 📐 철학적 의미

### Arc as Container

```
plynk arc (시스템)
└── 사용자가 "Arc"를 생성
    ├── "Patent Research" Arc
    ├── "AI Innovation" Arc  
    └── "Healthcare" Arc
```

**철학:**
```
Empty Arc:     ⌒
Growing Arc:   ⌒⌒⌒
Full Arc:      ⌒⌒⌒⌒⌒

각 자료(Resource)가 점(point)
점들이 모여 궤적(Arc)을 형성
자료를 추가할수록 궤적이 그려짐
```

**브랜드 일관성:**
- 도커(Docker) → Container를 만든다
- 노션(Notion) → Page를 만든다
- **plynk arc → Arc를 만든다** ✨

---

## 🗂️ 데이터베이스 변경

### 테이블명
```sql
-- Before
CREATE TABLE boxes (...);

-- After
CREATE TABLE arcs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT,
  icon TEXT DEFAULT '⌒',  -- Arc 아이콘!
  ...
);
```

### 컬럼명
- `box_id` → **`arc_id`**
- `box_limit` → **`arc_limit`**
- `box_threshold` → **`arc_threshold`**

### 인덱스명
- `idx_boxes_user` → **`idx_arcs_user`**
- `idx_resources_box_timeline` → **`idx_resources_arc_timeline`**

### 함수명
- `update_box_resource_count()` → **`update_arc_resource_count()`**

---

## 🔗 API 엔드포인트 변경

### Before
```
POST   /api/boxes
GET    /api/boxes/:id
PATCH  /api/boxes/:id
DELETE /api/boxes/:id
GET    /api/boxes/:boxId/resources
```

### After
```
POST   /api/arcs
GET    /api/arcs/:id
PATCH  /api/arcs/:id
DELETE /api/arcs/:id
GET    /api/arcs/:arcId/resources
```

---

## 🎨 UI/UX 변경

### 버튼 & 액션
- ~~"Create a Box"~~ → **"Create an Arc"**
- ~~"Your Boxes"~~ → **"Your Arcs"**
- ~~"Add to Box"~~ → **"Add to Arc"**
- ~~"Delete Box"~~ → **"Delete Arc"**

### 화면 타이틀
- ~~"My Boxes"~~ → **"My Arcs"**
- ~~"Box Detail"~~ → **"Arc Detail"**
- ~~"New Box"~~ → **"New Arc"**

### 메시지
```
Before: "You have 3 Boxes"
After:  "You have 3 Arcs"

Before: "Box created successfully"
After:  "Arc created successfully"

Before: "This Box contains 15 resources"
After:  "This Arc contains 15 resources"
```

---

## 💻 코드 변경

### 컴포넌트명
```tsx
// Before
<BoxCard box={box} />
<BoxList boxes={boxes} />

// After
<ArcCard arc={arc} />
<ArcList arcs={arcs} />
```

### Hook 이름
```tsx
// Before
const { boxes, createBox, updateBox } = useBoxes();

// After
const { arcs, createArc, updateArc } = useArcs();
```

### 폴더 구조
```
// Before
app/
├── (dashboard)/boxes/
components/
├── boxes/BoxCard.tsx

// After
app/
├── (dashboard)/arcs/
components/
├── arcs/ArcCard.tsx
```

---

## 📝 업데이트된 파일 (전체 10개)

1. ✅ **DATABASE_SCHEMA.sql** - 테이블, 인덱스, 함수명 변경
2. ✅ **API_ENDPOINTS.md** - 모든 API 경로 변경
3. ✅ **AI_PROMPTS.md** - box_name → arc_name
4. ✅ **COMPONENT_STRUCTURE.md** - 컴포넌트, Hook 이름 변경
5. ✅ **USER_FLOWS.md** - 모든 UI 텍스트 변경
6. ✅ **TECH_SPEC.md** - Arc 시스템 설명 업데이트
7. ✅ **README.md** - 프로젝트 가이드 업데이트
8. ✅ **BRANDING_GUIDE.md** - 브랜딩 통일
9. ✅ **env.example** - 프로젝트명, 도메인 변경
10. ✅ **UPDATE_NOTES.md** - 변경 히스토리

---

## 🎨 새로운 브랜딩

```
     ⌒⌒⌒
    ⌒  ⌒        plynk arc
   ⌒    ⌒       Draw Your Arcs
  ⌒      ⌒      
 ⌒        ⌒     지식의 궤적을 그리다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 로고
```
  ⌒⌒⌒
 ⌒   ⌒   plynk arc
⌒     ⌒  Draw Your Arcs
```

### 색상
- Primary: **#3B82F6** (Blue) - Arc 시작
- Gradient: **Blue → Purple** - Arc의 여정
- Accent: **#8B5CF6** (Purple) - 완성된 인사이트

### 아이콘
- 기본: **⌒** (Arc)
- 대체: **⌒⌒** (Multiple Arcs)
- 완성: **⌒⌒⌒** (Full Journey)

---

## 📱 사용 예시

### Dashboard
```
┌──────────────────────────────────────┐
│  Your Arcs                           │
├──────────────────────────────────────┤
│                                      │
│  ⌒⌒⌒ Patent Research               │
│  15 resources · 2 weeks              │
│  Drawing your innovation arc         │
│                                      │
│  ⌒⌒  AI Innovation                  │
│  8 resources · 1 week                │
│  Building your knowledge arc         │
│                                      │
│  [+ Create an Arc]                   │
│                                      │
└──────────────────────────────────────┘
```

### Arc 생성
```
┌──────────────────────────────────────┐
│  Create an Arc                       │
├──────────────────────────────────────┤
│                                      │
│  Name: [Patent Research________]     │
│  Goal: [Track AI innovations___]     │
│                                      │
│  Icon: ⌒ 🔬 💡 🚀 [Custom]          │
│  Color: ██ ██ ██ ██                  │
│                                      │
│  [Cancel]  [Create Arc]              │
│                                      │
└──────────────────────────────────────┘
```

### Chrome Extension
```
┌──────────────────────────────────┐
│  ⌒ plynk arc              [X]   │
├──────────────────────────────────┤
│                                  │
│  Save to Arc:                    │
│  ▼ Patent Research               │
│                                  │
│  Title: AI Patent Trends         │
│  Category: Research              │
│  Tags: AI, Patents, Innovation   │
│                                  │
│  [Save to Arc]                   │
│                                  │
└──────────────────────────────────┘
```

---

## 🎯 핵심 메시지

**plynk arc는:**
- ⌒ **Arc를 그리는** 지식 관리 도구
- 📝 자료를 추가할수록 **궤적이 형성**됨
- 🤖 AI가 자동으로 **패턴을 발견**
- 📊 인사이트를 **시각화**

**우리가 말하는 것:**
- "Create an Arc" (궤적을 시작하세요)
- "Add to your Arc" (궤적에 추가하세요)
- "Draw your knowledge arc" (지식의 궤적을 그리세요)
- "Follow your Arc" (당신의 궤적을 따라가세요)

---

## 🚀 다음 단계

### 1. 도메인 준비
- [ ] plynkarc.com 구입
- [ ] daily@plynkarc.com 이메일 설정

### 2. 개발 시작
```bash
# 프로젝트 생성
npx create-next-app@latest plynk-arc --typescript --tailwind --app

# Supabase에서 실행
# DATABASE_SCHEMA.sql 적용

# 개발 시작
npm run dev
```

### 3. 브랜딩 구현
- [ ] ⌒ 아이콘 제작
- [ ] Arc 로고 디자인 (Figma)
- [ ] 색상 팔레트 적용
- [ ] UI 컴포넌트 스타일

---

## ✨ 완벽한 일관성

**철학:**
```
시스템 이름: plynk arc
컨테이너: Arc
사용자 액션: "Create an Arc"
브랜딩: "Draw Your Arcs"
```

**모든 것이 Arc로 통일되었습니다!** 🎯

도커처럼, 노션처럼, 우리도:
- 시스템 = 기능
- **plynk arc = Arc를 만드는 도구**

---

## 📋 체크리스트

개발 시작 전:
- [x] 모든 문서 업데이트 완료
- [x] Box → Arc 일관성 확보
- [x] 브랜딩 통일
- [x] 태그라인 확정 (Draw Your Arcs)
- [ ] 도메인 구입 (plynkarc.com)
- [ ] 이메일 설정
- [ ] 로고 디자인
- [ ] Next.js 프로젝트 생성

---

## 🎉 준비 완료!

**plynk arc** 프로젝트가 완벽하게 정리되었습니다!

이제 Claude Code에게:
```
"이 문서들을 기반으로 plynk arc 프로젝트를 개발해줘.
Arc 시스템부터 시작하자!"
```

---

**Version:** 2.0 (Arc Edition)  
**Updated:** 2025-11-25  
**Status:** ✅ Ready for Development

**Project:** plynk arc  
**Tagline:** Draw Your Arcs  
**Philosophy:** Every resource is a point, every Arc is a journey
