'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { fetchUrlContent, fetchUrlMetadata } from '@/lib/jina'
import { generateSummary, SummaryResult } from '@/lib/gemini'

// 미리보기 결과 타입
export interface PreviewResult {
  url: string
  title: string
  summary: string
  contentType: SummaryResult['contentType']
  suggestedTags: string[]
  favicon: string
  content?: string
}

// URL 분석하여 미리보기 데이터 생성 (저장 전 단계)
export async function previewUrl(url: string): Promise<{ success: true; preview: PreviewResult } | { error: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Validate URL
  try {
    new URL(url)
  } catch {
    return { error: '올바른 URL을 입력해주세요.' }
  }

  try {
    let extractedTitle = ''
    let content = ''
    let description: string | null = null
    let favicon: string | null = null

    try {
      const jinaResult = await fetchUrlContent(url)
      extractedTitle = jinaResult.title
      content = jinaResult.content
      description = jinaResult.description || null
    } catch (jinaError) {
      console.log('Jina Reader failed, falling back to metadata extraction')
      const metadata = await fetchUrlMetadata(url)
      extractedTitle = metadata.title
      description = metadata.description
      favicon = metadata.favicon
    }

    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    }

    // AI로 요약 및 태그 추천
    const { summary, contentType, suggestedTags } = await generateSummary(
      content || description || extractedTitle,
      extractedTitle,
      url
    )

    return {
      success: true,
      preview: {
        url,
        title: extractedTitle,
        summary,
        contentType,
        suggestedTags,
        favicon: favicon || '',
        content: content?.slice(0, 50000) || undefined,
      }
    }
  } catch (error) {
    console.error('URL preview error:', error)
    return { error: 'URL 분석 중 오류가 발생했습니다.' }
  }
}

// 사용자 태그 목록 조회
export async function getUserTags() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('usage_count', { ascending: false })

  if (error) {
    console.error('Tags fetch error:', error)
    return { error: '태그 목록을 불러오는데 실패했습니다.' }
  }

  return { success: true, tags: data || [] }
}

// 미리보기 데이터로 리소스 저장 (태그 포함)
export async function saveResourceWithTags(
  arcId: string,
  preview: PreviewResult,
  customTitle: string | undefined,
  selectedTags: string[]
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Verify arc ownership
  const { data: arc } = await supabase
    .from('arcs')
    .select('id, user_id')
    .eq('id', arcId)
    .eq('user_id', user.id)
    .single()

  if (!arc) {
    return { error: 'Arc를 찾을 수 없거나 접근 권한이 없습니다.' }
  }

  try {
    // 리소스 저장
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        arc_id: arcId,
        user_id: user.id,
        url: preview.url,
        title: customTitle || preview.title,
        summary: preview.summary,
        content: preview.content || null,
        content_type: preview.contentType,
        favicon_url: preview.favicon,
      })
      .select()
      .single()

    if (resourceError) {
      console.error('Resource creation error:', resourceError)
      return { error: '리소스 저장에 실패했습니다.' }
    }

    // 태그 처리
    if (selectedTags.length > 0) {
      for (const tagName of selectedTags) {
        // 기존 태그 찾기 또는 생성
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id, usage_count')
          .eq('user_id', user.id)
          .eq('name', tagName)
          .single()

        let tagId: string

        if (existingTag) {
          tagId = existingTag.id
          // usage_count 증가
          await supabase
            .from('tags')
            .update({ usage_count: (existingTag.usage_count || 0) + 1 })
            .eq('id', tagId)
        } else {
          // 새 태그 생성
          const { data: newTag, error: tagError } = await supabase
            .from('tags')
            .insert({
              user_id: user.id,
              name: tagName,
              usage_count: 1,
            })
            .select()
            .single()

          if (tagError) {
            console.error('Tag creation error:', tagError)
            continue
          }
          tagId = newTag.id
        }

        // 리소스-태그 연결
        await supabase
          .from('resource_tags')
          .insert({
            resource_id: resource.id,
            tag_id: tagId,
          })
      }
    }

    revalidatePath(`/arcs/${arcId}`)
    revalidatePath('/dashboard')

    return { success: true, resource }
  } catch (error) {
    console.error('Resource save error:', error)
    return { error: '리소스 저장 중 오류가 발생했습니다.' }
  }
}

// 기존 함수 유지 (호환성)
export async function addUrlResource(arcId: string, url: string, customTitle?: string) {
  const previewResult = await previewUrl(url)

  if ('error' in previewResult) {
    return previewResult
  }

  return saveResourceWithTags(arcId, previewResult.preview, customTitle, previewResult.preview.suggestedTags)
}

