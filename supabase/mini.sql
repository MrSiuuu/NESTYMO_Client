-- Modification 1 — users.agence_id
ALTER TABLE public.users
  ADD COLUMN agence_id uuid REFERENCES public.agences(id) ON DELETE SET NULL;

-- Modification 2 — agences.verification_status
ALTER TABLE public.agences
  ADD COLUMN verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Modification 3 — fonction owns_agence
CREATE OR REPLACE FUNCTION public.owns_agence(aid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.agences g
    LEFT JOIN public.users u ON u.id = auth.uid()
    WHERE g.id = aid
      AND (
        g.created_by = auth.uid()
        OR u.agence_id = g.id
      )
  );
$$;

-- Modification 4 — policy agences_select_active_or_own
DROP POLICY IF EXISTS agences_select_active_or_own ON public.agences;

CREATE POLICY agences_select_active_or_own ON public.agences
FOR SELECT
USING (
  statut = 'active'
  OR public.owns_agence(id)
  OR public.is_admin()
);