# 사용자 플로우 & 와이어프레임

## 전체 사용자 여정

```
회원가입 → 첫 Arc 생성 → 링크 추가 → Daily 요약 → Synthesis → Export
   ↓           ↓            ↓          ↓          ↓          ↓
 이메일      목표 설정    자동 분석   이메일 수신  테이블 생성  PDF/Notion
 인증                   + 태그 추천
```

---

## 1. 회원가입 / 로그인

### 1.1 회원가입 화면

```
┌──────────────────────────────────────────────┐
│                                              │
│         📦 plynk arc                       │
│         Draw Your Arcs                        │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Full Name                              │ │
│  │ [________________]                     │ │
│  │                                        │ │
│  │ Email                                  │ │
│  │ [________________]                     │ │
│  │                                        │ │
│  │ Password                               │ │
│  │ [________________]                     │ │
│  │                                        │ │
│  │ Gender: ( ) Male ( ) Female ( ) Other │ │
│  │                                        │ │
│  │ Age: [__]                              │ │
│  │                                        │ │
│  │ Occupation: [________________]         │ │
│  │                                        │ │
│  │       [  Sign Up  ]                    │ │
│  │                                        │ │
│  │       ────── OR ──────                 │ │
│  │                                        │ │
│  │   🔵 Continue with Google              │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Already have an account? [Log In]           │
│                                              │
└──────────────────────────────────────────────┘
```

**User Flow:**
1. 이메일 + 비밀번호 입력 or Google 로그인
2. 프로필 정보 입력 (이름, 성별, 나이, 직업)
3. 이메일 인증 링크 클릭 (필수)
4. → Dashboard로 이동

---

### 1.2 로그인 화면

```
┌──────────────────────────────────────────────┐
│                                              │
│         📦 plynk arc                       │
│         Welcome Back!                        │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Email                                  │ │
│  │ [________________]                     │ │
│  │                                        │ │
│  │ Password                               │ │
│  │ [________________]                     │ │
│  │                                        │ │
│  │ [ ] Remember me     [Forgot Password?] │ │
│  │                                        │ │
│  │       [  Log In  ]                     │ │
│  │                                        │ │
│  │       ────── OR ──────                 │ │
│  │                                        │ │
│  │   🔵 Continue with Google              │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Don't have an account? [Sign Up]            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 2. Dashboard (첫 화면)

### 2.1 Empty State (Box 없음)

```
┌────────────────────────────────────────────────────────────┐
│ 🔔 [홍길동 ▼]                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│             Welcome to plynk arc! 🎉                   │
│                                                            │
│     Create an Arc to start organizing            │
│     your research and knowledge.                          │
│                                                            │
│              [  ➕ Create an Arc  ]                    │
│                                                            │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  💡 Quick Start Guide                                │ │
│  │                                                       │ │
│  │  1. Create an Arc (project/topic)                     │ │
│  │  2. Add links via browser extension or manually      │ │
│  │  3. AI automatically summarizes and tags             │ │
│  │  4. Get daily summaries via email                    │ │
│  │  5. Run Synthesis to generate insights               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 2.2 Dashboard with Boxes

