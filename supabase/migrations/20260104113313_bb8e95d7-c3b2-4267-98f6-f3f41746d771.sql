-- Drop the policy that allows users to view their own roles (not needed for app functionality)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- The has_role() function handles role checks internally via SECURITY DEFINER,
-- so users don't need direct SELECT access to the table