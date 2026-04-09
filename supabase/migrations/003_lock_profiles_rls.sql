-- Migration: 003_lock_profiles_rls.sql
-- Tightens profiles RLS: users can only insert their own profile with role=customer.
-- Prevents privilege escalation via client-side profile creation.

-- Drop the overly permissive insert policy
drop policy if exists "profiles_insert_service" on profiles;

-- Users can only insert their own profile, and only as 'customer'
create policy "profiles_insert_own_customer"
  on profiles for insert
  with check (
    auth.uid() = id
    AND role = 'customer'
  );