```
┌────────┬───────────────────────────────────────────────────┐
│        │ Dashboard                    🔔(3) [홍길동 ▼]     │
│        ├───────────────────────────────────────────────────┤
│  📚    │                                                    │
│ Boxes  │  Your Arcs (2/2 free)         [➕ New Arc]       │
│        │                                                    │
│  📊    │  ┌─────────────────┐  ┌─────────────────┐        │
│ Stats  │  │ 📚 LCT 특허 조사  │  │ 🎯 AI 트렌드     │        │
│        │  │                 │  │                 │        │
│  🔖    │  │ 선행기술 20건 분석 │  │ 최신 AI 기술     │        │
│ Tags   │  │                 │  │                 │        │
│        │  │ 18 resources    │  │ 12 resources    │        │
│  ⚙️    │  │ Last: 2시간 전   │  │ Last: 1일 전     │        │
│ Settings│  └─────────────────┘  └─────────────────┘        │
│        │                                                    │
│        │  Recent Activity                                  │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ 📄 ECG 기반 부정맥 탐지 (2시간 전)            │ │
│        │  │    LCT 특허 조사 · Research                   │ │
│        │  │                                               │ │
│        │  │ 🔬 Digital Twin 심장 모델링 (5시간 전)        │ │
│        │  │    LCT 특허 조사 · Research                   │ │
│        │  │                                               │ │
│        │  │ 🤖 GPT-5 발표 뉴스 (1일 전)                   │ │
│        │  │    AI 트렌드 · News                           │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Quick Stats                                      │
│        │  ┌─────────┬─────────┬─────────┬─────────┐       │
│        │  │ 30      │ 15      │ 2       │ Today   │       │
│        │  │ Total   │ Tags    │ Boxes   │ 5 added │       │
│        │  └─────────┴─────────┴─────────┴─────────┘       │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

**User Flow:**
1. Arc 목록 확인
2. Recent Activity로 최근 추가된 자료 확인
3. Arc 클릭 → Arc 상세로 이동

---

## 3. Arc 생성

### 3.1 New Arc 모달

```
┌────────────────────────────────────────────────────┐
│  Create an Arc                               [X]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Arc Name *                                        │
│  [________________________________]                │
│                                                    │
│  Goal (Optional)                                   │
│  [________________________________]                │
│  [________________________________]                │
│                                                    │
│  Icon                                              │
│  📁 📚 🎯 🔬 💼 🎨 🏥 ⚖️ (click to select)        │
│  Selected: 📚                                      │
│                                                    │
│  Color                                             │
│  🔵 🟢 🟡 🔴 🟣 🟠 ⚪ ⚫ (click to select)        │
│  Selected: 🔵                                      │
│                                                    │
│  Auto-Synthesis                                    │
│  [✓] Enable automatic synthesis                   │
│  Trigger after [10 ▼] resources                   │
│                                                    │
│                    [Cancel]  [Create an Arc]          │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Validation:**
- Arc Name: 필수, 1-100자
- Goal: 선택, 0-500자
- Icon: 기본값 📁
- Color: 기본값 #3B82F6
- Auto-Synthesis: 기본 활성화, 10개

---

## 4. Arc 상세 (Dashboard View)

```
┌────────┬───────────────────────────────────────────────────┐
│        │ 📚 LCT 특허 조사             🔔(3) [홍길동 ▼]      │
│        │ 선행기술 20건 분석                                  │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  Views: [Dashboard] Timeline Table                │
│        │                                                    │
│  Resources│  Stats                   [⚙️ Settings] [🔗 Share]│
│   (18)  │  ┌─────────┬─────────┬─────────┬─────────┐      │
│        │  │ 18      │ 5       │ 2       │ Ready   │      │
│  Timeline│  │ Total   │ Tags    │ Synth   │ Synth?  │      │
│        │  └─────────┴─────────┴─────────┴─────────┘      │
│  Synthesis│                                                 │
│   (2)   │  ⚠️ You have 18 resources. Time to synthesize!  │
│        │     [🧠 Run Synthesis Now]                       │
│  Tags   │                                                    │
│        │  Recent Resources                [➕ Add Resource]│
│  Export │  ┌──────────────────────────────────────────────┐ │
│        │  │ 📄 ECG 기반 부정맥 탐지         2시간 전       │ │
│        │  │    딥러닝 기반 ECG 신호 분석 알고리즘...       │ │
│        │  │    🏷️ ECG  딥러닝  부정맥                      │ │
│        │  │                                               │ │
│        │  │ 🔬 Digital Twin 심장 모델링    5시간 전       │ │
│        │  │    물리 기반 시뮬레이션으로 실시간...          │ │
│        │  │    🏷️ Digital Twin  시뮬레이션                │ │
│        │  │                                               │ │
│        │  │ 📊 FDA 승인 가이드라인          1일 전        │ │
│        │  │    의료기기 FDA 승인 절차 및...               │ │
│        │  │    🏷️ 규제  FDA                               │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Category Distribution                            │
│        │  ■■■■■■■■ Research (10)                         │
│        │  ■■■■ Article (5)                               │
│        │  ■■ Tool (3)                                     │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

**User Flow:**
1. 통계 확인 (자료 개수, 태그, Synthesis 횟수)
2. Synthesis 준비 알림 확인
3. Recent Resources 스크롤
4. View 전환 (Timeline/Table)
5. Add Resource 클릭 → 자료 추가

---

## 5. Timeline View

```
┌────────┬───────────────────────────────────────────────────┐
│        │ 📚 LCT 특허 조사             🔔(3) [홍길동 ▼]      │
│        │ 선행기술 20건 분석                                  │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  Views: Dashboard [Timeline] Table                │
│        │                                                    │
│  Resources│  Filters: [All ▼] [All Tags ▼] [Date Range ▼]  │
│   (18)  │                                 [➕ Add Resource]│
│        │                                                    │
│  Timeline│  ▶ Today (2)                                      │
│        │  ┌──────────────────────────────────────────────┐ │
│  Synthesis│  │ 📄 ECG 기반 부정맥 탐지                       │ │
│   (2)   │  │ https://arxiv.org/abs/2024.12345             │ │
│        │  │                                               │ │
│  Tags   │  │ 딥러닝 기반 ECG 신호 분석 알고리즘을 제안.    │ │
│        │  │ LSTM과 CNN을 결합하여...                      │ │
│  Export │  │                                               │ │
│        │  │ 🏷️ ECG  딥러닝  부정맥  [•••]                 │ │
│        │  │ Research · 2시간 전                           │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ 🔬 Digital Twin 심장 모델링                   │ │
│        │  │ https://papers.com/digital-twin-heart        │ │
│        │  │                                               │ │
│        │  │ 물리 기반 시뮬레이션으로 실시간 심장...       │ │
│        │  │                                               │ │
│        │  │ 🏷️ Digital Twin  시뮬레이션  [•••]            │ │
│        │  │ Research · 5시간 전                           │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  ▶ Yesterday (3)                                  │
│        │  ▶ 2 days ago (5)                                 │
│        │  ▶ Last week (8)                                  │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

