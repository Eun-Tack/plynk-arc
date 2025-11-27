# 컴포넌트 구조 (Component Structure)

## 프로젝트 폴더 구조

```
plynk-arc/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth 레이아웃 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Auth 공통 레이아웃
│   │
│   ├── (dashboard)/              # Dashboard 레이아웃 그룹
│   │   ├── layout.tsx            # 사이드바 + 헤더
│   │   ├── page.tsx              # Dashboard 홈
│   │   │
│   │   ├── arcs/
│   │   │   ├── page.tsx          # Arc 리스트
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Arc 상세
│   │   │   │   ├── synthesis/
│   │   │   │   │   └── page.tsx  # Synthesis 페이지
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx  # Arc 설정
│   │   │   └── new/
│   │   │       └── page.tsx      # 새 Arc 만들기
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx          # 사용자 프로필
│   │   │
│   │   ├── notifications/
│   │   │   └── page.tsx          # 알림 목록
│   │   │
│   │   └── settings/
│   │       └── page.tsx          # 전역 설정
│   │
│   ├── shared/
│   │   └── [token]/
│   │       └── page.tsx          # 공유된 Arc 보기
│   │
│   ├── api/                      # API Routes
│   │   ├── arcs/
│   │   │   ├── route.ts          # GET, POST /api/arcs
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE /api/arcs/:id
│   │   │       └── resources/
│   │   │           └── route.ts  # GET, POST
│   │   │
│   │   ├── resources/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   ├── synthesis/
│   │   │   └── route.ts          # POST /api/synthesis
│   │   │
│   │   ├── profile/
│   │   │   └── route.ts
│   │   │
│   │   └── notifications/
│   │       └── route.ts
│   │
│   ├── actions/                  # Server Actions
│   │   ├── arc-actions.ts
│   │   ├── resource-actions.ts
│   │   ├── synthesis-actions.ts
│   │   └── notification-actions.ts
│   │
│   ├── layout.tsx                # Root 레이아웃
│   ├── loading.tsx               # Global loading
│   ├── error.tsx                 # Global error
│   └── not-found.tsx             # 404 페이지
│
├── components/                   # React 컴포넌트
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── GoogleAuthButton.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── arcs/
│   │   ├── ArcCard.tsx           # Arc 카드 (그리드용)
│   │   ├── ArcList.tsx           # Arc 목록 컨테이너
│   │   ├── ArcForm.tsx           # Arc 생성/수정 폼
│   │   ├── ArcHeader.tsx         # Arc 상세 헤더
│   │   ├── ArcStats.tsx          # Arc 통계
│   │   └── ArcShareDialog.tsx    # 공유 설정 모달
│   │
│   ├── resources/
│   │   ├── ResourceTimeline.tsx  # 타임라인 뷰
│   │   ├── ResourceTable.tsx     # 테이블 뷰
│   │   ├── ResourceList.tsx      # 리스트 뷰
│   │   ├── ResourceCard.tsx      # 개별 카드
│   │   ├── ResourceForm.tsx      # 자료 추가 폼
│   │   └── ResourceFilter.tsx    # 필터 UI
│   │
│   ├── synthesis/
│   │   ├── SynthesisButton.tsx   # Synthesis 트리거
│   │   ├── SynthesisResult.tsx   # 결과 표시
│   │   ├── SynthesisTable.tsx    # 생성된 테이블
│   │   ├── SynthesisInsights.tsx # 인사이트 카드
│   │   └── SynthesisHistory.tsx  # 히스토리 목록
│   │
│   ├── daily-summary/
│   │   ├── DailySummaryCard.tsx
│   │   └── DailySummaryList.tsx
│   │
│   ├── notifications/
│   │   ├── NotificationBell.tsx  # 헤더 벨 아이콘
│   │   ├── NotificationList.tsx
│   │   └── NotificationItem.tsx
│   │
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── SubscriptionCard.tsx
│   │
│   └── ui/                       # 재사용 가능 UI (shadcn/ui)
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Dialog.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Table.tsx
│       ├── Badge.tsx
│       ├── Skeleton.tsx
│       └── ...
│
├── lib/                          # 유틸리티 & 라이브러리
│   ├── supabase/
│   │   ├── client.ts             # 클라이언트 Supabase
│   │   ├── server.ts             # 서버 Supabase
│   │   └── middleware.ts         # 미들웨어용
│   │
│   ├── ai/
│   │   ├── gemini-client.ts      # Gemini API 클라이언트
│   │   ├── prompts.ts            # 프롬프트 템플릿
│   │   └── pattern-detector.ts   # 패턴 탐지 로직
│   │
│   ├── scraper/
│   │   ├── jina-reader.ts        # Jina Reader API
│   │   └── url-parser.ts         # URL 파싱
│   │
│   ├── email/
│   │   ├── resend-client.ts      # Resend API
│   │   └── templates/            # 이메일 템플릿
│   │       ├── daily-summary.tsx
│   │       └── welcome.tsx
│   │
│   ├── export/
│   │   ├── pdf-generator.ts      # PDF 생성
│   │   └── notion-exporter.ts    # Notion 연동
│   │
│   └── utils/
│       ├── date.ts               # 날짜 유틸
│       ├── format.ts             # 포맷팅
│       ├── validators.ts         # 유효성 검사
│       └── cn.ts                 # classnames 헬퍼
│
├── types/                        # TypeScript 타입
│   ├── database.types.ts         # Supabase 자동 생성
│   ├── api.types.ts              # API 타입
│   ├── ai.types.ts               # AI 관련 타입
│   └── index.ts                  # 공통 타입
│
├── hooks/                        # Custom React Hooks
│   ├── use-arcs.ts              # Arc CRUD
│   ├── use-resources.ts          # Resource CRUD
│   ├── use-synthesis.ts          # Synthesis 실행
│   ├── use-notifications.ts      # 알림 관리
│   └── use-user.ts               # 사용자 정보
│
├── stores/                       # Zustand 스토어 (필요시)
│   ├── ui-store.ts               # UI 상태 (사이드바 등)
│   └── filter-store.ts           # 필터 상태
│
├── middleware.ts                 # Next.js Middleware (인증)
│
├── public/                       # 정적 파일
│   ├── icons/
│   └── images/
│
├── supabase/                     # Supabase 관련
│   ├── functions/                # Edge Functions
│   │   ├── daily-summary/
│   │   │   └── index.ts
│   │   └── extract-content/
│   │       └── index.ts
│   │
│   └── migrations/               # DB 마이그레이션
│       └── 001_initial_schema.sql
│
├── .env.local                    # 환경 변수
├── .env.example                  # 환경 변수 템플릿
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 주요 컴포넌트 상세

### 1. Dashboard 레이아웃

**파일**: `app/(dashboard)/layout.tsx`

```typescript
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Props**: N/A  
**State**: UI 상태 (사이드바 접기/펴기)  
**Data**: 사용자 정보, 알림 개수

