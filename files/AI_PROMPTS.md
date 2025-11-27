# AI 프롬프트 템플릿

## 개요

이 문서는 Gemini Flash 2.0에 전달할 프롬프트 템플릿을 정의합니다.

**공통 원칙:**
- JSON 출력 요구 (strict mode)
- 간결하고 명확한 지시
- 예상 출력 스키마 명시
- 한국어/영어 혼용 가능

---

## 1. URL 요약 생성 (Resource 저장 시)

### 1.1 프롬프트

```typescript
const SUMMARIZE_URL_PROMPT = `
You are analyzing web content to create a concise summary.

Content:
Title: {{title}}
URL: {{url}}
Body: {{content}}

Generate:
1. A 2-3 sentence summary (Korean if content is Korean, English otherwise)
2. Recommended category from: [Article, Video, Tool, Documentation, Research, Tutorial, News, Reference]
3. 3-5 relevant tags (keywords)

Return ONLY valid JSON:
{
  "summary": "...",
  "category": "...",
  "tags": ["...", "...", "..."]
}

DO NOT include any text outside the JSON.
`;
```

### 1.2 입력 변수

```typescript
interface SummarizeInput {
  title: string;
  url: string;
  content: string; // Jina Reader에서 추출한 마크다운
}
```

### 1.3 출력 스키마

```typescript
interface SummarizeOutput {
  summary: string;
  category: 'Article' | 'Video' | 'Tool' | 'Documentation' | 
            'Research' | 'Tutorial' | 'News' | 'Reference';
  tags: string[];
}
```

### 1.4 예제

**Input:**
```typescript
{
  title: "ECG 기반 부정맥 탐지 알고리즘",
  url: "https://arxiv.org/abs/2024.12345",
  content: "본 논문은 딥러닝을 활용한 ECG 신호 분석 방법론을 제안한다..."
}
```

**Output:**
```json
{
  "summary": "딥러닝 기반 ECG 신호 분석 알고리즘을 제안하는 논문. LSTM과 CNN을 결합하여 부정맥을 실시간으로 탐지하며, 기존 방법 대비 95% 정확도를 달성했다.",
  "category": "Research",
  "tags": ["ECG", "딥러닝", "부정맥", "LSTM", "의료AI"]
}
```

---

## 2. 카테고리 추천 (단독 실행)

### 2.1 프롬프트

```typescript
const RECOMMEND_CATEGORY_PROMPT = `
Analyze the following content and recommend the most appropriate category.

Content:
Title: {{title}}
URL: {{url}}
Summary: {{summary}}

Categories:
- Article: Blog posts, articles, opinion pieces
- Video: YouTube, Vimeo, video tutorials
- Tool: Software, web apps, productivity tools
- Documentation: Official docs, API references, technical specs
- Research: Academic papers, research reports, whitepapers
- Tutorial: How-to guides, step-by-step instructions
- News: News articles, press releases, announcements
- Reference: Cheat sheets, quick references, glossaries

Return ONLY valid JSON:
{
  "category": "...",
  "confidence": 0.95,
  "reasoning": "Brief explanation"
}
`;
```

### 2.2 출력 스키마

```typescript
interface CategoryOutput {
  category: string;
  confidence: number; // 0-1
  reasoning: string;
}
```

---

## 3. Daily 요약 생성

### 3.1 프롬프트

```typescript
const DAILY_SUMMARY_PROMPT = `
You are creating a daily summary for a user's knowledge management system.

Box: {{arc_name}}
Goal: {{arc_goal}}
Date: {{date}}
Resources added today: {{count}}