**Interactions:**
- 날짜 섹션 클릭 → 접기/펴기
- 카드 클릭 → 자세히 보기 모달
- `•••` 클릭 → 편집/삭제 메뉴

---

## 6. Table View

```
┌────────┬───────────────────────────────────────────────────┐
│        │ 📚 LCT 특허 조사             🔔(3) [홍길동 ▼]      │
│        │ 선행기술 20건 분석                                  │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  Views: Dashboard Timeline [Table]                │
│        │                                                    │
│  Resources│  Filters: [All ▼] [All Tags ▼] [Date Range ▼]  │
│   (18)  │                                 [➕ Add Resource]│
│        │                                                    │
│  Timeline│  ┌─┬───────────────┬─────────┬──────┬─────────┐ │
│        │  │✓│ Title         │Category │Tags  │Date     │ │
│  Synthesis│  ├─┼───────────────┼─────────┼──────┼─────────┤ │
│   (2)   │  │ │ECG 기반...    │Research │ECG...│2시간 전 │ │
│        │  │ │Digital Twin...│Research │Dig...│5시간 전 │ │
│  Tags   │  │ │FDA 승인...    │Article  │규제  │1일 전   │ │
│        │  │ │특허 출원...   │Research │특허  │2일 전   │ │
│  Export │  │ │연합학습...    │Research │AI... │3일 전   │ │
│        │  │ │...            │...      │...   │...      │ │
│        │  └─┴───────────────┴─────────┴──────┴─────────┘ │
│        │                                                    │
│        │  Selected: 3 items                                │
│        │  [🗑️ Delete] [🏷️ Add Tags] [📦 Move to Box]      │
│        │                                                    │
│        │  Page 1 of 2           [<] [1] [2] [>]            │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

**Features:**
- Column sorting (클릭으로 정렬)
- Row selection (체크Arc)
- Bulk actions (선택한 항목 일괄 작업)
- Pagination

---

## 7. Add Resource

### 7.1 수동 추가 모달

```
┌────────────────────────────────────────────────────┐
│  Add Resource                                 [X]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  URL *                                             │
│  [________________________________]  [📋 Paste]    │
│                                                    │
│  ⏳ Extracting content...                          │
│                                                    │
│  ✅ Content extracted!                             │
│                                                    │
│  Title (Auto-filled)                               │
│  [ECG 기반 부정맥 탐지 알고리즘____]               │
│                                                    │
│  Category (AI Recommended)                         │
│  [Research ▼] ⭐ Confidence: 95%                   │
│                                                    │
│  Summary (AI Generated)                            │
│  ┌──────────────────────────────────────────────┐ │
│  │ 딥러닝 기반 ECG 신호 분석 알고리즘을 제안    │ │
│  │ 하는 논문. LSTM과 CNN을 결합하여 부정맥을   │ │
│  │ 실시간으로 탐지하며, 기존 방법 대비 95%     │ │
│  │ 정확도를 달성했다.                           │ │
│  └──────────────────────────────────────────────┘ │
│  [✏️ Edit Summary]                                 │
│                                                    │
│  Tags (AI Recommended)                             │
│  🏷️ ECG  딥러닝  부정맥  LSTM  의료AI              │
│  [+ Add Custom Tag]                                │
│                                                    │
│                    [Cancel]  [Add Resource]        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Process:**
1. URL 입력 → Jina Reader 호출 (자동)
2. Gemini로 요약/카테고리/태그 생성 (자동)
3. 사용자 확인/수정
4. Add Resource 클릭

