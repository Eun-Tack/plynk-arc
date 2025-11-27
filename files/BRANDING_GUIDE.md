# plynk arc - 브랜딩 가이드

## 🎯 브랜드 아이덴티티

### 브랜드명
**plynk arc**
- 발음: "플링크 Arc"
- Arc + Arcs의 합성어
- 복수형(arc)으로 여러 Arc, 여러 궤적을 의미

### 태그라인
**Draw Your Arcs**
- Arc에 담고, 궤적을 그리다
- 지식을 정리하고, 인사이트를 발견하다

### 대체 슬로건
1. **"Multiple arcs, infinite arcs"**
2. **"Arc에 담고, 인사이트를 그리다"** (한국어)
3. **"Connect, Organize, Synthesize"** (기능 중심)

---

## 🎨 비주얼 아이덴티티

### 로고

**Primary Logo (추천)**
```
┌─⌒─┐ ┌─⌒─┐
│   │ │   │  plynk arc
└───┘ └───┘  Draw Your Arcs
```

**Alternative Logo**
```
    ⌒⌒⌒
   ⌒  ⌒
┌───────┐
│       │  plynk arc
└───────┘
```

**Minimal Logo**
```
▭⌒⌒  plynk arc
```

**App Icon**
```
┌──────────┐
│  ┌─⌒─┐   │
│  │   │   │  파란-보라 그라데이션
│  └───┘   │  Arc + Arc 결합
│   arc  │
└──────────┘
```

### 아이콘 선택
- 기본: ⌒ (Arc)
- 대체: 🗂️ (File Arc)
- 이모지: ⌒⌒ (Arc + Arc)

---

## 🌈 컬러 팔레트

### Primary Colors

**Blue (Arc)**
```
#3B82F6  ███████  Primary Blue
#2563EB  ███████  Blue 600
#1E40AF  ███████  Blue 700
```

**Green (Growth/Arc)**
```
#10B981  ███████  Emerald 500
#059669  ███████  Emerald 600
#047857  ███████  Emerald 700
```

**Purple (AI/Insight)**
```
#8B5CF6  ███████  Violet 500
#7C3AED  ███████  Violet 600
#6D28D9  ███████  Violet 700
```

### Secondary Colors

**Gray (UI)**
```
#F9FAFB  ███████  Gray 50
#F3F4F6  ███████  Gray 100
#6B7280  ███████  Gray 500
#1F2937  ███████  Gray 800
```

### Gradient
```
Linear Gradient: 
#3B82F6 (Blue) → #8B5CF6 (Purple)

Usage: Arc에서 Insight로의 여정
```

---

## 📝 타이포그래피

### 웹 폰트

**Primary Font**
```
Font Family: Inter
Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
Usage: 모든 UI 텍스트
```

**Korean Font**
```
Font Family: Pretendard
Weights: 400, 500, 600, 700
Usage: 한국어 텍스트
```

**Monospace (Code)**
```
Font Family: JetBrains Mono
Usage: 코드, URL, 기술 정보
```

### Font Scale

```
Heading 1:  32px / 2rem   (Bold)      - 페이지 타이틀
Heading 2:  24px / 1.5rem (Semibold)  - 섹션 헤더
Heading 3:  20px / 1.25rem (Semibold) - 서브섹션
Body Large: 18px / 1.125rem (Regular) - 중요 본문
Body:       16px / 1rem (Regular)     - 기본 본문
Body Small: 14px / 0.875rem (Regular) - 설명, 메타
Caption:    12px / 0.75rem (Medium)   - 라벨, 캡션
```

---

## 🖼️ UI 컴포넌트 스타일

### Buttons

**Primary Button**
```css
Background: #3B82F6
Text: White
Border Radius: 8px
Padding: 12px 24px
Hover: #2563EB
```

**Secondary Button**
```css
Background: White
Text: #3B82F6
Border: 1px solid #3B82F6
Border Radius: 8px
Padding: 12px 24px
```

### Cards

```css
Background: White
Border: 1px solid #E5E7EB
Border Radius: 12px
Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Padding: 20px
```

### Arc Card (특별)

```css
Background: Linear Gradient (#3B82F6 → #8B5CF6)
Text: White
Border Radius: 16px
Icon Size: 48px
```

---

## 📐 레이아웃 & 스페이싱

### Grid System
```
Container Max Width: 1280px
Columns: 12
Gutter: 24px
```

### Spacing Scale (Tailwind)
```
1  = 4px
2  = 8px
3  = 12px
4  = 16px
6  = 24px
8  = 32px
12 = 48px
16 = 64px
```

### Border Radius
```
Small:  4px  (badges, small buttons)
Medium: 8px  (buttons, inputs)
Large:  12px (cards)
XLarge: 16px (feature cards)
Round:  9999px (avatars, pills)
```

---

## 💬 Voice & Tone

### 브랜드 보이스

**특성:**
- 친근하지만 전문적
- 간결하고 명확
- 도움을 주는 느낌
- 기술적이지만 접근 가능

**예시:**

✅ Good:
- "18개의 자료를 분석했습니다. 지금 정리해볼까요?"
- "새로운 패턴을 발견했어요! 확인해보세요."
- "Arc에 저장되었습니다 ✓"

