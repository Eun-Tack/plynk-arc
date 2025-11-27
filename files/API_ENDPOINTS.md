# API 엔드포인트 명세

## 베이스 URL

```
Development: http://localhost:3000
Production: https://plynkarc.com
```

## 인증

모든 보호된 엔드포인트는 Supabase JWT를 사용합니다.

```typescript
// 자동 처리 (Supabase Client)
const supabase = createClient(url, key);
await supabase.auth.signInWithPassword({ email, password });

// 수동 처리 (REST API)
headers: {
  'Authorization': 'Bearer <JWT_TOKEN>'
}
```

---

## 📋 목차

1. [인증 (Auth)](#1-인증-auth)
2. [사용자 프로필](#2-사용자-프로필)
3. [Boxes](#3-arcs)
4. [Resources](#4-resources)
5. [Tags](#5-tags)
6. [Synthesis](#6-synthesis)
7. [Daily Summary](#7-daily-summary)
8. [Notifications](#8-notifications)
9. [Export](#9-export)
10. [공유 (Sharing)](#10-공유-sharing)

---

## 1. 인증 (Auth)

### 1.1 회원가입 (이메일)

```http
POST /auth/v1/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "options": {
    "data": {
      "full_name": "홍길동",
      "gender": "male",
      "age": 30,
      "occupation": "개발자"
    }
  }
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": null,
    "user_metadata": {
      "full_name": "홍길동"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

**Errors:**
- `400`: 이메일 형식 오류
- `422`: 이미 존재하는 이메일

---

### 1.2 로그인 (이메일)

```http
POST /auth/v1/token?grant_type=password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token",
  "user": { ... }
}
```

---

### 1.3 소셜 로그인 (Google)

```http
POST /auth/v1/authorize?provider=google
```

**Response:**
Redirect to Google OAuth consent page

---

### 1.4 로그아웃

```http
POST /auth/v1/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## 2. 사용자 프로필

### 2.1 프로필 조회

```http
GET /api/profile
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "홍길동",
  "gender": "male",
  "age": 30,
  "occupation": "개발자",
  "subscription_tier": "free",
  "box_limit": 2,
  "daily_summary_enabled": true,
  "daily_summary_time": "09:00:00",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 2.2 프로필 업데이트

```http
PATCH /api/profile
```

**Request Body:**
```json
{
  "full_name": "홍길동",
  "gender": "male",
  "age": 31,
  "occupation": "시니어 개발자",
  "daily_summary_enabled": true,
  "daily_summary_time": "10:00:00"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "full_name": "홍길동",
  "age": 31,
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

## 3. Arces

### 3.1 Arc 목록 조회

```http
GET /api/arcs
```

**Query Parameters:**
- `limit` (optional): 페이지당 개수 (기본 20)
- `offset` (optional): 오프셋 (기본 0)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "LCT 특허 조사",
      "goal": "선행기술 20건 분석",
      "icon": "📚",
      "color": "#3B82F6",
      "resource_count": 18,
      "last_synthesis_at": "2025-01-10T00:00:00Z",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 2,
  "limit": 2
}
```

---

### 3.2 Arc 생성

```http
POST /api/arcs
```

**Request Body:**
```json
{
  "name": "새 프로젝트",
  "goal": "목표 설명",
  "icon": "📁",
  "color": "#10B981",
  "auto_synthesis_enabled": true,
  "auto_synthesis_threshold": 10
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "새 프로젝트",
  "goal": "목표 설명",
  "icon": "📁",
  "color": "#10B981",
  "resource_count": 0,
  "created_at": "2025-01-15T00:00:00Z"
}
```

**Errors:**
- `403`: Arc 생성 한도 초과 (무료: 2개)

---

### 3.3 Arc 상세 조회

```http
GET /api/arcs/:id
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "LCT 특허 조사",
  "goal": "선행기술 20건 분석",
  "icon": "📚",
  "color": "#3B82F6",
  "resource_count": 18,
  "is_public": false,
  "share_token": "uuid",
  "auto_synthesis_enabled": true,
  "auto_synthesis_threshold": 10,
  "last_synthesis_at": "2025-01-10T00:00:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  
  "stats": {
    "total_resources": 18,
    "categories": {
      "Article": 10,
      "Research": 5,
      "Tool": 3
    },
    "tags": ["특허", "ECG", "AI"],
    "synthesis_count": 2
  }
}
```

---

### 3.4 Arc 업데이트

```http
PATCH /api/arcs/:id
```

**Request Body:**
```json
{
  "name": "업데이트된 이름",
  "goal": "새로운 목표",
  "icon": "🎯",
  "color": "#EF4444",
  "auto_synthesis_threshold": 15
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "업데이트된 이름",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 3.5 Arc 삭제

```http
DELETE /api/arcs/:id
```

**Response (204):**
No content

---

## 4. Resources

### 4.1 자료 목록 조회

```http
GET /api/arcs/:arcId/resources
```

**Query Parameters:**
- `limit`: 페이지당 개수 (기본 50)
- `offset`: 오프셋
- `date`: 특정 날짜 필터 (YYYY-MM-DD)
- `category`: 카테고리 필터
- `tag_id`: 태그 ID 필터

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "url": "https://example.com/article",
      "title": "ECG 분석 논문",
      "summary": "AI 기반 ECG 분석 방법론...",
      "category": "Research",
      "favicon_url": "https://example.com/favicon.ico",
      "tags": [
        { "id": 1, "name": "ECG", "color": "#3B82F6" },
        { "id": 2, "name": "AI", "color": "#10B981" }
      ],
      "created_at": "2025-01-15T09:00:00Z"
    }
  ],
  "count": 18,
  "has_more": false
}
```

---

### 4.2 자료 추가

```http
POST /api/arcs/:arcId/resources
```

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "title": "자동 추출 (선택사항)",
  "category": "Article"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "url": "https://example.com/article",
  "title": "ECG 분석 논문",
  "summary": "AI 기반 ECG 분석 방법론... (AI 생성)",
  "category": "Research",
  "created_at": "2025-01-15T10:00:00Z",
  
  "recommended_tags": ["ECG", "AI", "논문"]
}
```

**Errors:**
- `409`: 같은 Arc에 이미 존재하는 URL
  ```json
  {
    "error": "duplicate_url",
    "message": "This URL already exists in this box",
    "existing": {
      "resource_id": "uuid",
      "created_at": "2025-01-10T00:00:00Z"
    }
  }
  ```

---

### 4.3 자료 업데이트

```http
PATCH /api/resources/:id
```

**Request Body:**
```json
{
  "title": "수정된 제목",
  "category": "Tutorial",
  "tags": [1, 2, 5]
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "수정된 제목",
  "category": "Tutorial",
  "updated_at": "2025-01-15T11:00:00Z"
}
```

---

### 4.4 자료 삭제

```http
DELETE /api/resources/:id
```

**Response (204):**
No content

---

### 4.5 URL 중복 체크

```http
GET /api/resources/check-duplicate?url=https://example.com
```

**Response (200):**
```json
{
  "exists": true,
  "duplicates": [
    {
      "arc_id": "uuid",
      "box_name": "LCT 특허 조사",
      "resource_id": "uuid",
      "created_at": "2025-01-10T00:00:00Z"
    }
  ]
}
```

---

## 5. Tags

### 5.1 태그 목록 조회

```http
GET /api/tags
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "특허",
      "color": "#3B82F6",
      "usage_count": 15
    },
    {
      "id": 2,
      "name": "ECG",
      "color": "#10B981",
      "usage_count": 8
    }
  ]
}
```

---

### 5.2 태그 생성

```http
POST /api/tags
```

**Request Body:**
```json
{
  "name": "새 태그",
  "color": "#EF4444"
}
```

**Response (201):**
```json
{
  "id": 10,
  "name": "새 태그",
  "color": "#EF4444"
}
```

---

### 5.3 자료에 태그 추가

```http
POST /api/resources/:resourceId/tags
```

**Request Body:**
```json
{
  "tag_ids": [1, 2, 5]
}
```

**Response (200):**
```json
{
  "resource_id": "uuid",
  "tags": [
    { "id": 1, "name": "특허" },
    { "id": 2, "name": "ECG" },
    { "id": 5, "name": "AI" }
  ]
}
```

---

## 6. Synthesis

### 6.1 Synthesis 실행

```http
POST /api/arcs/:arcId/synthesis
```

**Request Body:**
```json
{
  "mode": "auto",
  "include_all": true,
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-15"
  }
}
```

**Response (200):**
```json
{
  "synthesis_id": "uuid",
  "status": "processing",
  "estimated_time": 30
}
```

**Response (완료 후):**
```json
{
  "id": "uuid",
  "arc_id": "uuid",
  "resource_count": 18,
  "date_range_start": "2025-01-01T00:00:00Z",
  "date_range_end": "2025-01-15T23:59:59Z",
  
  "summary": "18개의 자료를 분석한 결과...",
  
  "insights": [
    "통합 접근법을 사용한 특허가 없음",
    "연합학습 + ECG 조합은 2건만 발견",
    "대부분의 연구가 2023년 이후 발표됨"
  ],
  
  "patterns": {
    "categories": {
      "Research": 10,
      "Article": 5,
      "Tool": 3
    },
    "trending_keywords": ["ECG", "AI", "Digital Twin"],
    "temporal_distribution": {
      "2025-01": 10,
      "2024-12": 5,
      "2024-11": 3
    }
  },
  
  "table_schema": {
    "columns": ["제목", "출원인", "출원일", "핵심기술", "관련성"]
  },
  
  "table_data": [
    {
      "제목": "ECG 기반 심장 모니터링",
      "출원인": "ABC Corp",
      "출원일": "2024-05-10",
      "핵심기술": "딥러닝",
      "관련성": "9/10"
    }
  ],
  
  "created_at": "2025-01-15T12:00:00Z"
}
```

---

### 6.2 Synthesis 히스토리 조회

```http
GET /api/arcs/:arcId/synthesis
```

**Query Parameters:**
- `limit`: 페이지당 개수 (기본 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "resource_count": 18,
      "summary": "18개의 자료를 분석한 결과...",
      "created_at": "2025-01-15T12:00:00Z"
    },
    {
      "id": "uuid2",
      "resource_count": 10,
      "summary": "10개의 자료를 분석한 결과...",
      "created_at": "2025-01-08T12:00:00Z"
    }
  ],
  "count": 2
}
```

---

### 6.3 특정 Synthesis 조회

```http
GET /api/synthesis/:id
```

**Response (200):**
Full synthesis object (위 6.1과 동일)

---

## 7. Daily Summary

### 7.1 오늘의 요약 조회

```http
GET /api/daily-summary/today
```

**Query Parameters:**
- `arc_id` (optional): 특정 Arc만

**Response (200):**
```json
{
  "id": "uuid",
  "date": "2025-01-15",
  "resource_count": 5,
  
  "summary": "오늘 5개의 자료를 추가하셨습니다...",
  
  "key_findings": [
    "ECG 관련 논문 3건 추가",
    "새로운 Digital Twin 프레임워크 발견",
    "경쟁사 특허 출원 확인"
  ],
  
  "recommended_actions": [
    "XYZ 논문 추가 조사 필요",
    "ABC 특허와 차별점 명확히 하기"
  ],
  
  "created_at": "2025-01-15T09:00:00Z",
  "email_sent": true
}
```

**Errors:**
- `404`: 오늘 요약 없음 (자료 3개 미만)

---

### 7.2 Daily Summary 히스토리

```http
GET /api/daily-summary
```

**Query Parameters:**
- `limit`: 페이지당 개수 (기본 30)
- `arc_id` (optional): 특정 Arc

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "date": "2025-01-15",
      "resource_count": 5,
      "summary": "...",
      "email_sent": true
    }
  ],
  "count": 30
}
```

---

## 8. Notifications

### 8.1 알림 목록 조회

```http
GET /api/notifications
```

**Query Parameters:**
- `unread_only`: true/false (기본 false)
- `limit`: 페이지당 개수 (기본 20)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "synthesis_ready",
      "title": "Synthesis Ready",
      "message": "You have 18 resources in this box. Time to synthesize!",
      "link_url": "/arcs/uuid/synthesis",
      "is_read": false,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "unread_count": 3
}
```

---

### 8.2 알림 읽음 처리

```http
PATCH /api/notifications/:id
```

**Request Body:**
```json
{
  "is_read": true
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "is_read": true,
  "read_at": "2025-01-15T11:00:00Z"
}
```

---

### 8.3 모든 알림 읽음 처리

```http
POST /api/notifications/mark-all-read
```

**Response (200):**
```json
{
  "updated_count": 5
}
```

---

## 9. Export

### 9.1 Arc를 PDF로 Export

```http
POST /api/arcs/:arcId/export
```

**Request Body:**
```json
{
  "format": "pdf",
  "include_synthesis": true,
  "include_resources": true,
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-15"
  }
}
```

**Response (200):**
```json
{
  "download_url": "https://storage.supabase.co/...",
  "expires_at": "2025-01-15T15:00:00Z",
  "file_size": 2048000
}
```

---

### 9.2 Notion으로 Export

```http
POST /api/arcs/:arcId/export/notion
```

**Request Body:**
```json
{
  "notion_page_id": "abc123",
  "notion_token": "secret_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "notion_page_url": "https://notion.so/...",
  "exported_count": 18
}
```

---

## 10. 공유 (Sharing)

### 10.1 Arc 공유 활성화

```http
PATCH /api/arcs/:id/sharing
```

**Request Body:**
```json
{
  "is_public": true
}
```

**Response (200):**
```json
{
  "is_public": true,
  "share_url": "https://plynkarc.com/shared/uuid-share-token"
}
```

---

### 10.2 공유된 Arc 조회 (인증 불필요)

```http
GET /shared/:shareToken
```

**Response (200):**
```json
{
  "box": {
    "name": "LCT 특허 조사",
    "goal": "선행기술 20건 분석",
    "icon": "📚",
    "color": "#3B82F6",
    "resource_count": 18
  },
  "resources": [
    {
      "id": "uuid",
      "title": "ECG 분석 논문",
      "url": "https://example.com",
      "summary": "...",
      "created_at": "2025-01-15T00:00:00Z"
    }
  ],
  "owner": {
    "full_name": "홍길동"
  }
}
```

**Note:** 읽기 전용, 편집 불가

---

## 에러 응답 형식

모든 에러는 다음 형식을 따릅니다:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "validation error details"
  }
}
```

### 공통 에러 코드

| 코드 | 설명 |
|------|------|
| `400` | Bad Request (잘못된 요청) |
| `401` | Unauthorized (인증 필요) |
| `403` | Forbidden (권한 없음) |
| `404` | Not Found (리소스 없음) |
| `409` | Conflict (중복 등) |
| `422` | Unprocessable Entity (유효성 검사 실패) |
| `429` | Too Many Requests (속도 제한) |
| `500` | Internal Server Error |

---

## Rate Limiting

- **인증된 사용자**: 100 req/분
- **미인증 사용자**: 20 req/분
- **AI 요청 (Synthesis)**: 10 req/시간

초과 시:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 60
}
```

---

## Webhook (Phase 2)

사용자는 webhook을 등록하여 이벤트를 수신할 수 있습니다:

- `resource.created`
- `synthesis.completed`
- `daily_summary.sent`

```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "https://yourserver.com/webhook",
  "events": ["resource.created", "synthesis.completed"]
}
```