Resources:
{{#each resources}}
- {{title}} ({{category}})
  URL: {{url}}
  Summary: {{summary}}
{{/each}}

Generate:
1. Overall summary (3-4 sentences in Korean)
2. Key findings (3-5 bullet points)
3. Recommended actions (2-3 actionable items)

Return ONLY valid JSON:
{
  "summary": "...",
  "key_findings": ["...", "...", "..."],
  "recommended_actions": ["...", "..."]
}

Focus on insights and patterns, not just listing resources.
`;
```

### 3.2 입력 변수

```typescript
interface DailySummaryInput {
  arc_name: string;
  arc_goal: string;
  date: string; // YYYY-MM-DD
  count: number;
  resources: Array<{
    title: string;
    url: string;
    summary: string;
    category: string;
  }>;
}
```

### 3.3 출력 스키마

```typescript
interface DailySummaryOutput {
  summary: string;
  key_findings: string[];
  recommended_actions: string[];
}
```

### 3.4 예제

**Input:**
```typescript
{
  arc_name: "LCT 특허 조사",
  arc_goal: "선행기술 20건 분석",
  date: "2025-01-15",
  count: 5,
  resources: [
    {
      title: "ECG 기반 부정맥 탐지",
      url: "https://...",
      summary: "딥러닝 기반 ECG 분석...",
      category: "Research"
    },
    // ...
  ]
}
```

**Output:**
```json
{
  "summary": "오늘 5개의 자료를 추가하셨습니다. 대부분 ECG 분석과 딥러닝 관련 연구 논문으로, 실시간 모니터링 기술이 주목받고 있음을 확인했습니다. 특히 LSTM과 CNN을 결합한 접근법이 95% 이상의 정확도를 보이고 있습니다.",
  "key_findings": [
    "ECG 실시간 분석 논문 3건 추가 (모두 2024년 발표)",
    "LSTM+CNN 조합 기술이 주류 트렌드",
    "연합학습을 활용한 프라이버시 보호 방법 발견",
    "경쟁사 ABC Corp의 유사 특허 출원 확인 (2024-05)",
    "Digital Twin 개념과의 통합 가능성 논의"
  ],
  "recommended_actions": [
    "ABC Corp 특허(US-2024-12345)와의 차별점 명확히 문서화",
    "연합학습 + Digital Twin 통합 접근법 추가 조사 필요"
  ]
}
```

---

## 4. Synthesis - 패턴 분석

### 4.1 프롬프트

```typescript
const SYNTHESIS_PATTERN_PROMPT = `
You are analyzing a collection of resources to identify patterns and insights.

Box: {{arc_name}}
Goal: {{arc_goal}}
Total resources: {{count}}
Date range: {{date_start}} to {{date_end}}

Resources:
{{#each resources}}
{{@index}}. {{title}}
   Category: {{category}}
   Tags: {{tags}}
   Date: {{created_at}}
   Summary: {{summary}}
   URL: {{url}}
{{/each}}

Analyze and generate:
1. Overall synthesis summary (5-6 sentences)
2. Key insights (5-7 important findings)
3. Patterns discovered:
   - Topic clusters
   - Temporal trends
   - Relationships between resources
   - Gaps in knowledge
4. Recommended next steps

Return ONLY valid JSON:
{
  "summary": "...",
  "insights": ["...", "...", "..."],
  "patterns": {
    "topic_clusters": [
      {
        "name": "...",
        "resource_ids": [0, 1, 2],
        "description": "..."
      }
    ],
    "temporal_trends": "...",
    "relationships": "...",
    "knowledge_gaps": ["...", "..."]
  },
  "recommended_actions": ["...", "...", "..."]
}
`;
```

### 4.2 출력 스키마

```typescript
interface SynthesisPatternOutput {
  summary: string;
  insights: string[];
  patterns: {
    topic_clusters: Array<{
      name: string;
      resource_ids: number[];
      description: string;
    }>;
    temporal_trends: string;
    relationships: string;
    knowledge_gaps: string[];
  };
  recommended_actions: string[];
}
```

---

## 5. Synthesis - 테이블 생성

### 5.1 프롬프트

```typescript
const SYNTHESIS_TABLE_PROMPT = `
You are creating a comparison table for a collection of resources.

Box: {{arc_name}}
Goal: {{arc_goal}}

Resources:
{{#each resources}}
{{@index}}. {{title}}
   URL: {{url}}
   Summary: {{summary}}
   Category: {{category}}
   Date: {{created_at}}
{{/each}}

Task:
1. Analyze the resources and identify common attributes that would make a useful comparison table
2. Generate appropriate column names (4-6 columns recommended)
3. Extract data for each resource based on these columns
4. Fill in "N/A" if information is not available

Return ONLY valid JSON:
{
  "recommended_columns": [
    {
      "name": "제목",
      "type": "text",
      "description": "자료 제목"
    },
    {
      "name": "핵심 기술",
      "type": "text",
      "description": "사용된 주요 기술"
    }
  ],
  "table_data": [
    {
      "제목": "...",
      "핵심 기술": "...",
      ...
    }
  ]
}

Examples of good columns for different contexts:
- Research papers: 제목, 저자, 발표년도, 핵심기술, 결과, 관련성
- Patents: 제목, 출원인, 출원일, 핵심기술, 청구항수, 관련성
- Tools: 이름, 카테고리, 가격, 주요기능, 장점, 단점
- News: 제목, 출처, 날짜, 핵심내용, 영향도
`;
```

### 5.2 출력 스키마

```typescript
interface SynthesisTableOutput {
  recommended_columns: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'url';
    description: string;
  }>;
  table_data: Array<Record<string, string | number>>;
}
```

### 5.3 예제

**Output:**
```json
{
  "recommended_columns": [
    {
      "name": "제목",
      "type": "text",
      "description": "논문/특허 제목"
    },
    {
      "name": "출원인",
      "type": "text",
      "description": "출원 기관 또는 저자"
    },
    {
      "name": "날짜",
      "type": "date",
      "description": "발표 또는 출원 날짜"
    },
    {
      "name": "핵심 기술",
      "type": "text",
      "description": "사용된 주요 기술"
    },
    {
      "name": "관련성",
      "type": "text",
      "description": "우리 목표와의 관련도 (1-10)"
    }
  ],
  "table_data": [
    {
      "제목": "ECG 기반 부정맥 탐지",
      "출원인": "ABC Corp",
      "날짜": "2024-05-10",
      "핵심 기술": "LSTM + CNN",
      "관련성": "9/10"
    },
    {
      "제목": "Digital Twin 심장 모델링",
      "출원인": "XYZ University",
      "날짜": "2024-08-15",
      "핵심 기술": "물리 기반 시뮬레이션",
      "관련성": "8/10"
    }
  ]
}
```

---

## 6. 유의미한 패턴 탐지 알고리즘

### 6.1 개념

자료가 쌓일 때 "지금이 Synthesis 하기 좋은 타이밍"인지 판단하는 규칙 기반 알고리즘.

### 6.2 프롬프트

```typescript
const PATTERN_DETECTION_PROMPT = `
You are analyzing resources to determine if there are "meaningful patterns" that warrant synthesis.

Box: {{arc_name}}
Goal: {{arc_goal}}
Current resource count: {{count}}
Resources added in last 7 days: {{recent_count}}

Recent resources (last 7 days):
{{#each recent_resources}}
- {{title}} ({{category}}, {{tags}}, {{created_at}})
{{/each}}

Analyze:
1. Keyword/topic repetition (same keyword appears 3+ times)
2. Category clustering (70%+ resources in same category)
3. Time density (3+ resources added per day for 3+ days)
4. Tag convergence (same tag on 50%+ resources)

Return ONLY valid JSON:
{
  "has_meaningful_pattern": true,
  "confidence": 0.85,
  "reasons": [
    "Keyword 'ECG' appears 5 times (83% of resources)",
    "High time density: 5 resources in 3 days"
  ],
  "recommended_action": "synthesize_now",
  "pattern_type": "topic_convergence"
}

pattern_type: "topic_convergence" | "time_density" | "category_cluster" | "tag_convergence" | "mixed"
recommended_action: "synthesize_now" | "wait_for_more" | "no_pattern"
`;
```

### 6.3 규칙 기반 로직 (AI 보조)

```typescript
interface PatternDetectionInput {
  arc_name: string;
  arc_goal: string;
  count: number; // 전체 자료 개수
  recent_count: number; // 최근 7일 자료
  recent_resources: Array<{
    title: string;
    category: string;
    tags: string[];
    created_at: string;
  }>;
}

interface PatternDetectionOutput {
  has_meaningful_pattern: boolean;
  confidence: number; // 0-1
  reasons: string[];
  recommended_action: 'synthesize_now' | 'wait_for_more' | 'no_pattern';
  pattern_type: 'topic_convergence' | 'time_density' | 
                'category_cluster' | 'tag_convergence' | 'mixed';
}

// 규칙 기반 체크 (AI 전 사전 필터)
function checkBasicRules(input: PatternDetectionInput): boolean {
  // 규칙 1: 최소 자료 개수
  if (input.count < 5) return false;
  
  // 규칙 2: 최근 활동
  if (input.recent_count < 3) return false;
  
  // 규칙 3: 키워드 빈도
  const keywords = input.recent_resources
    .flatMap(r => r.tags);
  const freq = {};
  keywords.forEach(k => freq[k] = (freq[k] || 0) + 1);
  const hasRepeatingKeyword = Object.values(freq)
    .some(count => count >= 3);
  
  // 규칙 4: 카테고리 집중도
  const categories = input.recent_resources
    .map(r => r.category);
  const categoryFreq = {};
  categories.forEach(c => categoryFreq[c] = (categoryFreq[c] || 0) + 1);
  const maxCategoryRatio = Math.max(...Object.values(categoryFreq)) / categories.length;
  const hasCategoryCluster = maxCategoryRatio >= 0.7;
  
  return hasRepeatingKeyword || hasCategoryCluster;
}
```

### 6.4 통합 흐름

```typescript
async function detectMeaningfulPattern(
  input: PatternDetectionInput
): Promise<PatternDetectionOutput> {
  // Step 1: 기본 규칙 체크 (빠른 필터)
  if (!checkBasicRules(input)) {
    return {
      has_meaningful_pattern: false,
      confidence: 0,
      reasons: ['Not enough resources or activity'],
      recommended_action: 'wait_for_more',
      pattern_type: 'no_pattern'
    };
  }
  
  // Step 2: AI 분석 (컨텍스트 기반)
  const aiResult = await callGemini(PATTERN_DETECTION_PROMPT, input);
  
  return aiResult;
}
```

---

## 7. 에러 핸들링

### 7.1 AI 응답 파싱 실패

```typescript
function parseAIResponse<T>(response: string): T {
  try {
    // Remove potential markdown code blocks
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}
```

### 7.2 재시도 로직

```typescript
async function callGeminiWithRetry<T>(
  prompt: string,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await callGemini(prompt);
      return parseAIResponse<T>(response);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

---

## 8. 프롬프트 최적화 팁

### 8.1 JSON 강제 출력

```typescript
// ✅ Good: 명확한 JSON 요구
"Return ONLY valid JSON. DO NOT include any text outside the JSON."

// ❌ Bad: 애매한 요구
"Please format your response as JSON"
```

### 8.2 예제 제공

```typescript
// ✅ Good: 구체적 예제
"Example output:
{
  \"summary\": \"This paper proposes...\",
  \"category\": \"Research\"
}"

// ❌ Bad: 예제 없음
"Generate a summary and category"
```

### 8.3 길이 제한

```typescript
// ✅ Good: 구체적 길이
"Generate a 2-3 sentence summary (max 300 characters)"

// ❌ Bad: 모호한 길이
"Generate a short summary"
```

---

## 9. 프롬프트 템플릿 헬퍼

```typescript
// Handlebars 스타일 템플릿 렌더링
function renderPrompt(template: string, data: Record<string, any>): string {
  let result = template;
  
  // Simple variable replacement
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(
      new RegExp(`{{${key}}}`, 'g'),
      String(value)
    );
  });
  
  // Array iteration (simplified)
  // {{#each resources}} ... {{/each}}
  const eachRegex = /{{#each (\w+)}}([\s\S]*?){{\/each}}/g;
  result = result.replace(eachRegex, (match, arrayName, template) => {
    const array = data[arrayName] || [];
    return array.map((item: any, index: number) => {
      let itemTemplate = template;
      itemTemplate = itemTemplate.replace(/{{@index}}/g, String(index));
      Object.entries(item).forEach(([key, value]) => {
        itemTemplate = itemTemplate.replace(
          new RegExp(`{{${key}}}`, 'g'),
          String(value)
        );
      });
      return itemTemplate;
    }).join('\n');
  });
  
  return result;
}
```

---

## 10. 비용 최적화

### 10.1 캐싱 전략

```typescript
// 같은 URL은 캐시 활용
const summaryCache = new Map<string, SummarizeOutput>();

async function getCachedSummary(
  url: string,
  content: string
): Promise<SummarizeOutput> {
  const cacheKey = url;
  
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)!;
  }
  
  const result = await generateSummary(url, content);
  summaryCache.set(cacheKey, result);
  
  return result;
}
```

### 10.2 배치 처리

```typescript
// Daily Summary: 여러 자료를 한 번에 처리
async function generateDailySummary(
  resources: Resource[]
): Promise<DailySummaryOutput> {
  // 1개 API 호출로 모든 자료 분석
  return await callGemini(DAILY_SUMMARY_PROMPT, {
    resources,
    count: resources.length
  });
}
```

---

## 11. 테스트 프롬프트

개발 중 AI 출력을 테스트하기 위한 샘플 프롬프트:

```typescript
const TEST_SUMMARIZE = {
  title: "Test Article",
  url: "https://example.com",
  content: "This is a test article about ECG analysis using AI."
};

const TEST_DAILY_SUMMARY = {
  arc_name: "Test Arc",
  arc_goal: "Learn about AI",
  date: "2025-01-15",
  count: 3,
  resources: [
    {
      title: "AI Basics",
      url: "https://example.com/1",
      summary: "Introduction to AI",
      category: "Article"
    },
    // ...
  ]
};
```

---

## 부록: Gemini API 호출 코드

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
```
