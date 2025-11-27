import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ArcForm } from '@/components/arcs/ArcForm'

interface EditArcPageProps {
  params: Promise<{ id: string }>
}

export default async function EditArcPage({ params }: EditArcPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: arc, error } = await supabase
    .from('arcs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !arc) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ArcForm mode="edit" arc={arc} />
    </div>
  )
}