---

### 7.2 Chrome Extension 팝업

```
┌──────────────────────────────────┐
│  📦 plynk arc            [X]  │
├──────────────────────────────────┤
│                                  │
│  Current Page:                   │
│  ┌────────────────────────────┐ │
│  │ 🌐 ECG 기반 부정맥 탐지    │ │
│  │ https://arxiv.org/...      │ │
│  └────────────────────────────┘ │
│                                  │
│  Save to Arc:                    │
│  [📚 LCT 특허 조사 ▼]            │
│                                  │
│  Category:                       │
│  [Research ▼] ⭐ AI Pick         │
│                                  │
│  Tags (suggested):               │
│  [✓] ECG  [✓] 딥러닝  [ ] LSTM   │
│                                  │
│     [  💾 Save Resource  ]       │
│                                  │
│  ✅ Saved successfully!          │
│     View in [Dashboard]          │
│                                  │
└──────────────────────────────────┘
```

---

## 8. Synthesis

### 8.1 Synthesis 설정

```
┌────────────────────────────────────────────────────┐
│  Run Synthesis                                [X]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Analyze Resources                                 │
│  18 resources in this box                          │
│                                                    │
│  Date Range (Optional)                             │
│  From: [2025-01-01 ▼]  To: [2025-01-15 ▼]         │
│  [ ] Include all resources                         │
│                                                    │
│  Analysis Options                                  │
│  [✓] Generate summary and insights                │
│  [✓] Create comparison table                      │
│  [✓] Identify patterns                            │
│  [ ] Export to PDF after completion                │
│                                                    │
│  Estimated time: ~30 seconds                       │
│                                                    │
│                    [Cancel]  [Start Synthesis]     │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### 8.2 Synthesis 진행 중

```
┌────────────────────────────────────────────────────┐
│  Analyzing Resources...                            │
├────────────────────────────────────────────────────┤
│                                                    │
│           🧠 AI is working...                      │
│                                                    │
│     ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 60%                      │
│                                                    │
│  Current step:                                     │
│  Identifying patterns and relationships            │
│                                                    │
│  ⏱️ Estimated time remaining: 12 seconds           │
│                                                    │
│                    [Cancel]                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### 8.3 Synthesis 결과

```
┌────────┬───────────────────────────────────────────────────┐
│        │ 📚 LCT 특허 조사 > Synthesis                      │
│        │ January 15, 2025                                  │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  [📊 View Table] [📄 Export PDF] [📤 To Notion]   │
│  Summary│                                                    │
│        │  Summary                                           │
│  Insights│  ┌──────────────────────────────────────────────┐ │
│        │  │ 18개의 자료를 분석한 결과, ECG 기반 실시간    │ │
│  Patterns│  │ 모니터링 기술이 주목받고 있음을 확인했습니다.│ │
│        │  │ 대부분 딥러닝(LSTM+CNN) 접근법을 사용하며,    │ │
│  Table │  │ 95% 이상의 정확도를 달성하고 있습니다.        │ │
│        │  │ Digital Twin과의 통합 가능성도 논의되고      │ │
│  History│  │ 있으며, 연합학습을 통한 프라이버시 보호      │ │
│        │  │ 방법도 발견되었습니다.                        │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Key Insights                                     │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ 💡 통합 접근법을 사용한 특허가 없음           │ │
│        │  │ 💡 LSTM+CNN 조합이 주류 트렌드                │ │
│        │  │ 💡 연합학습 + ECG 조합은 2건만 발견           │ │
│        │  │ 💡 대부분 2024년 이후 발표                    │ │
│        │  │ 💡 경쟁사 ABC Corp 특허 출원 확인             │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Patterns Discovered                              │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ 🔍 Topic Clusters                             │ │
│        │  │                                               │ │
│        │  │ Cluster 1: ECG Analysis (10 resources)        │ │
│        │  │ - Deep learning algorithms                    │ │
│        │  │ - Real-time monitoring                        │ │
│        │  │                                               │ │
│        │  │ Cluster 2: Digital Twin (5 resources)         │ │
│        │  │ - Simulation models                           │ │
│        │  │ - Physics-based approach                      │ │
│        │  │                                               │ │
│        │  │ Cluster 3: Regulatory (3 resources)           │ │
│        │  │ - FDA approval guidelines                     │ │
│        │  │ - CE marking requirements                     │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  [👀 View Full Table]                             │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

---

### 8.4 Comparison Table

```
┌────────┬───────────────────────────────────────────────────┐
│        │ 📚 LCT 특허 조사 > Synthesis > Table              │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  Columns: ✏️ Edit                                  │
│  Summary│  ┌─────────────┬─────────┬──────────┬──────────┐ │
│        │  │ 제목        │출원인   │출원일    │핵심기술  │ │
│  Insights│  ├─────────────┼─────────┼──────────┼──────────┤ │
│        │  │ ECG 기반... │ABC Corp │2024-05-10│LSTM+CNN  │ │
│  Patterns│  │ Digital...  │XYZ Univ │2024-08-15│물리시뮬  │ │
│        │  │ 연합학습... │DEF Inc  │2024-03-20│Federated │ │
│  Table │  │ ...         │...      │...       │...       │ │
│        │  └─────────────┴─────────┴──────────┴──────────┘ │
│  History│                                                    │
│        │  [📥 Export as CSV] [📄 Export as PDF]            │
│        │                                                    │
│        │  💡 AI Column Recommendations:                    │
│        │  Would you like to add "관련성" column?           │
│        │  [+ Add Column]                                    │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

