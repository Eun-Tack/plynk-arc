import nodemailer from 'nodemailer'

// Google Workspace SMTP 설정
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"plynk arc" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // HTML 태그 제거한 텍스트 버전
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Daily Summary 이메일 템플릿
interface DailySummaryEmailData {
  userName: string
  title: string
  storyline: {
    context?: { title: string; content: string }
    discoveries?: Array<{ title: string; content: string }>
    synthesis?: { title: string; content: string }
    conclusion?: { title: string; content: string }
  }
  connections: Array<{ from: string; to: string; relationship: string }>
  actionItems: string[]
  resourceCount: number
  viewUrl: string
}

export function generateDailySummaryEmail(data: DailySummaryEmailData): string {
  const { userName, title, storyline, connections, actionItems, resourceCount, viewUrl } = data

  // 스토리라인 섹션 생성
  let storylineHtml = ''

  if (storyline.context) {
    storylineHtml += `
      <div style="margin-bottom: 20px; padding: 16px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
        <h3 style="margin: 0 0 8px 0; color: #0369a1; font-size: 14px;">${storyline.context.title}</h3>
        <p style="margin: 0; color: #334155; line-height: 1.6;">${storyline.context.content}</p>
      </div>
    `
  }

  if (storyline.discoveries && storyline.discoveries.length > 0) {
    storylineHtml += `
      <div style="margin-bottom: 20px; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
        <h3 style="margin: 0 0 12px 0; color: #15803d; font-size: 14px;">주요 발견</h3>
        ${storyline.discoveries.map(d => `
          <div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 4px 0; color: #166534; font-size: 13px;">${d.title}</h4>
            <p style="margin: 0; color: #334155; line-height: 1.6; font-size: 14px;">${d.content}</p>
          </div>
        `).join('')}
      </div>
    `
  }

  if (storyline.synthesis) {
    storylineHtml += `
      <div style="margin-bottom: 20px; padding: 16px; background: #faf5ff; border-radius: 8px; border-left: 4px solid #a855f7;">
        <h3 style="margin: 0 0 8px 0; color: #7e22ce; font-size: 14px;">${storyline.synthesis.title}</h3>
        <p style="margin: 0; color: #334155; line-height: 1.6;">${storyline.synthesis.content}</p>
      </div>
    `
  }

  if (storyline.conclusion) {
    storylineHtml += `
      <div style="margin-bottom: 20px; padding: 16px; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f97316;">
        <h3 style="margin: 0 0 8px 0; color: #c2410c; font-size: 14px;">${storyline.conclusion.title}</h3>
        <p style="margin: 0; color: #334155; line-height: 1.6;">${storyline.conclusion.content}</p>
      </div>
    `
  }

  // 연결 섹션
  let connectionsHtml = ''
  if (connections && connections.length > 0) {
    connectionsHtml = `
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">발견된 연결</h3>
        ${connections.slice(0, 3).map(c => `
          <div style="padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 8px;">
            <p style="margin: 0 0 4px 0; color: #6366f1; font-size: 13px; font-weight: 500;">
              ${c.from} → ${c.to}
            </p>
            <p style="margin: 0; color: #64748b; font-size: 13px;">${c.relationship}</p>
          </div>
        `).join('')}
      </div>
    `
  }

  // 액션 아이템 섹션
  let actionItemsHtml = ''
  if (actionItems && actionItems.length > 0) {
    actionItemsHtml = `
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">추천 액션</h3>
        <ul style="margin: 0; padding-left: 20px; color: #334155;">
          ${actionItems.map(item => `<li style="margin-bottom: 8px; line-height: 1.5;">${item}</li>`).join('')}
        </ul>
      </div>
    `
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        plynk arc
      </h1>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">Daily Insight Summary</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 32px;">
      <!-- Greeting -->
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">안녕하세요, ${userName}님</p>

      <!-- Title -->
      <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 600; line-height: 1.4;">
        ${title}
      </h2>

      <!-- Stats -->
      <div style="display: inline-block; padding: 8px 16px; background: #eef2ff; border-radius: 20px; margin-bottom: 24px;">
        <span style="color: #4f46e5; font-size: 13px; font-weight: 500;">
          ${resourceCount}개의 자료에서 인사이트 추출
        </span>
      </div>

      <!-- Storyline -->
      ${storylineHtml}

      <!-- Connections -->
      ${connectionsHtml}

      <!-- Action Items -->
      ${actionItemsHtml}

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${viewUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
          전체 인사이트 보기
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">이 이메일은 plynk arc 데일리 요약 설정에 따라 발송되었습니다.</p>
      <p style="margin: 0;">설정 변경은 <a href="${viewUrl.replace(/\/insights.*/, '/profile')}" style="color: #6366f1;">프로필 설정</a>에서 가능합니다.</p>
    </div>
  </div>
</body>
</html>
  `
}
