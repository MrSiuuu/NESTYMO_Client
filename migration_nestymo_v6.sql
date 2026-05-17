-- CDC Nestymo Public V2 - RLS contacts : le visiteur connecte lit ses propres demandes
-- Appliquer sur la base Supabase (pas execute par le build Next.js)

DROP POLICY IF EXISTS contacts_select ON public.contacts;

CREATE POLICY contacts_select_own ON public.contacts
  FOR SELECT USING (
    public.owns_agence(agence_id)
    OR public.is_admin()
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );
