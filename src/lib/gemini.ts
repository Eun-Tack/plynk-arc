// Gemini Flash API for AI summarization

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
  error?: {
    message: string
  }
}

export interface SummaryResult {
  summary: string
  contentType: 'article' | 'video' | 'tool' | 'documentation' | 'tutorial' | 'news'
  suggestedTags: string[]
}

export async function generateSummary(content: string, title: string, url?: string): Promise<SummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY

  // URL 기반 콘텐츠 타입 추론
  const inferContentType = (url?: string): string => {
    if (!url) return 'article'
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) return 'video'
    if (url.includes('github.com') || url.includes('npmjs.com') || url.includes('pypi.org')) return 'tool'
    if (url.includes('docs.') || url.includes('/docs/') || url.includes('documentation')) return 'documentation'
    return 'article'
  }

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return {
      summary: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      contentType: inferContentType(url) as SummaryResult['contentType'],
      suggestedTags: [],
    }
  }

  const prompt = `콘텐츠를 분석하여 JSON으로 응답하세요.

제목: ${title}
URL: ${url}

내용:
${content.slice(0, 5000)}

**요약 원칙**:
- "이 글은 ~에 대한 글입니다" 형식 금지
- "저자가 ~했습니다" 형식 금지
- 독자가 "이 글을 읽으면 무엇을 알 수 있는지" 중심으로 작성
- 구체적인 내용 포함 (숫자, 방법, 도구명 등)

**나쁜 요약 예시**:
- "Claude Code 세미나 후기를 공유합니다"
- "AI 트렌드에 대해 설명하는 글입니다"
- "다양한 기능을 소개합니다"

**좋은 요약 예시**:
- "Claude Code로 개발 생산성 높이는 5가지 팁. 프롬프트 작성법과 컨텍스트 관리 노하우"
- "2025년 AI 스타트업 투자 트렌드: Vertical AI가 주목받는 이유와 유망 분야 분석"
- "Next.js 15 주요 변경사항 정리. 마이그레이션 시 주의할 호환성 이슈 포함"

**JSON 형식으로만 응답** (다른 텍스트 없이):
{
  "summary": "30-50자. 핵심 내용과 얻을 수 있는 정보를 구체적으로",
  "contentType": "${inferContentType(url)}",
  "suggestedTags": ["요약에서 추출한 핵심 키워드 3-5개"]
}

**태그 규칙**:
- 요약에 포함된 핵심 키워드에서 추출
- 기술명, 제품명, 고유명사 우선 (Claude Code, React, GPT-4)
- 주제 카테고리 포함 (프롬프트엔지니어링, 투자, 생산성)
- 일반적인 단어 제외 (정보, 글, 소개, 방법)`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data: GeminiResponse = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      const validContentTypes = ['article', 'video', 'tool', 'documentation', 'tutorial', 'news']
      return {
        summary: parsed.summary || content.slice(0, 100),
        contentType: validContentTypes.includes(parsed.contentType)
          ? parsed.contentType
          : inferContentType(url) as SummaryResult['contentType'],
        suggestedTags: Array.isArray(parsed.suggestedTags)
          ? parsed.suggestedTags.slice(0, 5)
          : [],
      }
    }

    return {
      summary: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      contentType: inferContentType(url) as SummaryResult['contentType'],
      suggestedTags: [],
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      summary: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      contentType: inferContentType(url) as SummaryResult['contentType'],
      suggestedTags: [],
    }
  }
}

// YouTube 영상 자막 요약용 함수
export async function generateYouTubeSummary(
  transcript: string,
  title: string,
  url: string
): Promise<SummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return {
      summary: title.slice(0, 100),
      contentType: 'video',
      suggestedTags: [],
    }
  }

  const prompt = `YouTube 영상 자막을 분석하여 JSON으로 응답하세요.

제목: ${title}
URL: ${url}

자막 내용:
${transcript.slice(0, 8000)}

**요약 원칙**:
- 영상에서 설명하는 핵심 내용/방법/인사이트 중심
- "이 영상은 ~에 대한 영상입니다" 형식 금지
- "유튜버가 ~를 설명합니다" 형식 금지
- 시청자가 "이 영상을 보면 무엇을 배울 수 있는지" 중심
- 구체적 내용 포함 (숫자, 단계, 도구명 등)

**나쁜 요약 예시**:
- "유튜버가 Claude Code에 대해 설명합니다"
- "AI 관련 영상입니다"
- "다양한 팁을 소개합니다"

**좋은 요약 예시**:
- "Claude Code로 하루 만에 웹앱 만드는 과정. 프롬프트 작성법과 에러 해결 노하우 포함"
- "GPT-4o vs Claude 3.5 코딩 성능 비교. 5가지 테스트에서 Claude가 우세한 이유"
- "Cursor AI 실전 활용법 3가지. 코드 리뷰, 리팩토링, 테스트 작성 시연"

**JSON 형식으로만 응답** (다른 텍스트 없이):
{
  "summary": "30-60자. 영상의 핵심 내용과 배울 수 있는 것을 구체적으로",
  "contentType": "video",
  "suggestedTags": ["영상 내용에서 추출한 핵심 키워드 3-5개"]
}

**태그 규칙**:
- 영상에서 언급된 기술명, 제품명, 서비스명 우선
- 영상 주제 카테고리 포함
- 일반적인 단어 제외 (영상, 설명, 소개)`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data: GeminiResponse = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        summary: parsed.summary || title.slice(0, 100),
        contentType: 'video',
        suggestedTags: Array.isArray(parsed.suggestedTags)
          ? parsed.suggestedTags.slice(0, 5)
          : [],
      }
    }

    return {
      summary: title.slice(0, 100),
      contentType: 'video',
      suggestedTags: [],
    }
  } catch (error) {
    console.error('Gemini API error (YouTube):', error)
    return {
      summary: title.slice(0, 100),
      contentType: 'video',
      suggestedTags: [],
    }
  }
}

