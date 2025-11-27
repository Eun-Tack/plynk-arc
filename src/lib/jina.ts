// Jina Reader API for extracting content from URLs

export interface JinaReaderResponse {
  title: string
  content: string
  url: string
  description?: string
}

// 제목에서 불필요한 마크다운/패턴 제거
function cleanTitle(title: string): string {
  let cleaned = title

  // 마크다운 링크 제거: [텍스트](URL) -> 텍스트
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // 구분선 제거: ===, ---, *** 등
  cleaned = cleaned.replace(/[=\-*]{3,}/g, '')

  // 마크다운 헤딩 제거: # ## ### 등
  cleaned = cleaned.replace(/^#+\s*/gm, '')

  // 연속 공백 정리
  cleaned = cleaned.replace(/\s+/g, ' ')

  // 앞뒤 공백 및 특수문자 제거
  cleaned = cleaned.trim().replace(/^[\s|:;-]+|[\s|:;-]+$/g, '')

  return cleaned
}

export async function fetchUrlContent(url: string): Promise<JinaReaderResponse> {
  // Use Jina Reader API (free, no API key required)
  const jinaUrl = `https://r.jina.ai/${url}`

  const response = await fetch(jinaUrl, {
    headers: {
      'Accept': 'application/json',
      'X-Return-Format': 'json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL content: ${response.statusText}`)
  }

  const data = await response.json()

  // Jina Reader returns data in 'data' field
  const result = data.data || data

  // Extract title - try multiple sources
  let title = result.title || ''

  // If title is empty, try to extract from content (first line often is the title)
  if (!title && result.content) {
    const lines = result.content.split('\n').filter((l: string) => l.trim())
    const firstLine = lines[0]?.trim()
    // Use first line if it looks like a title (not too long)
    if (firstLine && firstLine.length < 200) {
      title = firstLine
    }
  }

  // Last resort: use domain name
  if (!title) {
    try {
      const urlObj = new URL(url)
      title = urlObj.hostname.replace('www.', '')
    } catch {
      title = url
    }
  }

  // 제목 정제
  title = cleanTitle(title)

  return {
    title,
    content: result.content || result.text || '',
    url: result.url || url,
    description: result.description,
  }
}

// Fallback: Simple metadata extraction using Open Graph tags
export async function fetchUrlMetadata(url: string): Promise<{
  title: string
  description: string | null
  favicon: string | null
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PlynkArc/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch URL')
    }

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const ogTitleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
                         html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i)
    const title = ogTitleMatch?.[1] || titleMatch?.[1] || 'Untitled'

    // Extract description
    const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) ||
                      html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i)
    const ogDescMatch = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ||
                        html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i)
    const description = ogDescMatch?.[1] || descMatch?.[1] || null

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]+rel="(?:shortcut )?icon"[^>]+href="([^"]+)"/i) ||
                         html.match(/<link[^>]+href="([^"]+)"[^>]+rel="(?:shortcut )?icon"/i)
    let favicon = faviconMatch?.[1] || null

    // Resolve relative favicon URL
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url)
      if (favicon.startsWith('/')) {
        favicon = `${urlObj.origin}${favicon}`
      } else {
        favicon = `${urlObj.origin}/${favicon}`
      }
    }

    // Default favicon from Google
    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    }

    return { title, description, favicon }
  } catch (error) {
    // Return defaults on error
    const urlObj = new URL(url)
    return {
      title: urlObj.hostname,
      description: null,
      favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
    }
  }
}