**Interactions:**
- Column 클릭 → 정렬
- ✏️ Edit → 컬럼 추가/수정/삭제
- Row 클릭 → 원본 자료로 이동

---

## 9. Daily Summary

### 9.1 Daily Summary 이메일

```
┌──────────────────────────────────────────────────┐
│  From: plynk arc <daily@plynkarc.com>       │
│  To: user@example.com                            │
│  Subject: 📚 Your Daily Summary - January 15     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Good morning, 홍길동! ☀️                        │
│                                                  │
│  Here's your daily summary for:                  │
│  📚 LCT 특허 조사                                 │
│                                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │
│                                                  │
│  📊 Activity                                     │
│  - 5 resources added today                      │
│  - 3 new tags                                    │
│  - Total resources: 18                           │
│                                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │
│                                                  │
│  📝 Summary                                      │
│  오늘 5개의 자료를 추가하셨습니다. 대부분 ECG   │
│  분석과 딥러닝 관련 연구 논문으로, 실시간       │
│  모니터링 기술이 주목받고 있음을 확인했습니다.  │
│                                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │
│                                                  │
│  💡 Key Findings                                 │
│  • ECG 실시간 분석 논문 3건 추가                │
│  • LSTM+CNN 조합 기술이 주류 트렌드             │
│  • 연합학습을 활용한 프라이버시 보호 방법 발견  │
│                                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │
│                                                  │
│  🎯 Recommended Actions                          │
│  • ABC Corp 특허와의 차별점 명확히 문서화       │
│  • 연합학습 + Digital Twin 통합 조사 필요       │
│                                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │
│                                                  │
│  [📱 View in Dashboard]                          │
│                                                  │
│  Keep up the great work! 🚀                      │
│                                                  │
│  ---                                             │
│  plynk arc                                     │
│  Manage preferences | Unsubscribe                │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### 9.2 Daily Summary 앱 내

```
┌────────┬───────────────────────────────────────────────────┐
│        │ Daily Summaries                 🔔(3) [홍길동 ▼] │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  [All Boxes ▼] [Last 30 Days ▼]                   │
│  Today │                                                    │
│        │  ┌──────────────────────────────────────────────┐ │
│  Yesterday│  │ 📚 LCT 특허 조사                             │ │
│        │  │ January 15, 2025 · 5 resources               │ │
│  This Week│  │                                               │ │
│        │  │ 오늘 5개의 자료를 추가하셨습니다...          │ │
│  Last Week│  │                                               │ │
│        │  │ Key Findings:                                │ │
│        │  │ • ECG 실시간 분석 논문 3건 추가              │ │
│  Filter │  │ • LSTM+CNN 조합 기술이 주류 트렌드           │ │
│        │  │                                               │ │
│        │  │ [📧 Email Sent] [📱 View Details]            │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ 🎯 AI 트렌드                                  │ │
│        │  │ January 14, 2025 · 3 resources               │ │
│        │  │                                               │ │
│        │  │ GPT-5 발표 뉴스와 관련 논문들...             │ │
│        │  │                                               │ │
│        │  │ [📧 Email Sent] [📱 View Details]            │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