// 스토리라인 기반 인사이트 구조
export interface StorySection {
  title: string
  content: string
  relatedResources: string[] // resource IDs
}

export interface SynthesisConnection {
  from: string // resource ID
  to: string   // resource ID
  relationship: string
}

export interface SynthesisResult {
  title: string
  // 스토리라인 구조
  storyline: {
    context: StorySection      // 배경/맥락
    discoveries: StorySection[] // 핵심 발견들
    synthesis: StorySection    // 연결/통합
    conclusion: StorySection   // 결론/시사점
  }
  connections: SynthesisConnection[]
  actionItems: string[] // 실행 가능한 액션
}

export async function generateSynthesis(resources: Array<{
  id: string
  title: string
  summary: string | null
  content: string | null
  category: string | null
  tags?: string[]
}>): Promise<SynthesisResult> {
  const apiKey = process.env.GEMINI_API_KEY

  const defaultResult: SynthesisResult = {
    title: '리소스 합성',
    storyline: {
      context: { title: '배경', content: '', relatedResources: [] },
      discoveries: [],
      synthesis: { title: '연결', content: '', relatedResources: [] },
      conclusion: { title: '결론', content: '', relatedResources: [] },
    },
    connections: [],
    actionItems: [],
  }

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return {
      ...defaultResult,
      storyline: {
        ...defaultResult.storyline,
        context: { title: 'API 키 필요', content: '인사이트를 생성하려면 Gemini API 키가 필요합니다.', relatedResources: [] },
      }
    }
  }

  const resourcesText = resources
    .map((r) => `[${r.id}] ${r.title}
카테고리: ${r.category || '없음'}
태그: ${r.tags?.join(', ') || '없음'}
요약: ${r.summary || '없음'}
내용: ${r.content?.slice(0, 800) || '없음'}`)
    .join('\n\n---\n\n')

  const prompt = `당신은 지식 큐레이터입니다. 다음 리소스들을 분석하여 **읽기 쉬운 스토리라인**으로 인사이트를 작성해주세요.

## 리소스 목록:
${resourcesText}

## 스토리라인 작성 원칙:
1. **흐름이 있어야 함**: 배경 → 발견 → 연결 → 결론 순서로 자연스럽게 읽히도록
2. **구체적이어야 함**: "다양한 방법이 있다" 대신 실제 내용을 언급
3. **실용적이어야 함**: 독자가 실행할 수 있는 액션 제시
4. **연결을 보여줘야 함**: 리소스들 사이의 관계와 공통점/차이점 명시

## 나쁜 예시:
- "이 리소스들은 AI에 대해 다루고 있습니다"
- "다양한 관점을 제시합니다"
- "여러 방법론이 소개됩니다"

## 좋은 예시:
- "최근 AI 도구들이 개발자 생산성을 높이고 있는데, 이 리소스들은 Claude Code와 Cursor를 중심으로 실제 활용 사례를 보여준다"
- "세 자료 모두 '프롬프트 설계'의 중요성을 강조하지만, 접근 방식이 다르다. A는 반복적 개선을, B는 한 번에 상세한 컨텍스트 제공을 권장한다"

## JSON 형식으로만 응답 (다른 텍스트 없이):
{
  "title": "인사이트 제목 (흥미를 끄는 한 줄)",
  "storyline": {
    "context": {
      "title": "배경/맥락",
      "content": "이 리소스들이 왜 함께 의미가 있는지, 공통 주제는 무엇인지 (2-3문장)",
      "relatedResources": ["관련 리소스 ID들"]
    },
    "discoveries": [
      {
        "title": "핵심 발견 1",
        "content": "구체적인 발견 내용 (2-3문장). 어떤 리소스에서 이 내용이 나왔는지 명시",
        "relatedResources": ["해당 리소스 ID들"]
      },
      {
        "title": "핵심 발견 2",
        "content": "또 다른 발견 (2-3문장)",
        "relatedResources": ["해당 리소스 ID들"]
      }
    ],
    "synthesis": {
      "title": "연결/통합",
      "content": "리소스들 사이의 연결고리, 공통점과 차이점, 상호 보완 관계 (3-4문장)",
      "relatedResources": ["모든 관련 리소스 ID들"]
    },
    "conclusion": {
      "title": "결론/시사점",
      "content": "이 인사이트가 독자에게 주는 의미, 앞으로의 방향 (2-3문장)",
      "relatedResources": []
    }
  },
  "connections": [
    {
      "from": "리소스ID",
      "to": "리소스ID",
      "relationship": "두 리소스가 어떻게 연결되는지 (10-20자)"
    }
  ],
  "actionItems": [
    "독자가 바로 실행할 수 있는 구체적 액션 1",
    "구체적 액션 2",
    "구체적 액션 3"
  ]
}

discoveries는 2-4개, connections는 의미있는 것만 2-4개, actionItems는 3-5개를 작성해주세요.`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 3000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data: GeminiResponse = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || '리소스 합성',
        storyline: {
          context: parsed.storyline?.context || defaultResult.storyline.context,
          discoveries: parsed.storyline?.discoveries || [],
          synthesis: parsed.storyline?.synthesis || defaultResult.storyline.synthesis,
          conclusion: parsed.storyline?.conclusion || defaultResult.storyline.conclusion,
        },
        connections: parsed.connections || [],
        actionItems: parsed.actionItems || [],
      }
    }

    return defaultResult
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      ...defaultResult,
      storyline: {
        ...defaultResult.storyline,
        context: { title: '오류', content: '리소스 분석 중 오류가 발생했습니다.', relatedResources: [] },
      }
    }
  }
}
