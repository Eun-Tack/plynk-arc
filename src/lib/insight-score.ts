// 인사이트 가능성 점수 계산 (AI 호출 없이)

export interface InsightScoreInput {
  resources: Array<{
    id: string
    title: string
    summary: string | null
    category: string | null
    tags: string[]
  }>
}

export interface InsightScoreResult {
  score: number // 0-100
  level: 'high' | 'medium' | 'low'
  reasons: string[]
  commonTags: string[]
  topKeywords: string[]
}

// 한국어 불용어 (stopwords)
const KOREAN_STOPWORDS = new Set([
  '이', '그', '저', '것', '수', '등', '및', '더', '또', '때', '중',
  '위', '대', '후', '전', '내', '외', '상', '하', '좌', '우',
  '있다', '하다', '되다', '없다', '같다', '보다', '들다', '나다',
  '이다', '아니다', '있는', '하는', '되는', '없는', '같은',
  '그리고', '그러나', '하지만', '그래서', '따라서', '또한',
  '정보', '내용', '방법', '관련', '대한', '통한', '위한',
  '소개', '설명', '정리', '분석', '활용', '사용',
])

// 영어 불용어
const ENGLISH_STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why',
  'how', 'what', 'which', 'who', 'whom', 'this', 'that', 'these',
  'those', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'about', 'between', 'under', 'again', 'further', 'once',
])

// 텍스트에서 키워드 추출 (간단한 TF 기반)
function extractKeywords(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => {
      if (word.length < 2) return false
      if (KOREAN_STOPWORDS.has(word)) return false
      if (ENGLISH_STOPWORDS.has(word)) return false
      if (/^\d+$/.test(word)) return false
      return true
    })

  const frequency = new Map<string, number>()
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  }

  return frequency
}

// 두 리소스 간 키워드 유사도 계산
function calculateKeywordSimilarity(
  keywords1: Map<string, number>,
  keywords2: Map<string, number>
): number {
  const set1 = new Set(keywords1.keys())
  const set2 = new Set(keywords2.keys())

  const arr1 = Array.from(set1)
  const arr2 = Array.from(set2)
  const intersection = new Set(arr1.filter(x => set2.has(x)))
  const union = new Set([...arr1, ...arr2])

  if (union.size === 0) return 0
  return intersection.size / union.size // Jaccard similarity
}

// 인사이트 가능성 점수 계산
export function calculateInsightScore(input: InsightScoreInput): InsightScoreResult {
  const { resources } = input
  const reasons: string[] = []
  let score = 0

  // 1. 최소 리소스 개수 체크
  if (resources.length < 2) {
    return {
      score: 0,
      level: 'low',
      reasons: ['최소 2개 이상의 리소스가 필요합니다.'],
      commonTags: [],
      topKeywords: [],
    }
  }

  // 2. 공통 태그 분석 (40점 만점)
  const allTags = resources.flatMap(r => r.tags)
  const tagCounts = new Map<string, number>()
  for (const tag of allTags) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
  }

  // 2개 이상 리소스에서 공통으로 나타나는 태그
  const commonTags = Array.from(tagCounts.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)

  const commonTagRatio = commonTags.length > 0
    ? Math.min(commonTags.length / resources.length, 1)
    : 0

  const tagScore = Math.round(commonTagRatio * 40)
  score += tagScore

  if (commonTags.length >= 3) {
    reasons.push(`공통 태그 ${commonTags.length}개 발견`)
  } else if (commonTags.length >= 1) {
    reasons.push(`공통 태그 ${commonTags.length}개`)
  } else {
    reasons.push('공통 태그 없음')
  }

  // 3. 카테고리 일치도 (20점 만점)
  const categories = resources.map(r => r.category).filter(Boolean)
  const categoryCounts = new Map<string, number>()
  for (const cat of categories) {
    if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1)
  }

  const maxCategoryCount = Math.max(...Array.from(categoryCounts.values()), 0)
  const categoryRatio = categories.length > 0
    ? maxCategoryCount / categories.length
    : 0

  const categoryScore = Math.round(categoryRatio * 20)
  score += categoryScore

  if (categoryRatio >= 0.8) {
    reasons.push('콘텐츠 유형이 유사함')
  }

  // 4. 키워드 유사도 (TF-IDF 간소화) (40점 만점)
  const resourceKeywords = resources.map(r => {
    const text = `${r.title} ${r.summary || ''}`
    return extractKeywords(text)
  })

  // 모든 리소스 쌍의 유사도 평균
  let totalSimilarity = 0
  let pairCount = 0

  for (let i = 0; i < resourceKeywords.length; i++) {
    for (let j = i + 1; j < resourceKeywords.length; j++) {
      totalSimilarity += calculateKeywordSimilarity(
        resourceKeywords[i],
        resourceKeywords[j]
      )
      pairCount++
    }
  }

  const avgSimilarity = pairCount > 0 ? totalSimilarity / pairCount : 0
  const keywordScore = Math.round(avgSimilarity * 40)
  score += keywordScore

  if (avgSimilarity >= 0.3) {
    reasons.push('키워드 유사도 높음')
  } else if (avgSimilarity >= 0.15) {
    reasons.push('키워드 유사도 보통')
  }

  // 5. 전체 키워드에서 상위 키워드 추출
  const globalKeywords = new Map<string, number>()
  for (const kw of resourceKeywords) {
    const entries = Array.from(kw.entries())
    for (const [word, count] of entries) {
      globalKeywords.set(word, (globalKeywords.get(word) || 0) + count)
    }
  }

  const topKeywords = Array.from(globalKeywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)

  // 6. 레벨 결정
  let level: 'high' | 'medium' | 'low'
  if (score >= 60) {
    level = 'high'
  } else if (score >= 30) {
    level = 'medium'
  } else {
    level = 'low'
  }

  return {
    score,
    level,
    reasons,
    commonTags: commonTags.slice(0, 5),
    topKeywords,
  }
}

// 합성 가능 여부 (버튼 활성화 기준)
export function canSynthesize(score: InsightScoreResult): boolean {
  return score.level !== 'low' && score.score >= 25
}