---

## 10. Settings

### 10.1 프로필 설정

```
┌────────┬───────────────────────────────────────────────────┐
│        │ Settings                        🔔(3) [홍길동 ▼] │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  [Profile] Preferences Export Account             │
│  Profile│                                                    │
│        │  Profile Information                              │
│  Preferences│  ┌──────────────────────────────────────────────┐ │
│        │  │ Full Name                                    │ │
│  Export │  │ [홍길동___________________]                  │ │
│        │  │                                               │ │
│  Account│  │ Email                                         │ │
│        │  │ user@example.com (verified ✓)                │ │
│        │  │                                               │ │
│        │  │ Gender                                        │ │
│        │  │ (•) Male  ( ) Female  ( ) Other              │ │
│        │  │                                               │ │
│        │  │ Age                                           │ │
│        │  │ [30]                                          │ │
│        │  │                                               │ │
│        │  │ Occupation                                    │ │
│        │  │ [개발자________________]                       │ │
│        │  │                                               │ │
│        │  │           [Save Changes]                      │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Subscription                                     │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ Current Plan: Free                           │ │
│        │  │ Arc Limit: 2/2                               │ │
│        │  │                                               │ │
│        │  │ [🚀 Upgrade to Pro]                          │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

---

### 10.2 Daily Summary 설정

```
┌────────┬───────────────────────────────────────────────────┐
│        │ Settings > Preferences          🔔(3) [홍길동 ▼] │
│        ├───────────────────────────────────────────────────┤
│  ← Back│                                                    │
│        │  [Profile] [Preferences] Export Account           │
│  Profile│                                                    │
│        │  Daily Summary                                    │
│  Preferences│  ┌──────────────────────────────────────────────┐ │
│        │  │ [✓] Enable daily summary emails              │ │
│  Export │  │                                               │ │
│        │  │ Delivery Time                                 │ │
│  Account│  │ [09:00 ▼] (your timezone: Asia/Seoul)       │ │
│        │  │                                               │ │
│        │  │ Minimum Resources                             │ │
│        │  │ Send only if at least [3] resources added    │ │
│        │  │                                               │ │
│        │  │ Include Boxes                                 │ │
│        │  │ [✓] 📚 LCT 특허 조사                          │ │
│        │  │ [✓] 🎯 AI 트렌드                              │ │
│        │  │                                               │ │
│        │  │ Email Format                                  │ │
│        │  │ ( ) Summary only                             │ │
│        │  │ (•) Summary + Insights                       │ │
│        │  │ ( ) Full details                             │ │
│        │  │                                               │ │
│        │  │           [Save Preferences]                  │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
│        │  Notifications                                    │
│        │  ┌──────────────────────────────────────────────┐ │
│        │  │ [✓] Synthesis ready notifications            │ │
│        │  │ [✓] Arc limit warnings                       │ │
│        │  │ [ ] New feature announcements                │ │
│        │  └──────────────────────────────────────────────┘ │
│        │                                                    │
└────────┴───────────────────────────────────────────────────┘
```

---

## User Flow Summary

```
회원가입
   ↓
이메일 인증
   ↓
Dashboard (빈 상태)
   ↓
첫 Arc 생성
   ↓
Chrome Extension 설치 (or 수동 추가)
   ↓
링크 저장 (자동 요약/태그)
   ↓
자료 누적 (3+ 개)
   ↓
Daily 요약 이메일 수신
   ↓
자료 계속 추가 (10+ 개)
   ↓
Synthesis 자동 알림
   ↓
Synthesis 실행 → 테이블 생성
   ↓
인사이트 확인
   ↓
PDF Export or Notion 연동
   ↓
반복...
```

---

## Mobile Responsiveness

Phase 1에서는 데스크톱과 동등하게 반응형으로 구현.

**주요 고려사항:**
- Sidebar → Hamburger Menu
- Table → Card Stack (모바일)
- Touch-friendly 버튼 크기 (44x44px 이상)
- Swipe gestures (삭제 등)

**Phase 2:**
- Web Share Target API (모바일에서 "공유" 버튼)
- PWA (설치 가능)

---

## 다음 단계

이제 Claude Code가 이 와이어프레임과 플로우를 기반으로 실제 UI를 구현할 수 있습니다! 🎉
