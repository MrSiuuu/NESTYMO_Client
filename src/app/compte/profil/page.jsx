import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfilForm from '@/features/compte/ProfilForm'

export const metadata = {
  title: 'Mon profil',
}

export default async function CompteProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirect=/compte/profil')

  const { data: profile } = await supabase
    .from('users')
    .select('prenom, nom')
    .eq('id', user.id)
    .maybeSingle()

  const initialPrenom =
    profile?.prenom ?? user.user_metadata?.prenom ?? ''
  const initialNom = profile?.nom ?? user.user_metadata?.nom ?? ''

  return (
    <ProfilForm
      userEmail={user.email ?? ''}
      initialPrenom={initialPrenom}
      initialNom={initialNom}
    />
  )
}

