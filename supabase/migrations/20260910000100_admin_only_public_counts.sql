-- Registration counts are committee data, not public homepage content.
-- Keep the RPC available to the protected Admin -> Reports page while making
-- sure an anonymous or ordinary school account cannot query the aggregates.

create or replace function public_counts()
returns table (
  approved_schools integer,
  participating_lgas integer,
  registered_students integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from schools where status = 'approved')::integer,
    (select count(distinct lga_id) from schools where status = 'approved')::integer,
    (select count(*) from students s
       join schools sc on sc.id = s.school_id
      where sc.status = 'approved')::integer
  where is_admin();
$$;

revoke execute on function public_counts() from anon;
grant execute on function public_counts() to authenticated;