❌ Avoid:
- "데이터베이스에 성공적으로 INSERT되었습니다."
- "시스템이 알고리즘을 실행했습니다."
- "처리가 완료되었습니다."

### 에러 메시지

**원칙:**
- 무엇이 잘못되었는지 명확히
- 어떻게 해결할지 제시
- 긍정적인 톤 유지

**예시:**

✅ Good:
```
Arc 생성 한도에 도달했어요
무료 플랜은 2개까지 만들 수 있습니다.
→ 기존 Arc 삭제하기
→ 유료 플랜 알아보기
```

❌ Avoid:
```
ERROR: Arc limit exceeded (403)
```

---

## 📧 이메일 브랜딩

### 이메일 헤더

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─⌒─┐
│   │  plynk arc
└───┘  Draw Your Arcs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 이메일 시그니처

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
plynk arc
Arc Your Knowledge, Arc Your Insights

daily@plynkarc.com
plynkarc.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 이메일 템플릿 컬러

```
Header Background: Linear Gradient (#3B82F6 → #8B5CF6)
Body Background: #F9FAFB
Card Background: White
Primary Text: #1F2937
Secondary Text: #6B7280
Link Color: #3B82F6
```

---

## 🌐 웹사이트 요소

### Hero Section

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ┌─⌒─┐ ┌─⌒─┐
        │   │ │   │
        └───┘ └───┘
        
        plynk arc
        Draw Your Arcs
        
        AI-powered knowledge management
        that actually works
        
        [Get Started Free]  [Learn More]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Feature Cards

```
┌────────────────────────────────┐
│  ⌒ Multiple Boxes             │
│                                │
│  Create unlimited arcs to     │
│  organize different projects   │
│  and topics                    │
└────────────────────────────────┘

┌────────────────────────────────┐
│  🤖 AI Auto-Tagging            │
│                                │
│  Smart categorization and      │
│  tagging saves you time        │
└────────────────────────────────┘

┌────────────────────────────────┐
│  📊 Smart Synthesis            │
│                                │
│  Generate insights and         │
│  comparison tables instantly   │
└────────────────────────────────┘
```

---

## 🎭 애니메이션 & 인터랙션

### Transition Timing

```css
Fast:   150ms  (hover effects)
Normal: 200ms  (default transitions)
Slow:   300ms  (page transitions)
```

### Easing

```css
ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1)  /* Default */
ease-out:     cubic-bezier(0, 0, 0.2, 1)    /* Enter */
ease-in:      cubic-bezier(0.4, 0, 1, 1)    /* Exit */
```

### Micro-interactions

**Button Hover:**
```
Transform: translateY(-1px)
Shadow: Increase
Transition: 150ms
```

**Card Hover:**
```
Shadow: Increase
Border Color: Lighten
Transition: 200ms
```

**Loading State:**
```
Skeleton: Pulse animation
Spinner: Rotate 360deg 1s linear infinite
```

---

## 📱 반응형 디자인

### Breakpoints

```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

### Mobile Considerations

```
Touch Target: Minimum 44x44px
Font Size: +2px larger than desktop
Spacing: More generous
Navigation: Hamburger menu
```

---

## ✅ 브랜딩 체크리스트

### 필수 사항
- [ ] 로고는 항상 plynk arc (소문자)
- [ ] 태그라인은 Draw Your Arcs
- [ ] Primary color는 #3B82F6 (Blue)
- [ ] 이모지는 ⌒ (Arc)
- [ ] 도메인은 plynkarc.com

### UI 요소
- [ ] 모든 버튼은 8px border radius
- [ ] 카드는 12px border radius
- [ ] Shadow는 subtle (1px 3px)
- [ ] Gradient는 Blue → Purple
- [ ] Font는 Inter (영어), Pretendard (한글)

### 톤 & 보이스
- [ ] 친근하지만 전문적
- [ ] 에러 메시지는 해결책 제시
- [ ] 성공 메시지는 간결하게
- [ ] 기술 용어는 최소화

---

## 🎨 디자인 리소스

### Figma 컴포넌트 (예정)
- Button variants
- Card layouts
- Icon set
- Color palette
- Typography scale

### 에셋 저장소 (예정)
- Logo files (SVG, PNG)
- App icons (iOS, Android)
- Social media graphics
- Email templates

---

## 📞 브랜딩 가이드 사용

**이 가이드는:**
- ✅ 디자이너와 개발자를 위한 레퍼런스
- ✅ 일관된 브랜드 경험 보장
- ✅ 새로운 기능 추가 시 참고
- ✅ 마케팅 자료 제작 시 활용

**업데이트:**
- 새로운 컴포넌트 추가 시 문서 업데이트
- 브랜드 진화에 따라 주기적 리뷰
- 팀 피드백 반영

---

## 🚀 다음 단계

1. [ ] Figma 디자인 시스템 구축
2. [ ] 로고 파일 제작 (SVG, PNG)
3. [ ] 아이콘 세트 디자인
4. [ ] 마케팅 웹사이트 디자인
5. [ ] 소셜 미디어 템플릿

---

**Version:** 1.0  
**Last Updated:** 2025-01-15  
**Maintainer:** plynk team