export async function addFileResource(arcId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Verify arc ownership
  const { data: arc } = await supabase
    .from('arcs')
    .select('id, user_id')
    .eq('id', arcId)
    .eq('user_id', user.id)
    .single()

  if (!arc) {
    return { error: 'Arc를 찾을 수 없거나 접근 권한이 없습니다.' }
  }

  const file = formData.get('file') as File
  const customTitle = formData.get('customTitle') as string | null

  if (!file) {
    return { error: '파일이 없습니다.' }
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return { error: '파일 크기는 10MB를 초과할 수 없습니다.' }
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]

  if (!allowedTypes.includes(file.type)) {
    return { error: '지원하지 않는 파일 형식입니다.' }
  }

  try {
    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const filename = `${user.id}/${arcId}/${timestamp}.${ext}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filename, file)

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return { error: '파일 업로드에 실패했습니다.' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(filename)

    // Extract text from file if applicable
    let content = ''
    let summary = file.name
    let contentType: SummaryResult['contentType'] = file.type.startsWith('image/') ? 'article' : 'documentation'

    if (file.type === 'text/plain' || file.type === 'text/markdown') {
      content = await file.text()
      const result = await generateSummary(content, file.name)
      summary = result.summary
      contentType = result.contentType
    }

    // Save to database (use custom title if provided)
    const { data, error } = await supabase
      .from('resources')
      .insert({
        arc_id: arcId,
        user_id: user.id,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        title: customTitle || file.name,
        summary,
        content: content?.slice(0, 50000) || null,
        content_type: contentType,
      })
      .select()
      .single()

    if (error) {
      console.error('Resource creation error:', error)
      return { error: '리소스 저장에 실패했습니다.' }
    }

    revalidatePath(`/arcs/${arcId}`)
    revalidatePath('/dashboard')

    return { success: true, resource: data }
  } catch (error) {
    console.error('File processing error:', error)
    return { error: '파일 처리 중 오류가 발생했습니다.' }
  }
}

export async function deleteResource(resourceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Get resource to find arc_id and file path
  const { data: resource } = await supabase
    .from('resources')
    .select('arc_id, file_url, user_id')
    .eq('id', resourceId)
    .single()

  if (!resource) {
    return { error: '리소스를 찾을 수 없습니다.' }
  }

  if (resource.user_id !== user.id) {
    return { error: '삭제 권한이 없습니다.' }
  }

  // Delete file from storage if exists
  if (resource.file_url) {
    try {
      // Extract file path from URL
      const urlParts = resource.file_url.split('/resources/')
      if (urlParts[1]) {
        await supabase.storage.from('resources').remove([urlParts[1]])
      }
    } catch (storageError) {
      console.error('Storage deletion error:', storageError)
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Resource deletion error:', error)
    return { error: '리소스 삭제에 실패했습니다.' }
  }

  revalidatePath(`/arcs/${resource.arc_id}`)
  revalidatePath('/dashboard')

  return { success: true }
}

// 리소스 수정
export async function updateResource(
  resourceId: string,
  data: {
    title?: string
    summary?: string
    tags?: string[]
  }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // 리소스 확인 및 권한 체크
  const { data: resource } = await supabase
    .from('resources')
    .select('id, arc_id, user_id')
    .eq('id', resourceId)
    .single()

  if (!resource) {
    return { error: '리소스를 찾을 수 없습니다.' }
  }

  if (resource.user_id !== user.id) {
    return { error: '수정 권한이 없습니다.' }
  }

  try {
    // 리소스 기본 정보 업데이트
    const updateData: Record<string, any> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.summary !== undefined) updateData.summary = data.summary

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', resourceId)

      if (updateError) {
        console.error('Resource update error:', updateError)
        return { error: '리소스 수정에 실패했습니다.' }
      }
    }

    // 태그 업데이트
    if (data.tags !== undefined) {
      // 기존 태그 연결 삭제
      await supabase
        .from('resource_tags')
        .delete()
        .eq('resource_id', resourceId)

      // 새 태그 연결
      for (const tagName of data.tags) {
        // 기존 태그 찾기 또는 생성
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id, usage_count')
          .eq('user_id', user.id)
          .eq('name', tagName)
          .single()

        let tagId: string

        if (existingTag) {
          tagId = existingTag.id
        } else {
          // 새 태그 생성
          const { data: newTag, error: tagError } = await supabase
            .from('tags')
            .insert({
              user_id: user.id,
              name: tagName,
              usage_count: 1,
            })
            .select()
            .single()

          if (tagError) {
            console.error('Tag creation error:', tagError)
            continue
          }
          tagId = newTag.id
        }

        // 리소스-태그 연결
        await supabase
          .from('resource_tags')
          .insert({
            resource_id: resourceId,
            tag_id: tagId,
          })
      }
    }

    revalidatePath(`/arcs/${resource.arc_id}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Resource update error:', error)
    return { error: '리소스 수정 중 오류가 발생했습니다.' }
  }
}

export async function getResource(resourceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      arcs (
        id,
        name,
        is_public,
        user_id
      )
    `)
    .eq('id', resourceId)
    .single()

  if (error || !data) {
    return { error: '리소스를 찾을 수 없습니다.' }
  }

  // Check access
  const arc = data.arcs as any
  if (arc.user_id !== user.id && !arc.is_public) {
    return { error: '접근 권한이 없습니다.' }
  }

  return { success: true, resource: data }
}