---

### 2. Arc 상세 페이지

**파일**: `app/(dashboard)/arcs/[id]/page.tsx`

```typescript
import { ArcHeader } from '@/components/arcs/BoxHeader';
import { ResourceTimeline } from '@/components/resources/ResourceTimeline';
import { ResourceTable } from '@/components/resources/ResourceTable';

export default async function ArcDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { view?: 'timeline' | 'table' };
}) {
  const box = await getBox(params.id);
  const resources = await getResources(params.id);
  const view = searchParams.view || 'dashboard';
  
  return (
    <div>
      <BoxHeader box={box} />
      
      {view === 'timeline' && <ResourceTimeline resources={resources} />}
      {view === 'table' && <ResourceTable resources={resources} />}
      {view === 'dashboard' && <BoxDashboard box={box} resources={resources} />}
    </div>
  );
}
```

**Props**: 
- `params.id`: Arc UUID
- `searchParams.view`: 뷰 타입

**Data**:
- Arc 정보 (Server Component)
- Resources (Server Component)

---

### 3. ArcCard 컴포넌트

**파일**: `components/arcs/ArcCard.tsx`

```typescript
'use client'

import { Arc } from '@/types';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface ArcCardProps {
  box: Arc;
  onClick?: () => void;
}

export function ArcCard({ box, onClick }: ArcCardProps) {
  return (
    <Link href={`/arcs/${box.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{box.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{box.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{box.goal}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {box.resource_count} resources
          </span>
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: box.color }}
          />
        </div>
      </Card>
    </Link>
  );
}
```

**Props**:
- `box`: Arc 객체
- `onClick` (optional): 클릭 핸들러

**State**: N/A (Stateless)

---

### 4. ResourceTimeline 컴포넌트

**파일**: `components/resources/ResourceTimeline.tsx`

```typescript
'use client'

import { Resource } from '@/types';
import { ResourceCard } from './ResourceCard';
import { groupBy } from '@/lib/utils';

interface ResourceTimelineProps {
  resources: Resource[];
}

