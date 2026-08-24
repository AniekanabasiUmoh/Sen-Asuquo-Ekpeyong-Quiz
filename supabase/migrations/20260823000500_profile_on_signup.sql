-- SAEAC — create the profile row when a user signs up.
--
-- Doing this in application code is unreliable: if the client disconnects
-- between auth.signUp() and the profile insert, the account exists with no
-- profile and every later join returns null. A trigger on auth.users makes the
-- two atomic.
--
-- security definer because the trigger runs as the auth system, which has no
-- rights on public tables; search_path is pinned to prevent hijacking.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  -- Everyone starts as school_admin: the only self-service sign-up route is a
  -- school registering itself. Committee, judge and admin roles are granted by
  -- an existing admin, never claimed at sign-up.
  insert into public.user_roles (user_id, role)
  values (new.id, 'school_admin')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
