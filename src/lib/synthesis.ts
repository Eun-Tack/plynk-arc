// Format synthesis as markdown for sharing
export function formatSynthesisAsMarkdown(synthesis: {
  title: string
  summary: string
  insights: Array<{ title: string; description: string }>
  keyTakeaways?: string[]
  created_at: string
  resource_count: number
}): string {
  const date = new Date(synthesis.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  let markdown = `# ${synthesis.title}\n\n`
  markdown += `> 생성일: ${date} | 리소스 ${synthesis.resource_count}개 분석\n\n`
  markdown += `## 요약\n\n${synthesis.summary}\n\n`

  if (synthesis.insights && synthesis.insights.length > 0) {
    markdown += `## 핵심 인사이트\n\n`
    synthesis.insights.forEach((insight, i) => {
      markdown += `### ${i + 1}. ${insight.title}\n\n`
      markdown += `${insight.description}\n\n`
    })
  }

  if (synthesis.keyTakeaways && synthesis.keyTakeaways.length > 0) {
    markdown += `## Key Takeaways\n\n`
    synthesis.keyTakeaways.forEach((takeaway) => {
      markdown += `- ${takeaway}\n`
    })
    markdown += '\n'
  }

  markdown += `---\n*Plynk Arc에서 생성됨*`

  return markdown
}
