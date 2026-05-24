-- 1. Allow public contact form submissions; reads remain admin-only
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Harden has_role: only allow callers to check their own roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Prevent enumeration: only allow checking your own roles
  -- (auth.uid() is null for service_role / superuser contexts, which are allowed)
  IF auth.uid() IS NOT NULL AND auth.uid() <> _user_id THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$function$;