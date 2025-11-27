// YouTube transcript extraction for video summarization
import { Innertube } from 'youtubei.js'

export interface YouTubeResult {
  videoId: string
  title: string
  transcript: string | null
  thumbnailUrl: string
  channelName: string
  hasTranscript: boolean
}

// YouTube URL 감지
export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}

// Video ID 추출
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
    /(?:youtube\.com\/live\/)([^?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// YouTube 메타데이터 + 자막 가져오기
export async function getYouTubeContent(url: string): Promise<YouTubeResult> {
  const videoId = extractVideoId(url)
  if (!videoId) throw new Error('Invalid YouTube URL')

  let title = ''
  let channelName = ''
  let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  let transcript: string | null = null
  let hasTranscript = false

  try {
    // youtubei.js로 정보 가져오기
    const yt = await Innertube.create()
    const info = await yt.getInfo(videoId)

    title = info.basic_info.title || ''
    channelName = info.basic_info.channel?.name || ''

    // 썸네일 (고화질 우선)
    const thumbnails = info.basic_info.thumbnail
    if (thumbnails && thumbnails.length > 0) {
      thumbnailUrl = thumbnails[thumbnails.length - 1].url
    }

    // 자막 가져오기
    try {
      const transcriptData = await info.getTranscript()
      const segments = transcriptData?.transcript?.content?.body?.initial_segments

      if (segments && segments.length > 0) {
        transcript = segments
          .map((s: { snippet?: { text?: string } }) => s.snippet?.text || '')
          .filter((t: string) => t.length > 0)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()

        // 최소 길이 체크 (50자 이상이면 유효한 자막)
        hasTranscript = transcript.length > 50

        // 토큰 제한 (10000자)
        if (transcript.length > 10000) {
          transcript = transcript.slice(0, 10000)
        }
      }
    } catch (transcriptError) {
      console.log('Transcript not available for this video')
      hasTranscript = false
    }
  } catch (error) {
    console.error('YouTube content fetch error:', error)

    // 폴백: oEmbed API로 기본 메타데이터만
    try {
      const metaResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`
      )
      if (metaResponse.ok) {
        const meta = await metaResponse.json()
        title = meta.title || ''
        channelName = meta.author_name || ''
        thumbnailUrl = meta.thumbnail_url || thumbnailUrl
      }
    } catch {
      // 모든 시도 실패
    }
  }

  return {
    videoId,
    title,
    transcript,
    thumbnailUrl,
    channelName,
    hasTranscript,
  }
}