export function ResourceTimeline({ resources }: ResourceTimelineProps) {
  // 날짜별 그룹핑
  const grouped = groupBy(resources, (r) => 
    new Date(r.created_at).toLocaleDateString()
  );
  
  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {date}
          </h3>
          <div className="space-y-3">
            {items.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Props**:
- `resources`: Resource 배열

**State**: N/A (Stateless, 데이터 변환만)

---

### 5. SynthesisButton 컴포넌트

**파일**: `components/synthesis/SynthesisButton.tsx`

```typescript
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { runSynthesis } from '@/app/actions/synthesis-actions';
import { useRouter } from 'next/navigation';

interface SynthesisButtonProps {
  arcId: string;
  resourceCount: number;
}

export function SynthesisButton({ arcId, resourceCount }: SynthesisButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await runSynthesis(arcId);
      router.push(`/arcs/${arcId}/synthesis?id=${result.id}`);
    } catch (error) {
      console.error(error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClick}
      disabled={loading || resourceCount < 5}
      loading={loading}
    >
      {loading ? 'Analyzing...' : `Synthesize (${resourceCount})`}
    </Button>
  );
}
```

**Props**:
- `arcId`: Arc UUID
- `resourceCount`: 자료 개수

**State**:
- `loading`: 로딩 상태

**Actions**:
- `runSynthesis`: Server Action 호출

---

### 6. NotificationBell 컴포넌트

**파일**: `components/notifications/NotificationBell.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Popover } from '@/components/ui/Popover';
import { NotificationList } from './NotificationList';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </Popover.Trigger>
      
      <Popover.Content className="w-96">
        <NotificationList 
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />
      </Popover.Content>
    </Popover>
  );
}
```

**Props**: N/A

**State**:
- `open`: Popover 열림 상태

**Hooks**:
- `useNotifications`: 커스텀 훅 (Supabase Realtime)

---

## Custom Hooks

### 1. use-arcs.ts

```typescript
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Arc } from '@/types';

export function useArcs() {
  const [arcs, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    fetchBoxes();
  }, []);
  
  async function fetchBoxes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('arcs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setBoxes(data);
    setLoading(false);
  }
  
  async function createArc(input: Partial<Box>) {
    const { data, error } = await supabase
      .from('arcs')
      .insert(input)
      .select()
      .single();
    
    if (data) {
      setBoxes([data, ...arcs]);
    }
    
    return { data, error };
  }
  
  async function updateArc(id: string, input: Partial<Box>) {
    const { data, error } = await supabase
      .from('arcs')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (data) {
      setBoxes(arcs.map(b => b.id === id ? data : b));
    }
    
    return { data, error };
  }
  
  async function deleteArc(id: string) {
    const { error } = await supabase
      .from('arcs')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setBoxes(arcs.filter(b => b.id !== id));
    }
    
    return { error };
  }
  
  return {
    arcs,
    loading,
    createArc,
    updateArc,
    deleteArc,
    refresh: fetchBoxes,
  };
}
```

---

### 2. use-resources.ts

```typescript
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Resource } from '@/types';

export function useResources(arcId: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    if (arcId) {
      fetchResources();
      
      // Realtime subscription
      const channel = supabase
        .channel(`resources:${arcId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'resources',
            filter: `arc_id=eq.${arcId}`,
          },
          (payload) => {
            setResources([payload.new as Resource, ...resources]);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [arcId]);
  
  async function fetchResources() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        tags:link_tags(
          tag:tags(*)
        )
      `)
      .eq('arc_id', arcId)
      .order('created_at', { ascending: false });
    
    if (data) setResources(data);
    setLoading(false);
  }
  
  async function addResource(input: {
    url: string;
    title?: string;
    category?: string;
  }) {
    // Server Action 호출
    const result = await fetch('/api/arcs/' + arcId + '/resources', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    
    return result.json();
  }
  
  return {
    resources,
    loading,
    addResource,
    refresh: fetchResources,
  };
}
```

---

## Server Actions

### arc-actions.ts

```typescript
'use server'

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createArc(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const name = formData.get('name') as string;
  const goal = formData.get('goal') as string;
  
  const { data, error } = await supabase
    .from('arcs')
    .insert({ name, goal })
    .select()
    .single();
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/arcs');
  return { data };
}

export async function deleteArc(arcId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { error } = await supabase
    .from('arcs')
    .delete()
    .eq('id', arcId);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/arcs');
  return { success: true };
}
```

---

## 컴포넌트 설계 원칙

### 1. Server Component 우선
- 데이터 패칭은 Server Component에서
- Client Component는 인터랙션이 필요한 경우만

### 2. Props Drilling 최소화
- Context API 또는 Zustand 사용
- Server Component → Client Component로 데이터 전달

### 3. 재사용성
- UI 컴포넌트는 `components/ui`에 집중
- 도메인 로직은 hooks/actions로 분리

### 4. 타입 안전성
- 모든 컴포넌트에 Props 인터페이스
- Supabase 타입 자동 생성 활용

### 5. 성능 최적화
- React.memo() 필요한 곳에만
- useMemo/useCallback 신중하게 사용
- 이미지는 Next.js Image 컴포넌트

---

## 다음 단계

1. ✅ 폴더 구조 생성
2. ✅ UI 컴포넌트 (shadcn/ui) 설치
3. ✅ Supabase 클라이언트 설정
4. ✅ 기본 레이아웃 구현
5. ✅ Arc CRUD 구현
6. ✅ Resource CRUD 구현
7. ✅ Synthesis 기능 구현
